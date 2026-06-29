// 把全国重点高校宿舍与设施情况汇总.xlsx 转成精简 JSON
// 用法: node scripts/convert-xlsx.mjs
import XLSX from 'xlsx';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const src = resolve(root, '全国重点高校宿舍与设施情况汇总.xlsx');
const outDir = resolve(root, 'public', 'data');
mkdirSync(outDir, { recursive: true });

const buf = readFileSync(src);
const wb = XLSX.read(buf, { type: 'buffer' });
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

const header = rows[0];
const dataRows = rows.slice(1).filter(r => r[5]); // 院校名称必填

// 字段映射
const F = {
  province: 0,
  city: 1,
  cityType: 2,
  level: 3,
  nature: 4,
  name: 5,
  address: 6,
  multiCampus: 7,
  bedDesk: 8,       // 上床下桌
  roomSize: 9,      // 几人间
  dormAC: 10,       // 宿舍空调
  classAC: 11,      // 教室空调
  privateBath: 12,  // 独立卫浴
  hotWater: 13,     // 洗澡热水时段
  laundry: 14,      // 洗衣机
  nightStudy: 15,   // 通宵自习室
  powerLimit: 16,   // 宿舍限电瓦数
  nightPowerOff: 17,// 夜间断电
  nightNetOff: 18,  // 夜间断网
  netSpeed: 19,     // 校园网速度
  netPrice: 20,     // 校园网价格
  bringPC: 21,      // 大一带电脑
  checkDorm: 22,    // 查寝情况
  curfew: 23,       // 晚归门禁时间
  selfStudy: 24,    // 早晚自习
  morningRun: 25,   // 晨跑要求
  runCheck: 26,     // 跑步打卡要求
  subway: 27,       // 地铁
  cityDistance: 28, // 市区距离
  traffic: 29,      // 学校交通便利
  takeout: 30,      // 点外卖
  canteenPrice: 31, // 食堂价格感受
  storePrice: 32,   // 超市价格感受
  delivery: 33,     // 收发快递
  sharedBike: 34,   // 共享单车
};

function clean(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}

// 标准化"是/否/部分/有/无"等到枚举
function normalize(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (s === '') return null;
  if (['是', '有', '完全可以', '可以'].includes(s)) return 'yes';
  if (['否', '无'].includes(s)) return 'no';
  if (s.startsWith('部分')) return 'partial';
  return s; // 其他原样返回
}

const schools = dataRows.map((r, idx) => {
  const name = clean(r[F.name]);
  return {
    id: idx + 1,
    name,
    province: clean(r[F.province]),
    city: clean(r[F.city]),
    cityType: clean(r[F.cityType]),
    level: clean(r[F.level]),
    nature: clean(r[F.nature]),
    address: clean(r[F.address]),
    multiCampus: clean(r[F.multiCampus]),
    facilities: {
      bedDesk: normalize(r[F.bedDesk]),
      roomSize: clean(r[F.roomSize]),
      dormAC: normalize(r[F.dormAC]),
      classAC: normalize(r[F.classAC]),
      privateBath: normalize(r[F.privateBath]),
      hotWater: clean(r[F.hotWater]),
      laundry: clean(r[F.laundry]),
      nightStudy: clean(r[F.nightStudy]),
      powerLimit: clean(r[F.powerLimit]),
      nightPowerOff: clean(r[F.nightPowerOff]),
      nightNetOff: clean(r[F.nightNetOff]),
      netSpeed: clean(r[F.netSpeed]),
      netPrice: clean(r[F.netPrice]),
      bringPC: normalize(r[F.bringPC]),
      checkDorm: clean(r[F.checkDorm]),
      curfew: clean(r[F.curfew]),
      selfStudy: clean(r[F.selfStudy]),
      morningRun: clean(r[F.morningRun]),
      runCheck: clean(r[F.runCheck]),
    },
    around: {
      subway: normalize(r[F.subway]),
      cityDistance: clean(r[F.cityDistance]),
      traffic: clean(r[F.traffic]),
      takeout: normalize(r[F.takeout]),
      canteenPrice: clean(r[F.canteenPrice]),
      storePrice: clean(r[F.storePrice]),
      delivery: clean(r[F.delivery]),
      sharedBike: clean(r[F.sharedBike]),
    },
  };
});

// 索引：省份列表、城市列表、本科层次列表
const facets = {
  provinces: [...new Set(schools.map(s => s.province).filter(Boolean))].sort(),
  cities: [...new Set(schools.map(s => s.city).filter(Boolean))].sort(),
  cityTypes: [...new Set(schools.map(s => s.cityType).filter(Boolean))].sort(),
  levels: [...new Set(schools.map(s => s.level).filter(Boolean))].sort(),
  natures: [...new Set(schools.map(s => s.nature).filter(Boolean))].sort(),
  roomSizes: [...new Set(schools.flatMap(s => (s.facilities.roomSize || '').split(/[、,，]/)).map(x => x.trim()).filter(Boolean))].sort(),
};

const payload = { generatedAt: new Date().toISOString(), count: schools.length, facets, schools };
writeFileSync(resolve(outDir, 'schools.json'), JSON.stringify(payload));
console.log(`Wrote ${schools.length} schools to public/data/schools.json`);
console.log('Facets:', JSON.stringify(facets, null, 2));
