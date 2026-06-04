import Swup from 'swup';
import SwupPreloadPlugin from '@swup/preload-plugin';

const swup = new Swup({
    containers: ['#swup', '#main-nav'],
    plugins: [new SwupPreloadPlugin()]
});

// Immediately update the navigation bar styling when a nav tab is clicked
document.addEventListener('click', (e) => {
    const link = e.target.closest('#main-nav a');
    if (link && link.href) {
        const navLinks = document.querySelectorAll('#main-nav a');
        navLinks.forEach(navLink => {
            navLink.classList.remove('text-[#4dc9f1]', 'border-b-4', 'border-[#4dc9f1]', 'pb-1');
            navLink.classList.add('text-[#76757a]', 'hover:text-[#4dc9f1]');
        });

        link.classList.remove('text-[#76757a]', 'hover:text-[#4dc9f1]');
        link.classList.add('text-[#4dc9f1]', 'border-b-4', 'border-[#4dc9f1]', 'pb-1');
    }
});
