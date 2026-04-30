// ElectroCAD Pro v12 — Configuration and Constants

// Grid size for snapping
export const GRID = 20;

// Maximum undo history size
export const MAX_UNDO = 50;

// Feature flags
export const ENABLE_PROSUMER_MODULE = true;
export const ADMIN_EMAIL = 'grigoriualin13@gmail.com';

// ========== Electrical Tables ==========

// Resistance tables per conductor type (ohm/km)
export const R0_TABLES = {
  'Clasic Al': {2.5:11800,4:7320,6:4900,10:2940,16:1802,25:1181,35:833,50:579,70:437,95:309,120:246,150:196,185:158,240:119},
  'Torsadat Al': {10:3080,16:1910,25:1200,35:868,50:591,70:410,95:320,120:253,150:206},
  'Cablu Al': {2.5:11800,4:7812,6:5208,10:3125,16:1953,25:1250,35:892,50:525,70:445,95:328,120:260,150:208,185:169,240:130},
  'Cablu Cu': {2.5:7130,4:4470,6:2970,10:1786,16:1123,25:738,35:525,50:372,70:271,95:192,120:153,150:122,185:98,240:78}
};

// Ks coefficient tables — rural/urban simultaneity factor by consumer count
export const KS_RURAL = { 0:0,1:1,2:0.52,3:0.52,4:0.51,5:0.51,6:0.5,7:0.5,8:0.49,9:0.49,10:0.48, 11:0.48,12:0.48,13:0.47,14:0.47,15:0.47,16:0.46,17:0.46,18:0.46,19:0.45, 20:0.45,21:0.44,22:0.42,23:0.4,24:0.38,25:0.36,26:0.34,27:0.33,28:0.32, 29:0.31,30:0.3 };
export const KS_URBAN = { 0:0,1:1,2:0.65,3:0.64,4:0.63,5:0.63,6:0.62,7:0.62,8:0.61,9:0.6,10:0.59, 11:0.58,12:0.57,13:0.56,14:0.55,15:0.54,16:0.53,17:0.52,18:0.51,19:0.51, 20:0.51,21:0.5,22:0.49,23:0.48,24:0.47,25:0.46,26:0.45,27:0.44,28:0.43, 29:0.42,30:0.41 };

// ========== Prosumator Profiles ==========

// Consumption profiles — Delgaz Grid (official source, 168h Mon→Sun)
// Summer: 2022-07-04 ÷ 2022-07-10; Winter: 2022-12-05 ÷ 2022-12-11
// Normalized: mean summer = 1.0
export const PROS_PROFILE = {"cons_vara":[0.8803,0.7929,0.7503,0.7283,0.7202,0.7577,0.8539,0.9662,1.0638,1.1343,1.1798,1.2026,1.2033,1.2165,1.2209,1.2209,1.2415,1.2841,1.2995,1.3054,1.3046,1.3384,1.3223,1.0903,0.8986,0.7951,0.7467,0.7232,0.7055,0.7349,0.8304,0.9383,1.033,1.0829,1.1365,1.1747,1.1842,1.2011,1.2114,1.2261,1.2635,1.3017,1.3325,1.3384,1.3436,1.3715,1.3406,1.102,0.9082,0.8091,0.7606,0.7379,0.7158,0.7452,0.8494,0.9706,1.0609,1.1189,1.1747,1.2048,1.2099,1.2063,1.1901,1.1864,1.1857,1.2004,1.2364,1.2562,1.2599,1.2562,1.1505,0.9508,0.8105,0.7386,0.6997,0.6799,0.6688,0.7004,0.7672,0.8443,0.9119,0.964,1.0066,1.0161,0.9889,0.9823,0.9809,0.9956,1.0095,1.0411,1.0646,1.08,1.1035,1.1718,1.1321,0.9412,0.7775,0.6953,0.652,0.6365,0.6226,0.6512,0.7393,0.8465,0.9346,0.9735,0.9985,1.0124,1.0036,1.0139,1.0168,1.0455,1.0682,1.0932,1.1182,1.1262,1.1417,1.2004,1.1696,0.9757,0.812,0.7232,0.674,0.6527,0.6387,0.6637,0.7606,0.8928,1.0095,1.0866,1.1306,1.1512,1.1505,1.1571,1.1527,1.1497,1.1769,1.1997,1.2261,1.2474,1.2687,1.309,1.2665,1.0513,0.8781,0.7731,0.718,0.6938,0.6725,0.6725,0.7232,0.7929,0.8663,0.8972,0.9221,0.9295,0.9376,0.9258,0.9199,0.9141,0.9295,0.95,0.975,1.0227,1.055,1.0991,1.0506,0.8788],"cons_iarna":[0.7192,0.6595,0.6329,0.6208,0.6418,0.7111,0.8619,1.0239,1.1408,1.2142,1.2255,1.1997,1.1836,1.182,1.1997,1.2182,1.3005,1.3859,1.3884,1.3593,1.286,1.1739,1.0312,0.8659,0.7401,0.6708,0.6418,0.6281,0.6426,0.7079,0.8393,0.9449,0.9852,1.0078,1.0135,1.0006,1.0014,0.9997,1.0143,1.053,1.1505,1.2408,1.2553,1.2408,1.1852,1.0941,0.9683,0.8191,0.7151,0.6506,0.6232,0.6144,0.6305,0.695,0.8401,0.9868,1.0892,1.1336,1.14,1.1086,1.0699,1.0602,1.0683,1.1054,1.2295,1.3666,1.3803,1.3505,1.2666,1.1425,0.9844,0.8143,0.7047,0.6442,0.6152,0.6031,0.6224,0.6942,0.8482,1.003,1.0909,1.1223,1.1191,1.0796,1.0538,1.057,1.0699,1.1183,1.2295,1.3561,1.3674,1.3311,1.2497,1.1352,0.9756,0.8232,0.7159,0.6579,0.6281,0.62,0.6321,0.6942,0.7651,0.9046,1.0933,1.2053,1.2553,1.2602,1.2416,1.2166,1.2166,1.2489,1.3811,1.544,1.5415,1.4827,1.3722,1.2344,1.0554,0.8796,0.745,0.6748,0.6313,0.616,0.6152,0.645,0.7071,0.7998,0.9328,0.9885,1.0223,1.0344,1.0384,1.0118,0.9748,1.0078,1.1062,1.2328,1.2497,1.24,1.182,1.0771,0.9369,0.7998]};

// PVGIS v5.3 real profiles (JRC EU) — measured 2023 for Iasi, 1 kWp, losses 14%
// Summer: 2023-07-03 ÷ 2023-07-09 (Mon→Sun); Winter: 2023-12-04 ÷ 2023-12-10
// Values = fraction of installed kWp (0..1)
export const PROS_PV_PROFILE = {"pv_vara":[0.0,0.0,0.0,0.0001,0.0067,0.0166,0.0673,0.2487,0.5952,0.6755,0.5997,0.4709,0.5931,0.523,0.3877,0.2812,0.1282,0.0204,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0044,0.1255,0.2726,0.4072,0.5269,0.5883,0.5625,0.5796,0.5813,0.522,0.4554,0.3802,0.299,0.1462,0.0233,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0001,0.0067,0.2619,0.3265,0.0,0.4331,0.5195,0.6395,0.5999,0.5467,0.4657,0.3532,0.301,0.0323,0.0366,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0136,0.1188,0.2694,0.3874,0.533,0.6166,0.6645,0.674,0.6566,0.6125,0.5286,0.1319,0.0359,0.0183,0.0096,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0062,0.0163,0.2071,0.1037,0.1691,0.203,0.2223,0.2559,0.1963,0.3265,0.2951,0.1533,0.0972,0.0359,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0068,0.1598,0.3299,0.4343,0.5078,0.4994,0.6737,0.6964,0.5963,0.5915,0.4559,0.3033,0.1535,0.0384,0.0,0.0,0.0,0.0,0.0,0.0],"pv_iarna":[0.0,0.0,0.0,0.0,0.0,0.0,0.0095,0.0966,0.1863,0.1985,0.2324,0.21,0.1698,0.0665,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0026,0.0381,0.1104,0.0323,0.0623,0.0834,0.1102,0.043,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0006,0.0103,0.0397,0.0439,0.0985,0.0682,0.0413,0.0068,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0032,0.0425,0.1021,0.1164,0.1673,0.121,0.0812,0.0348,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0006,0.0343,0.0531,0.046,0.0399,0.0356,0.0216,0.0082,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0068,0.1598,0.3299,0.4343,0.5078,0.4994,0.6737,0.6964,0.5963,0.5915,0.4559,0.3033,0.1535,0.0384,0.0,0.0,0.0,0.0,0.0,0.0]};

// ========== Fișă de Calcul Catalog ==========

// Master FC catalog — relevant positions for auto-mapping from schema.
// Prices per FISA_CALCUL.xlsm (contr. 22.07.2024 / Costuri Specifice 2021).
export const FC_CATALOG = [
  // Branșamente aerian mono
  { poz:1, cat:'Brans.mono. radial aerian', den:'Branșament monofazat aerian standard', um:'buc', pu:1340.00 },
  { poz:2, cat:'Brans.mono. radial aerian', den:'Branșament monofazat aerian - deschidere suplimentară', um:'buc', pu:1810.00 },
  // Branșamente subteran mono
  { poz:4, cat:'Brans.mono. radial subteran', den:'Branșament monofazat subteran standard L ≤ 20 m din LEA', um:'buc', pu:2060.00 },
  { poz:5, cat:'Brans.mono. radial subteran', den:'Branșament monofazat subteran standard L ≤ 20 m din firidă', um:'buc', pu:1820.00 },
  { poz:6, cat:'Brans.mono. radial subteran', den:'Branșament monofazat subteran - creșterea lungimii cu 1 m față de L = 20 m', um:'m', pu:60.00 },
  // Branșamente aerian trif
  { poz:7, cat:'Brans.trif. radial aerian', den:'Branșament trifazat aerian standard', um:'buc', pu:1460.00 },
  { poz:8, cat:'Brans.trif. radial aerian', den:'Branșament trifazat aerian - deschidere suplimentară', um:'buc', pu:1930.00 },
  // Branșamente subteran trif
  { poz:10, cat:'Brans.trif. radial subteran', den:'Branșament trifazat subteran standard L≤ 20m din LEA', um:'buc', pu:2430.00 },
  { poz:11, cat:'Brans.trif. radial subteran', den:'Branșament trifazat subteran standard L≤ 20m din firida S≤20 KVA', um:'buc', pu:2060.00 },
  { poz:12, cat:'Brans.trif. radial subteran', den:'Branșament trifazat subteran standard L≤ 20m din firida 20KVA<S≤30 KVA', um:'buc', pu:2200.00 },
  { poz:13, cat:'Brans.trif. radial subteran', den:'Branșament trifazat subteran - creșterea lungimii cu 1 m față de L = 20 m', um:'m', pu:70.00 },
  // Extinderi rețele JT
  { poz:37, cat:'Costuri Specifice 2021', den:'Extinderi - rețele electrice noi LEA JT', um:'km', pu:194598.49 },
  { poz:38, cat:'Costuri Specifice 2021', den:'Extinderi - rețele electrice noi LES JT', um:'km', pu:257401.72 },
  { poz:40, cat:'Costuri Specifice 2021', den:'Extinderi rețele noi pe stâlpi existenți LEA JT', um:'km', pu:77839.40 },
  // Înlocuiri conductor
  { poz:43, cat:'Costuri Specifice 2021', den:'Înlocuire conductor torsadat 95mm2 1 KM traseu LEA 0.4 kV', um:'km', pu:176583.77 },
  // Înlocuiri stâlpi JT (fără material)
  { poz:47, cat:'Costuri Specifice 2021', den:'Înlocuire stâlp de JT de beton SE4 (fără material)', um:'buc', pu:7232.21 },
  { poz:48, cat:'Costuri Specifice 2021', den:'Înlocuire stâlp de JT de beton SE 10 (fără material)', um:'buc', pu:10895.40 },
];

// ========== Supabase Config ==========

export const SUPABASE_URL = 'https://fmvcwdopsugwqiodwtxm.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtdmN3ZG9wc1Vnd2FvZFd0eG0iLCJyb2xlIjoicGF1bCIsImlhdCI6MTc3NjE0MzM4NiwiZXhwIjoyMDkxNzE5Mzg2fQ.rkmhhzzaGHa0d_P7RSph0X74oDLYID_c4IZGPLstJD0';
