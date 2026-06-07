/**
 * PakStyle — Theme JavaScript
 * Base utilities, cart API, and UI interactions.
 */
(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Configuration & Global State
     -------------------------------------------------------------------------- */
  const config = window.PakStyleConfig || {
    moneyFormat: '${{amount}}',
    currency: 'PKR',
    cartUrl: '/cart',
    rootUrl: '/'
  };

  /** Global cart state — updated by fetchCart() and cart mutations */
  const cartState = {
    items: [],
    item_count: 0,
    total_price: 0,
    currency: config.currency,
    isLoading: false,
    isOpen: false
  };

  const STORAGE_KEYS = {
    announcementDismissed: 'pakstyle_announcement_dismissed'
  };

  /* --------------------------------------------------------------------------
     Utility Functions
     -------------------------------------------------------------------------- */

  /**
   * Debounce — delays function execution until after wait ms of inactivity.
   * @param {Function} fn - Function to debounce
   * @param {number} wait - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(fn, wait) {
    let timeoutId;
    return function debounced(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        fn.apply(this, args);
      }, wait);
    };
  }

  /**
   * Format a price in cents using the shop money format.
   * @param {number} cents - Price in cents
   * @returns {string} Formatted money string
   */
  function formatMoney(cents) {
    if (typeof cents !== 'number' || isNaN(cents)) {
      return '';
    }

    const amount = (cents / 100).toFixed(2);
    const format = config.moneyFormat || '${{amount}}';

    return format
      .replace(/\{\{\s*amount\s*\}\}/g, amount)
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, Math.round(cents / 100).toString())
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, amount.replace('.', ','));
  }

  /**
   * Safely parse JSON from a fetch response.
   * @param {Response} response - Fetch API response
   * @returns {Promise<Object>}
   */
  function parseJSON(response) {
    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }
    return response.json();
  }

  /* --------------------------------------------------------------------------
     Cart API
     -------------------------------------------------------------------------- */

  /**
   * Fetch the current cart from Shopify Ajax API.
   * Updates global cartState and dispatches a custom event.
   * @returns {Promise<Object>} Cart object
   */
  function fetchCart() {
    cartState.isLoading = true;
    document.dispatchEvent(new CustomEvent('pakstyle:cart:loading'));

    return fetch('/cart.js', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(parseJSON)
      .then(function (cart) {
        cartState.items = cart.items || [];
        cartState.item_count = cart.item_count || 0;
        cartState.total_price = cart.total_price || 0;
        cartState.currency = cart.currency || config.currency;
        cartState.isLoading = false;

        document.dispatchEvent(
          new CustomEvent('pakstyle:cart:updated', { detail: { cart: cart } })
        );

        return cart;
      })
      .catch(function (error) {
        cartState.isLoading = false;
        console.error('[PakStyle] fetchCart error:', error);
        document.dispatchEvent(
          new CustomEvent('pakstyle:cart:error', { detail: { error: error } })
        );
        throw error;
      });
  }

  /**
   * Add a variant to the cart.
   * @param {number|string} variantId - Shopify variant ID
   * @param {number} [quantity=1] - Quantity to add
   * @returns {Promise<Object>} Updated cart or line item response
   */
  function addToCart(variantId, quantity) {
    quantity = quantity || 1;

    return fetch('/cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    })
      .then(parseJSON)
      .then(function (item) {
        return fetchCart().then(function () {
          return item;
        });
      })
      .catch(function (error) {
        console.error('[PakStyle] addToCart error:', error);
        document.dispatchEvent(
          new CustomEvent('pakstyle:cart:error', { detail: { error: error } })
        );
        throw error;
      });
  }

  /**
   * Update a cart line item quantity (0 removes the item).
   * @param {number|string} id - Line item key or ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Updated cart
   */
  function updateCartItem(id, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        quantity: quantity
      })
    })
      .then(parseJSON)
      .then(function (cart) {
        cartState.items = cart.items || [];
        cartState.item_count = cart.item_count || 0;
        cartState.total_price = cart.total_price || 0;
        cartState.currency = cart.currency || config.currency;

        document.dispatchEvent(
          new CustomEvent('pakstyle:cart:updated', { detail: { cart: cart } })
        );

        return cart;
      })
      .catch(function (error) {
        console.error('[PakStyle] updateCartItem error:', error);
        document.dispatchEvent(
          new CustomEvent('pakstyle:cart:error', { detail: { error: error } })
        );
        throw error;
      });
  }

  /* --------------------------------------------------------------------------
     Announcement Bar
     -------------------------------------------------------------------------- */

  /**
   * Initialize dismissible announcement bar with localStorage persistence.
   */
  function initAnnouncementBar() {
    const bar = document.querySelector('[data-announcement-bar]');
    if (!bar) return;

    const closeBtn = bar.querySelector('[data-announcement-close]');
    const message = bar.dataset.message || '';
    const storageKey = STORAGE_KEYS.announcementDismissed + '_' + hashString(message);

    if (localStorage.getItem(storageKey) === 'true') {
      bar.classList.add('is-hidden');
      return;
    }

    if (!closeBtn) return;

    closeBtn.addEventListener('click', function () {
      bar.classList.add('is-dismissing');

      bar.addEventListener(
        'animationend',
        function () {
          bar.classList.remove('is-dismissing');
          bar.classList.add('is-hidden');
          localStorage.setItem(storageKey, 'true');
        },
        { once: true }
      );
    });
  }

  /**
   * Simple string hash for localStorage keys.
   * @param {string} str - Input string
   * @returns {string} Hash string
   */
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  /* --------------------------------------------------------------------------
     Mobile Menu Toggle
     -------------------------------------------------------------------------- */

  /**
   * Toggle the mobile navigation menu open/closed.
   * @param {boolean} [forceOpen] - Force open (true) or closed (false)
   */
  function toggleMobileMenu(forceOpen) {
    const menu = document.querySelector('[data-mobile-menu]');
    const toggle = document.querySelector('[data-mobile-menu-toggle]');

    if (!menu || !toggle) return;

    const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !menu.classList.contains('is-open');

    menu.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      const firstLink = menu.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }
  }

  /**
   * Bind mobile menu toggle button and close-on-escape.
   */
  function initMobileMenu() {
    const toggle = document.querySelector('[data-mobile-menu-toggle]');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      toggleMobileMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        toggleMobileMenu(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     Sticky Header Scroll Handler
     -------------------------------------------------------------------------- */

  /**
   * Add/remove scrolled class on header based on scroll position.
   */
  function initStickyHeader() {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;

    const onScroll = debounce(function () {
      const scrolled = window.scrollY > 10;
      header.classList.toggle('is-scrolled', scrolled);
    }, 10);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------------------
     Accessibility — Skip Link
     -------------------------------------------------------------------------- */

  /**
   * Bind skip-to-content link behavior.
   */
  function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    const main = document.getElementById('main-content');

    if (!skipLink || !main) return;

    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    });

    if (window.location.hash === '#main-content') {
      main.focus();
    }
  }

  /* --------------------------------------------------------------------------
     Cart Drawer Toggle (stub for Phase 3)
     -------------------------------------------------------------------------- */

  /**
   * Open or close the cart drawer.
   * @param {boolean} [forceOpen] - Force open (true) or closed (false)
   */
  function toggleCartDrawer(forceOpen) {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !drawer.classList.contains('is-open');

    drawer.classList.toggle('is-open', isOpen);
    cartState.isOpen = isOpen;
    document.body.style.overflow = isOpen ? 'hidden' : '';

    document.dispatchEvent(
      new CustomEvent('pakstyle:cart:drawer', { detail: { isOpen: isOpen } })
    );

    if (isOpen) {
      fetchCart();
    }
  }

  /**
   * Bind cart drawer open/close triggers.
   */
  function initCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    document.querySelectorAll('[data-cart-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        toggleCartDrawer(true);
      });
    });

    drawer.querySelectorAll('[data-cart-close]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        toggleCartDrawer(false);
      });
    });
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */

  function init() {
    initSkipLink();
    initCartDrawer();
    fetchCart();
  }

  document.addEventListener('DOMContentLoaded', init);

  /* --------------------------------------------------------------------------
     Public API
     -------------------------------------------------------------------------- */
  window.PakStyle = {
    cartState: cartState,
    config: config,
    fetchCart: fetchCart,
    addToCart: addToCart,
    updateCartItem: updateCartItem,
    formatMoney: formatMoney,
    debounce: debounce,
    toggleMobileMenu: toggleMobileMenu,
    toggleCartDrawer: toggleCartDrawer
  };
})();
