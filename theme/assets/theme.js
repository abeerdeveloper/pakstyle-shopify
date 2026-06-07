/**
 * PakStyle — theme initialization
 */
(function () {
  'use strict';

  const PakStyle = {
    init: function () {
      this.setFocusOnMainContent();
      this.bindSkipLink();
    },

    setFocusOnMainContent: function () {
      const hash = window.location.hash;
      if (hash === '#MainContent') {
        const main = document.getElementById('MainContent');
        if (main) {
          main.focus();
        }
      }
    },

    bindSkipLink: function () {
      const skipLink = document.querySelector('.skip-link');
      if (!skipLink) return;

      skipLink.addEventListener('click', function (event) {
        const main = document.getElementById('MainContent');
        if (!main) return;

        event.preventDefault();
        main.focus();
        main.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      PakStyle.init();
    });
  } else {
    PakStyle.init();
  }

  window.PakStyle = PakStyle;
})();
