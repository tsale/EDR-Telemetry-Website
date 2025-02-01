document.addEventListener('DOMContentLoaded', () => {
    // Add link symbol to all headings with IDs
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');
    
    headings.forEach(heading => {
        // Create the link element
        const link = document.createElement('span');
        link.innerHTML = '🔗';
        link.className = 'heading-link';
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.setAttribute('aria-label', 'Copy link to section');
        
        // Create tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = 'Copy link';
        link.appendChild(tooltip);

        // Add click handler
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = new URL(window.location.href);
            url.hash = heading.id;
            navigator.clipboard.writeText(url.toString()).then(() => {
                tooltip.textContent = 'Copied!';
                tooltip.classList.add('show');
                setTimeout(() => {
                    tooltip.classList.remove('show');
                    setTimeout(() => {
                        tooltip.textContent = 'Copy link';
                    }, 200);
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                tooltip.textContent = 'Failed to copy';
                tooltip.classList.add('show');
                setTimeout(() => {
                    tooltip.classList.remove('show');
                }, 1000);
            });
        });

        // Add keyboard support
        link.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });

        // Show tooltip on hover
        link.addEventListener('mouseenter', () => {
            tooltip.classList.add('show');
        });

        link.addEventListener('mouseleave', () => {
            if (tooltip.textContent === 'Copy link') {
                tooltip.classList.remove('show');
            }
        });

        // Insert the link before the heading content
        heading.insertBefore(link, heading.firstChild);
    });
}); 