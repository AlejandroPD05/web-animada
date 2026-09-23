const particleField = document.getElementById('particleField');
const particleCount = 22;

for (let i = 0; i < particleCount; i += 1) {
  const particle = document.createElement('span');
  particle.className = 'particle';
  const left = Math.random() * 100;
  const duration = 9 + Math.random() * 8;
  const delay = Math.random() * 10;
  const driftX = (Math.random() * 80 - 40) + 'px';
  const size = 4 + Math.random() * 4;

  particle.style.left = left + 'vw';
  particle.style.animationDuration = duration + 's';
  particle.style.animationDelay = delay + 's';
  particle.style.setProperty('--drift-x', driftX);
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';

  particleField.appendChild(particle);
}

const milestones = document.querySelectorAll('[data-milestone]');

const milestoneObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        milestoneObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

milestones.forEach((milestone) => milestoneObserver.observe(milestone));

document.querySelectorAll('.milestone-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.milestone-card');
    const isExpanded = card.classList.toggle('expanded');
    button.setAttribute('aria-expanded', String(isExpanded));
    button.textContent = isExpanded ? 'Leer menos' : 'Leer más';
  });
});

const bloom = document.getElementById('bloom');

const bloomObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        bloom.classList.add('in-view');
        bloomObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

bloomObserver.observe(bloom);