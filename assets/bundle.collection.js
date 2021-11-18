window.REBASE = window.REBASE || {};
REBASE.theme = REBASE.theme || {};
REBASE.theme.collection = REBASE.theme.collection || {};

(function(){
  function swymCallbackFn(swat) {
    $(document).on('variantChange', function(event) {
      $(".product-quickview .product__wishlist").attr('data-variant-id', event.variant.id)
      swat.initializeActionButtons(".product-quickview");
    });
  }
  if (!window.SwymCallbacks) {
    window.SwymCallbacks = [];
  }
  window.SwymCallbacks.push(swymCallbackFn);
})();


window.millyToggleQuickView = async function millyToggleQuickView({handle, index, id, variantId, callback}) {
  var remainder = index % 3,
    insertIndex = index,
    productData = null,
    variantMatch = null;

  try {
    productData = await fetch(`/products/${handle}.json`).then((resp) => resp.json());
    variantMatch = productData.product.variants.filter((variant) => variant.id === variantId || variant.sku === variantId.toString() );
  } catch(e) {
    console.error(e);
  }

  if ( variantMatch !== null && variantMatch.length > 0 ) {
    variantMatch = variantMatch[0];
  }

  // remove dom el and bail early if we have no handle
  // this acts as a safeguard against a bad call as well as
  // a method of 'closing' the quickview
  if ( typeof handle === 'undefined' ) {
    $('.product-quickview').remove();
    return false;
  }

  if ( remainder === 1 ) {
    insertIndex = index + 2;
  }

  if ( remainder === 2 ) {
    insertIndex = index + 1;
  }

  // remove old quick-view if it is still visible
  $('.product-quickview').remove();

  // get our new HTML
  fetch(`/products/${handle}?view=quickview&variant=${variantMatch.id}`).then((resp) => resp.text())
    .then((html) => {
      callback({success: true})
      if ( $('.products .product').length >= insertIndex ) { // if our index is viable, use it
        $(`.products .product:nth-child(${insertIndex})`).after(html);
        $('html, body').animate({scrollTop: $('.product-quickview').offset().top - 150 }, 10);
      } else { // otherwise append to end
        $('.products').append(html);
      }

      document.dispatchEvent(new CustomEvent("swym:collections-loaded"));

      if ( typeof nostojs !== 'undefined' ) {
        nostojs(function(api) {
          api.createRecommendationRequest()
            .addEvent('vp', id.toString())
            .addElements(['nosto-quick-view'])
            .loadRecommendations();
        });
      }

      new REBASE.theme.Product({
        $container: $('#add-to-cart-form'),
        quickView: true
      });

      if ( document.getElementById('product__json') ) {
        var productData = JSON.parse(document.getElementById('product__json').innerHTML)
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'ecommerce': {
              'detail': {
                'products': [{
                  'name': productData.title,
                  'id': productData.variants[0].sku,
                  'price': Shopify.formatMoney(productData.price).replace('$',''),
                  'brand': 'Milly',
                  'variant': $('input[name="single-option-select-1"]:checked').val() || ''
                }]
              }
          }
        });
      }
      var variantNew = JSON.parse(document.getElementById('variant__inv').innerHTML);
      var preOrder = false;
      for(var i = 0; i < variantNew.variants.length; i++){
        if(variantNew.variants[i].id == variantMatch.id){
          if(variantNew.variants[i].inv <= 0){
            preOrder = true;
          }
        }
      }

      if(preOrder){
        $('#add-to-cart-text').text('Pre-order');
      }
    
 
    })
    .catch((e) => {
      callback({success: false, error: e})
      console.error(e)
    })
};

(function($) {

  $(document).on('mouseenter click', '.product__swatch', function(e) {
    e.preventDefault();
    var swatch = $(this),
      data = swatch.data(),
      product_el = swatch.parents('.product');

    swatch.siblings().removeClass('product__swatch--selected');
    swatch.addClass('product__swatch--selected');

    if ( data.variantImage !== '' ) {
      product_el.find('.product__image--primary').attr('src', data.variantImage ).attr('data-src', data.variantImage );
    }
    if ( data.variantImageSecondary !== '' ) {
      product_el.find('.product__image--secondary').attr('src', data.variantImageSecondary ).attr('data-src', data.variantImageSecondary );
    }

    product_el.find('.product__price--current').text(data.variantPrice);
    product_el.find('.product__price--old').text(data.variantCompareAtPrice);
    product_el.toggleClass('product--on-sale', data.onSale)

    if ( data.variantUrl !== '' ) {
      product_el.find('.product__content a').attr('href', data.variantUrl);
    }
  });     
  


  $(document).on('click', '.product__quick-view-button', function(e) {
    var $el = $(this), data = this.dataset;

    $el.text('...');

    e.preventDefault();
    millyToggleQuickView({
      handle: data.productHandle,
      index: parseInt(data.productIndex),
      id: parseInt(data.productId),
      variantId: parseInt(data.variantId),
      callback: function(resp){
        $el.text('Quick View')
      }
    });
    

    
    
  });

})(jQuery);

