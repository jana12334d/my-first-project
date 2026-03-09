/**
 * Projects Module
 * Fetches and renders projects
 */

export async function loadProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    try {
        const response = await fetch('./data/portfolio-data.json');
        if (!response.ok) throw new Error('Failed to load projects');
        const data = await response.json();
        const projects = data.projects || [];
        renderProjects(projects, container);
        setupFilters(projects, container);
    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="text-red-400 font-mono">Error loading modules: ${error.message}</div>`;
    }
}

function renderProjects(projects, container) {
    container.innerHTML = projects.map(project => `
        <div class="project-card group relative glass-panel p-6 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1" data-category="${project.category}">
            <div class="absolute top-4 right-4 text-xs font-mono text-slate-500 border border-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">
                ${project.category}
            </div>
            
            <h3 class="text-xl font-bold text-slate-100 mb-2 group-hover:text-accent transition-colors">
                ${project.title}
            </h3>
            
            <p class="text-slate-400 text-sm mb-4 line-clamp-2">
                ${project.description}
            </p>
            
            <div class="flex flex-wrap gap-2 mb-6">
                ${project.tags.map(tag => `
                    <span class="text-xs font-mono text-accent/80 bg-accent/10 px-2 py-1 rounded">
                        ${tag}
                    </span>
                `).join('')}
            </div>
            
            <div class="flex items-center gap-4 mt-auto">
                <a href="${project.github}" target="_blank" class="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    Code
                </a>
                ${project.demo ? `
                <a href="${project.demo}" target="_blank" class="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    Demo
                </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function setupFilters(projects, container) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('bg-accent', 'text-white'));
            filterBtns.forEach(b => b.classList.add('text-slate-400', 'hover:text-white'));
            
            btn.classList.remove('text-slate-400', 'hover:text-white');
            btn.classList.add('bg-accent', 'text-white');
            
            const category = btn.dataset.filter;
            
            if (category === 'all') {
                renderProjects(projects, container);
            } else {
                const filtered = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
                renderProjects(filtered, container);
            }
        });
    });
}
