// Custom Admin JavaScript for Interactions

// Sidebar functionality
export function initAdmin() {
  // Initialize tooltips
  initTooltips();

  // Initialize dropdowns
  initDropdowns();

  // Initialize charts (if Chart.js is available)
  initCharts();
}

// Tooltip functionality
function initTooltips() {
  const tooltipTriggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', showTooltip);
    trigger.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(e) {
  const title = e.target.getAttribute('data-bs-title');
  if (!title) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'custom-tooltip';
  tooltip.textContent = title;
  tooltip.style.cssText = `
    position: absolute;
    background: #1e1b4b;
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
  `;

  document.body.appendChild(tooltip);

  const rect = e.target.getBoundingClientRect();
  tooltip.style.left = rect.right + 10 + 'px';
  tooltip.style.top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2 + 'px';

  requestAnimationFrame(() => {
    tooltip.style.opacity = '1';
  });

  e.target._tooltip = tooltip;
}

function hideTooltip(e) {
  if (e.target._tooltip) {
    e.target._tooltip.remove();
    e.target._tooltip = null;
  }
}

// Dropdown functionality
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleDropdown);
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      closeAllDropdowns();
    }
  });
}

function toggleDropdown(e) {
  e.preventDefault();
  const dropdown = e.target.closest('.dropdown');
  const menu = dropdown.querySelector('.dropdown-menu');

  if (menu.classList.contains('show')) {
    menu.classList.remove('show');
  } else {
    closeAllDropdowns();
    menu.classList.add('show');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
  });
}

// Chart initialization placeholder
function initCharts() {
  // Charts can be initialized here if using Chart.js
  // This is a placeholder for future chart implementations
}

// Animate numbers counting up
export function animateNumber(element, target, duration = 1000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = Math.floor(start + (target - start) * easeProgress);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Sidebar toggle
export function toggleSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  const main = document.querySelector('.admin-main');

  if (sidebar && main) {
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');

    // Save state to localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }
}

// Mobile sidebar toggle
export function toggleMobileSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  const overlay = document.querySelector('.mobile-overlay');

  if (sidebar && overlay) {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
  }
}

// Initialize sidebar state from localStorage
export function initSidebarState() {
  const sidebar = document.querySelector('.admin-sidebar');
  const main = document.querySelector('.admin-main');
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

  if (sidebar && main && isCollapsed) {
    sidebar.classList.add('collapsed');
    main.classList.add('expanded');
  }
}

// Smooth scroll to element
export function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Confirmation dialog
export function confirmAction(message, onConfirm, onCancel) {
  if (window.confirm(message)) {
    onConfirm?.();
  } else {
    onCancel?.();
  }
}

// Toast notification
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  const container = document.querySelector('.toast-container') || document.body;
  container.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Table sorting
export function sortTable(table, column, asc = true) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aVal = a.cells[column].textContent.trim();
    const bVal = b.cells[column].textContent.trim();

    if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
      return asc ? parseFloat(aVal) - parseFloat(bVal) : parseFloat(bVal) - parseFloat(aVal);
    }

    return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  rows.forEach(row => tbody.appendChild(row));
}

// Export data as CSV
export function exportToCSV(data, filename) {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertToCSV(data) {
  if (!data || !data.length) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => {
    const value = obj[header];
    // Escape quotes and wrap in quotes if needed
    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }).join(','));

  return [headers.join(','), ...rows].join('\n');
}

// Debounce function
export function debounce(func, wait) {
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

// Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Date formatter
export function formatDate(date, format = 'MM/DD/YYYY') {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  return format
    .replace('MM', month)
    .replace('DD', day)
    .replace('YYYY', year);
}

// Relative time formatter
export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'Just now';
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}

// Export all functions
export default {
  initAdmin,
  animateNumber,
  toggleSidebar,
  toggleMobileSidebar,
  initSidebarState,
  smoothScrollTo,
  confirmAction,
  showToast,
  sortTable,
  exportToCSV,
  debounce,
  throttle,
  formatDate,
  timeAgo
};
