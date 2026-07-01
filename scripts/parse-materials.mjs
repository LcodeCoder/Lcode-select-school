// Parse material docs (docx/pdf/doc/xls) into structured JSON for SQLite import.
// Preserves paragraph structure: h2/h3 headings, ordered/unordered lists,
// strong/em inline emphasis, blockquotes, and long paragraphs split by sentence.
// Run with: node scripts/parse-materials.mjs
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import XLSX from 'xlsx';
import iconv from 'iconv-lite';
import cfb from 'cfb';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const DIRS = [
  { src: 'C:/Users/31700/Desktop/新生发资料(8)', module: 'guide', label: '新生指南' },
  { src: 'C:/Users/31700/Desktop/高考资料(1)(6)', module: 'exam', label: '志愿填报' },
  { src: 'C:/Users/31700/Desktop/老生(3)(1)', module: 'growth', label: '自我提升' },
];

function pickCategory(moduleKey, fileName) {
  const name = fileName.toLowerCase();
  if (moduleKey === 'guide') {
    if (/入党|团员|助学金|申请书/.test(fileName)) return '申请文书';
    if (/电脑|选购/.test(fileName)) return '物品准备';
    if (/四级|英语/.test(fileName)) return '学业规划';
    if (/报道|报到|开学|入学|问题答疑|锦囊|必做/.test(fileName)) return '入学须知';
    if (/专业/.test(fileName)) return '专业选择';
    return '入学须知';
  }
  if (moduleKey === 'exam') {
    if (/平行志愿|顺序志愿|调剂/.test(fileName)) return '志愿规则';
    if (/Q&A|问答|60个问题/.test(fileName)) return '问答集锦';
    if (/专业/.test(fileName)) return '专业解读';
    if (/估分|分数/.test(fileName)) return '分数预判';
    if (/院校|名单|代码|宿舍/.test(fileName)) return '院校资料';
    if (/一本通|填报策略/.test(fileName)) return '填报策略';
    return '填报策略';
  }
  if (moduleKey === 'growth') {
    if (/C语言|高数|计算机基础/.test(fileName)) return '学科基础';
    if (/四级|六级|英语|AB级|词汇|听力/.test(fileName)) return '外语学习';
    if (/考证|普通话/.test(fileName)) return '考证规划';
    return '学业提升';
  }
  return '其它';
}

function titleFromFilename(f) {
  return f
    .replace(/\.[^.]+$/, '')
    .replace(/^新生指南[丨|]/, '')
    .replace(/^【[^】]*】/, '')
    .replace(/【[^】]*】/g, '')
    .replace(/\s*\(1\)\s*$/, '')
    .replace(/\(\d+\)/g, '')
    .trim();
}

// ===== HTML → blocks =====
// Block types: h1, h2, h3, p, ul, ol, quote, hr
// Inline: <strong>, <em>, <a> are flattened into {text, marks: {strong, em}} per paragraph.

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(s) {
  return decodeEntities(s.replace(/<[^>]+>/g, ''));
}

// Crude HTML tokenizer — handles the small subset mammoth emits:
// <p>, <h1>-<h6>, <ul>, <ol>, <li>, <blockquote>, <strong>/<b>, <em>/<i>, <a>, <br>, <img>
function htmlToBlocks(html) {
  // Drop images (we don't ship them) and the leftover <a id="brX"> anchors
  const cleaned = html
    .replace(/<img[^>]*>/g, '')
    .replace(/<a id="br\d+"><\/a>/g, '')
    .replace(/<a[^>]*>([^<]*)<\/a>/g, '$1');

  const blocks = [];
  let idx = 0;
  // Tokenize by top-level block tags
  const re = /<(p|h1|h2|h3|h4|h5|h6|ul|ol|blockquote|hr)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(cleaned)) !== null) {
    const tag = m[1].toLowerCase();
    const inner = m[2].replace(/<br\s*\/?>/gi, '\n').trim();
    if (tag === 'hr') {
      blocks.push({ type: 'hr', idx: idx++ });
      continue;
    }
    if (tag === 'ul' || tag === 'ol') {
      const items = [];
      const liRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
      let li;
      while ((li = liRe.exec(inner)) !== null) {
        const t = inlineText(li[1]);
        if (t.text || t.hasMark) items.push(t);
      }
      if (items.length) blocks.push({ type: tag, idx: idx++, items });
      continue;
    }
    if (tag === 'blockquote') {
      const t = inlineText(inner);
      if (t.text) blocks.push({ type: 'quote', idx: idx++, ...t });
      continue;
    }
    // h1-h6 → normalize to h1/h2/h3
    const level = tag.startsWith('h') ? Math.min(Number(tag.slice(1)), 3) : 0;
    const t = inlineText(inner);
    if (!t.text && !t.hasMark) continue;
    if (level === 1 || level === 2 || level === 3) {
      blocks.push({ type: 'h' + level, idx: idx++, ...t });
    } else {
      blocks.push({ type: 'p', idx: idx++, ...t });
    }
  }
  return blocks;
}

// Extract {text, marks, hasMark} from inline HTML — strong/em are recorded but
// text is concatenated. The renderer re-applies marks via offset ranges.
function inlineText(html) {
  if (!html) return { text: '', marks: [], hasMark: false };
  const marks = []; // {type: 'strong'|'em', start, end}
  let text = '';
  let pos = 0;
  const re = /<(\/?)(strong|b|em|i)\b[^>]*>|<[^>]+>/gi;
  const stack = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[2]) {
      const close = m[1] === '/';
      const type = (m[2] === 'strong' || m[2] === 'b') ? 'strong' : 'em';
      if (close) {
        const open = stack.pop();
        if (open && open.type === type && pos > open.start) {
          marks.push({ type, start: open.start, end: pos });
        }
      } else {
        stack.push({ type, start: pos });
      }
    } else {
      // Drop any other tag — its content stays in the buffer via the regex gap
    }
    // Text between last match end and this match start
    const gap = html.slice(re.lastIndex - m[0].length, re.lastIndex - m[0].length);
    // Actually: text already accumulates via the gaps below
  }
  // Simpler approach: walk char by char with a regex split
  // Restart with a cleaner implementation
  return inlineTextV2(html);
}

function inlineTextV2(html) {
  const marks = [];
  let text = '';
  const stack = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      if (end === -1) { text += html.slice(i); break; }
      const tagSrc = html.slice(i + 1, end).trim();
      const close = tagSrc[0] === '/';
      const name = (close ? tagSrc.slice(1) : tagSrc).split(/[\s>]/)[0].toLowerCase();
      const type = (name === 'strong' || name === 'b') ? 'strong'
        : (name === 'em' || name === 'i') ? 'em' : null;
      if (type) {
        if (close) {
          const open = stack.pop();
          if (open && open.type === type && text.length > open.start) {
            marks.push({ type, start: open.start, end: text.length });
          }
        } else {
          stack.push({ type, start: text.length });
        }
      }
      i = end + 1;
      continue;
    }
    // Entity or plain char
    if (html[i] === '&') {
      const semi = html.indexOf(';', i);
      if (semi !== -1 && semi - i < 8) {
        const ent = html.slice(i, semi + 1);
        text += decodeEntities(ent);
        i = semi + 1;
        continue;
      }
    }
    text += html[i++];
  }
  // Close any unclosed marks
  while (stack.length) {
    const open = stack.pop();
    if (text.length > open.start) marks.push({ type: open.type, start: open.start, end: text.length });
  }
  const trimmed = text.replace(/\s+/g, ' ').trim();
  // Offset marks to match trimmed text (best-effort: shift by leading whitespace removed)
  const lead = text.length - text.replace(/^\s+/, '').length;
  const adjusted = marks
    .map(mk => ({ type: mk.type, start: Math.max(0, mk.start - lead), end: Math.max(0, mk.end - lead) }))
    .filter(mk => mk.end > mk.start);
  return { text: trimmed, marks: adjusted, hasMark: adjusted.length > 0 };
}

// ===== Per-format extractors =====

async function parseDocx(path) {
  const r = await mammoth.convertToHtml({ path });
  return htmlToBlocks(r.value || '');
}

async function parsePdf(path) {
  // PDFs have no reliable heading info — treat each non-empty line as a paragraph,
  // and detect "第N章/N. xxx/一、xxx" as h2.
  const buf = await readFile(path);
  const parser = new PDFParse({ data: new Uint8Array(buf) });
  try {
    const r = await parser.getText();
    return textToBlocks(r.text || '');
  } finally {
    await parser.destroy();
  }
}

async function parseXlsx(path) {
  const buf = await readFile(path);
  const wb = XLSX.read(buf, { type: 'buffer' });
  const blocks = [];
  let idx = 0;
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    blocks.push({ type: 'h2', idx: idx++, text: `表格：${name}`, marks: [] });
    const items = [];
    for (const r of rows) {
      const line = r.map(c => c == null ? '' : String(c).trim()).join(' | ');
      if (line) items.push({ text: line, marks: [] });
    }
    if (items.length) blocks.push({ type: 'ul', idx: idx++, items });
  }
  return blocks;
}

async function parseDoc(path) {
  // .doc (Word 97-2003 binary / OLE compound). Parse WordDocument stream directly.
  try {
    const buf = await readFile(path);
    const c = cfb.read(buf, { type: 'buffer' });
    const wd = c.FileIndex.find(f => f.name === 'WordDocument');
    if (!wd || !wd.content) return [];
    const raw = Buffer.from(wd.content);
    if (raw.length < 0x200) return [];
    const fcMin = raw.readUInt32LE(0x18);
    const ccpText = raw.readInt32LE(0x4C);
    if (ccpText <= 0 || fcMin <= 0 || fcMin + ccpText * 2 > raw.length) {
      const t = iconv.decode(buf, 'gb18030');
      return textToBlocks(cleanText(t));
    }
    const slice = raw.slice(fcMin, fcMin + ccpText * 2);
    const text = iconv.decode(slice, 'utf16le');
    return textToBlocks(cleanText(text));
  } catch (e) {
    console.warn('parseDoc failed', path, e.message);
    return [];
  }
}

function cleanText(text) {
  return text
    // Drop Word field codes (TOC, HYPERLINK, PAGEREF, REF, SEQ, etc.)
    .replace(/\bTOC\b[^\\]*\\o[^"]*?"/g, ' ')
    .replace(/\\[lyhtrdcfpo]["0-9]*\s+/g, ' ')
    .replace(/HYPERLINK\s*\\l\s*\S+/g, ' ')
    .replace(/PAGEREF\s*\S+/g, ' ')
    .replace(/HYPERLINK/g, ' ')
    .replace(/_Toc\d+/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => /[一-鿿A-Za-z0-9]/.test(l))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Plain-text → blocks. Detect heading-like lines (numbering, 章节).
function textToBlocks(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const blocks = [];
  let idx = 0;
  let paraBuf = [];

  const flushPara = () => {
    if (!paraBuf.length) return;
    const joined = paraBuf.join(' ').replace(/\s+/g, ' ').trim();
    if (joined) {
      // Split very long paragraphs at sentence boundaries (~1200 chars)
      for (const chunk of splitLongPara(joined)) {
        blocks.push({ type: 'p', idx: idx++, text: chunk, marks: [] });
      }
    }
    paraBuf = [];
  };

  const headingRe = /^(第[一二三四五六七八九十百零\d]+[章节篇部]|[一二三四五六七八九十]+[、.．]|[（(][一二三四五六七八九十\d]+[)）]|\d+[、.．]\s*[^一二三四五六七八九十])/;
  const isHeading = (l) => {
    if (l.length > 40) return false;
    return headingRe.test(l);
  };

  for (const line of lines) {
    if (isHeading(line)) {
      flushPara();
      blocks.push({ type: 'h2', idx: idx++, text: line, marks: [] });
      continue;
    }
    // Lines that look like list items: "1) ...", "- ...", "• ..."
    if (/^[-•·]\s+/.test(line) || /^\d+[)）]\s+/.test(line)) {
      flushPara();
      blocks.push({ type: 'ul', idx: idx++, items: [{ text: line.replace(/^[-•·]\s+|^\d+[)）]\s+/, ''), marks: [] }] });
      continue;
    }
    paraBuf.push(line);
  }
  flushPara();
  return blocks;
}

function splitLongPara(text, max = 1200) {
  if (text.length <= max) return [text];
  const out = [];
  let s = text;
  while (s.length > max) {
    let cut = s.lastIndexOf('。', max) + 1;
    if (cut === 0 || cut < max * 0.5) cut = s.lastIndexOf('；', max) + 1;
    if (cut === 0 || cut < max * 0.5) cut = s.lastIndexOf('，', max) + 1;
    if (cut === 0 || cut < max * 0.5) cut = max;
    out.push(s.slice(0, cut));
    s = s.slice(cut);
  }
  if (s) out.push(s);
  return out;
}

async function parseAny(path) {
  const lower = path.toLowerCase();
  if (lower.endsWith('.docx')) return parseDocx(path);
  if (lower.endsWith('.pdf')) return parsePdf(path);
  if (lower.endsWith('.doc')) return parseDoc(path);
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx')) return parseXlsx(path);
  return [];
}

async function main() {
  const outDir = resolve(root, 'scripts', 'materials-out');
  await mkdir(outDir, { recursive: true });

  const articles = [];
  let order = 0;

  for (const { src, module: mod, label } of DIRS) {
    const files = await readdir(src);
    for (const f of files) {
      const full = join(src, f);
      const isXls = /\.xlsx?$/i.test(f);
      if (isXls && /宿舍与设施|普通高等学校名单/.test(f)) continue;

      let blocks = [];
      let rawLen = 0;
      try {
        blocks = await parseAny(full);
        rawLen = blocks.reduce((n, b) => n + (b.text ? b.text.length : (b.items ? b.items.reduce((m, it) => m + (it.text || '').length, 0) : 0)), 0);
      } catch (err) {
        console.warn('parse failed', f, err.message);
      }
      if (blocks.length === 0 || rawLen < 20) {
        console.warn('skip empty:', f);
        continue;
      }
      const title = titleFromFilename(f);
      const category = pickCategory(mod, f);
      const article = {
        module: mod,
        category,
        title,
        source: f,
        order: ++order,
        blocks,
        rawLen,
      };
      articles.push(article);
      console.log(`[+] ${mod}/${category}/${title}  (${rawLen} chars, ${blocks.length} blocks)`);
    }
  }

  const outPath = resolve(outDir, 'articles.json');
  await writeFile(outPath, JSON.stringify(articles, null, 2));
  console.log(`\nWrote ${articles.length} articles to ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
