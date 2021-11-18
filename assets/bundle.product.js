window.REBASE = window.REBASE || {};
REBASE.theme = REBASE.theme || {};

(function($) {
  $(function() {
    REBASE.theme.IS_PRODUCT_TEMPLATE = $('body').hasClass('product-template');

    if ( REBASE.theme.IS_PRODUCT_TEMPLATE ){
      REBASE.theme.bindProductControls();
    }

    REBASE.theme.is_mobile = window.innerWidth < 1040;
    
        $(document).on('click', '.dropdown__option', function(e) {
      e.preventDefault();
//       debugger;
      $('.dropdown__option').removeClass('dropdown__option--selected');
      $(this).addClass('dropdown__option--selected');
      $('.dropdown__option input').prop('checked', false);
      if($(this).hasClass('available')){
        const $radios = $(this).children('input[type=radio]')
        if ($radios.is(':checked') === false) {
          $radios.prop('checked', true);
        }
        $('#add-to-cart').removeClass('disabled').removeAttr('disabled');
         $('#add-to-cart-text').text('Add To Bag');
      }else{
        $('#back-stock-limited p').hide();
      	 $('#add-to-cart').addClass('disabled').attr('disabled', 'disabled');
         $('#add-to-cart-text').text('Sold Out');
      }
      var swatches = JSON.parse(document.getElementById('variant__inv').innerHTML);
      var currentId = parseInt($(this).attr('id'));
      for(var i = 0; i < swatches.variants.length; i++){
        if(currentId == swatches.variants[i].id){
          if(swatches.variants[i].inv <= 4){
            if($(this).hasClass('dropdown__option--sold-out')){
            
            }else{
             $('#back-stock-limited p').show();

            }
          }else{
            $('#back-stock-limited p').hide();
          }
        }
      }     
          
          
    });

    $(document).on('click', '.swatch-element', function(e) {
      var cruntColor = $(this).children().val();
      var swatches = JSON.parse(document.getElementById('variant__inv').innerHTML);
      $('#swathes-load-id').empty();
      var currentColorList = [];
      for(var i = 0; i < swatches.variants.length; i++){
        var swatchesColor = swatches.variants[i].option1;
        var swatchesSize = swatches.variants[i].option2;

        if(cruntColor === swatchesColor.trim()){
          if(swatches.variants[i].inv > 0){
            currentColorList.push(`<div id="${swatches.variants[i].id}" data-varaint-id="${swatches.variants[i].id}" class="dropdown__option available" tabindex="0" data-label="0" data-position="2" data-value="${swatches.variants[i].option2}"><input type="radio" name="single-option-select-2" id="swatch-2-${swatches.variants[i].option2}" value="${swatches.variants[i].option2}" data-index="option2" class="single-option-select visually-hidden"><label for="swatch-2-${swatches.variants[i].option2}"><div>${swatches.variants[i].option2}</div></label></div>`);
          }else{
            currentColorList.push(`<div id="${swatches.variants[i].id}" data-varaint-id="${swatches.variants[i].id}" class="dropdown__option dropdown__option--sold-out" tabindex="0" data-label="0" data-position="2" data-value="${swatches.variants[i].option2}"><input type="radio" name="single-option-select-2" id="swatch-2-${swatches.variants[i].option2}" value="${swatches.variants[i].option2}" data-index="option2" class="single-option-select visually-hidden"><label for="swatch-2-${swatches.variants[i].option2}"><div>${swatches.variants[i].option2}</div></label></div>`);
          }

        }
      }
	
      

      $('#swathes-load-id').append(currentColorList);

      $('.dropdown__option.available').each(function(index, obj) {
        if (index === 0) {
          const $radios = $(`#${obj.id} input[type=radio]`);
          if ($radios.is(':checked') === false) {
            $radios.prop('checked', true);
          }
          var currentId = parseInt(obj.id);
      for(var i = 0; i < swatches.variants.length; i++){
        if(currentId == swatches.variants[i].id){
          if(swatches.variants[i].inv <= 4){
            $('#back-stock-limited p').show();
          }else{
            $('#back-stock-limited p').hide();
          }
        }
      }
        }


      });



    });


  });

  /* ----------------------------------------------------------------
  -------------------------------------------------------------------
  Setup Product page controls (needs to run on product pages and when quickview is opened)
  -------------------------------------------------------------------
  -----------------------------------------------------------------*/
  REBASE.theme.handleizeStr = function(str) {
    if ( str === null || typeof str === 'undefined' ){return ''}
    str = str.toLowerCase();

    // list of special characters we want to drop completely
    var toReplace = ['"', "'", "\\", "(", ")", "[", "]"];

    // For the old browsers
    for (var i = 0; i < toReplace.length; ++i) {
      str = str.replace(toReplace[i], "");
    }

    // all non-alphanumeric and non-underscore
    str = str.replace(/\W+/g, "-");

    // if last character is a hyphen, drop it
    if (str.charAt(str.length - 1) == "-") {
      str = str.replace(/-+\z/, "");
    }

    // if first character is a hyphen, drop it
    if (str.charAt(0) == "-") {
      str = str.replace(/\A-+/, "");
    }

    return str;
  }

  REBASE.theme.appendToFilename = function(filename, str) {
    var dot_indx = filename.lastIndexOf('.');

    if (dot_indx === -1) {
      return filename + str;
    } else {
      return filename.substring(0, dot_indx) + str + filename.substring(dot_indx);
    }
  };

  REBASE.theme.unbindProductControls = function() {
    $('.product-header__reviews, .product-info__tabs a').off('.rbProduct');
  };

  REBASE.theme.initProductGallery = function() {
    // Image Galleries
    REBASE.theme.product_photo_gallery = new Swiper('.gallery', {
      effect: 'slide',
      loop: true,
      speed: 300,
      slidesPerView: 1.75,
      centeredSlides: true,
      navigation: {
        nextEl: '.gallery-button__next',
        prevEl: '.gallery-button__prev'
      }
    });
  }

  // var lastWindowWidth = 0;
  // function toggleMobilePDPForm() {
  //   var willToggle = false,
  //     isMobile = window.innerWidth < 960;

  //   if ( window.innerWidth > 960 ) {
  //     if ( lastWindowWidth === 0 || lastWindowWidth < 960) {
  //       willToggle = true;
  //       lastWindowWidth = window.innerWidth;
  //     }
  //   } else {
  //     if ( lastWindowWidth === 0 || lastWindowWidth > 960) {
  //       willToggle = true;
  //       lastWindowWidth = window.innerWidth;
  //     }
  //   }

  //   if ( !willToggle ) {return false}

  //   if ( isMobile ) {
  //     var options = $('.product-option-row').detach();
  //     var button = $('.product-action__btn').detach();
  //     // var estimate = $('.shipping-estimate').detach();
  //     $('.mobile-product-form-actions').append(options);
  //     $('.mobile-product-form-actions').append(button);
  //     // $('.mobile-product-form-actions').append(estimate);
  //   } else {
  //     var options = $('.product-option-row').detach();
  //     var button = $('.product-action__btn').detach();
  //     // var estimate = $('.shipping-estimate').detach();
  //     $('.product-option-rows').append(options);
  //     $('.product-action').append(button);
  //     // $('.product-action').before(estimate);
  //   }
  // }

  // Removed on 2/23/21 by request of client - may re-enable after launch

  // Couple of methods on the Date object to help see if we are in DST or not
  // Date.prototype.stdTimezoneOffset = function() {
  //   var jan = new Date(this.getFullYear(), 0, 1);
  //   var jul = new Date(this.getFullYear(), 6, 1);
  //   return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  // }

  // Date.prototype.isDst = function() {
  //   return this.getTimezoneOffset() < this.stdTimezoneOffset();
  // }

  // function addShippingDays(days, date) {
  //   for ( let i = 0; i < days; i++ ) {
  //     date.setDate(date.getDate() + 1); // add one day per our loop

  //     // if we are now on a saturday, add 2 days to get to monday
  //     if ( date.getDay() == 6 ) {
  //       date.setDate(date.getDate() + 2);
  //     }

  //     // if we are now on a sunday, add 1 day to get to monday
  //     if ( date.getDay() == 0 ) {
  //       date.setDate(date.getDate() + 1);
  //     }
  //   }

  //   return date;
  // }

  // // get the local time based on the offset from global theme settings
  // function getCurrentLocalTime() {
  //   let date = new Date();
  //   let offset = (date.isDst() ? -4 : -5);
  //   let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  //   return new Date(utc + (3600000 * offset));
  // }

  // function setEstimatedDeliveryDate() {
  //   var container = $('.shipping-estimate'),
  //     currentTime = getCurrentLocalTime()  ,
  //     formattedDate;

  //   // add a day if we're past the cutoff time of 11am
  //   if ( currentTime.getHours() >= 10 ) {
  //     currentTime.setDate(currentTime.getDate() + 1);
  //   }

  //   // add our 5 days, skipping over weekends
  //   currentTime = addShippingDays(5, new Date(currentTime))

  //   // format it for display
  //   formattedDate = `${new Intl.DateTimeFormat('en-US', {month: 'long', day: 'numeric', year: 'numeric' }).format(currentTime)}`

  //   // display!
  //   container.find('span').text(formattedDate)
  //   container.removeClass('shipping-estimate--hidden')
  // }

  REBASE.theme.bindProductControls = function() {
    $(document).on('click', '.product-qty__minus', function(e) {
      e.preventDefault();
      var el = $('#quantity'),
          newValue = parseInt(el.val()) - 1;
      if ( newValue >= 1 ) {
        el.val(newValue);
      }
    });

    $(document).on('click', '.product-qty__plus', function(e) {
      e.preventDefault();
      var el = $('#quantity');
      el.val(parseInt(el.val()) + 1);
    });


    // Image Galleries
    REBASE.theme.initProductGallery();

    // toggleMobilePDPForm();
    // $(window).on('resize', toggleMobilePDPForm)

    // setEstimatedDeliveryDate();

    // Option Selectors & Swatches
    // NOTE: must come after image gallery (for selected variant to show correct image when loading page)
    product = new REBASE.theme.Product({
      $container: $('#add-to-cart-form')
    });
  };

  /* ----------------------------------------------------------------
  -------------------------------------------------------------------
  Product class
  -------------------------------------------------------------------
  -----------------------------------------------------------------*/

  REBASE.theme.Product = (function() {
    function Product(options) {
      var inputs, input_type;

      this.variants = null;
      this.$container = options.$container;
      this.data = JSON.parse(document.getElementById('product__json').innerHTML);
      this.dataNew = JSON.parse(document.getElementById('variant__inv').innerHTML);
      this.images = this.data.images;
      this.media = this.data.media;
      this.quickView = options.quickView || false;

      this.settings = {
        single_option_selector: '.single-option-select',
        original_select_id: 'select#product-select'
      };

      if (this.data) {
        this._initVariants();

        // Trigger change to sync up images, etc on initial page load
        inputs = $(this.settings.single_option_selector, this.$container);
        input_type = inputs.first().attr('type');

        if (input_type === 'radio' || input_type === 'checkbox') {
          inputs.filter(':checked:first').trigger('change');
        } else {
          inputs.first().trigger('change');
        }
      } else {
        if (console) {console.log('Missing product json data!');}
      }
    }

    Product.prototype = $.extend({}, Product.prototype, {
      _initVariants: function() {
        var options = {
          $container: this.$container,
          enable_history_state: !this.quickView,
          single_option_selector: this.settings.single_option_selector,
          original_select_id: this.settings.original_select_id,
          product: this.data,
          quickView: this.quickView || false
        };

        this.variants = new REBASE.theme.Variants(options);

        this.$container.on('variantChange', this._updateAddToCart.bind(this));
        this.$container.on('variantPriceChange', this._updatePrice.bind(this));
        this.$container.on('variantChange', this._updateColorLabel.bind(this));

        // images for quickview are a bit different, so handle them differently
        if ( this.quickView === true ) {
          this.$container.on('variantChange', this._updateQuickViewDetailsLink.bind(this));
          this.$container.on('variantImageChange', this._updateQuickViewMedia.bind(this));
          
           setTimeout(function(){ 
              $('.dropdown__option.available').each(function(index, obj) {
                  if (index === 0) {
                    $('.dropdown__option').removeClass('dropdown__option--selected');
      				$(this).addClass('dropdown__option--selected');
                    const $radios = $(`#${obj.id} input[type=radio]`);
                    if ($radios.is(':checked') === false) {
                      $radios.prop('checked', true);
                      $('#add-to-cart').removeClass('disabled').removeAttr('disabled');
              		$('#add-to-cart').text('Add To Bag');
                    }
                  }
              });
          }, 800);
          
        } else {
          this.$container.on('variantImageChange', this._updateMedia.bind(this));
        }
      },

      _updateColorLabel: function(e) {
        $('#option-name--option1 span').text(e.variant.option1);
      },

      _updatePrice: function(e) {
        var variant = e.variant;

        $('.product-price:not(.product-price--old)').html(Shopify.formatMoney(variant.price, ''));
        if ( variant.price < variant.compare_at_price ) {
          $('.product-price--old').html(Shopify.formatMoney(variant.compare_at_price, ''));
          $('.product-price:not(.product-price--old)').addClass('product-price--on-sale');
          $('.product__final-sale').addClass('visible');
        } else {
          $('.product-price--old').html('');
          $('.product-price:not(.product-price--old)').removeClass('product-price--on-sale');
          $('.product__final-sale').removeClass('visible');
        }
      },

      _updateAddToCart: function(e) {
        var variant = e.variant,
            all_variants_match_option1 = e.all_variants_match_option1,
            target = $(e.target),
            input_type = target.attr('type'),
            btn = $('#add-to-cart'),
            btn_txt = $('#add-to-cart-text'),
            variantNew = this.dataNew,
            tags = this.data.tags;

        if (!variant) {
          btn.addClass('disabled').attr('disabled', 'disabled');
          btn_txt.text('Not Available');
        } else {
          if (variant.available) {

              btn.removeClass('disabled').removeAttr('disabled');
              btn_txt.text(btn_txt.data('add-to-cart-text'));
          } else {
            btn.addClass('disabled').attr('disabled', 'disabled');
            btn_txt.text(btn_txt.data('sold-out-text'));
          }
        }

        if (input_type === 'radio' || input_type === 'checkbox') {
          target.parent('.swatch-element').addClass('selected-swatch').siblings().removeClass('selected-swatch');

          // MODDED FOR SWATCH AVAILABILITY (only one level deep, option2)
          var option2_inputs = $('input[data-index="option2"]'),
              option2_vals = option2_inputs.map(function() {return $(this).val();}).get(),
              option2_not_available = $.map(option2_vals, function(option_val) {
                var is_available = false;
                option2_inputs.parent('.dropdown__option').addClass('available');
                $.each(all_variants_match_option1, function(i, match_variant) {
                  if (match_variant.option2 === option_val) {
                    if (match_variant.available) {
                      is_available = true;
                    }
                  }
                });

                if (is_available) {
                  return undefined;
                } else {
                  return option_val;
                }
              });

          option2_inputs.parent('.swatch-element').removeClass('swatch--unavailable');
          option2_inputs.parent('.dropdown__option').removeClass('dropdown__option--sold-out').find('.dropdown__option-label span').remove();
          option2_inputs.parent('.dropdown__option').find('.dropdown__option-label').removeClass('back-in-stock-trigger');

          $.each(option2_not_available, function(indx, option_val) {
            option2_inputs.each(function() {
              var current_option_input = $(this);

              if (current_option_input.val() === option_val) {
                current_option_input.parent('.dropdown__option').removeClass('available');
                current_option_input.parent('.swatch-element').addClass('swatch--unavailable');
                current_option_input.parent('.dropdown__option').addClass('dropdown__option--sold-out');
                current_option_input.parent('.dropdown__option').find('.dropdown__option-label').append('<span>Sold Out </span>')
                if ( !tags.includes('final-sale:1') ) {
                  current_option_input.parent('.dropdown__option').find('.dropdown__option-label').addClass('back-in-stock-trigger');
                  current_option_input.parent('.dropdown__option').find('.dropdown__option-label').append('<span>Notify Me When Available</span>');
                }
              }
            });
          });
        }
        
        $('.dropdown__option.available').each(function(index, obj) {
          if (index === 0) {
             const $radios = $(`#${obj.id} input[type=radio]`);
              if ($radios.is(':checked') === false) {
                $radios.prop('checked', true);
              }
             btn.removeClass('disabled').removeAttr('disabled');
             btn_txt.text(btn_txt.data('add-to-cart-text'));
//             if($(`#${obj.id}.dropdown__option`).hasClass('dropdown__option--sold-out')){
//             const availableId =  $('.dropdown__option').next('.dropdown__option.available').first().attr('id');
//               const $radios = $(`#${availableId} input[type=radio]`);
//               if ($radios.is(':checked') === false) {
//                 $radios.prop('checked', true);
//                 $(`#${availableId}.dropdown__option.available`).addClass('dropdown__option--selected');
                
//                 btn.removeClass('disabled').removeAttr('disabled');
//               	btn_txt.text(btn_txt.data('add-to-cart-text'));
//               }
//             }
            
          }


        });
      },

      _buildImgUrl: function(src, size) {
        // set a sensible default
        var replaceSize = size || '900x';

        // remove version parameter if exists
        src = src.split('?')[0];

        // get index of file extension so we can insert size before
        var ext_index = src.match(/(\.[\w\d_-]+)$/i).index;

        // return our rebuilt src url
        return src.slice(0, ext_index) + '_' + replaceSize + src.slice(ext_index);
      },

      _buildImage: function(media) {
        var div = document.createElement('div');
        var link = document.createElement('a');
        var img = document.createElement('img');

        link.href = this._buildImgUrl(media.src, '3000x');
        link.classList.add('MagicZoom');

        img.src = this._buildImgUrl(media.src, '900x');
        img.srcset = this._buildImgUrl(media.src, '900x') + ' 1x, ' + this._buildImgUrl( media.src, '1800x') + ' 2x';

        div.classList.add('swiper-slide');

        link.appendChild(img);
        div.appendChild(link);
        return div;
      },

      _buildVideo: function(media) {
        var figure = document.createElement('figure');
        var video = document.createElement('video');

        video.playsinline = true;
        video.controls = true;
        video.poster = media.preview_image.src;

        media.sources.forEach(function(src){
          var source = document.createElement('source');
          source.src = src.url;
          source.type = src.mime_type;
          video.appendChild(source);
        });

        figure.classList.add('swiper-slide');

        figure.appendChild(video);
        return figure;
      },

      _buildExternalVideo: function(media) {
        var figure = document.createElement('figure'),
            container = document.createElement('div'),
            iframe = document.createElement('iframe');

        figure.classList.add('swiper-slide');
        container.classList.add('gallery-video-container');
        iframe.title = media.alt ? media.alt : this.data.title;
        iframe.allowfullscreen = 'allowfullscreen';
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.frameborder = '0';
        iframe.src = 'https://www.youtube.com/embed/' + media.external_id + '?controls=1&amp;enablejsapi=1&amp;modestbranding=1&amp;playsinline=1&amp;rel=0';

        container.appendChild(iframe);
        figure.appendChild(container);
        return figure;
      },

      _getMediaEl: function(media) {
        var el = null;

        switch(media.media_type) {
          case 'image':
            el = this._buildImage(media);
            break;
          case 'video':
            el = this._buildVideo(media);
            break;
          case 'external_video':
            el = this._buildExternalVideo(media);
            break;
        }

        return el;
      },
      _updateMedia: function(e) {
        var variant = e.variant,
            swiper_el = $('.product__part--gallery'),
            swiper_container = swiper_el.find('.swiper-container .swiper-wrapper');

        variant_media = this.data.media.filter( function(media) {
          var split_filename = media.src.match(/([^/]+\.(jpg|png))/gi)[0].split('_');

          return REBASE.theme.handleizeStr(split_filename[split_filename.length-2]).replace('-', "") === REBASE.theme.handleizeStr(variant.option1).replace('-', "") ||
            REBASE.theme.handleizeStr(split_filename[split_filename.length-2]).replace('-', "") === REBASE.theme.handleizeStr(variant.option2).replace('-', "") ||
            REBASE.theme.handleizeStr(split_filename[split_filename.length-2]).replace('-', "") === REBASE.theme.handleizeStr(variant.option3).replace('-', "");
        });

        swiper_container.fadeOut(200, function() {
          swiper_container.empty();
          variant_media.forEach(function(v) {
            swiper_container.append(this._getMediaEl(v));
          }.bind(this));

          REBASE.theme.product_photo_gallery.destroy();
          REBASE.theme.initProductGallery();

          setTimeout(function() {
            swiper_el.addClass('visible');
            swiper_container.addClass('visible');
            swiper_container.fadeIn(200);
            MagicZoom.refresh();
          })
        }.bind(this));
      },

      _updateQuickViewMedia: function(e) {
        var variant = e.variant,
            variant_media,
            thumbs_container = $('.product-quickview__thumbs'),
            main_container = $('.product-quickview__image');

        variant_media = this.data.media.filter( function(media) {
          var split_filename = media.src.match(/([^/]+\.(jpg|png))/gi)[0].split('_');

          return REBASE.theme.handleizeStr(split_filename[split_filename.length-2]).replace('-', "") === REBASE.theme.handleizeStr(variant.option1).replace('-', "") ||
            REBASE.theme.handleizeStr(split_filename[split_filename.length-2]).replace('-', "") === REBASE.theme.handleizeStr(variant.option2).replace('-', "") ||
            REBASE.theme.handleizeStr(split_filename[split_filename.length-2]).replace('-', "") === REBASE.theme.handleizeStr(variant.option3).replace('-', "");
        });

        thumbs_container.empty();
        main_container.empty();

        variant_media.forEach(function(media, index){
          if ( media.media_type == 'image' ) {
            thumbs_container.append('<a href="#" data-src="' + Shopify.resizeImage(media.src, '1600x') + '"><img src="' + Shopify.resizeImage(media.src, '800x') + '" alt="' + media.alt + ' Image ' + index + '" /></a>');
          }
        });

        main_container.html('<img src="' + Shopify.resizeImage(variant_media[0].src, '1600x') + '" alt="' + variant_media[0].alt + '" />');
      },

      _updateQuickViewDetailsLink: function (e) {
        var details_btn = $('.view-details-btn', this.$container),
            existing_link = details_btn.attr('href'),
            new_link = existing_link.split('?')[0] + '?variant=' + e.variant.id;

        details_btn.attr('href', new_link);
//         $('.dropdown__option.available').each(function(index, obj) {
//           if (index === 0) {
//             const $radios = $(`#${obj.id} input[type=radio]`);
//             if ($radios.is(':checked') === false) {
//               $radios.prop('checked', true);
//             }
//           }


//         });


      }
    });

    return Product;
  })();

  /* ----------------------------------------------------------------
  -------------------------------------------------------------------
  Product Variants class - based on Shopify debut
  -------------------------------------------------------------------
  -----------------------------------------------------------------*/

  REBASE.theme.Variants = (function() {
    function Variants(options) {
      this.$container = options.$container;
      this.product = options.product;
      this.single_option_selector = options.single_option_selector;
      this.original_select_id = options.original_select_id;
      this.enable_history_state = options.enable_history_state;
      this.current_variant = {};
      this.quickView = options.quickView;

      $(this.single_option_selector, this.$container).on('change', this._onSelectChange.bind(this));
    }

    Variants.prototype = $.extend({}, Variants.prototype, {
      /**
       * Get the currently selected options from add-to-cart form. Works with all
       * form input elements.
       *
       * @return {array} options - Values of currently selected variants
       */
      _getCurrentOptions: function() {
        var should_filter = false,
            the_options = $.map($(this.single_option_selector, this.$container), function(element) {
              var $element = $(element),
                  type = $element.attr('type'),
                  current_option = {};

              if (type === 'radio' || type === 'checkbox') {
                should_filter = true;

                if ($element[0].checked) {
                  current_option.value = $element.val();
                  current_option.index = $element.data('index');
                  return current_option;
                } else {
                  return false;
                }
              } else {
                current_option.value = $element.val();
                current_option.index = $element.data('index');
                return current_option;
              }
            });

        // Remove any unchecked input values if using radio buttons or checkboxes
        // Removes all falsy values (Boolean constructor is a function, if the value is omitted or is 0, -0, null, false, NaN, undefined, or the empty string ("") then it will get removed)
        if (should_filter) {
          the_options = the_options.filter(Boolean);
        }

        return the_options;
      },

      /**
       * Find variant based on selected values.
       *
       * @param  {array} selected_values - Values of variant inputs
       * @return {object || undefined} found - Variant object from product.variants
       */
      _getVariantFromOptions: function() {
        var selected_values = this._getCurrentOptions(),
            variants = this.product.variants,
            all_variants_match_option1,
            found;

        found = $.grep(variants, function(variant) {
          return selected_values.every(function(values) {
            return variant[values.index] === values.value;
          });
        });

        all_variants_match_option1 = $.grep(variants, function(variant) {
          return variant[selected_values[0].index] === selected_values[0].value;
        });

        if (found.length) {
          found = found[0];
        } else {
          found = undefined;
        }

        return {
          variant_match: found,
          all_variants_match_option1: all_variants_match_option1
        };
      },

      /**
       * Event handler for when a variant input changes.
       */
      _onSelectChange: function(e) {
        var variant_from_options = this._getVariantFromOptions(),
            variant;

        variant = variant_from_options.variant_match;

        this.$container.trigger({
          type: 'variantChange',
          variant: variant,
          all_variants_match_option1: variant_from_options.all_variants_match_option1,
          target: e.target
        });

        if (!variant) {
          this.current_variant = {};
          return;
        }

        // trigger an extra event on the document for wishlist plus to listen to
        if ( this.quickView ) {
          $(document).trigger({
            type: 'variantChange',
            variant: variant
          });
        }

        this._updateMasterSelect(variant);
        this._updateImages(variant);
        this._updatePrice(variant);
        this._updateSKU(variant);
        this.current_variant = variant;

        if (this.enable_history_state) {
          this._updateHistoryState(variant);
        }
      },

      /**
       * Trigger event when variant image changes
       *
       * @param  {object} variant - Currently selected variant
       * @return {event}  variantImageChange
       */
      _updateImages: function(variant) {
        var variant_image = variant.featured_image || {},
            current_variant_image = this.current_variant.featured_image || {};

        if (!variant.featured_image || variant_image.src === current_variant_image.src) {return;}

        this.$container.trigger({
          type: 'variantImageChange',
          variant: variant
        });
      },

      /**
       * Trigger event when variant price changes.
       *
       * @param  {object} variant - Currently selected variant
       * @return {event} variantPriceChange
       */
      _updatePrice: function(variant) {
        if (variant.price === this.current_variant.price && variant.compare_at_price === this.current_variant.compare_at_price) {return;}

        this.$container.trigger({
          type: 'variantPriceChange',
          variant: variant
        });
      },

      /**
       * Trigger event when variant sku changes.
       *
       * @param  {object} variant - Currently selected variant
       * @return {event} variantSKUChange
       */
      _updateSKU: function(variant) {
        if (variant.sku === this.current_variant.sku) {return;}

        this.$container.trigger({
          type: 'variantSKUChange',
          variant: variant
        });
      },

      /**
       * Update history state for product deeplinking
       *
       * @param  {variant} variant - Currently selected variant
       * @return {k}         [description]
       */
      _updateHistoryState: function(variant) {
        if (!history.replaceState || !variant) {return;}
        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
//         window.history.replaceState({ path: newurl }, '', newurl);
      },

      /**
       * Update hidden master select of variant change
       *
       * @param  {variant} variant - Currently selected variant
       */
      _updateMasterSelect: function(variant) {
        $(this.original_select_id, this.$container).val(variant.id).data('selected-variant-id', variant.id);
        $('#product-supplier-style').text($('option:selected', this.original_select_id, this.$container).data('variant-ss'));
      }
    });

    return Variants;
  })();
})(jQuery);
