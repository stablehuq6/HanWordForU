// Lets keyboard users "click" a whole-card clickable area (.menu-card,
// .practice-btn) with Enter or Space, same as tapping/clicking it.
// Works for cards added later via innerHTML (topic-picker, lesson-picker)
// since it's delegated on document instead of attached per-element.
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const target = e.target.closest('.menu-card, .practice-btn');
  if (!target) return;
  e.preventDefault();
  target.click();
});

// ==================== SCREEN MANAGER ====================
// Handles switching between screens, plus a shared back button
// and breadcrumb trail that reflect where the user actually is
// in the app (Trang chủ > Thực hành > Săn Rồng, etc).

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s =>
    s.classList.remove('active')
  );

  document.getElementById(id).classList.add('active');
  renderNavBar(id);
}

window.showScreen = showScreen;

// ---- Labels shown in the back button / breadcrumb ----
const SCREEN_LABELS = {
  'home': 'Trang chủ',
  'alphabet': 'Bảng chữ cái',
  'practice-menu': 'Thực hành',
  'topic-picker': 'Chọn chủ đề',
  'lesson-picker': 'Chọn bài học',
  'flashcard': 'Thẻ từ vựng',
  'dragon': 'Săn Rồng',
  'dauho': 'Đầu Hồ',
  'typing': 'Đua Gõ',
  'lixì': 'Bao Lì Xì',
  'firework': 'Pháo Hoa Chữ',
  'lantern': 'Đèn Lồng Ghép Đôi'
};

// Screens that run a loop/timer which must be stopped when leaving them
const SCREEN_STOP_FN = {
  'dragon': 'stopDragon',
  'dauho': 'stopDauho',
  'typing': 'stopTyping',
  'lixì': 'stopLixi',
  'firework': 'stopFirework',
  'lantern': 'stopLantern'
};

// Returns the list of ancestor screen ids (root..parent) for a given screen.
// topicPickerBackScreen / topicPickerTarget are set by app.js and read here
// lazily (this function only runs after the user clicks something, by which
// point app.js has already initialized them).
function getBreadcrumbPath(id) {
  if (id === 'home') return [];
  if (id === 'alphabet' || id === 'practice-menu') return ['home'];
  if (id === 'topic-picker') {
    const parent = (typeof topicPickerBackScreen !== 'undefined') ? topicPickerBackScreen : 'home';
    return parent === 'home' ? ['home'] : ['home', parent];
  }
  if (id === 'lesson-picker') return [...getBreadcrumbPath('topic-picker'), 'topic-picker'];
  if (SCREEN_STOP_FN[id] || id === 'flashcard') {
    return [...getBreadcrumbPath('lesson-picker'), 'lesson-picker'];
  }
  return ['home'];
}

function getParentScreen(id) {
  const path = getBreadcrumbPath(id);
  return path.length ? path[path.length - 1] : 'home';
}

// Runs the stop-function (if any) for whichever screen is currently active,
// so leaving a game via the back button or a breadcrumb jump always cleans
// up its timers/animation frames.
function navigateAway(fromId) {
  const fn = SCREEN_STOP_FN[fromId];
  if (fn && typeof window[fn] === 'function') window[fn]();
}

function navigateTo(id) {
  const current = document.querySelector('.screen.active');
  if (current) navigateAway(current.id);
  showScreen(id);
}
window.navigateTo = navigateTo;

function goBack() {
  const current = document.querySelector('.screen.active');
  if (!current) return;
  navigateTo(getParentScreen(current.id));
}
window.goBack = goBack;

function renderNavBar(id) {
  const bar = document.getElementById('nav-bar');
  if (!bar) return;

  if (id === 'home') {
    bar.style.display = 'none';
    return;
  }
  bar.style.display = 'flex';

  const path = getBreadcrumbPath(id);
  const parent = path.length ? path[path.length - 1] : 'home';

  const backBtn = document.getElementById('nav-back-btn');
  if (backBtn) backBtn.textContent = '← ' + (SCREEN_LABELS[parent] || 'Quay lại');

  const trail = document.getElementById('nav-breadcrumb');
  if (trail) {
    const fullPath = [...path, id];
    trail.innerHTML = fullPath.map((sid, i) => {
      const label = SCREEN_LABELS[sid] || sid;
      const isLast = i === fullPath.length - 1;
      if (isLast) return `<span class="crumb-current">${label}</span>`;
      return `<span class="crumb-link" tabindex="0" onclick="navigateTo('${sid}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigateTo('${sid}')}">${label}</span><span class="crumb-sep">›</span>`;
    }).join('');
  }
}
