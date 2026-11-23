// 1. Nhập nguyên liệu
import { projects } from './data.js';
import { loadRepos } from './repos.js'; // Nhập thêm hàm gọi GitHub API

// 2. Chỉ điểm dụng cụ (Dự án)
const ul = document.querySelector('#project-list');
const tpl = document.querySelector('#project-card');

// 3. Hàm đúc dự án
function render(list) {
    ul.textContent = ''; 
    for (const p of list) {
        const li = tpl.content.cloneNode(true);
        li.querySelector('h3').textContent = p.title;
        li.querySelector('.tags').textContent = p.tags.join(', ');
        ul.append(li);
    }
}
render(projects); // Gọi hàm để hiện các dự án lên

// ==========================================
//  TẠO NÚT LỌC TỰ ĐỘNG (Dự án)
// ==========================================
const tags = [...new Set(
  projects.flatMap((p) => p.tags),
)];

const bar = document.querySelector('#filters');

for (const tag of ['all', ...tags]) {
  const b = document.createElement('button');
  b.textContent = tag;
  b.dataset.tag = tag; 
  bar.append(b); 
}

bar.addEventListener('click', (e) => {
  const tag = e.target.dataset.tag;
  if (!tag) return; 

  const filtered = tag === 'all'
    ? projects
    : projects.filter((p) => p.tags.includes(tag));

  render(filtered);
});

// ==========================================
//  WIDGET REPO GITHUB (Chặng 2)
// ==========================================
const state = document.querySelector('#repos-state');
const list = document.querySelector('#repo-list');

function repoCard(r) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = r.url;
    a.target = '_blank'; // Mở tab mới khi bấm vào repo
    a.textContent = r.name;
    
    const p = document.createElement('p');
    p.textContent = `⭐ ${r.stars} · ${r.desc}`;
    
    li.append(a, p);
    return li;
}

async function showRepos(user) {
    state.textContent = 'Đang tải...';
    list.textContent = '';
    try {
        const repos = await loadRepos(user);
        state.textContent = repos.length ? '' : 'Chưa có repo công khai.';
        repos.forEach((r) => list.append(repoCard(r)));
    } catch (err) {
        state.textContent = 'Không tải được: ' + err.message;
        const again = document.createElement('button');
        again.textContent = 'Thử lại';
        again.onclick = () => showRepos(user);
        state.append(again);
    }
}

// THAY BẰNG TÊN TÀI KHOẢN GITHUB 
showRepos('ngocthanhtran1502-jpg');

// ==========================================
//  TÍNH NĂNG DARK / LIGHT MODE
// ==========================================
const themeToggleBtn = document.querySelector('#theme-toggle');
const rootElement = document.documentElement;

if (localStorage.getItem('theme') === 'dark') {
    rootElement.classList.add('dark');
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        rootElement.classList.toggle('dark');
        
        const isDark = rootElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}