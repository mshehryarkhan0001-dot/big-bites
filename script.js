// mobile nav toggle
const burgerBtn = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
burgerBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// menu filter tabs
const tabs = document.querySelectorAll('.menu-tab');
const tickets = document.querySelectorAll('.ticket');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    tickets.forEach(t => {
      t.style.display = (cat === 'all' || t.dataset.cat === cat) ? '' : 'none';
    });
  });
});

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));
