/**
 * Common utility functions for the EDR Telemetry Project
 */

// Add your common utility functions here
// (createSnow function has been removed to prevent its use in future migrations)

/**
 * Initialize mobile navigation
 */
export function initializeMobileNav() {
  if (typeof document === 'undefined') return;
  
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

/**
 * Format date to a readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Sanitize HTML content for security
export function sanitizeHtml(html) {
  if (!html) return '';
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Generate a unique ID for elements
export function generateId() {
  return `id_${Math.random().toString(36).substr(2, 9)}`;
}

// Sort an array of objects by a specific key
export function sortByKey(array, key, direction = 'asc') {
  if (!array || !array.length) return [];
  
  return [...array].sort((a, b) => {
    const valueA = a[key] || '';
    const valueB = b[key] || '';
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      const comparison = valueA.localeCompare(valueB);
      return direction === 'asc' ? comparison : -comparison;
    } else {
      const comparison = valueA - valueB;
      return direction === 'asc' ? comparison : -comparison;
    }
  });
}

// Format numbers with commas
export function formatNumber(num) {
  if (num === undefined || num === null) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Debounce function for performance optimization
export function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Detect mobile browser
export function isMobile() {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Get color based on percentage (green for high, red for low)
export function getColorByPercentage(percentage) {
  if (typeof percentage !== 'number') return '#888888';
  
  if (percentage >= 80) {
    return '#4caf50'; // Green
  } else if (percentage >= 60) {
    return '#8bc34a'; // Light green
  } else if (percentage >= 40) {
    return '#ffc107'; // Amber
  } else if (percentage >= 20) {
    return '#ff9800'; // Orange
  } else {
    return '#f44336'; // Red
  }
} 