// Version configuration for global use
const VERSION_CONFIG = {
  version: "CS2 Alpha 2.8.5",
  copyright: "AtomicRecall 2025"
};

// Function to update footer elements with version info
function updateFooterVersion() {
  const footerElements = document.querySelectorAll('.footer, [data-footer]');
  footerElements.forEach(footer => {
    const copyrightSpan = footer.querySelector('[data-copyright]');
    const versionSpan = footer.querySelector('[data-version]');
    
    if (copyrightSpan) {
      copyrightSpan.textContent = `© ${VERSION_CONFIG.copyright}`;
    }
    if (versionSpan) {
      versionSpan.textContent = VERSION_CONFIG.version;
    }
  });
}

// Update footer when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateFooterVersion);
} else {
  updateFooterVersion();
}
