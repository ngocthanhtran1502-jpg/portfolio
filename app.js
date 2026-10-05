// 1. Nhập nguyên liệu
import { projects } from './data.js';

// 2. Chỉ điểm dụng cụ
const ul = document.querySelector('#project-list');
const tpl = document.querySelector('#project-card');

// 3. Hàm đúc dự án (Đã làm ở bước 3)
function render(list) {
    ul.textContent = ''; 
    for (const p of list) {
        const li = tpl.content.cloneNode(true);
        li.querySelector('h3').textContent = p.title;
        li.querySelector('.tags').textContent = p.tags.join(', ');
        ul.append(li);
    }
}
render(projects); // Gọi hàm để hiện 4 dự án lên

// ==========================================
//  TẠO NÚT LỌC TỰ ĐỘNG
// ==========================================

// Lọc ra các tag duy nhất, không trùng lặp
const tags = [...new Set(
  projects.flatMap((p) => p.tags),
)];

// Tìm cái đĩa trống #filters
const bar = document.querySelector('#filters');

// Đúc nút bấm cho chữ 'all' và từng tag
for (const tag of ['all', ...tags]) {
  const b = document.createElement('button');
  b.textContent = tag;
  b.dataset.tag = tag; // Gắn nhãn chìm để lát sau xài
  bar.append(b); // Ném nút vào đĩa
}
// Lắng nghe sự kiện click trên toàn bộ khay chứa nút
bar.addEventListener('click', (e) => {
  // Lấy cái nhãn chìm của nút bị bấm
  const tag = e.target.dataset.tag;
  if (!tag) return; // Bấm trượt ra ngoài thì bỏ qua

  // Sàng lọc dữ liệu
  const filtered = tag === 'all'
    ? projects
    : projects.filter((p) => p.tags.includes(tag));

  // Ném dữ liệu mới vào cỗ máy để vẽ lại
  render(filtered);
});

// ==========================================
//  TÍNH NĂNG DARK / LIGHT MODE
// ==========================================
const themeToggleBtn = document.querySelector('#theme-toggle');
const rootElement = document.documentElement;

// 1. Kiểm tra xem trước đó người dùng đã chọn mode nào chưa
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