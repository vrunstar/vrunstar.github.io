// ── NAVBAR: scrolled state ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── NAVBAR: active section on scroll ──
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => observer.observe(section));

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll(
  '.hero-eyebrow, .hero-name, .hero-line, .hero-cta, .hero-stats, ' +
  '.about-left, .about-right, ' +
  '.project-card, ' +
  '.contact-inner'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ── TERMINAL ──
const terminalBody  = document.getElementById('terminal-body');
const terminalInput = document.getElementById('terminal-input');
const history = [];
let historyIndex = -1;

const COMMANDS = {
  help: () => `Available commands:
  <span class="t-accent">whoami</span>      — about me
  <span class="t-accent">skills</span>      — tech stack
  <span class="t-accent">projects</span>    — what I built
  <span class="t-accent">contact</span>     — reach me
  <span class="t-accent">clear</span>       — clear terminal`,

  whoami: () => `<span class="t-accent">Varun Shakya</span>
• 21 · Gandhinagar, Gujarat
• Final-year CS @ Parul University
• Enthusiastic about everything data
• Big on sports analytics — Cricket, F1, football
• Certs: Supervised Learning (DataCamp)
         Oracle Cloud Infrastructure 2025`,

  skills: () => `<span class="t-white">Languages</span>
Python · SQL · HTML · CSS

<span class="t-white">Data & ML</span>
Pandas · NumPy · Scikit-learn
XGBoost · Plotly · Power BI

<span class="t-white">Frameworks</span>
FastAPI · React · Streamlit · Flask

<span class="t-white">Tools</span>
Git · Supabase · Jupyter · Colab`,

  projects: () => `<span class="t-white">WC 2026 Predictor</span>          <span class="t-link" onclick="window.open('https://github.com/vrunstar/wc-predictor')">→ github</span>
<span class="t-white">pauseresume.ai</span>             <span class="t-link" onclick="window.open('https://pauseresume.vercel.app')">→ live</span>   <span class="t-link" onclick="window.open('https://github.com/vrunstar/ats_resume_optimizer')">→ github</span>
<span class="t-white">MediAssist</span>                 <span class="t-link" onclick="window.open('https://github.com/vrunstar/medAssist')">→ github</span>
<span class="t-white">NaukriPredict</span>              <span class="t-link" onclick="window.open('https://github.com/vrunstar')">→ github</span>
<span class="t-white">Olist SQL Analysis</span>         <span class="t-link" onclick="window.open('https://github.com/vrunstar/olist_sql_analysis')">→ github</span>
<span class="t-white">BOXBOXBOX</span>                  <span class="t-link" onclick="window.open('https://github.com/vrunstar/f1_maps')">→ github</span>`,

  contact: () => `<span class="t-white">Email</span>              <span class="t-link" onclick="window.location='mailto:varunshakya1794@gmail.com'">varunshakya1794@gmail.com</span>
<span class="t-white">GitHub</span>             <span class="t-link" onclick="window.open('https://github.com/vrunstar')">@vrunstar</span>
<span class="t-white">LinkedIn</span>           <span class="t-link" onclick="window.open('https://linkedin.com/in/varoooooom')">@varoooooom</span>
<span class="t-white">LeetCode</span>           <span class="t-link" onclick="window.open('https://leetcode.com/vrunstar')">@vrunstar</span>
<span class="t-white">Kaggle</span>             <span class="t-link" onclick="window.open('https://kaggle.com/vrunstar')">@vrunstar</span>
<span class="t-white">Phone</span>              +91 99047 93827`,

  clear: () => null,
};

const HELP_OUTPUT = `Available commands:
  <span class="t-accent">whoami</span>      — about me
  <span class="t-accent">skills</span>      — tech stack
  <span class="t-accent">projects</span>    — what I built
  <span class="t-accent">contact</span>     — reach me
  <span class="t-accent">clear</span>       — clear terminal`;

function renderHelp() {
  const cmdLine = document.createElement('div');
  cmdLine.className = 't-line';
  cmdLine.innerHTML = `<span class="t-prompt">→</span> <span class="t-cmd">help</span>`;
  terminalBody.appendChild(cmdLine);
  const out = document.createElement('div');
  out.className = 't-output';
  out.innerHTML = HELP_OUTPUT;
  terminalBody.appendChild(out);
}

function printLine(cmd, output) {
  // always clear and reprint help first
  terminalBody.innerHTML = '';
  renderHelp();

  if (output === null) return; // bare clear command
  if (cmd === 'help') return;  // already printed above

  // command line
  const cmdLine = document.createElement('div');
  cmdLine.className = 't-line';
  cmdLine.innerHTML = `<span class="t-prompt">→</span> <span class="t-cmd">${cmd}</span>`;
  terminalBody.appendChild(cmdLine);

  if (output !== undefined) {
    const out = document.createElement('div');
    out.className = 't-output';
    out.innerHTML = output;
    terminalBody.appendChild(out);
  }

  terminalBody.scrollTop = terminalBody.scrollHeight;
}

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';
    if (!cmd) return;

    history.unshift(cmd);
    historyIndex = -1;

    if (COMMANDS[cmd]) {
      const output = COMMANDS[cmd]();
      printLine(cmd, output);
    } else {
      printLine(cmd, `<span class="t-error">command not found: ${cmd}</span>  type <span class="t-accent">help</span> for available commands`);
    }
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      terminalInput.value = history[historyIndex];
    }
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminalInput.value = history[historyIndex];
    } else {
      historyIndex = -1;
      terminalInput.value = '';
    }
  }
});

// click anywhere on terminal to focus input
document.getElementById('terminal').addEventListener('click', () => {
  terminalInput.focus();
});

// render help on load
renderHelp();