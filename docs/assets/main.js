document.addEventListener('DOMContentLoaded', () => {
  // Highlight current nav item
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .dropdown-item, .navbar-nav .nav-link:not(.dropdown-toggle)').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith(currentPath)) link.classList.add('active');
  });
});