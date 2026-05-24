var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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