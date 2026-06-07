/**
 * PakStyle — Theme JavaScript
 * Cart API, predictive search, wishlist, recently viewed, toasts.
 */
(function () {
  'use strict';

  const config = window.PakStyleConfig || {
    moneyFormat: '${{amount}}',
    currency: 'PKR',
    cartUrl: '/cart',
    rootUrl: '/',
    freeShippingThreshold: 250000
  };

  const STORAGE = {
    wishlist: 'pakstyle-wishlist',
    wishlistLegacy: 'pakstyle_wishlist',
    recentlyViewed: 'pakstyle-recently-viewed',
    recentlyViewedLegacy: 'pakstyle_recently_viewed',
    announcementDismissed: 'pakstyle_announcement_dismissed'
  };

  const cartState = {
    items: [],
    item_count: 0,
    total_price: 0,
    currency: config.currency,
    isLoading: false,
    isOpen: false
  };

  /* --------------------------------------------------------------------------
     Utilities
     -------------------------------------------------------------------------- */

  function debounce(fn, wait) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Format price in cents as PKR.
   * @param {number} cents
   * @returns {string}
     */
  function formatMoney(cents) {
    if (typeof cents !== 'number' || isNaN(cents)) return '';
    return 'PKR ' + (cents / 100).toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function parseJSON(response) {
    if (!response.ok) throw new Error('Request failed with status ' + response.status);
    return response.json();
  }

  function migrateStorage(key, legacyKey) {
    try {
      if (!localStorage.getItem(key) && localStorage.getItem(legacyKey)) {
        localStorage.setItem(key, localStorage.getItem(legacyKey));
      }
    } catch (e) { /* ignore */ }
  }

  /* --------------------------------------------------------------------------
     Toast notification system
     -------------------------------------------------------------------------- */

  function getToastIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    return icons[type] || icons.info;
  }

  function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
    return container;
  }

  function showToast(message, type, duration) {
    type = type || 'success';
    duration = duration || 3000;

    const container = document.querySelector('#toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML =
      '<span class="toast-icon">' + getToastIcon(type) + '</span>' +
      '<span class="toast-message">' + escapeHtml(message) + '</span>' +
      '<button type="button" class="toast-close" aria-label="Close">&times;</button>';

    toast.querySelector('.toast-close').addEventListener('click', function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    });

    container.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('show'); });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, duration);
  }

  /* --------------------------------------------------------------------------
     Cart API
     -------------------------------------------------------------------------- */

  function updateShippingBar(totalCents) {
    const threshold = config.freeShippingThreshold || 250000;
    const percentage = Math.min((totalCents / threshold) * 100, 100);
    const remaining = Math.max(threshold - totalCents, 0);

    document.querySelectorAll('.shipping-bar-fill, [data-cart-shipping-bar]').forEach(function (el) {
      el.style.width = percentage + '%';
    });

    document.querySelectorAll('.shipping-bar-text, [data-cart-shipping-text]').forEach(function (el) {
      if (remaining > 0) {
        el.textContent = 'Add ' + formatMoney(remaining) + ' more for FREE shipping!';
      } else {
        el.textContent = '🎉 You have unlocked FREE shipping!';
      }
    });
  }

  function renderCartDrawer(cart) {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    const itemsEl = drawer.querySelector('[data-cart-items]');
    const emptyEl = drawer.querySelector('[data-cart-empty]');
    const footerEl = drawer.querySelector('[data-cart-footer]');
    const titleEl = drawer.querySelector('[data-cart-drawer-title]');
    const subtotalEl = drawer.querySelector('[data-cart-subtotal]');
    const hasItems = cart.item_count > 0;

    if (titleEl) {
      titleEl.textContent = 'Your Cart (' + cart.item_count + ' item' + (cart.item_count === 1 ? '' : 's') + ')';
    }
    if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);
    if (emptyEl) emptyEl.hidden = hasItems;
    if (footerEl) footerEl.hidden = !hasItems;

    if (itemsEl) {
      itemsEl.hidden = !hasItems;
      itemsEl.innerHTML = hasItems
        ? cart.items.map(function (item) {
          const variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? item.variant_title : '';
          return '<li class="ps-cart-drawer__item" data-line-key="' + escapeHtml(item.key) + '">' +
            '<a href="' + escapeHtml(item.url) + '"><img src="' + escapeHtml(item.image || '') + '" alt="" class="ps-cart-drawer__item-img" width="60" height="60" loading="lazy"></a>' +
            '<div class="ps-cart-drawer__item-details">' +
            '<p class="ps-cart-drawer__item-title"><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.product_title) + '</a></p>' +
            (variantTitle ? '<p class="ps-cart-drawer__item-variant">' + escapeHtml(variantTitle) + '</p>' : '') +
            '<p class="ps-cart-drawer__item-price">' + formatMoney(item.final_line_price) + '</p>' +
            '</div>' +
            '<div class="ps-cart-drawer__item-actions">' +
            '<button type="button" class="ps-cart-drawer__item-remove" data-cart-remove="' + escapeHtml(item.key) + '" aria-label="Remove">&times;</button>' +
            '<div class="ps-cart-drawer__qty">' +
            '<button type="button" class="ps-cart-drawer__qty-btn" data-cart-qty-minus="' + escapeHtml(item.key) + '" aria-label="Decrease">&minus;</button>' +
            '<span class="ps-cart-drawer__qty-value">' + item.quantity + '</span>' +
            '<button type="button" class="ps-cart-drawer__qty-btn" data-cart-qty-plus="' + escapeHtml(item.key) + '" aria-label="Increase">+</button>' +
            '</div></div></li>';
        }).join('')
        : '';
    }

    bindCartDrawerEvents(drawer);
    updateShippingBar(cart.total_price);
  }

  function bindCartDrawerEvents(drawer) {
    const itemsEl = drawer.querySelector('[data-cart-items]');
    if (!itemsEl) return;

    itemsEl.querySelectorAll('[data-cart-remove]').forEach(function (btn) {
      btn.onclick = function () { removeCartItem(btn.getAttribute('data-cart-remove')); };
    });

    itemsEl.querySelectorAll('[data-cart-qty-minus]').forEach(function (btn) {
      btn.onclick = function () {
        const key = btn.getAttribute('data-cart-qty-minus');
        const item = cartState.items.find(function (i) { return i.key === key; });
        if (item) updateCartItem(key, item.quantity - 1);
      };
    });

    itemsEl.querySelectorAll('[data-cart-qty-plus]').forEach(function (btn) {
      btn.onclick = function () {
        const key = btn.getAttribute('data-cart-qty-plus');
        const item = cartState.items.find(function (i) { return i.key === key; });
        if (item) updateCartItem(key, item.quantity + 1);
      };
    });
  }

  function updateCartUI(cart) {
    document.querySelectorAll('.cart-count, [data-cart-count]').forEach(function (el) {
      el.textContent = cart.item_count;
      if (el.classList.contains('cart-count') || el.classList.contains('ps-header__badge')) {
        el.style.display = cart.item_count > 0 ? 'flex' : 'none';
      }
      if (cart.item_count <= 0) el.hidden = true;
      else el.hidden = false;
    });

    renderCartDrawer(cart);
    updateShippingBar(cart.total_price);

    document.dispatchEvent(new CustomEvent('pakstyle:cart:updated', { detail: { cart: cart } }));
  }

  async function fetchCart() {
    cartState.isLoading = true;
    document.dispatchEvent(new CustomEvent('pakstyle:cart:loading'));

    try {
      const res = await fetch('/cart.js', { credentials: 'same-origin' });
      const cart = await parseJSON(res);
      cartState.items = cart.items || [];
      cartState.item_count = cart.item_count || 0;
      cartState.total_price = cart.total_price || 0;
      cartState.currency = cart.currency || config.currency;
      cartState.isLoading = false;
      updateCartUI(cart);
      return cart;
    } catch (error) {
      cartState.isLoading = false;
      console.error('[PakStyle] fetchCart error:', error);
      document.dispatchEvent(new CustomEvent('pakstyle:cart:error', { detail: { error: error } }));
      throw error;
    }
  }

  async function addToCart(variantId, quantity, properties) {
    quantity = quantity || 1;
    properties = properties || {};

    const res = await fetch('/cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: quantity, properties: properties })
    });

    if (!res.ok) {
      showToast('Could not add to cart', 'error');
      throw new Error('Could not add to cart');
    }

    const item = await res.json();
    await fetchCart();
    openCartDrawer();
    showToast('Added to cart!', 'success');
    return item;
  }

  async function updateCartItem(lineItemKey, quantity) {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (drawer) drawer.classList.add('ps-cart-drawer__loading');

    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lineItemKey, quantity: quantity })
      });
      const cart = await parseJSON(res);
      cartState.items = cart.items || [];
      cartState.item_count = cart.item_count || 0;
      cartState.total_price = cart.total_price || 0;
      updateCartUI(cart);
      return cart;
    } catch (error) {
      showToast('Could not update cart', 'error');
      throw error;
    } finally {
      if (drawer) drawer.classList.remove('ps-cart-drawer__loading');
    }
  }

  async function removeCartItem(lineItemKey) {
    return updateCartItem(lineItemKey, 0);
  }

  async function applyDiscount(code) {
    const res = await fetch('/cart/update.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attributes: { discount_code: code } })
    });
    const cart = await res.json();
    await fetchCart();
    return cart;
  }

  function openCartDrawer() {
    toggleCartDrawer(true);
  }

  function toggleCartDrawer(forceOpen) {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', isOpen);
    cartState.isOpen = isOpen;
    document.body.style.overflow = isOpen ? 'hidden' : '';

    document.dispatchEvent(new CustomEvent('pakstyle:cart:drawer', { detail: { isOpen: isOpen } }));

    if (isOpen) fetchCart();
  }

  function initCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!drawer) return;

    document.querySelectorAll('[data-cart-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openCartDrawer();
      });
    });

    drawer.querySelectorAll('[data-cart-close]').forEach(function (trigger) {
      trigger.addEventListener('click', function () { toggleCartDrawer(false); });
    });
  }

  /* --------------------------------------------------------------------------
     Wishlist
     -------------------------------------------------------------------------- */

  class WishlistManager {
    constructor() {
      migrateStorage(STORAGE.wishlist, STORAGE.wishlistLegacy);
      this.items = JSON.parse(localStorage.getItem(STORAGE.wishlist) || '[]').map(Number).filter(Boolean);
      this.init();
    }

    init() {
      this.updateAllButtons();
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.wishlist-btn, [data-wishlist-toggle], [data-ps-wishlist-btn]');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const productId = parseInt(btn.dataset.productId || btn.dataset.wishlistToggle || btn.dataset.psWishlistBtn, 10);
        if (productId) this.toggle(productId, btn);
      });
    }

    has(id) { return this.items.includes(Number(id)); }

    add(id) {
      id = Number(id);
      if (!this.has(id)) this.items.push(id);
    }

    remove(id) {
      id = Number(id);
      this.items = this.items.filter(function (i) { return i !== id; });
    }

    save() {
      localStorage.setItem(STORAGE.wishlist, JSON.stringify(this.items));
      document.dispatchEvent(new CustomEvent('pakstyle:wishlist:updated'));
    }

    toggle(productId, btn) {
      if (this.has(productId)) {
        this.remove(productId);
        btn.classList.remove('active', 'is-active');
        this.setIcon(btn, '♡');
        showToast('Removed from wishlist', 'info');
      } else {
        this.add(productId);
        btn.classList.add('active', 'is-active');
        this.setIcon(btn, '♥');
        showToast('Added to wishlist!', 'success');
      }
      this.save();
      this.updateCount();
    }

    setIcon(btn, char) {
      const icon = btn.querySelector('.wishlist-icon, [data-ps-wishlist-icon]');
      if (icon) icon.textContent = char;
      const svg = btn.querySelector('svg');
      if (svg && char === '♥') btn.classList.add('is-active');
    }

    updateCount() {
      document.querySelectorAll('.wishlist-count, [data-ps-wishlist-count]').forEach(function (el) {
        el.textContent = this.items.length;
        el.style.display = this.items.length > 0 ? 'flex' : 'none';
        el.hidden = this.items.length <= 0;
      }.bind(this));
      document.querySelectorAll('[data-ps-wishlist-count-mobile]').forEach(function (el) {
        el.textContent = this.items.length;
      }.bind(this));
    }

    updateAllButtons() {
      document.querySelectorAll('.wishlist-btn, [data-wishlist-toggle], [data-ps-wishlist-btn]').forEach(function (btn) {
        const id = parseInt(btn.dataset.productId || btn.dataset.wishlistToggle, 10);
        if (this.has(id)) {
          btn.classList.add('active', 'is-active');
          this.setIcon(btn, '♥');
        }
      }.bind(this));
      this.updateCount();
    }
  }

  /* --------------------------------------------------------------------------
     Recently viewed
     -------------------------------------------------------------------------- */

  class RecentlyViewed {
    constructor() {
      migrateStorage(STORAGE.recentlyViewed, STORAGE.recentlyViewedLegacy);
      this.items = JSON.parse(localStorage.getItem(STORAGE.recentlyViewed) || '[]');
      this.maxItems = 4;
    }

    add(product) {
      this.items = this.items.filter(function (p) { return p.id !== product.id; });
      this.items.unshift(product);
      this.items = this.items.slice(0, this.maxItems);
      localStorage.setItem(STORAGE.recentlyViewed, JSON.stringify(this.items));
    }

    get() { return this.items; }

    render(excludeId) {
      const section = document.querySelector('[data-ps-recent-section]');
      const grid = document.querySelector('[data-ps-recent-grid]');
      if (!section || !grid) return;

      const list = this.items.filter(function (p) { return p.id !== excludeId; }).slice(0, this.maxItems);
      if (!list.length) {
        section.hidden = true;
        return;
      }

      section.hidden = false;
      grid.innerHTML = list.map(function (p) {
        const imgUrl = p.image || '';
        const onSale = p.compare_at_price && p.compare_at_price > p.price;
        return '<article class="ps-product-card">' +
          '<div class="ps-product-card__media"><a href="' + escapeHtml(p.url) + '">' +
          (imgUrl ? '<img src="' + escapeHtml(imgUrl) + '" alt="" class="ps-product-card__img ps-product-card__img--primary" loading="lazy">' : '<div class="ps-product-card__placeholder"></div>') +
          '</a></div><div class="ps-product-card__info">' +
          '<h3 class="ps-product-card__title"><a href="' + escapeHtml(p.url) + '">' + escapeHtml(p.title) + '</a></h3>' +
          '<div class="ps-product-card__price">' +
          (onSale
            ? '<span class="ps-product-card__price-sale">' + formatMoney(p.price) + '</span><s class="ps-product-card__price-compare">' + formatMoney(p.compare_at_price) + '</s>'
            : '<span>' + formatMoney(p.price) + '</span>') +
          '</div></div></article>';
      }).join('');
    }
  }

  function initProductRecentlyViewed(recentlyViewed) {
    const section = document.querySelector('[data-enable-recent]');
    if (section && section.dataset.enableRecent !== 'true') return;

    const jsonEl = document.querySelector('[data-ps-product-json]');
    if (!jsonEl) return;

    try {
      const product = JSON.parse(jsonEl.textContent);
      const img = product.featured_image || (product.images && product.images[0]);
      recentlyViewed.add({
        id: product.id,
        title: product.title,
        price: product.price,
        compare_at_price: product.compare_at_price,
        url: '/products/' + product.handle,
        vendor: product.vendor,
        image: img ? (img.src || img) : ''
      });
      recentlyViewed.render(product.id);
    } catch (e) {
      console.error('[PakStyle] Recently viewed error:', e);
    }
  }

  /* --------------------------------------------------------------------------
     Predictive search
     -------------------------------------------------------------------------- */

  function initPredictiveSearch() {
    const searchInput = document.querySelector('#search-input') || document.querySelector('[data-ps-search-input]');
    const overlay = document.querySelector('[data-ps-search]');
    if (!searchInput || !overlay) return;

    const suggestionsEl = document.querySelector('#search-suggestions') || document.querySelector('[data-ps-search-results]');
    const loadingEl = document.querySelector('#search-loading');
    const openBtns = document.querySelectorAll('[data-ps-search-open]');
    const closeBtns = overlay.querySelectorAll('[data-ps-search-close]');
    let activeIndex = -1;
    let currentProducts = [];

    function clearSuggestions() {
      if (suggestionsEl) {
        suggestionsEl.innerHTML = '';
        suggestionsEl.hidden = true;
      }
      if (loadingEl) loadingEl.hidden = true;
      activeIndex = -1;
      currentProducts = [];
    }

    function setOverlayOpen(isOpen) {
      overlay.classList.toggle('is-open', isOpen);
      overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen) {
        setTimeout(function () { searchInput.focus(); }, 100);
      } else {
        searchInput.value = '';
        clearSuggestions();
      }
    }

    function renderSuggestions(products) {
      if (!suggestionsEl) return;
      currentProducts = products;

      if (!products.length) {
        suggestionsEl.innerHTML = '<p class="no-results ps-search__empty">No products found</p>';
        suggestionsEl.hidden = false;
        return;
      }

      suggestionsEl.innerHTML = products.map(function (product, index) {
        const img = product.image || (product.featured_image && product.featured_image.url) || '';
        const price = product.price ? formatMoney(product.price) : '';
        return '<a href="' + escapeHtml(product.url) + '" class="suggestion-item ps-search__result" data-suggestion-index="' + index + '">' +
          (img ? '<img src="' + escapeHtml(img) + '" alt="" width="50" height="50" class="suggestion-item__img ps-search__result-img">' : '<div class="ps-search__result-img"></div>') +
          '<div class="suggestion-info ps-search__result-info">' +
          '<span class="suggestion-title ps-search__result-title">' + escapeHtml(product.title) + '</span>' +
          (price ? '<span class="suggestion-price ps-search__result-price">' + price + '</span>' : '') +
          '</div></a>';
      }).join('');

      suggestionsEl.hidden = false;
      activeIndex = -1;
    }

    function predictiveSearch(query) {
      if (query.length < 2) {
        clearSuggestions();
        return;
      }

      if (loadingEl) loadingEl.hidden = false;

      fetch('/search/suggest.json?q=' + encodeURIComponent(query) +
        '&resources[type]=product&resources[limit]=5&resources[fields]=title,image,price,url')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (loadingEl) loadingEl.hidden = true;
          const products = (data.resources && data.resources.results && data.resources.results.products) || [];
          renderSuggestions(products);
        })
        .catch(function () {
          if (loadingEl) loadingEl.hidden = true;
          if (suggestionsEl) {
            suggestionsEl.innerHTML = '<p class="no-results ps-search__empty">Search unavailable</p>';
            suggestionsEl.hidden = false;
          }
        });
    }

    const debouncedSearch = debounce(function (query) {
      predictiveSearch(query);
    }, 300);

    searchInput.addEventListener('input', function () {
      debouncedSearch(searchInput.value.trim());
    });

    searchInput.addEventListener('keydown', function (e) {
      const items = suggestionsEl ? suggestionsEl.querySelectorAll('.suggestion-item') : [];
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        items[activeIndex].click();
        return;
      } else {
        return;
      }

      items.forEach(function (el, i) {
        el.classList.toggle('is-highlighted', i === activeIndex);
      });
      if (activeIndex >= 0) items[activeIndex].scrollIntoView({ block: 'nearest' });
    });

    openBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const mobileMenu = document.querySelector('[data-ps-mobile-menu]');
        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
          mobileMenu.classList.remove('is-open');
        }
        setOverlayOpen(true);
      });
    });

    closeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { setOverlayOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        setOverlayOpen(false);
      }
    });

    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('ps-search__backdrop')) {
        setOverlayOpen(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     Skip link
     -------------------------------------------------------------------------- */

  function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    const main = document.getElementById('main-content');
    if (!skipLink || !main) return;

    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */

  let wishlist;
  let recentlyViewed;

  function init() {
    initSkipLink();
    initCartDrawer();
    initPredictiveSearch();

    wishlist = new WishlistManager();
    recentlyViewed = new RecentlyViewed();

    initProductRecentlyViewed(recentlyViewed);
    fetchCart();
  }

  document.addEventListener('DOMContentLoaded', init);

  window.PakStyle = {
    cartState: cartState,
    config: config,
    fetchCart: fetchCart,
    addToCart: addToCart,
    updateCartItem: updateCartItem,
    removeCartItem: removeCartItem,
    applyDiscount: applyDiscount,
    updateCartUI: updateCartUI,
    renderCartDrawer: renderCartDrawer,
    updateShippingBar: updateShippingBar,
    openCartDrawer: openCartDrawer,
    toggleCartDrawer: toggleCartDrawer,
    formatMoney: formatMoney,
    debounce: debounce,
    showToast: showToast,
    get wishlist() { return wishlist; },
    get recentlyViewed() { return recentlyViewed; }
  };

  window.showToast = showToast;
})();
