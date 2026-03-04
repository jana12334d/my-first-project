/**
 * Boot Sequence Module
 * Handles the initial "OS boot" animation
 */

export function initBootSequence(onComplete) {
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    
    if (!bootScreen || !bootText) {
        if (onComplete) onComplete();
        return;
    }

    // Check if we've already booted this session to avoid annoyance
    if (sessionStorage.getItem('janaos_booted')) {
        bootScreen.style.display = 'none';
        if (onComplete) onComplete();
        return;
    }

    const steps = [
        { text: "Initializing System...", delay: 600 },
        { text: "AI Module: Active", delay: 800 },
        { text: "Security Layer: Enabled", delay: 800 },
        { text: "Jana Mufti — Ready.", delay: 500 }
    ];

    let currentStep = 0;

    function runStep() {
        if (currentStep >= steps.length) {
            setTimeout(() => {
                finishBoot();
            }, 500);
            return;
        }

        const step = steps[currentStep];
        const p = document.createElement('div');
        p.className = "text-accent font-mono mb-2";
        p.innerHTML = `<span class="opacity-50 mr-2">[OK]</span> ${step.text}`;
        bootText.appendChild(p);

        currentStep++;
        setTimeout(runStep, step.delay);
    }

    function finishBoot() {
        bootScreen.classList.add('opacity-0', 'pointer-events-none');
        bootScreen.addEventListener('transitionend', () => {
            bootScreen.style.display = 'none';
        });
        sessionStorage.setItem('janaos_booted', 'true');
        if (onComplete) onComplete();
    }

    // Start
    setTimeout(runStep, 500);
}
