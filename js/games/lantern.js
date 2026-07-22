// Logic màn hình "Đèn Lồng Ghép Đôi" (Lantern Match)
// Game lật thẻ tìm cặp: 1 thẻ hiện Hán tự, 1 thẻ hiện nghĩa tiếng Việt tương ứng.
// Dùng chung currentVocab của bài học đang chọn (lanternVocab được app.js gán
// trong launchTopicVocab), chia thành các vòng 5 cặp/vòng (10 thẻ/vòng) —
// bài học chuẩn 20 từ sẽ chia thành 2 vòng.
// Tiến độ dùng chung vocabSeen/currentLessonKey đã có sẵn trong app.js,
// không xây hệ thống lưu riêng: vòng được coi là "đã xong" khi mọi từ trong
// vòng đó đã có trong vocabSeen[currentLessonKey].

let lanternVocab = [];
const LANTERN_ROUND_SIZE = 5;

let lnRound = 0;             // vòng hiện tại (0-based)
let lnRoundWordsList = [];   // danh sách từ của vòng hiện tại
let lnCards = [];            // 2 thẻ / từ, đã xáo trộn
let lnFlippedIdx = [];       // index các thẻ đang lật chờ so khớp (tối đa 2)
let lnLock = false;          // khoá thao tác trong lúc đang so khớp / úp lại
let lnMatched = 0;           // số cặp đã ghép đúng trong vòng hiện tại
let lnFlipTimer = null;      // timeout đang chờ (ghép đúng / sai) — cần clear khi rời màn

// ==================== CHIA VÒNG ====================

function lnTotalRounds() {
  return Math.max(1, Math.ceil(lanternVocab.length / LANTERN_ROUND_SIZE));
}

function lnRoundWords(r) {
  return lanternVocab.slice(r * LANTERN_ROUND_SIZE, r * LANTERN_ROUND_SIZE + LANTERN_ROUND_SIZE);
}

function lnRoundDone(r) {
  const seen = vocabSeen[currentLessonKey];
  if (!seen) return false;
  const words = lnRoundWords(r);
  return words.length > 0 && words.every(w => seen.has(wordKey(w)));
}

// Tìm vòng đầu tiên chưa hoàn thành để tiếp tục học dở; nếu đã xong hết,
// quay lại vòng cuối (cho phép chơi lại để ôn tập).
function lnFindResumeRound() {
  const total = lnTotalRounds();
  for (let r = 0; r < total; r++) {
    if (!lnRoundDone(r)) return r;
  }
  return total - 1;
}

// ==================== KHỞI TẠO MÀN HÌNH ====================

function initLanternScreen() {
  if (lnFlipTimer) { clearTimeout(lnFlipTimer); lnFlipTimer = null; }
  lnRound = lnFindResumeRound();
  lnMatched = 0;
  lnFlippedIdx = [];
  lnLock = false;
  lnCards = [];
  document.getElementById('ln-board').innerHTML = '';
  document.getElementById('ln-complete-overlay').style.display = 'none';
  document.getElementById('ln-start-overlay').style.display = 'flex';
  document.getElementById('ln-start-round').textContent = lnRound + 1;
  updateLanternProgressUI();
}

function updateLanternProgressUI() {
  const total = lnTotalRounds();
  document.getElementById('ln-round-info').textContent = `Vòng ${lnRound + 1}/${total}`;
  const words = lnRoundWordsList.length ? lnRoundWordsList : lnRoundWords(lnRound);
  const pct = words.length ? Math.round((lnMatched / words.length) * 100) : 0;
  document.getElementById('ln-progress').style.width = pct + '%';
}

function startLantern() {
  document.getElementById('ln-start-overlay').style.display = 'none';
  buildLanternRound(lnRound);
}

// ==================== DỰNG BÀN CHƠI CHO 1 VÒNG ====================

function buildLanternRound(r) {
  lnRoundWordsList = lnRoundWords(r);
  lnMatched = 0;
  lnFlippedIdx = [];
  lnLock = false;

  const cards = [];
  lnRoundWordsList.forEach((w, pairIdx) => {
    cards.push({ pairIdx, type: 'hanzi', word: w, matched: false });
    cards.push({ pairIdx, type: 'meaning', word: w, matched: false });
  });
  // Xáo trộn (Fisher-Yates)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  lnCards = cards;

  renderLanternBoard();
  updateLanternProgressUI();
}

function renderLanternBoard() {
  const board = document.getElementById('ln-board');
  board.innerHTML = lnCards.map((c, idx) => {
    const front = c.type === 'hanzi'
      ? `<span class="ln-hanzi">${c.word.hanzi}</span>`
      : `<span class="ln-meaning">${c.word.meaning}</span>`;
    return `
      <div class="ln-card" data-idx="${idx}" tabindex="0" role="button" aria-label="Thẻ đèn lồng"
           onclick="flipLanternCard(${idx})"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();flipLanternCard(${idx})}">
        <div class="ln-card-inner">
          <div class="ln-card-face ln-card-back">🏮</div>
          <div class="ln-card-face ln-card-front">${front}</div>
        </div>
      </div>`;
  }).join('');
}

function lnCardEl(idx) {
  return document.querySelector('#ln-board .ln-card[data-idx="' + idx + '"]');
}

// ==================== LẬT THẺ / SO KHỚP ====================

function flipLanternCard(idx) {
  if (lnLock) return;
  const card = lnCards[idx];
  if (!card || card.matched || lnFlippedIdx.includes(idx)) return;
  if (lnFlippedIdx.length >= 2) return;

  lnFlippedIdx.push(idx);
  const el = lnCardEl(idx);
  if (el) el.classList.add('flipped');

  if (lnFlippedIdx.length < 2) return;

  lnLock = true;
  const [i1, i2] = lnFlippedIdx;
  const c1 = lnCards[i1], c2 = lnCards[i2];
  const isMatch = c1.pairIdx === c2.pairIdx && c1.type !== c2.type;

  if (isMatch) {
    c1.matched = true;
    c2.matched = true;
    markVocabSeen(c1.word);
    lnMatched++;
    spawnLanternMatchFx(i1);
    spawnLanternMatchFx(i2);
    updateLanternProgressUI();
    lnFlipTimer = setTimeout(() => {
      [i1, i2].forEach(i => { const e = lnCardEl(i); if (e) e.classList.add('matched'); });
      lnFlippedIdx = [];
      lnLock = false;
      lnFlipTimer = null;
      if (lnMatched >= lnRoundWordsList.length) showLanternRoundComplete();
    }, 350);
  } else {
    lnFlipTimer = setTimeout(() => {
      [i1, i2].forEach(i => { const e = lnCardEl(i); if (e) e.classList.remove('flipped'); });
      lnFlippedIdx = [];
      lnLock = false;
      lnFlipTimer = null;
    }, 1000);
  }
}

// ==================== HIỆU ỨNG GHÉP ĐÚNG (đèn lồng bay lên + lấp lánh) ====================

function spawnLanternMatchFx(idx) {
  const board = document.getElementById('ln-board');
  const el = lnCardEl(idx);
  if (!board || !el) return;
  const boardRect = board.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const cx = r.left - boardRect.left + r.width / 2;
  const cy = r.top - boardRect.top + r.height / 2;

  const lantern = document.createElement('div');
  lantern.className = 'ln-fly-lantern';
  lantern.textContent = '🏮';
  lantern.style.left = cx + 'px';
  lantern.style.top = cy + 'px';
  board.appendChild(lantern);
  setTimeout(() => lantern.remove(), 900);

  for (let i = 0; i < 6; i++) {
    const sp = document.createElement('div');
    sp.className = 'ln-spark';
    sp.style.left = cx + 'px';
    sp.style.top = cy + 'px';
    sp.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    sp.style.setProperty('--dy', -(30 + Math.random() * 40) + 'px');
    sp.style.animationDelay = (Math.random() * 0.15) + 's';
    board.appendChild(sp);
    setTimeout(() => sp.remove(), 900);
  }
}

// ==================== HOÀN THÀNH VÒNG ====================

function showLanternRoundComplete() {
  const total = lnTotalRounds();
  const isLast = lnRound >= total - 1;

  document.getElementById('ln-complete-title').textContent = isLast
    ? `🎉 Hoàn thành tất cả ${total} vòng!`
    : `🎉 Chúc mừng! Hoàn thành ${lnRoundWordsList.length} từ`;

  const actions = document.getElementById('ln-complete-actions');
  actions.innerHTML = '';

  if (!isLast) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'game-start-btn';
    nextBtn.textContent = 'Vòng tiếp theo →';
    nextBtn.onclick = () => {
      lnRound++;
      document.getElementById('ln-complete-overlay').style.display = 'none';
      buildLanternRound(lnRound);
    };
    actions.appendChild(nextBtn);
  }

  const stopBtn = document.createElement('button');
  stopBtn.className = 'game-start-btn';
  stopBtn.style.background = 'linear-gradient(135deg,#555,#333)';
  stopBtn.textContent = isLast ? 'Xong' : 'Dừng lại';
  stopBtn.onclick = () => {
    document.getElementById('ln-complete-overlay').style.display = 'none';
    goBack();
  };
  actions.appendChild(stopBtn);

  spawnLanternCelebrationFx();
  document.getElementById('ln-complete-overlay').style.display = 'flex';
}

function spawnLanternCelebrationFx() {
  const fx = document.getElementById('ln-complete-fx');
  if (!fx) return;
  fx.innerHTML = '';
  const emojis = ['🏮', '🏮', '🏮', '✨', '✨'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'ln-celebrate-item';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = (5 + Math.random() * 90) + '%';
    el.style.fontSize = (1.3 + Math.random() * 1.4) + 'rem';
    el.style.animationDuration = (2.2 + Math.random() * 1.2) + 's';
    el.style.animationDelay = (Math.random() * 1.2) + 's';
    fx.appendChild(el);
  }
}

// ==================== DỌN DẸP KHI RỜI MÀN (gọi từ ScreenManager) ====================

function stopLantern() {
  if (lnFlipTimer) { clearTimeout(lnFlipTimer); lnFlipTimer = null; }
  lnLock = false;
}

window.initLanternScreen = initLanternScreen;
window.startLantern = startLantern;
window.flipLanternCard = flipLanternCard;
window.stopLantern = stopLantern;
