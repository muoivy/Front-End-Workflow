! function() { // limit scope

	  // Variable
    var html = $('html'),
    		windowElm = $(window),
    		windowWidth = $(window).width();

		function Common() {
			this.ua = function() {
				var t = window.navigator.userAgent.toLowerCase();
				return -1 != t.indexOf("msie 10") ? "ie10" : -1 != t.indexOf("trident/7.0") ? "ie11" : -1 != t.indexOf("edge") ? "edge" : -1 != t.indexOf("chrome") ? "chrome" : -1 != t.indexOf("firefox") ? "firefox" : -1 != t.indexOf("safari") ? "safari" : -1 != t.indexOf("opera") ? "opera" : -1 != t.indexOf("gecko") ? "gecko" : ""
			},

			this.isMS = function() {
				return "ie10" == this.ua() || "ie11" == this.ua() || "edge" == this.ua()
			},

			this.touch = function() {
				var t = window.navigator.userAgent;
				return -1 != t.indexOf("iPhone") || -1 != t.indexOf("iPod") || -1 != t.indexOf("iPad") || -1 != t.indexOf("Android")
			}

			// Add Class
			this.ua() && html.addClass(this.ua()),
      "ie10" != this.ua() && "ie11" != this.ua() || html.addClass("isIE"),
      this.isMS() && html.addClass("isMS"),
      this.touch() || html.addClass("notouch")

		}
		var common = new Common();

    var _scope_ = null;

    var SmoothScroll = function() {

      $('a[href^=#]', _scope_).click(function() {
        var speed = 1000;
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;
        var header = $('.header-primary').innerHeight();

        if ($('body').width() < 768) {
        	var position = target.offset().top - header;
        }

        $('body,html').animate({ scrollTop: position }, speed, 'swing');
        return false;
      });
    }

		// スクロール禁止
		function no_scroll() {
		  // PCでのスクロール禁止
		  document.addEventListener('mousewheel', scroll_control, { passive: false });
		  // スマホでのタッチ操作でのスクロール禁止
		  document.addEventListener('touchmove', scroll_control, { passive: false });
		}
		// スクロール禁止解除
		function return_scroll() {
		  // PCでのスクロール禁止解除
		  document.removeEventListener('mousewheel', scroll_control, { passive: false });
		  // スマホでのタッチ操作でのスクロール禁止解除
		  document.removeEventListener('touchmove', scroll_control, { passive: false });
		}
		// スクロール関連メソッド
		function scroll_control(event) {
		  event.preventDefault();
		}

		$(function() {

		  window.addEventListener('orientationchange', function() {

		  });

		  window.addEventListener('resize', function() {
		    if ($('body').width() > 767) {
		      return_scroll();
		    }
		  });

		});

    $(function() {

    	// Background fixed in IE11
    	if(navigator.userAgent.match(/Trident\/7\./)) {
        document.body.addEventListener("mousewheel", function() {
          var e = window.event || e; // old IE support
          if(e.preventDefault) {
					  e.preventDefault();
					}
					else {
					  e.returnValue = false;
					}
          var wd = e.wheelDelta;
          var csp = window.pageYOffset;
          window.scrollTo(0, csp - wd);
        });
      }

      // Set background image
      // document.addEventListener('lazybeforeunveil', function(e){
      //   var bg = e.target.getAttribute('data-bg');
      //   if(bg){
      //       e.target.style.backgroundImage = 'url(' + bg + ')';
      //   }
      // });

      // $(function() {
      //   $('.header-hamburger').click(function() {
      //     $(this).toggleClass('active');

      //     if ($(this).hasClass('active')) {
      //         $('.header-nav').addClass('active');
      //     } else {
      //         $('.header-nav').removeClass('active');
      //     }
      //   });
      // });

      // $(function() {
      //   $('.header-menu a').click(function() {
      //     $('.header-hamburger').removeClass('active');
      //     $('.header-nav').removeClass('active');
      //   });
      // });

      SmoothScroll();

      // $('.top-voice__list .item-txt').matchHeight();


      //Accodion
      // $('.faq-ttl:first').addClass('active');
      // $('.faq-content:first').show();
      // $('.faq-ttl').click(function() {
      //   $(this).toggleClass('active');
      //   $(this).next().slideToggle();
      // });

      $(function() {

        var $slider = $('.faq-box__content');

        $slider.slick({
          autoplay: true,
          autoplaySpeed: 4000,
          infinite: true,
          arrows: true,
          dots: false,
          pauseOnFocus: false,
          pauseOnHover: false,
          pauseOnDotsHover: false,
          slidesToShow: 6,
          responsive: [
            {
              breakpoint: 768,      // 縲�767px
              settings: {
                slidesToShow: 4
              }
            }
          ],
          verticalSwiping: false,
          speed: 400
        });
        $slider.bind('touchend', function() {
          $slider.slick('slickPlay');
        });
      });


    });

    function inview() {
    	var offset = 0.95,
  		FADE = 'is-fade';

  		init();

  		function init() {
  			$('.inview').each(function() {
		      var $el = $(this);

		      if ($el.data('offset')) {
		        offset = $el.data('offset');
		      }

		      if ($el.data('transform-custom')) {
		        $el.css({
		          transform: $el.data('transform-custom'),
		        })
		      }

		      $('[data-transition-delay]').each(function() {
		        $(this).css({
		          'transition-delay': $(this).data('transition-delay') + 's',
		        })
		      });

		      checkReset($el, offset);
		      checkPos($el, offset, FADE);
    			addClass($el, offset, FADE);

		    });
  		}

		  function checkReset($elm, $offset) {
		    $(window).on('load', function() {
		      if (
		        $(window).scrollTop() > $elm.offset().top + $elm.outerHeight() ||
		        $(window).scrollTop() < $elm.offset().top - $(window).height() * $offset
		      ) {
		        if ($elm.data('reset')) {
		          $elm.css({
		            'transition-delay': $elm.data('reset') + 's',
		          })
		        }
		      }
		    })
		  }

		  function addClass($elm, $offset, CLASS) {
		    $(window).on('load scroll resize', function() {
		      checkPos($elm, $offset, CLASS);
		    })
		  }

		  function checkPos($elm, $offset, CLASS) {
		    if (
		    	$(window).scrollTop() >= Math.floor($elm.offset().top - $(window).height() * $offset) &&
		    	$(window).scrollTop() <= Math.floor( $elm.offset().top + $elm.outerHeight() - $(window).height() * (1 - $offset)) &&
		    	!$elm.hasClass(CLASS)) {
		    	setTimeout(function() {
		    		$elm.addClass(CLASS)
		    	}, 100)
		    }
		  }
    }

}();
