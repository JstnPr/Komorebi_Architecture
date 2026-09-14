import { projects } from './projects.js';

const projectsGrid = document.querySelector('#projects-grid');

if (projectsGrid) {
  projectsGrid.innerHTML = projects.map((project) => `
    <article id="${project.id}" class="project-card project-card-${project.id} border border-border-subtle bg-transparent rounded-sm overflow-hidden">
      <figure class="project-card-image">
        <img src="${project.image}" alt="${project.alt}" class="h-full w-full object-cover" loading="lazy">
        <figcaption class="absolute bottom-4 left-4 text-[0.65rem] uppercase tracking-widest text-canvas font-semibold">${project.place} / ${project.year}</figcaption>
      </figure>
      <div class="project-card-content">
        <span class="text-xs uppercase tracking-widest text-terracotta font-semibold">${project.category}</span>
        <h2 class="font-serif text-2xl md:text-3xl leading-tight mt-3 mb-3">${project.name}</h2>
        <p class="text-charcoal-muted text-sm leading-relaxed">${project.description}</p>
        <a href="#${project.id}" class="project-card-link inline-flex items-center gap-3 self-start mt-6 text-[0.65rem] uppercase tracking-widest font-semibold group">
          <span class="border-b border-charcoal pb-1 group-hover:border-terracotta group-hover:text-terracotta">Read the Case Study</span>
          <span aria-hidden="true" class="text-lg leading-none group-hover:text-terracotta">&rarr;</span>
        </a>
      </div>
    </article>
  `).join('');
}
