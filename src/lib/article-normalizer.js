const PINYIN_RE = '[A-Za-zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜüńňǹḿɡɑê]+[A-Za-zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜüńňǹḿɡɑê\d]*';

export function normalizeArticle(article) {
  if (!article || !Array.isArray(article.blocks)) return article;
  const title = article.title || '';
  let blocks = article.blocks.map(cloneBlock).map(b => cleanBlock(b, title)).filter(Boolean);

  blocks = applyTargetedArticleFixes({ ...article, blocks }).blocks;
  blocks = blocks.flatMap(b => expandStructuredBlock(b, title)).filter(Boolean);
  blocks = renumberBlocks(blocks);

  const rawLen = blocks.reduce((n, b) => n + blockTextLength(b), 0);
  return { ...article, blocks, rawLen };
}

function cloneBlock(b) {
  return {
    ...b,
    marks: Array.isArray(b.marks) ? b.marks.slice() : [],
    items: Array.isArray(b.items) ? b.items.map(it => ({ ...it, marks: Array.isArray(it.marks) ? it.marks.slice() : [] })) : undefined,
  };
}

function cleanBlock(b, title) {
  if (b.text != null) {
    b.text = cleanText(String(b.text), title);
    if (!b.text || shouldDropText(b.text, title)) return null;
    b.marks = [];
  }
  if (Array.isArray(b.items)) {
    b.items = b.items
      .map(it => ({ ...it, text: cleanText(String(it.text || ''), title), marks: [] }))
      .filter(it => it.text && !shouldDropText(it.text, title));
    if (!b.items.length) return null;
  }
  return b;
}

export function cleanText(input, title = '') {
  let text = input || '';
  text = decodeEscapedUnicode(text);
  text = text.replace(/\\u(?![0-9a-fA-F]{4})/g, ' ');
  text = text
    .replace(/INCLUDEPICTURE\s+"https?:\/\/[^"\s]+"/gi, '')
    .replace(/"https?:\/\/[^"\s]+"\s*"?_blank"?\s*https?:\/\/[^\s，。；、)）]+/gi, '')
    .replace(/来源：\s*"?https?:\/\/[^\s，。；、)）]+"?/gi, '')
    .replace(/https?:\/\/[^\s，。；、)）]+/gi, '')
    .replace(/\bHYPERLINK\b\s*(?:\\l\s*)?/gi, '')
    .replace(/\bPAGEREF\b\s*\S*/gi, '')
    .replace(/\bTOC\b[^\n]*/gi, '')
    .replace(/_Toc\d+/gi, '')
    .replace(/EMBED\s+Equation\.3/gi, '□')
    .replace(/--\s*\d+\s+of\s+\d+\s*--\s*高考志愿填报手册\s*[IVX\d]*/gi, '')
    .replace(/高考志愿填报手册\s*[IVX]+/g, '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
    .replace(/[�]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (/大学优秀团员申请书/.test(title)) {
    const first = text.indexOf('大学优秀团员申请书 尊敬的团组织');
    if (first > 0) text = text.slice(first);
    const duplicate = text.indexOf('大学优秀团员申请书 尊敬的团组织', 1);
    if (duplicate > 0) text = text.slice(duplicate);
    text = text.replace(/第\s*页\s*/g, '');
  }

  return text.trim();
}

function decodeEscapedUnicode(text) {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (Number.isNaN(code)) return '';
    const ch = String.fromCharCode(code);
    return /[\u0000-\u001f\u007f]/.test(ch) ? ' ' : ch;
  });
}

function shouldDropText(text, title) {
  if (!text.trim()) return true;
  if (/^[\.·…\s第页\d-]+$/.test(text)) return true;
  if (looksLikeBinaryGarbage(text)) return true;
  if (/高等数学学习笔记/.test(title) && looksLikeBrokenFormulaTail(text)) return true;
  if (/大学优秀团员申请书/.test(title) && /[棱惫仅犀吠熬裸嫂赎锹酮耙螟蛆逾奢]/.test(text.slice(0, 120))) return true;
  return false;
}

function looksLikeBinaryGarbage(text) {
  if (text.length < 80) return false;
  const bad = (text.match(/[ꀀ-꿿가-힣\u0800-\u0fff\u1200-\u1cff\u2000-\u2bff\ue000-\uf8ff]/g) || []).length;
  return bad / text.length > 0.18;
}

function looksLikeBrokenFormulaTail(text) {
  const markers = (text.match(/[鵨桽栕綝䩃嘁⡯ꪪ닀능俿]|[\u0800-\u0fff\u1200-\u1cff\ue000-\uf8ff]/g) || []).length;
  return text.length > 80 && markers / text.length > 0.08;
}


function looksLikeCatalogueLine(text) {
  if (!text) return false;
  const dotCount = (text.match(/[.．]{4,}/g) || []).length;
  const pageRefs = (text.match(/第\s*\d+\s*页/g) || []).length;
  const denseTocNumbers = (text.match(/\b\d{1,3}\s+[\u4e00-\u9fffA-Za-z]/g) || []).length;
  return dotCount >= 1 || pageRefs >= 2 || denseTocNumbers >= 8;
}

function applyTargetedArticleFixes(article) {
  let { title, blocks } = article;

  if (/高考填报一本通/.test(title)) {
    const start = blocks.findIndex(b => (b.type === 'h2' || b.type === 'h3') && /一、高考志愿填报基本常识|1\.1\s*985工程大学/.test(b.text || ''));
    if (start > 0) blocks = blocks.slice(start);
  }

  if (/306个专业详细介绍|全国各高校学生、毕业生分享感受/.test(title)) {
    const introEnd = '希望能对大家选专业有所帮助。';
    blocks = blocks.map((b, i) => {
      if (i !== 0 || !b.text) return b;
      const end = b.text.indexOf(introEnd);
      return end >= 0 ? { ...b, text: b.text.slice(0, end + introEnd.length) } : b;
    }).filter((b, i) => i === 0 || !looksLikeCatalogueLine(b.text || ''));
  }

  if (/大学优秀团员申请书/.test(title)) {
    blocks = blocks.filter(b => !/[棱惫仅犀吠熬裸嫂赎锹酮耙螟蛆逾奢]/.test((b.text || '').slice(0, 160)));
    blocks = blocks.filter(b => !/我一定会得[肘尖垃谷钎秀敷塑晦希]/.test(b.text || ''));
  }

  if (/高等数学学习笔记/.test(title)) {
    const firstGarbage = blocks.findIndex(b => looksLikeBrokenFormulaTail(b.text || ''));
    if (firstGarbage >= 0) blocks = blocks.slice(0, firstGarbage);
  }

  if (/新生开学报道流程/.test(title)) {
    blocks = normalizeFreshmanFlowBlocks(blocks);
  }

  return { ...article, blocks };
}

function expandStructuredBlock(block, title) {
  if (/新生开学报道流程/.test(title)) {
    if (block.type !== 'p') return [block];
    if (!String(block.text || '').trim()) return [];
    return expandFreshmanFlow(block.text || '');
  }
  if (block.type === 'hr' || block.type === 'ul' || block.type === 'ol' || block.type === 'quote') return [block];
  const text = block.text || '';

  if (/大学计算机基础考试题库/.test(title)) return splitExamText(text).map(t => ({ ...block, type: 'p', text: t, variant: 'exam', marks: [] }));
  if (/国家普通话水平测试题/.test(title)) return splitPutonghuaText(text).map(t => ({ ...block, type: 'p', text: t, variant: 'pinyin', marks: [] }));
  if (/306个专业详细介绍|全国各高校学生、毕业生分享感受/.test(title)) return splitLongReadable(text, 420).map(t => ({ ...block, type: classifyHeading(t), text: t, marks: [] }));
  if (/高考填报一本通/.test(title)) return splitLongReadable(text, 520).map(t => ({ ...block, type: block.type, text: t, marks: [] }));
  if (text.length > 850) return splitLongReadable(text, 560).map(t => ({ ...block, type: block.type, text: t, marks: [] }));
  return [block];
}

function normalizeFreshmanFlowBlocks(blocks) {
  const joined = blocks.map(b => {
    if (Array.isArray(b.items)) return b.items.map(it => it.text || '').join(' ');
    return b.text || '';
  }).join(' ').replace(/\s+/g, ' ').trim();
  if (!joined) return blocks;

  const withoutTitle = joined
    .replace(/^大学报到流程[。.]?\s*/, '')
    .replace(/\b80[\.．]/, '08.')
    .replace(/一[.．、]\s*大学报到流程\s*/g, '');
  const packMatch = withoutTitle.match(/二[.．、]\s*大学装箱必备/);
  const shopMatch = withoutTitle.match(/三[.．、]\s*来到学校需要买的日用品/);
  const packStart = packMatch ? packMatch.index : -1;
  const shopStart = shopMatch ? shopMatch.index : -1;

  const reportText = (packStart >= 0 ? withoutTitle.slice(0, packStart) : (shopStart >= 0 ? withoutTitle.slice(0, shopStart) : withoutTitle)).trim();
  const packText = packStart >= 0
    ? withoutTitle.slice(packStart + packMatch[0].length, shopStart >= 0 ? shopStart : undefined).trim()
    : '';
  const shopText = shopStart >= 0 ? withoutTitle.slice(shopStart + shopMatch[0].length).trim() : '';

  const reportItems = extractNumberedSegments(reportText)
    .filter(({ n }) => n >= 1 && n <= 13)
    .map(({ text }) => stripFreshmanSectionNoise(text));
  if (reportItems.length < 4) return blocks;

  const out = [
    { type: 'h2', text: '大学报到流程', marks: [] },
    { type: 'ol', items: reportItems.map(text => ({ text, marks: [] })) },
  ];

  const packItems = extractNumberedSegments(packText).map(({ text }) => stripFreshmanSectionNoise(text));
  if (packItems.length) {
    out.push({ type: 'h2', text: '入学装箱必备', marks: [] });
    out.push({ type: 'ul', items: packItems.map(text => ({ text, marks: [] })) });
  }

  if (shopText) {
    out.push({ type: 'h2', text: '到校后常买日用品', marks: [] });
    out.push({ type: 'p', text: stripFreshmanSectionNoise(shopText), marks: [] });
  }

  return out;
}

function extractNumberedSegments(text) {
  const src = String(text || '').replace(/\s+/g, ' ').trim();
  const matches = [...src.matchAll(/(?:^|\s)(\d{1,2})[.．、]\s*/g)];
  if (!matches.length) return src ? [{ n: 1, text: src }] : [];
  return matches.map((m, i) => {
    const start = m.index + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : src.length;
    return { n: Number(m[1]), text: src.slice(start, end).trim() };
  }).filter(x => x.text);
}

function stripFreshmanSectionNoise(text) {
  return String(text || '')
    .replace(/[一二三四五六七八九十][.．、]\s*(大学报到流程|大学装箱必备|来到学校需要买的日用品)\s*/g, '')
    .replace(/^\d{1,2}[.．、]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandFreshmanFlow(text) {
  const cleaned = text.replace(/^大学报到流程[。.]?\s*/, '').replace(/\b80[\.．]/, '08.');
  const parts = cleaned
    .split(/(?=\b\d{2}[\.．]\s*)/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.replace(/^(\d{2})[\.．]\s*/, (_, n) => `${Number(n)}. `));
  if (parts.length < 4) return [{ type: 'p', text: cleaned, marks: [] }];
  return [
    { type: 'h2', text: '大学报到流程', marks: [] },
    { type: 'ol', items: parts.map(text => ({ text, marks: [] })) },
  ];
}

function splitPutonghuaText(text) {
  const seeded = text
    .replace(/(国家普通话水平测试题（?\d+）?)/g, '\n$1\n')
    .replace(/([一二三四]、[^）)]*[）)][^\n]*)/g, '\n$1\n')
    .replace(/(作品\d+号)/g, '\n$1\n')
    .replace(/(\d+\.我[^\n]+)/g, '\n$1\n');
  return seeded.split(/\n+/).map(s => s.trim()).filter(Boolean).flatMap(s => splitLongReadable(s, 650));
}

function splitExamText(text) {
  const t = text
    .replace(/\s+/g, ' ')
    .replace(/(?<!\d)(第\d+题\s*（?[\d.]+分）?)/g, '\n$1 ')
    .replace(/(?<!\d)(\d{1,3}[．、.]\s*)/g, '\n$1')
    .replace(/\s+([A-D])[．:：、)]\s*/g, '\n$1. ')
    .replace(/\s+(答案[:：]?\s*[A-D对错BDAC]{1,20})/g, '\n$1')
    .replace(/\s+(答案\s*\d+-\d+)/g, '\n$1')
    .trim();
  return t.split(/\n+/).map(s => s.trim()).filter(Boolean).flatMap(s => splitLongReadable(s, 700));
}

function splitLongReadable(text, max = 560) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized ? [normalized] : [];
  const chunks = [];
  let rest = normalized;
  while (rest.length > max) {
    let cut = bestCut(rest, max);
    chunks.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) chunks.push(rest);
  return chunks.filter(Boolean);
}

function bestCut(text, max) {
  const puncts = ['。', '？', '！', '；', ';', '：', ':', '）', ')'];
  let cut = -1;
  for (const p of puncts) cut = Math.max(cut, text.lastIndexOf(p, max));
  if (cut >= Math.floor(max * 0.45)) return cut + 1;
  const question = text.slice(1, max).search(/\s\d{1,3}[、．.]|\s第\d+题|\s[A-D][．:：、)]/);
  if (question > Math.floor(max * 0.35)) return question + 1;
  const comma = Math.max(text.lastIndexOf('，', max), text.lastIndexOf(',', max));
  if (comma >= Math.floor(max * 0.55)) return comma + 1;
  return max;
}

function classifyHeading(text) {
  return /^([一二三四五六七八九十]+[、.．]|\d+(?:\.\d+)*\s|第[一二三四五六七八九十\d]+[章节])/.test(text) && text.length < 80 ? 'h2' : 'p';
}

function blockTextLength(b) {
  if (b.text) return b.text.length;
  if (Array.isArray(b.items)) return b.items.reduce((n, it) => n + (it.text || '').length, 0);
  return 0;
}

function renumberBlocks(blocks) {
  return blocks.map((b, idx) => ({ ...b, idx }));
}

export function isPutonghuaTitle(title = '') {
  return /国家普通话水平测试题/.test(title);
}

export function pinyinPattern() {
  return PINYIN_RE;
}
