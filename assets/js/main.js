import { initBootSequence } from './modules/boot.js';
import { loadProjects } from './modules/projects.js';
import { loadResume } from './modules/resume.js';
import { loadGallery } from './modules/gallery.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Boot Sequence
    initBootSequence(() => {
        // Reveal Main Content
        const mainContent = document.getElementById('main-content');
        mainContent.classList.remove('hidden');
        
        // Trigger animations for hero elements
        requestAnimationFrame(() => {
            document.querySelectorAll('.animate-on-load').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('opacity-100', 'translate-y-0');
                    el.classList.remove('opacity-0', 'translate-y-4');
                }, index * 100);
            });
        });

        // Load Data
        loadProjects();
        loadResume();
        loadGallery();
    });

    // Navigation Handling
    setupNavigation();
});

function setupNavigation() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-slate-900/90', 'backdrop-blur-md', 'border-b', 'border-white/5', 'shadow-lg');
            nav.classList.remove('bg-transparent');
        } else {
            nav.classList.remove('bg-slate-900/90', 'backdrop-blur-md', 'border-b', 'border-white/5', 'shadow-lg');
            nav.classList.add('bg-transparent');
        }
    });
}
