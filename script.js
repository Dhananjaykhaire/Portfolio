const sideMenu = document.querySelector('#sideMenu');
const navBar = document.querySelector('nav');
const navLinks = document.querySelector('nav ul');
const copyrightEl = document.querySelector('#copyright');
const backendStatusEl = document.querySelector('#backendStatus');
const contactForm = document.querySelector('#contactForm');
const formStatusEl = document.querySelector('#formStatus');
const showMoreBtn = document.querySelector('#showMoreBtn');
const showMoreText = document.querySelector('#showMoreText');
const projectGrid = document.querySelector('#projectGrid');
const hiddenProjects = document.querySelectorAll('.hidden-project');
const aboutCards = document.querySelectorAll('.about-click-card');
const aboutDetailPanel = document.querySelector('#aboutDetailPanel');
const aboutDetailTitle = document.querySelector('#aboutDetailTitle');
const aboutDetailList = document.querySelector('#aboutDetailList');

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
      backendStatusEl.textContent = 'Backend status: Connected';
    }
  } catch (_error) {
    if (backendStatusEl) {
      backendStatusEl.textContent = 'Backend status: Not connected (running static mode)';
    }
  }
}

async function handleContactSubmit(event) {
  event.preventDefault();

  if (!contactForm) return;

  const formData = new FormData(contactForm);
  const payload = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    message: String(formData.get('message') || '').trim()
  };

  if (!payload.name || !payload.email || !payload.message) {
    if (formStatusEl) formStatusEl.textContent = 'Please fill all fields before submitting.';
    return;
  }

  if (formStatusEl) formStatusEl.textContent = 'Submitting your message...';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Unable to submit form right now.');
    }

    contactForm.reset();
    if (formStatusEl) formStatusEl.textContent = 'Thanks! Your message has been submitted successfully.';
  } catch (error) {
    if (formStatusEl) formStatusEl.textContent = error.message || 'Submission failed. Please try again.';
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', handleContactSubmit);
}

function setupShowMoreProjects() {
  if (!showMoreBtn || !hiddenProjects.length || !projectGrid) return;

  let expanded = false;
  showMoreBtn.addEventListener('click', () => {
    expanded = !expanded;
    projectGrid.classList.toggle('projects-expanded', expanded);
    if (showMoreText) showMoreText.textContent = expanded ? 'Show Less' : 'Show More';
  });
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupAboutCardDetails() {
  if (!aboutCards.length || !aboutDetailPanel || !aboutDetailTitle || !aboutDetailList) return;

  const aboutDetails = {
    programming: {
      title: 'Programming Languages & Skills',
      points: [
        'Python: fundamentals, OOP, file handling, problem solving',
        'JavaScript: DOM manipulation and interactive UI features',
        'HTML5/CSS3: semantic structure and responsive layouts',
        'Basic C/C++: core programming concepts and logic building'
      ]
    },
    education: {
      title: 'Education Details',
      points: [
        'Master of Computer Applications (AIML), Sri Balaji University, Pune',
        'Bachelor of Computer Applications (Computer Programming)',
        'Current focus: applied Python, ML foundations, and deployment-oriented learning'
      ]
    },
    career: {
      title: 'Career Goals',
      points: [
        'Targeting fresher/internship roles in Python and AIML',
        'Open to Cloud and Linux support opportunities',
        'Building deployable projects to strengthen industry readiness'
      ]
    }
  };

  const renderDetail = (key) => {
    const detail = aboutDetails[key];
    if (!detail) return;

    aboutCards.forEach((card) => {
      card.classList.toggle('active', card.getAttribute('data-about') === key);
    });

    aboutDetailTitle.textContent = detail.title;
    aboutDetailList.innerHTML = detail.points.map((point) => `<li>${point}</li>`).join('');
    aboutDetailPanel.classList.add('show');
  };

  const collapseDetail = () => {
    aboutCards.forEach((card) => card.classList.remove('active'));
    aboutDetailPanel.classList.remove('show');
  };

  aboutCards.forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-about');
      if (card.classList.contains('active') && aboutDetailPanel.classList.contains('show')) {
        collapseDetail();
        return;
      }
      renderDetail(key);
    });

    card.addEventListener('dblclick', () => {
      collapseDetail();
    });
  });

  renderDetail('education');
}

setupAboutCardDetails();
setupShowMoreProjects();
setupRevealAnimations();
initializeDynamicContent();
