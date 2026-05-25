var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// added to get rid of scatter motion when a category is selected
var mixer = mixitup(containerEl, {
    animation: {
        duration: prefersReducedMotion ? 0 : 300,
        effects: prefersReducedMotion ? '' : 'fade scale'
    },
    callbacks: {
        onMixEnd: function(state) {
            state.show.forEach(el => {
                el.querySelector('a[data-lightbox]')
                  .setAttribute('data-lightbox', 'current');
            });
            state.hide.forEach(el => {
                el.querySelector('a[data-lightbox]')
                  .setAttribute('data-lightbox', 'hidden');
            });
        }
    }
});

// lightbox keyboard accessibility

// Trap focus inside lightbox while open, and allow Escape to close
document.addEventListener('keydown', function (e) {
    const lightbox = document.querySelector('#lightbox');
    if (!lightbox || lightbox.style.display === 'none') return;
 
    const focusable = lightbox.querySelectorAll('a, button, [tabindex="0"]');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
 
    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
 
    if (e.key === 'Escape') {
        const lbClose = document.querySelector('.lb-close');
        if (lbClose) lbClose.click();
    }
});


// The following section was added to get rid of the aXe accessibility notices where a lightbox image is selected
// because of how the lightbox library is built. It adds the aria-label and role attributes to the lightbox 
// elements when they are added to the DOM

const observer = new MutationObserver(function(mutations) {
  const lbClose = document.querySelector('.lb-close');
  if (lbClose && !lbClose.getAttribute('aria-label')) {
    lbClose.setAttribute('aria-label', 'Close');
  }

  const lbDetails = document.querySelector('.lb-details');
  if (lbDetails && !lbDetails.closest('[role="region"]')) {
    const region = document.createElement('div');
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', 'Image caption');
    lbDetails.parentNode.insertBefore(region, lbDetails);
    region.appendChild(lbDetails);
  }

  const lbOuterContainer = document.querySelector('.lb-outerContainer');
  if (lbOuterContainer && !lbOuterContainer.closest('[role="dialog"]')) {
    const lbContainer = document.querySelector('#lightbox');
    if (lbContainer) {
      lbContainer.setAttribute('role', 'dialog');
      lbContainer.setAttribute('aria-label', 'Image lightbox');
      lbContainer.setAttribute('aria-modal', 'true');
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });