/**
 * JanaOS Admin Panel Logic
 * Handles state management, UI rendering, and JSON import/export
 */

// Initial State Schema
const initialState = {
    profile: {
        name: "",
        title: "",
        university: "",
        bio: "",
        about: ""
    },
    links: {
        github: "",
        linkedin: "",
        email: "",
        resume: ""
    },
    skills: {
        languages: [],
        ai_tools: [],
        security_tools: [],
        frameworks: []
    },
    projects: [],
    gallery: [],
    // Container for other resume sections to ensure they are preserved
    resume_extras: {
        education: [],
        experience: [],
        certifications: [],
        achievements: []
    }
};

// Global State
let appState = JSON.parse(JSON.stringify(initialState));
let editingProjectId = null;

// DOM Elements
const els = {
    tabs: document.querySelectorAll('.nav-btn'),
    sections: document.querySelectorAll('.tab-content'),
    toast: document.getElementById('toast'),
    
    // Profile Inputs
    pName: document.getElementById('p-name'),
    pTitle: document.getElementById('p-title'),
    pUni: document.getElementById('p-university'),
    pBio: document.getElementById('p-bio'),
    pAbout: document.getElementById('p-about'),
    
    // Link Inputs
    lGithub: document.getElementById('l-github'),
    lLinkedin: document.getElementById('l-linkedin'),
    lEmail: document.getElementById('l-email'),
    lResume: document.getElementById('l-resume'),
    
    // Project Inputs
    projTitle: document.getElementById('proj-title'),
    projCategory: document.getElementById('proj-category'),
    projTags: document.getElementById('proj-tags'),
    projDesc: document.getElementById('proj-desc'),
    projDetails: document.getElementById('proj-details'),
    projGithub: document.getElementById('proj-github'),
    projDemo: document.getElementById('proj-demo'),
    
    // Gallery Inputs
    galSrc: document.getElementById('gal-src'),
    galCaption: document.getElementById('gal-caption'),
    galCategory: document.getElementById('gal-category'),
    
    // Lists
    projectsList: document.getElementById('projects-list'),
    galleryList: document.getElementById('gallery-list'),
    
    // Buttons
    saveProjectBtn: document.getElementById('save-project-btn'),
    clearProjectBtn: document.getElementById('clear-project-btn'),
    addGalleryBtn: document.getElementById('add-gallery-btn'),
    exportBtn: document.getElementById('export-btn'),
    importFile: document.getElementById('import-file')
};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupEventListeners();
    setupSkillInputs();
    
    // Try to load from local storage first (draft), otherwise fetch live data
    const saved = localStorage.getItem('janaos_admin_draft');
    if (saved) {
        try {
            appState = JSON.parse(saved);
            populateUI();
            showToast('Draft loaded from local storage');
        } catch (e) {
            console.error('Failed to load draft');
            fetchCurrentData();
        }
    } else {
        fetchCurrentData();
    }
});

async function fetchCurrentData() {
    try {
        const response = await fetch('../data/portfolio-data.json');

        if (response.ok) {
            const data = await response.json();

            // Map fetched data to appState structure
            appState.profile = data.profile || initialState.profile;
            appState.links = {
                github: data.links?.github || "",
                linkedin: data.links?.linkedin || "",
                email: data.links?.email || "",
                resume: data.links?.resume || "assets/resume.pdf"
            };
            
            // Map skills
            if (data.skills) {
                appState.skills = {
                    languages: data.skills.languages || [],
                    ai_tools: data.skills.ai_tools || [],
                    security_tools: data.skills.security_tools || [],
                    frameworks: data.skills.frameworks || []
                };
            }

            // Preserve other sections
            appState.resume_extras = {
                education: data.education || [],
                experience: data.experience || [],
                certifications: data.certifications || [],
                achievements: data.achievements || []
            };

            appState.projects = data.projects || [];
            appState.gallery = data.gallery || [];

            populateUI();
            showToast('Loaded current portfolio data');
        } else {
            throw new Error('Failed to load portfolio-data.json');
        }
    } catch (error) {
        console.error('Error fetching current data:', error);
        showToast('Could not load current data. Starting fresh.');
    }
}

// --- Event Listeners ---

function setupEventListeners() {
    // Profile & Links Input Listeners (Auto-save to state)
    const inputs = [
        els.pName, els.pTitle, els.pUni, els.pBio, els.pAbout,
        els.lGithub, els.lLinkedin, els.lEmail, els.lResume
    ];
    
    inputs.forEach(input => {
        input.addEventListener('input', updateStateFromProfile);
    });

    // Project Buttons
    els.saveProjectBtn.addEventListener('click', saveProject);
    els.clearProjectBtn.addEventListener('click', clearProjectForm);

    // Gallery Buttons
    els.addGalleryBtn.addEventListener('click', addGalleryItem);

    // Import / Export
    els.exportBtn.addEventListener('click', exportJSON);
    els.importFile.addEventListener('change', importJSON);
}

function setupTabs() {
    els.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class
            els.tabs.forEach(t => t.classList.remove('active'));
            els.sections.forEach(s => s.classList.remove('active'));
            
            // Add active class
            tab.classList.add('active');
            const targetId = tab.dataset.tab;
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function setupSkillInputs() {
    const inputs = document.querySelectorAll('.skill-input');
    const addBtns = document.querySelectorAll('.add-skill-btn');

    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addSkill(input.dataset.category, input.value);
                input.value = '';
            }
        });
    });

    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            addSkill(input.dataset.category, input.value);
            input.value = '';
        });
    });
}

// --- State Management ---

function updateStateFromProfile() {
    appState.profile.name = els.pName.value;
    appState.profile.title = els.pTitle.value;
    appState.profile.university = els.pUni.value;
    appState.profile.bio = els.pBio.value;
    appState.profile.about = els.pAbout.value;
    
    appState.links.github = els.lGithub.value;
    appState.links.linkedin = els.lLinkedin.value;
    appState.links.email = els.lEmail.value;
    appState.links.resume = els.lResume.value;
    
    persist();
}

function persist() {
    localStorage.setItem('janaos_admin_draft', JSON.stringify(appState));
}

// --- UI Populating ---

function populateUI() {
    // Profile
    els.pName.value = appState.profile.name || "";
    els.pTitle.value = appState.profile.title || "";
    els.pUni.value = appState.profile.university || "";
    els.pBio.value = appState.profile.bio || "";
    els.pAbout.value = appState.profile.about || "";
    
    // Links
    els.lGithub.value = appState.links.github || "";
    els.lLinkedin.value = appState.links.linkedin || "";
    els.lEmail.value = appState.links.email || "";
    els.lResume.value = appState.links.resume || "";
    
    // Skills
    renderSkills();
    
    // Projects
    renderProjectsList();
    
    // Gallery
    renderGalleryList();
}

// --- Skills Logic ---

function addSkill(category, skillName) {
    if (!skillName.trim()) return;
    
    if (!appState.skills[category]) {
        appState.skills[category] = [];
    }
    
    appState.skills[category].push(skillName.trim());
    renderSkills();
    persist();
}

function removeSkill(category, index) {
    appState.skills[category].splice(index, 1);
    renderSkills();
    persist();
}

function renderSkills() {
    const categories = ['languages', 'ai_tools', 'security_tools', 'frameworks'];
    
    categories.forEach(cat => {
        const container = document.getElementById(`skills-${cat}`);
        if (!container) return;
        
        container.innerHTML = '';
        const skills = appState.skills[cat] || [];
        
        skills.forEach((skill, index) => {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                ${skill}
                <span class="tag-remove" onclick="window.removeSkillGlobal('${cat}', ${index})">&times;</span>
            `;
            container.appendChild(tag);
        });
    });
}

// Expose to window for onclick
window.removeSkillGlobal = removeSkill;

// --- Projects Logic ---

function saveProject() {
    const project = {
        id: editingProjectId || Date.now().toString(),
        title: els.projTitle.value,
        category: els.projCategory.value,
        tags: els.projTags.value.split(',').map(t => t.trim()).filter(t => t),
        description: els.projDesc.value,
        details: els.projDetails.value,
        github: els.projGithub.value,
        demo: els.projDemo.value
    };
    
    if (!project.title) {
        alert('Project title is required');
        return;
    }
    
    if (editingProjectId) {
        const index = appState.projects.findIndex(p => p.id === editingProjectId);
        if (index !== -1) {
            appState.projects[index] = project;
        }
    } else {
        appState.projects.push(project);
    }
    
    renderProjectsList();
    clearProjectForm();
    persist();
    showToast('Project saved');
}

function editProject(id) {
    const project = appState.projects.find(p => p.id === id);
    if (!project) return;
    
    editingProjectId = id;
    els.projTitle.value = project.title;
    els.projCategory.value = project.category;
    els.projTags.value = project.tags.join(', ');
    els.projDesc.value = project.description;
    els.projDetails.value = project.details || "";
    els.projGithub.value = project.github || "";
    els.projDemo.value = project.demo || "";
    
    els.saveProjectBtn.textContent = "Update Project";
    
    // Scroll to form
    els.projTitle.scrollIntoView({ behavior: 'smooth' });
}

function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    appState.projects = appState.projects.filter(p => p.id !== id);
    renderProjectsList();
    persist();
}

function clearProjectForm() {
    editingProjectId = null;
    els.projTitle.value = "";
    els.projTags.value = "";
    els.projDesc.value = "";
    els.projDetails.value = "";
    els.projGithub.value = "";
    els.projDemo.value = "";
    els.saveProjectBtn.textContent = "Save Project";
}

function renderProjectsList() {
    els.projectsList.innerHTML = '';
    
    appState.projects.forEach(p => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="item-info">
                <h4>${p.title} <span class="badge">${p.category}</span></h4>
                <p>${p.description}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-sm" onclick="window.editProjectGlobal('${p.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="window.deleteProjectGlobal('${p.id}')">Delete</button>
            </div>
        `;
        els.projectsList.appendChild(item);
    });
}

window.editProjectGlobal = editProject;
window.deleteProjectGlobal = deleteProject;

// --- Gallery Logic ---

function addGalleryItem() {
    const src = els.galSrc.value;
    const caption = els.galCaption.value;
    const category = els.galCategory.value;
    
    if (!src) return;
    
    appState.gallery.push({
        id: Date.now().toString(),
        src,
        caption,
        category
    });
    
    els.galSrc.value = "";
    els.galCaption.value = "";
    
    renderGalleryList();
    persist();
}

function deleteGalleryItem(id) {
    appState.gallery = appState.gallery.filter(g => g.id !== id);
    renderGalleryList();
    persist();
}

function renderGalleryList() {
    els.galleryList.innerHTML = '';
    
    appState.gallery.forEach(g => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${g.src}" alt="${g.caption}">
            <div class="gallery-overlay">
                <button class="btn btn-danger" onclick="window.deleteGalleryItemGlobal('${g.id}')">Remove</button>
            </div>
        `;
        els.galleryList.appendChild(item);
    });
}

window.deleteGalleryItemGlobal = deleteGalleryItem;

// --- Import / Export ---

function exportJSON() {
    // Reconstruct the full portfolio-data.json structure
    const exportData = {
        profile: appState.profile,
        links: appState.links,
        education: appState.resume_extras.education,
        skills: appState.skills,
        experience: appState.resume_extras.experience,
        certifications: appState.resume_extras.certifications,
        achievements: appState.resume_extras.achievements,
        projects: appState.projects,
        gallery: appState.gallery
    };
    
    downloadFile("portfolio-data.json", JSON.stringify(exportData, null, 2));
    showToast('Exported portfolio-data.json. Place it in /data folder.');
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            // Basic validation
            if (data.profile && data.projects) {
                appState = data;
                populateUI();
                persist();
                showToast('Data imported successfully');
            } else {
                alert('Invalid JSON structure');
            }
        } catch (err) {
            alert('Error parsing JSON');
        }
    };
    reader.readAsText(file);
}

function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.remove('hidden');
    setTimeout(() => {
        els.toast.classList.add('hidden');
    }, 3000);
}
