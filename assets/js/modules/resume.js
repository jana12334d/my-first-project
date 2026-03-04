/**
 * Resume Module
 * Fetches and renders resume data
 */

export async function loadResume() {
    const container = document.getElementById('resume-content');
    if (!container) return;

    try {
        const response = await fetch('/data/resume.json');
        if (!response.ok) throw new Error('Failed to load resume');
        const data = await response.json();
        renderResume(data, container);
    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="text-red-400 font-mono">Error loading system profile: ${error.message}</div>`;
    }
}

function renderResume(data, container) {
    // Education Section
    const educationHTML = data.education.map(edu => `
        <div class="mb-4 border-l-2 border-accent/30 pl-4">
            <h4 class="text-white font-bold">${edu.school}</h4>
            <p class="text-accent text-sm">${edu.degree}</p>
            <p class="text-slate-400 text-xs">${edu.concentration}</p>
            <div class="flex justify-between mt-1 text-xs font-mono text-slate-500">
                <span>${edu.year}</span>
                <span>GPA: ${edu.gpa}</span>
            </div>
        </div>
    `).join('');

    // Skills Section
    const skillsHTML = Object.entries(data.skills).map(([category, items]) => `
        <div class="mb-4">
            <h4 class="text-xs font-mono uppercase text-slate-500 mb-2 tracking-wider">${category}</h4>
            <div class="flex flex-wrap gap-2">
                ${items.map(skill => `
                    <span class="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">
                        ${skill}
                    </span>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Experience Section
    const experienceHTML = data.experience.map(exp => `
        <div class="mb-6 group">
            <div class="flex justify-between items-baseline mb-1">
                <h4 class="text-white font-bold group-hover:text-accent transition-colors">${exp.role}</h4>
                <span class="text-xs font-mono text-slate-500">${exp.duration}</span>
            </div>
            <p class="text-sm text-accent/80 mb-2">${exp.company}</p>
            <p class="text-sm text-slate-400 leading-relaxed">
                ${exp.description}
            </p>
        </div>
    `).join('');

    // Certifications
    const certsHTML = data.certifications.map(cert => `
        <li class="text-sm text-slate-400 mb-1 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
            ${cert}
        </li>
    `).join('');

    // Achievements (New)
    const achievementsHTML = data.achievements ? `
        <div class="glass-panel p-5 mt-6">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                Achievements
            </h3>
            <ul class="list-none">
                ${data.achievements.map(ach => `
                    <li class="text-sm text-slate-400 mb-1 flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                        ${ach}
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    // Assemble Dashboard
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
            <!-- Left Column: Stats & Skills -->
            <div class="md:col-span-4 space-y-6">
                <div class="glass-panel p-5">
                    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="M22 10v6M2 10v6M20 2a2 2 0 0 1 2 2v2H2V4a2 2 0 0 1 2-2h16zM12 22a2 2 0 0 0 2-2v-2H10v2a2 2 0 0 0 2 2zM2 10h20"></path></svg>
                        Education
                    </h3>
                    ${educationHTML}
                </div>

                <div class="glass-panel p-5">
                    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        Technical Specs
                    </h3>
                    ${skillsHTML}
                </div>
                
                <div class="glass-panel p-5">
                    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Certifications
                    </h3>
                    <ul class="list-none">
                        ${certsHTML}
                    </ul>
                </div>

                ${achievementsHTML}
            </div>

            <!-- Right Column: Experience -->
            <div class="md:col-span-8">
                <div class="glass-panel p-6 h-full">
                    <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <h3 class="text-xl font-bold text-white flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            System Logs (Experience)
                        </h3>
                        <a href="/assets/resume.pdf" download class="text-xs font-mono bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded hover:bg-accent hover:text-white transition-all flex items-center gap-2">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            EXPORT.PDF
                        </a>
                    </div>
                    
                    <div class="space-y-2">
                        ${experienceHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
}
