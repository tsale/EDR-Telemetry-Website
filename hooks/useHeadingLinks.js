import { useEffect } from 'react';

/**
 * A hook that adds link buttons to all heading elements (h1, h2, h3, h4)
 * for easy sharing of specific sections.
 */
export default function useHeadingLinks() {
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server-side
    
    const buildSafeUrl = (headingId) => {
      const { origin, pathname, search } = window.location;
      const safeSearch = search
        ? `?${new URLSearchParams(search.slice(1)).toString()}`
        : '';
      const safeHash = headingId ? `#${encodeURIComponent(headingId)}` : '';
      return `${origin}${pathname}${safeSearch}${safeHash}`;
    };
    
    // Get all heading elements
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');
    
    // Process each heading
    headings.forEach(heading => {
      // Skip if already processed
      if (heading.classList.contains('heading-processed')) return;
      
      // Generate an ID if the heading doesn't have one
      if (!heading.id) {
        const headingText = heading.textContent.trim();
        const id = headingText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        heading.id = id;
      }
      
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
        e.preventDefault();
        e.stopPropagation();
        
        // Get the current URL and append the heading ID
        const textToCopy = buildSafeUrl(heading.id);
        
        // Copy to clipboard
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
      
      // Add the link to the wrapper instead of inside the heading
      wrapper.appendChild(link);
      
      // Mark as processed
      heading.classList.add('heading-processed');
    });
    
    // Clean up function (optional)
    return () => {
      // If needed, you could remove the links here
    };
  }, []); // Empty dependency array means this runs once after mount
} 
