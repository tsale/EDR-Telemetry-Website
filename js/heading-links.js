document.addEventListener('DOMContentLoaded', () => {
    // Add link symbol to all headings with IDs
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');
    
    headings.forEach(heading => {
        // Create wrapper div for the heading
        const wrapper = document.createElement('div');
        wrapper.className = 'heading-wrapper';
        heading.parentNode.insertBefore(wrapper, heading);
        wrapper.appendChild(heading);

        // Create the link element
        const link = document.createElement('a');
        link.className = 'heading-link';
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.setAttribute('aria-label', 'Copy link to section');
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Link copied!';
        wrapper.appendChild(notification);

        // Function to copy URL
        const copyUrl = (e) => {
            e.stopPropagation();
            const url = new URL(window.location.href);
            url.hash = heading.id;
            const textToCopy = url.toString();

            // Try the modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy)
                    .then(showSuccess)
                    .catch(() => fallbackCopyToClipboard(textToCopy));
            } else {
                fallbackCopyToClipboard(textToCopy);
            }
        };

        // Fallback copy method
        const fallbackCopyToClipboard = (text) => {
            // Create temporary textarea
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '0';
            textArea.style.top = '0';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);

            try {
                // Select and copy the text
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (successful) {
                    showSuccess();
                } else {
                    showError();
                }
            } catch (err) {
                console.error('Fallback copy failed:', err);
                document.body.removeChild(textArea);
                showError();
            }
        };

        // Success notification
        const showSuccess = () => {
            notification.textContent = 'Link copied!';
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        };

        // Error notification
        const showError = () => {
            notification.textContent = 'Failed to copy';
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                notification.textContent = 'Link copied!';
            }, 2000);
        };

        // Add click handlers to both heading and link
        heading.addEventListener('click', copyUrl);
        link.addEventListener('click', copyUrl);

        // Add keyboard support
        link.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyUrl(e);
            }
        });

        // Insert the link before the heading content
        heading.insertBefore(link, heading.firstChild);
    });
}); 