// Logic màn hình Bảng Chữ Cái (Pinyin)

let abGroup = 'all';
let abList = [];
let abIndex = 0;

function buildAlphabetList(group) {
  const d = ALPHABET_DATA;
  if (group === 'initials') return d.initials.map(x => ({ ...x, groupLabel: 'Phụ âm' }));
  if (group === 'finals')   return d.finals.map(x => ({ ...x, groupLabel: 'Nguyên âm' }));
  if (group === 'tones')    return d.tones.map(x => ({ ...x, groupLabel: 'Thanh điệu', example: x.pinyin }));
  return [
    ...d.initials.map(x => ({ ...x, groupLabel: 'Phụ âm' })),
    ...d.finals.map(x => ({ ...x, groupLabel: 'Nguyên âm' })),
    ...d.tones.map(x => ({ ...x, groupLabel: 'Thanh điệu', example: x.pinyin })),
  ];
}

function filterAlphabet(group) {
  abGroup = group;
  abList = buildAlphabetList(group);
  abIndex = 0;
  document.querySelectorAll('.ab-filter-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.group === group)
  );
  renderJumpGrid();
  renderAlphabetCard();
}

function renderJumpGrid() {
  const grid = document.getElementById('ab-jump-grid');
  grid.innerHTML = abList.map((item, i) =>
    `<button class="ab-jump-pill${i === abIndex ? ' active' : ''}" data-idx="${i}" onclick="jumpToAlphabet(${i})">${item.pinyin}</button>`
  ).join('');
}

function jumpToAlphabet(i) {
  abIndex = i;
  renderAlphabetCard();
}

function highlightActivePill() {
  document.querySelectorAll('.ab-jump-pill').forEach((el, i) => {
    el.classList.toggle('active', i === abIndex);
  });
  const activeEl = document.querySelector('.ab-jump-pill.active');
  if (activeEl) activeEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function renderAlphabetCard() {
  if (!abList.length) return;
  const item = abList[abIndex];

  // Hiệu ứng fade nhẹ mỗi khi chuyển sang phát âm mới
  const cardEl = document.querySelector('#alphabet .ab-card');
  if (cardEl) {
    cardEl.classList.remove('ab-fade-in');
    void cardEl.offsetWidth; // ép trình duyệt reflow để animation chạy lại
    cardEl.classList.add('ab-fade-in');
  }

  document.getElementById('ab-pinyin').textContent = item.pinyin;
  document.getElementById('ab-hanzi').textContent = item.hanzi;
  document.getElementById('ab-write-hanzi').textContent = item.hanzi;
  document.getElementById('ab-example-pinyin').textContent = item.toneLabel || item.example;
  document.getElementById('ab-meaning').textContent = item.meaning;
  document.getElementById('ab-counter').textContent = `${abIndex + 1} / ${abList.length}`;
  document.getElementById('ab-group-tag').textContent = item.groupLabel;

  const abProgressFill = document.getElementById('ab-progress-fill');
  if (abProgressFill) abProgressFill.style.width = `${((abIndex + 1) / abList.length) * 100}%`;

  document.getElementById('ab-example-sentence').innerHTML = `
    <div class="zh">这是${item.hanzi}。</div>
    <div class="py">Zhè shì ${item.example}.</div>
    <div class="vi">Đây là ${item.meaning}.</div>
  `;

  highlightActivePill();
}

function nextAlphabet() {
  if (!abList.length) return;
  abIndex = (abIndex + 1) % abList.length;
  renderAlphabetCard();
}

function prevAlphabet() {
  if (!abList.length) return;
  abIndex = (abIndex - 1 + abList.length) % abList.length;
  renderAlphabetCard();
}

function switchAbTab(tab) {
  document.querySelectorAll('.ab-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab)
  );
  document.getElementById('ab-tab-write').style.display = tab === 'write' ? 'block' : 'none';
  document.getElementById('ab-tab-example').style.display = tab === 'example' ? 'block' : 'none';
}

function playAlphabetAudio() {
  if (!abList.length) return;
  const item = abList[abIndex];
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(item.hanzi);
    utter.lang = 'zh-CN';
    utter.rate = 0.75;
    window.speechSynthesis.speak(utter);
  }
}

function initAlphabetScreen() {
  filterAlphabet('all');
}

window.filterAlphabet = filterAlphabet;
window.nextAlphabet = nextAlphabet;
window.prevAlphabet = prevAlphabet;
window.switchAbTab = switchAbTab;
window.playAlphabetAudio = playAlphabetAudio;
window.initAlphabetScreen = initAlphabetScreen;
