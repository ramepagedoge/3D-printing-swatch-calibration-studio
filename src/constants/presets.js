export const MODEL_PRESETS = [
  {
    id: 'swatch',
    name: 'Translucent Filament Swatch',
    nameZh: '多階透光色票樣卡 (150%)',
    description: '150% scaled 128×75mm card with 5-step thickness window, lanyard hole, and line width gauge.',
    descriptionZh: '150% 放大 128×75mm 規格，具備 5 階透光窗、掛孔與精度肋條，厚度孔洞不變。',
    defaultSize: { width: 127.5, length: 75.0, height: 2.4 },
    category: 'swatch'
  },
  {
    id: 'bridge',
    name: 'Dual-Track Bridging Test Card',
    nameZh: '雙軌橋接測試校準卡 (150%)',
    description: 'Narrow and wide bridging tracks across 5 spans (15-75mm) with a 1-5mm droop gauge.',
    descriptionZh: '窄線與寬帶雙軌 5 階跨距測試 (15~75mm)，附帶 1~5mm 階梯下垂量測標尺。',
    defaultSize: { width: 127.5, length: 75.0, height: 9.4 },
    category: 'bridge'
  },
  {
    id: 'ironing',
    name: 'Top Surface Ironing Matrix',
    nameZh: '表面熨燙校準矩陣卡 (150%)',
    description: '4×5 matrix testing flow rates against line spacings for optimal top surface finish.',
    descriptionZh: '4×5 測試矩陣（流量% × 行間距），精準調校頂層平整度與光澤。',
    defaultSize: { width: 127.5, length: 75.0, height: 3.2 },
    category: 'ironing'
  },
  {
    id: 'fuzzy',
    name: 'Vertical Fuzzy Skin Matrix',
    nameZh: '垂直外壁 Fuzzy 噪波卡 (150%)',
    description: 'Standalone vertical card with a 4×4 tactile grid of point distance vs skin thickness.',
    descriptionZh: '直立獨立卡片 (128x75mm)，包含 4×4 點間距與噪波厚度矩陣，直觀比對手感觸感。',
    defaultSize: { width: 127.5, length: 2.4, height: 75.0 },
    category: 'fuzzy'
  },
  {
    id: 'tolerance',
    name: 'Precision Tolerance Gauge',
    nameZh: '精密配合公差量規卡 (150%)',
    description: '4 pin diameters across 5 clearance gap levels (20 stations) to evaluate fit and shrinkage.',
    descriptionZh: '4 組精密圓銷直徑配合 5 階公差間隙（共 20 個插孔），測試機構裝配與材料收縮。',
    defaultSize: { width: 127.5, length: 75.0, height: 4.8 },
    category: 'tolerance'
  }
];

export const FILAMENT_BRANDS = [
  'Bambu Lab',
  'Polymaker',
  'eSUN',
  'Sunlu',
  'Overture',
  'Formfutura',
  'Prusament',
  'Eryone',
  'Custom'
];

export const MATERIAL_PROFILES = [
  {
    name: 'PLA Basic',
    nozzleTemp: 220,
    bedTemp: 55,
    bridgeSpeed: 50,
    bridgeFlow: 0.95,
    flowRatio: 0.98,
    kFactor: 0.02,
    finish: 'glossy',
    notes: 'Standard General Purpose'
  },
  {
    name: 'PLA Matte',
    nozzleTemp: 220,
    bedTemp: 55,
    bridgeSpeed: 45,
    bridgeFlow: 0.95,
    flowRatio: 0.96,
    kFactor: 0.025,
    finish: 'matte',
    notes: 'Low Glare / Fine Texture'
  },
  {
    name: 'PLA Silk',
    nozzleTemp: 225,
    bedTemp: 60,
    bridgeSpeed: 40,
    bridgeFlow: 1.00,
    flowRatio: 1.00,
    kFactor: 0.02,
    finish: 'silk',
    notes: 'High Gloss Metallic Sheen'
  },
  {
    name: 'PETG Basic',
    nozzleTemp: 250,
    bedTemp: 75,
    bridgeSpeed: 35,
    bridgeFlow: 0.95,
    flowRatio: 0.95,
    kFactor: 0.04,
    finish: 'glossy',
    notes: 'High Toughness / Heat 75C'
  },
  {
    name: 'PETG-CF',
    nozzleTemp: 255,
    bedTemp: 80,
    bridgeSpeed: 30,
    bridgeFlow: 0.94,
    flowRatio: 0.94,
    kFactor: 0.035,
    finish: 'cf',
    notes: 'Carbon Fiber Reinforced'
  },
  {
    name: 'ABS',
    nozzleTemp: 260,
    bedTemp: 90,
    bridgeSpeed: 40,
    bridgeFlow: 0.96,
    flowRatio: 0.96,
    kFactor: 0.03,
    finish: 'matte',
    notes: 'Enclosed Chamber Recommended'
  },
  {
    name: 'ASA',
    nozzleTemp: 265,
    bedTemp: 95,
    bridgeSpeed: 40,
    bridgeFlow: 0.96,
    kFactor: 0.03,
    finish: 'matte',
    tempStart: 275,
    tempStep: 5,
    notes: 'UV Resistant Outdoor'
  },
  {
    name: 'TPU 95A',
    nozzleTemp: 230,
    bedTemp: 40,
    bridgeSpeed: 20,
    bridgeFlow: 1.05,
    flowRatio: 1.05,
    kFactor: 0.08,
    finish: 'glossy',
    tempStart: 240,
    tempStep: 5,
    notes: 'Direct Drive Only / Slow'
  },
  {
    name: 'PA-CF',
    nozzleTemp: 280,
    bedTemp: 100,
    bridgeSpeed: 30,
    bridgeFlow: 0.93,
    flowRatio: 0.93,
    kFactor: 0.04,
    finish: 'cf',
    tempStart: 290,
    tempStep: 5,
    notes: 'Dry 12h @ 80C Before Print'
  },
  {
    name: 'PC',
    nozzleTemp: 275,
    bedTemp: 100,
    bridgeSpeed: 35,
    bridgeFlow: 0.96,
    flowRatio: 0.96,
    kFactor: 0.035,
    finish: 'glossy',
    tempStart: 285,
    tempStep: 5,
    notes: 'High Strength / High Temp'
  }
];

export const POPULAR_COLORS = [
  { name: 'Jade White', hex: '#F5F5F7' },
  { name: 'Matte Charcoal', hex: '#2C2D30' },
  { name: 'Bambu Green', hex: '#00AE42' },
  { name: 'Sunset Orange', hex: '#FF5B00' },
  { name: 'Cyan Blue', hex: '#009FE3' },
  { name: 'Crimson Red', hex: '#C8102E' },
  { name: 'Silk Gold', hex: '#D4AF37' },
  { name: 'Space Gray', hex: '#6B7280' },
  { name: 'Cyber Purple', hex: '#8B5CF6' },
  { name: 'Sunflower Yellow', hex: '#FACC15' }
];
