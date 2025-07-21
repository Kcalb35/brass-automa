// card-data.js

/*
 * 在此处定义所有卡片。
 * 每张卡片都需要以下属性：
 * - id: 卡片编号，用于构建图像URL（例如，id: 1 对应 1a.png 和 1b.png）。
 * - type: 'large', 'small', 或 'common'。
 * - isRailEra: 布尔值，如果卡片属于铁路时代，则为true。
 * - group: 'A', 'B', 或 'C'。
 */

export const lancashireCards = [
  { id: 1, type: 'large', isRailEra: true, group: 'C' },
  { id: 2, type: 'common', isRailEra: false, group: 'C' },
  { id: 3, type: 'common', isRailEra: true, group: 'C' },
  { id: 4, type: 'common', isRailEra: false, group: 'C' },
  { id: 5, type: 'small', isRailEra: true, group: 'A' },
  { id: 6, type: 'large', isRailEra: false, group: 'A' },
  { id: 7, type: 'large', isRailEra: true, group: 'C' },
  { id: 8, type: 'common', isRailEra: false, group: 'A' },
  { id: 9, type: 'common', isRailEra: false, group: 'A' },
  { id: 10, type: 'large', isRailEra: false, group: 'C' },
  { id: 11, type: 'small', isRailEra: true, group: 'C' },
  { id: 12, type: 'common', isRailEra: false, group: 'C' },
  { id: 13, type: 'common', isRailEra: false, group: 'B' },
  { id: 14, type: 'large', isRailEra: true, group: 'B' },
  { id: 15, type: 'common', isRailEra: false, group: 'B' },
  { id: 16, type: 'common', isRailEra: false, group: 'C' },
  { id: 17, type: 'small', isRailEra: true, group: 'C' },
  { id: 18, type: 'common', isRailEra: false, group: 'C' },
  { id: 19, type: 'large', isRailEra: false, group: 'C' },
  { id: 20, type: 'small', isRailEra: true, group: 'C' },
  { id: 21, type: 'common', isRailEra: true, group: 'A' },
  { id: 22, type: 'large', isRailEra: false, group: 'A' },
  { id: 23, type: 'large', isRailEra: true, group: 'A' },
  { id: 24, type: 'small', isRailEra: true, group: 'A' },
  { id: 25, type: 'small', isRailEra: false, group: 'A' },
  { id: 26, type: 'large', isRailEra: false, group: 'A' },
  { id: 27, type: 'small', isRailEra: false, group: 'A' },
  { id: 28, type: 'common', isRailEra: false, group: 'A' },
  { id: 29, type: 'small', isRailEra: false, group: 'A' },
  { id: 30, type: 'common', isRailEra: false, group: 'A' },
  { id: 31, type: 'common', isRailEra: true, group: 'B' },
  { id: 32, type: 'small', isRailEra: false, group: 'B' },
  { id: 33, type: 'small', isRailEra: true, group: 'B' },
  { id: 34, type: 'common', isRailEra: false, group: 'B' },
  { id: 35, type: 'common', isRailEra: true, group: 'C' },
  { id: 36, type: 'large', isRailEra: true, group: 'B' },
  { id: 37, type: 'common', isRailEra: false, group: 'B' },
  { id: 38, type: 'large', isRailEra: false, group: 'C' },
  { id: 39, type: 'large', isRailEra: false, group: 'B' },
  { id: 40, type: 'large', isRailEra: false, group: 'C' },
  { id: 41, type: 'large', isRailEra: true, group: 'A' },
  { id: 42, type: 'large', isRailEra: false, group: 'C' },
];

// 为伯明翰预留的牌堆
export const birminghamCards = [
  // 伯明翰卡牌数据将在这里定义
];

// 导出所有牌堆
export const cardDecks = {
  lancashire: {
    name: '兰开夏',
    cards: lancashireCards,
    imagePath: '/Lancashire-cards/',
  },
  birmingham: {
    name: '伯明翰',
    cards: birminghamCards,
    imagePath: '/Birmingham-cards/', // 假设的路径
  },
};