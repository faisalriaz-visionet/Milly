window.REBASE = window.REBASE || {};
REBASE.theme = REBASE.theme || {};

(function($) {
  /* ----------------------------------------------------------------
  -------------------------------------------------------------------
  Main Script
  -------------------------------------------------------------------
  -----------------------------------------------------------------*/

  $(function() {

    /* ----------------------------------------------------------------
    Header Search Toggle
    -----------------------------------------------------------------*/
    $(document).on('click', '[data-search-toggle]', function(e) {
      var el = $('.site-header__search');
      e.preventDefault();
      el.toggleClass('visible');
      if ( el.hasClass('visible') ) {
        el.find('input').focus();
      }
    });

    /* ----------------------------------------------------------------
    Fixed Header Scroll
    -----------------------------------------------------------------*/
    function setHeaderHeight() {
      REBASE.theme.siteHeaderHeight = $('.site-header').outerHeight();
    }

    function setHeaderFixed() {
      $('.site-header').addClass('site-header--fixed');
      $('body').css({'padding-top': REBASE.theme.siteHeaderHeight + 'px'});
    }

    function setHeader() {
      setHeaderHeight();
      setHeaderFixed();
    }

    setTimeout(setHeader, 200)
    $(window).on('resize', _.debounce(setHeader, 250))

    /* ----------------------------------------------------------------
    Header Promo Rotation
    -----------------------------------------------------------------*/
    function fadeToNextPromoBarItem(nextIndex) {
      $('.site-header__promo-item.active').removeClass('active').fadeOut(200,function(){
        $('.site-header__promo-item[data-index="' + nextIndex + '"]').addClass('active').fadeIn(200)
      });
    }

    if ( $('.site-header__promo-item').length > 1 ) {
      setInterval(function() {
        var currentIndex = $('.site-header__promo-item.active').data('index');

        if ( currentIndex >= $('.site-header__promo-item').length ) {
          fadeToNextPromoBarItem(1);
        } else {
          fadeToNextPromoBarItem(currentIndex + 1)
        }
      }, 6000);
    }

    /* ----------------------------------------------------------------
    Navigation
    -----------------------------------------------------------------*/
    // lock the body on mobile nav open so it does not scroll in background
    function toggleBodyScroll(lock) {
      var body = document.querySelector('body');
      var scrollPosition = 0;

      if ( lock ) {
        scrollPosition = window.pageYOffset;
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = '-' + scrollPosition + 'px';
        body.style.width = '100%';
      } else {
        body.style.removeProperty('overflow');
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        body.style.removeProperty('width');
        window.scrollTo(0, scrollPosition);
      }
    }

    // Mobile Navigation
    $(document).on('click', function(e) {
      var container = $('.mobile-navigation, .mobile-menu-toggle');

      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('body').removeClass('mobile-nav-opened');
      }
    });

    $(document).on('click', '.mobile-menu-toggle', function() {
      var body = $('body');
      toggleBodyScroll(!body.hasClass('mobile-nav-opened'))
      body.toggleClass('mobile-nav-opened');
    });

    $(document).on('click', '[data-mobile-menu-toggle]', function(e) {
      var _this = $(this);
      e.preventDefault();

      _this.attr('aria-expanded', !_this.parent().hasClass('open'))
      _this.parent().toggleClass('open');
      _this.parent().find('> ul').slideToggle();
    });

    $(document).on('click', '.mobile-navigation__level-1-item.has-children', function(e) {
      e.preventDefault();
      $('.mobile-navigation__panel--2[data-slug="'+ $(this).data('slug') +'"]').css({left: 0});
    });

    $(document).on('click', '.mobile-navigation__panel-back', function(e) {
      e.preventDefault();
      $('.mobile-navigation__panel--2').css({left: '100vw'});
    });


    $(document).on('click', '.site-nav__item.hover-intent.has-children .site-nav__item-link', function(e) {
      if ( isTouchEnabled() && !$(this).hasClass('open')) {
        e.preventDefault();
      }
    })

    // Desktop Dropdowns
    $('.hover-intent.has-children').hoverIntent({
      over: function(e) {
        var _this = $(this);
        $('.hover-intent').removeClass('hovered');
        _this.toggleClass('hovered');
        if ( _this.hasClass('has-children') ){
          $('body').addClass('nav-opened');
          setTimeout(function() {
            _this.find('.site-nav__item-link').addClass('open');
          },100)
        }
      },
      out: function() {
        $(this).removeClass('hovered').find('.site-nav__item-link').removeClass('open');
        $('body').removeClass('nav-opened');
      },
      timeout: 200
    });

    function isTouchEnabled() {
      return ( 'ontouchstart' in window ) ||  ( navigator.maxTouchPoints > 0 ) ||  ( navigator.msMaxTouchPoints > 0 );
    }

    /* ----------------------------------------------------------------
    jQuery toggles
    -----------------------------------------------------------------*/

    //Login Page - forgot password toggle
    $('#forgot-password').on('click', function() {
      $('#recover-password-form').show();
      $('#customer-login-form').hide();
    });

    $('#forgot-password-cancel').on('click', function() {
      $('#recover-password-form').hide();
      $('#customer-login-form').show();
    });

    // Mobile Collection filters
    $(document).on('click', '.filter-toggle, .filter-container__apply', function(e) {
      e.preventDefault();

      $('.filter-container').toggleClass('filter-container--visible');
    });

    // Header Search input
    $(document).on('click', '.site-header__search .btn', function(e) {
      var _this = $(this);

      e.preventDefault();
      _this.parent().find('form').addClass('visible').find('input').focus();
      _this.find('span').hide();
    });

    $(document).on('click', function(e) {
      var search_container = $('.site-header__search');
      var account_container = $('.site-header__action-dropdown, .site-header__account-action--logged-in');

      // if the target of the click isn't the container nor a descendant of the container
      if (!search_container.is(e.target) && search_container.has(e.target).length === 0) {
        search_container.find('form').removeClass('visible');
        setTimeout(function(){
          search_container.find('.btn span').show();
        }, 100)
      }

      // if the target of the click isn't the account_container nor a descendant of the account_container
      if (!account_container.is(e.target) && account_container.has(e.target).length === 0) {
        account_container.removeClass('visible');
      }
    });

    // Header account dropdown
    $(document).on('click', '.site-header__account-action--logged-in', function(e) {
      e.preventDefault();
      $('.site-header__action-dropdown').addClass('visible');
    });

    // PDP content toggle
    $(document).on('click', '.toggle__label', function(e) {
      var parent = $(this).parent();
      e.preventDefault();
      parent.find('.toggle__content').stop().slideToggle(200);
      parent.toggleClass('visible');
    });

    // Back to top link in footer
    $(document).on('click', '.back-to-top', function(e) {
      e.preventDefault();
      $('html,body').animate({scrollTop: 0}, 200);
    });

    /* ----------------------------------------------------------------
    Dropdown component ( custom <select /> )
    -----------------------------------------------------------------*/
    // open dropdown
    $(document).on('click', '.dropdown__label', function() {
      var _this = $(this);
      var container = _this.parent('.dropdown');
      if ( container.hasClass('dropdown--open') ) {
        $('.dropdown__options').removeClass('dropdown__options--visible');
        container.removeClass('dropdown--open');
      } else {
        container.find('.dropdown__options').addClass('dropdown__options--visible');
        container.addClass('dropdown--open');
        container.find('.dropdown__options').focus();
      }
    });

    $(document).on('click', '.dropdown__option:not(.dropdown__option--sort)', function () {
      var _this = $(this),
        container = _this.parents('.dropdown'),
        input = _this.find('input');
     
      // IMPORTANT: make sure the input gets updated, just in case the click target is not the radio label (as intended)
      input.prop('checked', true).trigger('change');


      if ( _this.hasClass('dropdown__option--swatch') ) {
        container.find('.dropdown__label div span:nth-child(2)').html(_this.find('.dropdown-swatch').clone());
      } else {
        container.find('.dropdown__label div span:nth-child(2)').text(_this.data('label'));
      }
      container.find('.dropdown__options').removeClass('dropdown__options--visible');
      container.find('.dropdown__option').removeClass('dropdown__option--selected');
      _this.addClass('dropdown__option--selected');
      container.removeClass('dropdown--open');
      container.next().focus();
    });

    // close dropdown on click outside of it
    $(document).on('mouseup', function(e) {
      var container = $('.dropdown');
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('.dropdown__options').removeClass('dropdown__options--visible');
        container.removeClass('dropdown--open');
      }
    });

    $(document).on('keypress', function(e) {
      var _this = $(e.target), container = _this.parents('.dropdown');

      if (!container.is(e.target) && container.has(e.target).length > 0) {
        if ( e.which === 13 ) {
          container.find('.dropdown__label div span:nth-child(2)').text(_this.data('label'));
          container.find('.dropdown__options').removeClass('dropdown__options--visible');
          container.find('.dropdown__option').removeClass('dropdown__option--selected');
          _this.addClass('dropdown__option--selected');
          container.removeClass('dropdown--open');
          container.next().focus();
        }
      }
    });

    /* ----------------------------------------------------------------
    Gift With Purchase add-to-cart listener
    -----------------------------------------------------------------*/
    $(document).on('click', '.gift-with-purchase__product .btn[data-gwp-variant-id]', function(e) {
      e.preventDefault();
      CartJS.addItem($(this).data('gwp-variant-id'), 1, {"_gwp_promo": true});
    });


    /* ----------------------------------------------------------------
    Collection category toggle
    -----------------------------------------------------------------*/
    $(document).on('click', '.filter-panel__header-btn:not(.ais-Panel-collapseButton)', function(e) {
      var panel = $(this).parents('.filter-panel');
      panel.attr('aria-expanded', panel.hasClass('filter-panel--collapsed'));
      panel.toggleClass('filter-panel--collapsed');
    });

    /* ----------------------------------------------------------------
    Collection Quick View Thumbs
    -----------------------------------------------------------------*/
    $(document).on('click', '.product-quickview__thumbs a', function(e){
      e.preventDefault();
      var _this = $(this);

      _this.parents('.product-quickview__gallery').find('.product-quickview__image img').attr('src', _this.data('src'));
    });

    /* ----------------------------------------------------------------
    Tab Controls
    -----------------------------------------------------------------*/
    $(document).on('click', '.tab', function(e) {
      var _this = $(this), slug = _this.data('slug');

      _this.siblings().removeClass('tab--selected');
      _this.addClass('tab--selected');

      _this.parents('.tab-container').find('.tab-content').removeClass('tab-content--selected');
      _this.parents('.tab-container').find('.tab-content[data-slug="'+slug+'"]').addClass('tab-content--selected');
    });

    /* ----------------------------------------------------------------
    Shopify Recommended Product API
    -----------------------------------------------------------------*/
    function displayRecommendedProducts(products) {
      products.forEach(function(product) {
        var product_loop_template = $('#related-product__template').html();
        var compiled_html = _.template(product_loop_template, product);
        $('.section--related-products .products').append(compiled_html({ product: product }));
        if ( REBASE && REBASE.lists ) {
          REBASE.lists.updateActiveProductVariant({
            product_id: product.id,
            variant_id: product.variants[0].id
          });
        }
      });
    }

    function getRecommendedProducts(id) {
      fetch('/recommendations/products.json?product_id=' + id + '&limit=5')
        .then(function(resp) {return resp.json();})
        .then(function(data) {
          if (data.products && data.products.length) {
            displayRecommendedProducts(data.products);
          } else {
            $('.section--related-products').hide();
          }
        });
    }

    if ( $('body').hasClass('product-template') || $('body').hasClass('cart-template') ) {
      if (typeof rehash_related_products !== 'undefined' && rehash_related_products.length) {
        displayRecommendedProducts(rehash_related_products);
      } else {
        var rec_product_json;

        if ( document.getElementById('product__json') ) {
          rec_product_json = JSON.parse(document.getElementById('product__json').innerHTML)
          getRecommendedProducts(rec_product_json.id);
        } else {
          rec_product_json = JSON.parse(document.getElementById('cart-item__json').innerHTML)
          getRecommendedProducts(rec_product_json.product_id);
        }
      }
    }
  });

  REBASE.theme.ProductListing = (function(){
    function ProductListing(options) {
      this.options = options;
      this.rowContainer = this._getRowContainer();
      this.navItems = this._getNavItems();
      this.singleWidth = this._getSingleWidth();
      this.itemCount = this._getItemCount();
      this.activeIndex = 0;
      this.lastScrollDistance = 0;

      // $(this.rowContainer).on('scroll', _.debounce(this._updateScrollDistance.bind(this), 300));
      $(this.rowContainer).on('scroll', this._updateScrollDistance.bind(this));
      $(window).on('resize', _.debounce(this._updateSingleWidth.bind(this), 300));
      $(this.navItems).on('click', this._handleClickNav.bind(this));
      this.scrollTo = this._scrollTo.bind(this);
      this._updateNav.apply(this);
    }

    ProductListing.prototype = $.extend({}, ProductListing.prototype, {
      _getRowContainer: function() {
        return this.options.container.find(this.options.rowClass);
      },
      _getNavItems: function() {
        return this.options.container.find(this.options.navClass)
      },
      _getSingleWidth: function() {
        return (this.rowContainer.find('.product-listing__item').width() + this.options.gutterWidth)
      },
      _getItemCount: function() {
        return this.rowContainer.find(this.options.itemClass).length;
      },
      _getNavDirection: function(el) {
        if ( typeof el.data('next') !== 'undefined' ) { return 'next'}
        if ( typeof el.data('prev') !== 'undefined' ) { return 'prev'}
      },
      _updateScrollDistance: function() {
        var els = this.rowContainer.find(this.options.itemClass),
          foundPositiveOffset = false;

        this.lastScrollDistance = this.rowContainer.scrollLeft();

        els.each(function(i, el) {
          if (foundPositiveOffset){return}
          if ( $(el).position().left >=0 ) {
            foundPositiveOffset = true;
            this.activeIndex = i;
          }
        }.bind(this));

        return this.lastScrollDistance;
      },
      _updateSingleWidth: function() {
        this.singleWidth = this._getSingleWidth();
        return this.singleWidth;
      },
      _scrollTo: function(left) {
        this.rowContainer.addClass('no-snap');
        this.rowContainer.stop().animate({scrollLeft: left}, 300, function() {
          this.rowContainer.removeClass('no-snap');
        }.bind(this));
        this._updateNav();
      },
      _updateNav: function() {
        this.navItems.each(function(i, el) {
          var $el = $(el);
          if ( this._getNavDirection($el) === 'next' ) {
            $el.toggleClass('visible', this.activeIndex <= (this.itemCount - this.options.perRow) );
          }
          if ( this._getNavDirection($el) === 'prev' ) {
            $el.toggleClass('visible', this.activeIndex >= 1)
          }
        }.bind(this));
      },
      _handleClickNav: function(e) {
        var target = $(e.currentTarget),
          scrollDistance = this.lastScrollDistance;

        if ( !target.hasClass('visible') ) {return}

        if ( this._getNavDirection(target) === 'next' ) {
          this.activeIndex = this.activeIndex >= this.itemCount ? this.itemCount - 1 : this.activeIndex + 1;
          scrollDistance = scrollDistance + this.singleWidth;
        }

        if ( this._getNavDirection(target) === 'prev' ) {
          this.activeIndex = this.activeIndex < 0 ? 0 : this.activeIndex - 1;
          scrollDistance = scrollDistance - this.singleWidth;
        }

        this._updateNav();
        this._scrollTo(scrollDistance);
      }
    });

    return ProductListing;
  })();

})(jQuery);
