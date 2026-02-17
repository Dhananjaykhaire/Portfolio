const sideMenu = document.querySelector('#sideMenu');
const navBar = document.querySelector('nav');
const navLinks = document.querySelector('nav ul');
const copyrightEl = document.querySelector('#copyright');
const backendStatusEl = document.querySelector('#backendStatus');

function openMenu() {
  sideMenu.style.transform = 'translateX(-16rem)';
}

function closeMenu() {
  sideMenu.style.transform = 'translateX(16rem)';
}

window.addEventListener('scroll', () => {
  if (scrollY > 50) {
    navBar.classList.add(
      'bg-white',
      'bg-opacity-50',
      'backdrop-blur-lg',
      'shadow-sm',
      'dark:bg-darkTheme',
      'dark:shadow-white/20'
    );
    navLinks.classList.remove(
      'bg-white',
      'shadow-sm',
      'bg-opacity-50',
      'dark:border',
      'dark:border-white/50',
      'dark:bg-transparent'
    );
  } else {
    navBar.classList.remove('bg-white', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm');
    navLinks.classList.add(
      'bg-white',
      'shadow-sm',
      'bg-opacity-50',
      'dark:border',
      'dark:border-white/50',
      'dark:bg-transparent'
    );
  }
});

//----------------light mode and dark mode---------------
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');

  if (document.documentElement.classList.contains('dark')) {
    localStorage.theme = 'dark';
  } else {
    localStorage.theme = 'light';
  }
}

async function initializeDynamicContent() {
  const fallbackYear = new Date().getFullYear();

  if (copyrightEl) {
    copyrightEl.textContent = `© ${fallbackYear} Dhananjay Khaire. All rights reserved.`;
  }

  try {
    const response = await fetch('/api/site-info');
    if (!response.ok) throw new Error('site-info request failed');

    const data = await response.json();

    if (copyrightEl && data.currentYear) {
      copyrightEl.textContent = `© ${data.currentYear} ${data.owner}. ${data.rights}`;
    }

    if (backendStatusEl) {
      backendStatusEl.textContent = 'Backend status: Connected ✅';
    }
  } catch (_error) {
    if (backendStatusEl) {
      backendStatusEl.textContent = 'Backend status: Not connected (running static mode)';
    }
  }
}

initializeDynamicContent();
