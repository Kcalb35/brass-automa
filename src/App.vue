<script setup>
import { ref, computed } from 'vue';
import { cardDecks } from './data/cards.js';

// 随机打乱数组的辅助函数 (Fisher-Yates shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- 响应式状态 ---

// 用户的选择
const selection = ref({
  game: 'lancashire',
  type: 'large', // 'large' or 'small'
  era: 'canal',  // 'canal' or 'rail'
});

// 牌堆
const drawPile = ref([]);
const discardPile = ref([]);

// UI状态
const deckBuilt = ref(false);

// --- 计算属性 ---

const gameTitle = computed(() => {
  if (!selection.value.game) return '选择游戏';
  return `${cardDecks[selection.value.game].name}自动机`;
});

const imageBaseUrl = computed(() => {
  if (!selection.value.game) return '';
  return cardDecks[selection.value.game].imagePath;
});

// 当前抽牌堆顶的牌
const currentCard = computed(() => {
  if (drawPile.value.length > 0) {
    return drawPile.value[drawPile.value.length - 1];
  }
  return null;
});

// 当前展示的卡牌图片URL (总是B面)
const currentCardImageUrl = computed(() => {
  if (!currentCard.value) return `${imageBaseUrl.value}1b.png`; // 默认背面或占位图
  return `${imageBaseUrl.value}${currentCard.value.id}b.png`;
});

// 弃牌顶的牌
const discardPileTopCard = computed(() => {
  if (discardPile.value.length > 0) {
    return discardPile.value[discardPile.value.length - 1];
  }
  return null;
});

// 弃牌堆顶的卡牌图片URL (总是A面)
const discardPileTopCardUrl = computed(() => {
  if (!discardPileTopCard.value) return null;
  return `${imageBaseUrl.value}${discardPileTopCard.value.id}a.png`;
});


// 构建牌堆
function buildDeck() {
  const allCards = cardDecks[selection.value.game].cards;
  
  // 1. 筛选卡牌
  let availableCards = allCards.filter(card => {
    if (selection.value.type === 'large' && card.type === 'small') return false;
    if (selection.value.type === 'small' && card.type === 'large') return false;
    if (selection.value.era === 'canal' && card.isRailEra) return false;
    return true;
  });

  // 2. 按A, B, C分组
  const groups = {
    A: availableCards.filter(c => c.group === 'A'),
    B: availableCards.filter(c => c.group === 'B'),
    C: availableCards.filter(c => c.group === 'C'),
  };

  let deck = [];

  // 3. 从A中随机选4张，B中3张，C中3张，混合
  const stage1 = [
    ...shuffle(groups.A).splice(0, 4),
    ...shuffle(groups.B).splice(0, 3),
    ...shuffle(groups.C).splice(0, 3),
  ];
  deck.push(...shuffle(stage1));

  // 4. 从每个组剩下的牌中各选1张，混合加入
  const stage2 = [
    ...shuffle(groups.A).splice(0, 1),
    ...shuffle(groups.B).splice(0, 1),
    ...shuffle(groups.C).splice(0, 1),
  ];
  deck.push(...shuffle(stage2));

  // 5. 混合所有剩下的牌加入
  const remainingCards = [...groups.A, ...groups.B, ...groups.C];
  deck.push(...shuffle(remainingCards));

  // 6. 颠倒顺序
  deck.reverse();

  drawPile.value = deck;
  discardPile.value = [];
  deckBuilt.value = true;
}

// 抽一张牌并直接放入弃牌堆
function drawCard() {
  if (!currentCard.value) return;
  const drawnCard = drawPile.value.pop();
  discardPile.value.push(drawnCard);
}

// 撤销上一步操作
function undoLastMove() {
  if (discardPile.value.length === 0) return; // 如果弃牌堆是空的，则不执行任何操作
  const lastCard = discardPile.value.pop();
  drawPile.value.push(lastCard);
}


// 重置并返回游戏选择界面
function reset() {
  deckBuilt.value = false;
  drawPile.value = [];
  discardPile.value = [];
}

</script>

<template>
  <div id="app">
    <header class="header">
      <h1>{{ gameTitle }}</h1>
      <button v-if="deckBuilt" @click="reset" class="reset-btn">返回首页</button>
    </header>

    <!-- 设置界面 -->
    <main v-if="!deckBuilt" class="setup-container">
      <div class="options">
        <div class="option-group">
          <label>选择游戏:</label>
          <div class="btn-group">
            <button :class="{ active: selection.game === 'lancashire' }" @click="selection.game = 'lancashire'">
              <img src="/lancashire.jpg" class="logo" />
              <div>兰开夏</div>
            </button>
            <button :class="{ active: selection.game === 'birmingham' }" @click="selection.game = 'birmingham'">
              <img src="/birmingham.jpg" class="logo" />
              <div>伯明翰</div>
            </button>
          </div>
          <div v-if="selection.game=='lancashire'">
            <label>选择地图:</label>
            <div class="btn-group">
              <button :class="{ active: selection.type === 'large' }" @click="selection.type = 'large'">Large</button>
              <button :class="{ active: selection.type === 'small' }" @click="selection.type = 'small'">Small</button>
            </div>
            <label>选择时代:</label>
            <div class="btn-group">
              <button :class="{ active: selection.era === 'canal' }" @click="selection.era = 'canal'">运河</button>
              <button :class="{ active: selection.era === 'rail' }" @click="selection.era = 'rail'">铁路</button>
            </div>
          </div>
        </div>
      </div>
      <button @click="buildDeck" class="build-btn">构建牌堆</button>
    </main>

    <!-- 抽卡界面 -->
    <main v-else class="game-container">
      <div class="piles">
        <div class="pile">
          <h2>弃牌堆 ({{ discardPile.length }})</h2>
           <div class="card-display">
            <img
              v-if="discardPileTopCardUrl"
              :src="discardPileTopCardUrl"
              alt="Discard Pile"
              class="card"
              @click="undoLastMove"
            />
            <div v-else class="card-placeholder">弃牌堆为空</div>
          </div>
        </div>
        <div class="pile">
          <h2>抽牌堆 ({{ drawPile.length }})</h2>
          <div class="card-display">
            <img
              v-if="currentCard"
              :src="currentCardImageUrl"
              alt="Current Card"
              @click="drawCard"
              class="card"
            />
            <div v-else class="card-placeholder">牌堆已空</div>
          </div>
        </div>
      </div>
       <div class="instructions">
          <p v-if="currentCard">点击下方卡牌抽卡</p>
          <p v-if="discardPile.length > 0">点击上方弃牌堆的卡牌可撤销</p>
        </div>
    </main>
  </div>
</template>

<style>
:root {
  --secondary-bg: #ffffff;
  --text-color: #333;
  --primary-color: #007bff;
  --border-color: #ddd;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--secondary-bg);
  color: var(--text-color);
}

#app {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.header {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 0.5rem;
  text-align: center;
  position: relative;
}

.header h1 {
  margin: 0;
  font-size: 1.2rem;
}

.reset-btn {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: white;
  color: var(--primary-color);
  border: none;
  border-radius: 5px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-weight: bold;
}

.setup-container, .game-container {
  padding: 0.5rem;
}

.options {
  margin-bottom: 1.5rem;
}

.option-group {
  margin-bottom: 1rem;
}

.option-group label {
  display: block;
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1rem;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.btn-group button {
  flex-grow: 1;
  padding: 0.7rem;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  background-color: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.btn-group button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-group-vertical button {
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  background-color: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.btn-group-vertical button:hover:not(:disabled) {
  background-color: #e2e6ea;
}

.btn-group-vertical button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}


.btn-group button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.build-btn {
  width: 100%;
  padding: 0.8rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.build-btn:hover {
  background-color: #218838;
}



.piles {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.pile h2 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.card-display {
  height: auto; 
}

.card {
  max-width: 220px;
  width: 100%;
  height: auto;
  cursor: pointer;
  display: block;
}

.card-placeholder {
  width: 220px;
  height: 308px;
  border: 2px dashed var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

.instructions {
  text-align: center;
  margin-top: 1rem;
  color: #555;
  min-height: 1.5em;
  font-size: 0.9rem;
}

.logo {
  width:80%;
}
</style>

