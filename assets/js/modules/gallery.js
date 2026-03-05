/**
 * Gallery Module
 * Fetches and renders the creative gallery
 */

export async function loadGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;

    try {
        const response = await fetch('./data/gallery.json');
        if (!response.ok) throw new Error('Failed to load gallery');
        const items = await response.json();
        renderGallery(items, container);
    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="text-red-400 font-mono">Error loading gallery: ${error.message}</div>`;
    }
}

function renderGallery(items, container) {
    container.innerHTML = items.map(item => `
        <div class="group relative aspect-square overflow-hidden rounded-lg bg-slate-800 border border-white/5">
            <img 
                src="${item.src}" 
                alt="${item.caption}" 
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p class="text-white text-sm font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    ${item.caption}
                </p>
            </div>
        </div>
    `).join('');
}
