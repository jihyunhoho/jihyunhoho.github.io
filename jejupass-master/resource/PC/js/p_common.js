(function($, window) {
  // project default object
  var common = {
    Swiper: null,
    el    : {
      doc : $(document),
      win : $(window),
      body: null
    },
    selector: {
      body        : 'body',
      html        : 'html',
      bh          : 'body, html',
      wrapper     : '#wrapper',
      header      : '#wrapper > header',
      footer      : 'footer',
      swiperWrap  : '.swiperWrap',
      scriptScroll: '.scriptScroll',
      popupBtn    : '.layPopBtn',
      tab         : '[class^="tabType"]',
      accordion   : '.toggleList, #snbList',
      datepicker  : '.multiCalendar',
      dimmed      : '.dimmed',
      floatingCon : '#filterWrap',
      slider      : '.slider',
      sortable    : '.ui-sortable',
      tabAhcnor   : '#tabAhcnor',
      tooltip     : '.btnTool,aside .btNoti'
    },
    setting: {
      device : null,
      browser: null
    },
    handler: {
      ready: function() {
        common.el.body = $(common.selector.body);
        common.Swiper = window.Swiper;

        var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
        var device = null;
        var browser = null;
        //모바일 환경 체크
        if (varUA.indexOf('android') > -1) {
          device = 'android';
        } else if (
          varUA.indexOf('iphone') > -1 ||
          varUA.indexOf('ipad') > -1 ||
          varUA.indexOf('ipod') > -1
        ) {
          device = 'ios';
        } else {
          device = 'other';
        }
        common.setting.device = device;
        // 브라우저 체크
        if (varUA.indexOf('chrome') !== -1 || varUA.indexOf('crios') !== -1) {
          browser = 'Chrome';
        } else if (varUA.indexOf('opera') !== -1) {
          browser = 'Opera';
        } else if (varUA.indexOf('firefox') !== -1) {
          browser = 'Firefox';
        } else if (varUA.indexOf('safari') !== -1) {
          browser = 'Safari';
        }
        common.setting.browser = browser;

        // 디자인 스크롤로 인한 추가
        var oldSelf = $.fn.andSelf || $.fn.addBack;
        $.fn.andSelf = function() {
          return oldSelf.apply(this, arguments);
        };

        //디자인 스크롤
        common.el.doc
          .find(common.selector.scriptScroll)
          .each(function(idx, el) {
            myScroll.init(el);
          });

        //스와이프
        common.el.doc.find(common.selector.swiperWrap).each(function(idx, el) {
          mySwiper.init(el);
        });

        //팝업
        common.el.doc.find(common.selector.popupBtn).each(function(idx, el) {
          popup.init(el);
        });

        //헤더 영역
        common.el.doc.find(common.selector.header).each(function(idx, el) {
          header.init(el);
        });

        //탭
        common.el.doc.find(common.selector.tab).each(function(idx, el) {
          tab.init(el);
        });

        //아코디언
        common.el.doc.find(common.selector.accordion).each(function(idx, el) {
          accordion.init(el);
        });

        //플로팅 컨텐츠
        common.el.doc
          .find(common.selector.floatingCon)
          .each(function(idx, el) {
            floating.init(el);
          });

        //툴팁
        common.el.doc.find(common.selector.tooltip).each(function(idx, el) {
          tooltip.init(el);
        });

        //빠른정렬 선택
        common.el.doc.find(common.selector.tabAhcnor).each(function(idx, el) {
          tabAhcnor.init(el);
        });

        //달력
        common.el.doc.find(common.selector.datepicker).each(function(idx, el) {
          datepicker.init(el);
        });

        //슬라이더
        common.el.doc.find(common.selector.slider).each(function(idx, el) {
          slider.init(el);
        });

        //정렬
        common.el.doc.find(common.selector.sortable).each(function(idx, el) {
          sortable.init(el);
        });

        //기타
        etc.init();

        common.el.win.trigger('scroll');
        common.el.win.trigger('resize');
      },
      load: function() {}
    }
  };

  // window ready event
  // $(document).on('DOMContentLoaded', common.handler.ready);
  common.el.doc.ready(common.handler.ready);

  // window load event
  // string: single quotation
  common.el.win.on('load', common.handler.load);
  // common.el.win.load(common.handler.load);

  // 유틸
  var utils = {
    //스크롤 비활성화
    scrollDisabled: function() {
      var body = common.el.body;
      body.css({
        overflow : 'hidden',
        position : 'fixed',
        height   : '100%',
        width    : '100%',
        marginTop:
          parseInt(body.css('margin-top')) || -common.el.win.scrollTop()
      });
    },
    //스크롤 활성화
    scrollEnabled: function() {
      var body = common.el.body;
      var scrollTop = -parseInt(body.css('margin-top'));
      body.css({
        overflow : '',
        position : '',
        height   : '',
        width    : '',
        marginTop: ''
      });
      common.el.win.scrollTop(scrollTop);
    },
    //딤 show
    dimmedShow: function() {
      var dimmed = $(common.selector.dimmed).not(
        $('.laySearch').find('.dimmed')
      );
      var maxIndex = 0;
      dimmed.css('transition', 'auto');
      common.el.doc.find('.layPop:visible').each(function() {
        var $this = $(this);
        var zIndex = parseInt($this.css('z-index'));
        maxIndex = maxIndex < zIndex ? zIndex : maxIndex;
      });
      if (dimmed.is(':visible')) {
        dimmed.css('z-index', maxIndex - 1);
        dimmed.addClass('depth2');
      } else {
        dimmed.show().stop().animate({ opacity: 1 }, 500);
      }
    },
    //딤 hide
    dimmedHide: function() {
      var dimmed = $(common.selector.dimmed).not(
        $('.laySearch').find('.dimmed')
      );
      dimmed.css('transition', 'auto');
      if (dimmed.hasClass('depth2')) {
        dimmed.removeClass('depth2').css('z-index', '');
      } else {
        dimmed.stop().animate({ opacity: 0 }, 500, function() {
          dimmed.hide();
        });
      }
    }
  };

  //스와이프
  var mySwiper = {
    swiper: null,
    el    : {
      swiperWrap: null,
      container : null,
      wrapper   : null,
      cont      : null,
      prevBtn   : null,
      nextBtn   : null,
      pagination: null,
      paging    : null
    },
    methodes: {
      init: function() {
        //기본 옵션
        var options = {
          allowTouchMove: true,
          loop          : false,
          autoplay      : false,
          spaceBetween  : 0,
          navigation    : false,
          pagination    : false,
          observer      : true,
          direction     : 'horizontal',
          freeMode      : false,
          centeredSlides: false,
          slidesPerView : 1,
          effect        : 'slide',
          on            : {}
        };
        var optionData = mySwiper.el.swiperWrap.data('options') || {};
        var container = mySwiper.el.container;
        var pagination = mySwiper.el.pagination;
        var defaultPaging = '';

        //내부 스와이퍼
        if (mySwiper.el.swiperWrap.hasClass('innerSwiper')) {
          options.nested = true;
        }

        pagination.find('.swiperMore').each(function() {
          var $this = $(this);
          defaultPaging += $this[0].outerHTML;
          $this.remove();
        });

        // 터치 이동 허용/불가
        if (optionData.touchMove) {
          options.allowTouchMove = optionData.touchMove;
        }

        //루프
        if (optionData.loop) {
          options.loop = true;
        }

        //간격
        if (optionData.Spacebetween > 0) {
          options.spaceBetween = optionData.Spacebetween;
        }

        //오토플레이
        if (optionData.autoplay > 0) {
          options.autoplay = {
            delay               : optionData.autoplay,
            disableOnInteraction: false
          };

          //마우스 오버 시 오토 멈춤
          container
            .closest('.swiperWrap')
            .off('mouseenter mouseleave')
            .on('mouseenter mouseleave', function(e) {
              var data = container.data('swiper');
              if (e.type === 'mouseenter') {
                data.autoplay.stop();
              } else {
                var playBtn = pagination.find('.btPlay');

                if (playBtn.is(':visible')) {
                  return false;
                }
                data.autoplay.start();
              }
            });

          pagination
            .find('.btAutoplays')
            .children()
            .each(function() {
              var $this = $(this);
              $this.off('click').on('click', function() {
                var $this = $(this);
                var data = container.data('swiper');
                $this.hide().siblings('button').show();
                if ($this.hasClass('btStop')) {
                  data.autoplay.stop();
                } else {
                  data.autoplay.start();
                }
              });
            });
        }

        //버튼
        if (mySwiper.el.prevBtn.length > 0) {
          options.navigation = {
            nextEl: container.next('.swiper-button-next')[0],
            prevEl: container.prev('.swiper-button-prev')[0]
          };
        }

        //페이지네이션
        if (optionData.pagination === 'all') {
          // 두 타입 모두
          options.pagination = {
            el          : pagination,
            type        : 'custom',
            renderCustom: function(swiper, current, total) {
              // 기호
              if (this.el.find('.tyBl').length === 0) {
                this.el.prepend('<span class="tyBl"></span>');
              }
              var bl = '';
              for (var i = 1; i <= total; i++) {
                if (current === i) {
                  bl +=
                    '<span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span>';
                } else {
                  bl += '<span class="swiper-pagination-bullet"></span>';
                }
              }
              this.el.find('.tyBl').html(bl);

              // 숫자
              if (this.el.find('.tyNum').length === 0) {
                this.el.append('<div class="tyNum"></div>');
              }
              var num =
                '<div class="swiper-paging"><div class="paging"><span class="swiper-pagination-current">' +
                current +
                '</span>/<span class="swiper-pagination-total">' +
                total;

              if (defaultPaging !== '') {
                num += '</span></div>' + defaultPaging + '</div>';
              }
              num += '</span></div>';
              this.el.find('.tyNum').html(num);

              return;
            }
          };
        } else if (optionData.pagination === 'fraction') {
          // 숫자
          options.pagination = {
            el          : pagination,
            type        : 'custom',
            renderCustom: function(swiper, current, total) {
              if (this.el.find('.tyNum').length === 0) {
                this.el.append('<div class="tyNum"></div>');
              }

              var num =
                '<div class="swiper-paging"><div class="paging"><span class="swiper-pagination-current">' +
                current +
                '</span>/<span class="swiper-pagination-total">' +
                total;

              if (defaultPaging !== '') {
                num += '</span></div>' + defaultPaging + '</div>';
              }
              num += '</span></div>';
              this.el.find('.tyNum').html(num);
              return;
            }
          };
        } else if (pagination.length > 0) {
          // 기호
          options.pagination = {
            el          : pagination,
            type        : 'custom',
            renderCustom: function(swiper, current, total) {
              // 기호
              if (this.el.find('.tyBl').length === 0) {
                this.el.prepend('<span class="tyBl"></span>');
              }
              var bl = '';
              for (var i = 1; i <= total; i++) {
                if (current === i) {
                  bl +=
                    '<span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span>';
                } else {
                  bl += '<span class="swiper-pagination-bullet"></span>';
                }
              }
              this.el.find('.tyBl').html(bl);
              return;
            }
          };
        }

        // 몇개씩 보일지
        if (optionData.view !== undefined) {
          options.slidesPerView = optionData.view;
        }
        // 몇개씩 움직일지
        if (optionData.group > 0) {
          options.slidesPerGroup = optionData.group;
        }
        //가로,세로 방향
        if (optionData.vertical) {
          options.direction = 'vertical';
        }

        //모드(이펙트)
        if (optionData.mode) {
          options.effect = optionData.mode;
        }

        // 유사 스크롤 모드
        if (optionData.free) {
          options.freeMode = {
            enabled      : optionData.free,
            momentumRatio: 0.2,
            sticky       : true
          };
          //스냅 활성화
          if (optionData.freeSticky) {
            options.freeMode.sticky = optionData.freeSticky;
          }
        }

        if (optionData.centeredSlides) {
          options.centeredSlides = true;
        }

        //섬네일
        if (mySwiper.el.swiperWrap.hasClass('swiperThumb')) {
          options.watchSlidesProgress = true;
          options.freeMode = true;
        }

        if (container.data('swiper') !== undefined) {
          container.data('swiper').destroy();
        }
        var swiper = new common.Swiper(container, options);
        container.data('swiper', swiper);

        //섬네일 연동 스와이프
        if (mySwiper.el.swiperWrap.hasClass('swiperThumb')) {
          var wrap = mySwiper.el.swiperWrap;
          var nextCon = wrap
            .prev()
            .children('.swiper-container')
            .data('swiper');
          nextCon.thumbs.swiper = swiper;
          nextCon.thumbs.init();
          nextCon.thumbs.update(0);
        }

        // if (container.closest('.themeViewArea').length) {
        //   swiper.allowTouchMove = false;
        // }
      },
      swiperUpdate: function(target) {
        target.find('.swiper-container').each(function() {
          var $this = $(this);
          var sData = $this.data('swiper');
          sData.update();
        });
      },
      tabScrollSwiper: function(target) {
        if (target.data('swiper') !== undefined) {
          target.data('swiper').update();
        }
        target.closest('.tabScript').each(function() {
          var $this = $(this);
          $this.find('>ul>li').addClass('swiper-slide');
          var mySwiper = new Swiper($this, {
            wrapperClass : $this.children('ul')[0].classList[0],
            slidesPerView: 'auto',
            freeMode     : {
              enabled: true
            },
            CenteredSlidesBounds: true,
            SlideToClickedSlide : true,
            // spaceBetween        : 8,
            on                  : {
              setTranslate: tab.handler.scroll,
              init        : function() {
                var swiper = this;
                setTimeout(function() {
                  swiper.update();
                }, 100);
              }
            }
          });
          target.data('swiper', mySwiper);
        });
      }
    },
    handler    : {},
    setProperty: function(el) {
      this.el.swiperWrap = el;
      this.el.container = el.children('.swiper-container');
      this.el.wrapper = this.el.container.children('.swiper-wrapper');
      this.el.cont = this.el.wrapper.children('.swiper-slide');
      this.el.prevBtn = this.el.container.siblings('.swiper-button-prev');
      this.el.nextBtn = this.el.container.siblings('.swiper-button-next');
      this.el.pagination = this.el.container.siblings('.swiper-pagination');
      this.el.paging = this.el.container.siblings('.swiper-paging');

      this.methodes.init();
    },
    bind: function() {},
    init: function(el) {
      this.setProperty($(el));
    }
  };

  //디자인 스크롤
  var myScroll = {
    el: {
      target: null
    },
    selector: {},
    methodes: {
      init: function(target) {
        var el = target || myScroll.el.target;
        var classList = el.attr('class').split(' ');
        el.scrollbar({
          onInit: function(con) {
            classList.forEach(function(val) {
              con.removeClass(val);
            });

            if (con.closest('#filterWrap').length > 0) {
              con.closest('.scriptScroll').css('height', '100%');
            }
          }
        });
        el.css('overflow', 'hidden');
      },
      destroy: function(target) {
        var child = target.children();
        target.children().scrollbar('destroy');
        child.closest('div').addClass('scriptScroll').css('height', '100%');
      }
    },
    handler    : {},
    setProperty: function(el) {
      this.el.target = el;
    },
    bind: function() {},
    init: function(el) {
      this.setProperty($(el));
      this.methodes.init();
      this.bind();
    }
  };

  //팝업
  var popup = {
    el: {
      popup       : null,
      popBtn      : null,
      layContainer: null
    },
    selector: {
      closeBtn: '.closeL'
    },
    methodes: {
      //팝업 show
      show: function(target) {
        //팝업 다중 노출 시 z-index 처리
        if (common.el.doc.find('.layPop:visible').length > 0) {
          var maxIndex = 0;
          common.el.doc.find('.layPop:visible').each(function() {
            var $this = $(this);
            var zIndex = parseInt($this.css('z-index'));
            maxIndex = maxIndex < zIndex ? zIndex : maxIndex;
          });
          target.css('z-index', maxIndex + 1);
        }

        target.show();
        // 지도 left 팝업
        if (target.hasClass('layerMapList')) {
          target.stop().animate({ left: 0 });
          target
            .find('.closeL')
            .off('click')
            .on('click', function() {
              popup.methodes.hide(target);
            });
        }

        //스와이프 초기화
        mySwiper.methodes.swiperUpdate(target);

        //딤 예외 처리
        if (!target.hasClass('layerMap') && !target.hasClass('layerMapList')) {
          mvJs.utils.dimmedShow();
        }

        utils.scrollDisabled();

        target
          .find('.scroll-content')
          .off('scroll.popup')
          .on('scroll.popup', popup.handler.scroll);
      },
      //팝업 hide
      hide: function(target) {
        if (target.hasClass('layerMap')) {
          // 지도 팝업
          var mapLeft = common.el.doc.find('.layerMapList');
          if (mapLeft.is(':visible')) {
            mapLeft.css('left', -mapLeft.width());
            mapLeft.hide();
          }
          target.hide();
        } else if (target.hasClass('layerMapList')) {
          // 지도 left 팝업
          target.stop().animate({ left: -target.width() }, function() {
            target.hide();
            target.find('.closeL').off('click');
          });
        } else if (target.hasClass('layCent')) {
          //가운데 정렬 팝업
          target.hide();
        } else {
          //외 경우 (풀팝업)
          target.hide();
        }
        mvJs.utils.dimmedHide();
        utils.scrollEnabled();
      }
    },
    handler: {
      show: function() {
        var $this = $(this);
        var popLayer = $('#' + $this.data('id'));

        popup.methodes.show(popLayer);
      },
      hide: function() {
        var $this = $(this);
        var popLayer = $this.closest('.layPop');

        popup.methodes.hide(popLayer);
      },
      resize: function() {},
      scroll: function() {
        var $this = $(this);
        var laypop = $this.closest('.layPop');
        var scrollTop = $this.scrollTop();
        //팝업 내부 스크롤 시 class on/off
        // if (scrollTop === 0 && laypop.hasClass('layScroll')) {
        //   laypop.removeClass('layScroll');
        // }
        // if (scrollTop > 0 && !laypop.hasClass('layScroll')) {
        //   laypop.addClass('layScroll');
        // }

        //앵커 탭 대응
        var anchor = $this.find('.anchorTabFixed');
        if (anchor.length > 0) {
          var anchorScroll = scrollTop + anchor.height();

          anchor.find('ul>li>a').each(function(idx) {
            var $this = $(this);
            var target = $('#' + $this.data('controls'));
            var top = target.position().top + scrollTop;
            var nextArea = target.nextAll('div[class*=anchorTab]').eq(0);
            var nextTop;
            if (nextArea.length) {
              nextTop = nextArea.position().top + scrollTop;
            }

            if (nextArea.length === 0) {
              if (
                top <=
                anchorScroll + laypop.find('.scriptScroll').height() / 3
              ) {
                anchor.find('>ul>li>a').attr('aria-selected', 'false');
                $this.attr('aria-selected', 'true');
              } else {
                $this.attr('aria-selected', 'false');
              }
            } else if (idx === 0 && top > anchorScroll) {
              $this.attr('aria-selected', 'true');
            } else if (top <= anchorScroll && anchorScroll < nextTop) {
              $this.attr('aria-selected', 'true');
            } else {
              $this.attr('aria-selected', 'false');
            }
          });
        }
      }
    },
    setProperty: function(el) {
      this.el.popBtn = el;
      this.el.popup = $('#' + el.data('id'));
      this.el.layCont = this.el.popup.find('.layContainer');
    },
    bind: function() {
      this.el.popBtn.off('click.popup').on('click.popup', popup.handler.show);
      this.el.popup
        .find(this.selector.closeBtn)
        .off('click.popup')
        .on('click.popup', popup.handler.hide);

      this.el.layCont
        .find('.scroll-content')
        .off('scroll.popup')
        .on('scroll.popup', popup.handler.scroll);

      //퍼블 확인 용
      // $('.viewListWrap .btView')
      //   .off('click')
      //   .on('click', function() {
      //     popup.methodes.show($('.layerMapList'));
      //   });
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //헤더 영역 기능
  var header = {
    el: {
      header    : null,
      search    : null,
      laySearch : null,
      searchDim : null,
      searchBtns: null
    },
    selector: {
      mainTopbanner: '.mainTopbanner'
    },
    methodes: {
      // navContral: function(idx, speed) {
      //   var navList = header.el.navList;
      //   var navListW = navList.outerWidth();
      //   var navCon = header.el.navCon;
      //   var target = header.el.navCon.eq(idx);
      //   var targetLeft = target.position().left;
      //   var navW = parseInt(navList.css('padding-left')) * 2;
      //   var scrollLeft = navList.scrollLeft();
      //   var aniSpeed = speed || 250;
      //   var moveVal =
      //     targetLeft + scrollLeft - parseInt(navList.css('padding-left'));
      //   navCon.each(function() {
      //     var $this = $(this);
      //     navW += $this.width();
      //   });
      //   if (moveVal + navListW > navW) {
      //     moveVal = navW - navListW;
      //   }
      //   header.el.navCon.removeClass('navON').eq(idx).addClass('navON');
      //   navList.stop().animate(
      //     {
      //       scrollLeft: moveVal
      //     },
      //     aniSpeed
      //   );
      // }
      searchMenuOpen: function(target) {
        var targetId = target.attr('aria-controls');
        var cont = common.el.doc.find('#' + targetId);
        target.attr('aria-selected', true);
        target
          .closest('li')
          .siblings('li')
          .children('a')
          .attr('aria-selected', false);
        cont
          .addClass('sectionON')
          .siblings('.k1_section_multi')
          .removeClass('sectionON');
        mySwiper.methodes.swiperUpdate(cont);
      }
    },
    handler: {
      searchMenuToggle: function(e) {
        e.preventDefault();
        var $this = $(this);
        header.methodes.searchMenuOpen($this);
      },
      searchToggle: function() {
        var lay = header.el.laySearch;
        var dim = header.el.searchDim;
        var section = $(common.selector.wrapper);
        if (lay.is(':animated')) {
          return false;
        }
        if (lay.is(':visible')) {
          lay.slideUp(function() {
            section.removeClass('quickWrapper');
          });
          dim.css('opacity', 0);
          mvJs.utils.scrollEnabled();
        } else {
          section.addClass('quickWrapper');
          lay.slideDown();
          dim.css('opacity', 1);
          mySwiper.methodes.swiperUpdate(lay);
          mvJs.utils.scrollDisabled();
        }
      },
      searchClose: function() {
        header.handler.searchToggle();
      },
      topBannerClose: function() {
        var $this = $(this);
        var topBanner = $this.closest('.mainTopbanner');
        // topBanner.slideUp(function() {
        //   topBanner.remove();
        // });
        topBanner.animate({ marginTop: -topBanner.height() }, 200, function() {
          topBanner.remove();
        });
      },
      scroll: function() {
        var head = header.el.header;
        var scrollTop = common.el.win.scrollTop();
        var headerH = head.height();
        var fixedWrap = head.children('.fixedWrap');
        var wrap = head.closest('#wrapper');
        var mainTopbanner = $(header.selector.mainTopbanner);

        if (mainTopbanner.length > 0) {
          headerH += mainTopbanner.height();
        }

        if ($(common.selector.body).css('overflow') !== 'hidden') {
          if (scrollTop === 0 && wrap.hasClass('headFixed')) {
            wrap.removeClass('headFixed');
          }
          if (scrollTop > headerH && !wrap.hasClass('headFixed')) {
            wrap.addClass('headFixed');
          }
        }
      }
    },
    setProperty: function(el) {
      this.el.header = el;
      this.el.search = el.find('.btSearch');
      this.el.laySearch = el.find('.laySearch');
      this.el.searchDim = this.el.laySearch.find('.dimmed');
      this.el.searchClose = this.el.laySearch.find('.closeL');
      this.el.searchBtns = common.el.doc.find('.searchBtns');
    },
    bind: function() {
      var mainTopbanner = $(header.selector.mainTopbanner);
      common.el.win
        .off('scroll.header')
        .on('scroll.header', header.handler.scroll);

      this.el.search
        .off('click.header')
        .on('click.header', header.handler.searchToggle);
      this.el.searchClose
        .off('click.header')
        .on('click.header', header.handler.searchClose);
      this.el.searchBtns.find('>li>a').each(function() {
        $(this)
          .off('click.header')
          .on('click.header', header.handler.searchMenuToggle);
      });

      if (mainTopbanner.length > 0) {
        mainTopbanner
          .children('.btn_close')
          .off('click.header')
          .on('click.header', header.handler.topBannerClose);
      }
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //탭기능
  var tab = {
    el: {
      tabWrap: null,
      tab    : null,
      tabCon : null
    },
    selector: {},
    methodes: {
      tabOn: function(target, speed) {
        var tabScript = target.closest('.tabScript');
        var wrap = target.closest('ul');
        var targetA = target.children('a');
        var tabConData = targetA.data('controls');
        if (targetA.attr('aria-selected') === 'true') {
          return true;
        }

        //앵커 타입일 때 미동작
        if (!tabScript.hasClass('anchorTabFixed')) {
          targetA.attr('aria-selected', 'true');
          target.siblings('li').children('a').attr('aria-selected', 'false');
        }

        if (tabConData !== undefined) {
          var con = common.el.doc.find('#' + tabConData);
          //앵커 타입
          if (tabScript.hasClass('anchorTabFixed')) {
            var fixedH = wrap.height();
            $('#wrapper header').each(function() {
              fixedH += $(this).height();
            });
            if (con.closest('.scriptScroll').length > 0) {
              //팝업 내부
              con
                .closest('.scroll-content')
                .stop()
                .animate(
                  {
                    scrollTop:
                      con.position().top -
                      tabScript.height() +
                      con.closest('.scroll-content').scrollTop() +
                      20
                  },
                  500
                );
            } else {
              $(common.selector.bh)
                .stop()
                .animate(
                  {
                    scrollTop: con.offset().top - fixedH
                  },
                  500
                );
            }
          } else {
            con
              .addClass('tabON')
              .siblings('.tabContentWrap')
              .removeClass('tabON');

            //스와이프 업데이트
            mySwiper.methodes.swiperUpdate(con);

            //리뷰 리스트 업데이트
            con.find('.reviewList').each(function() {
              var $this = $(this);
              // $this.find('>li>.txt').css({
              //   textOverflow        : '',
              //   '-webkit-box-orient': ''
              // });
              etc.methodes.reviewMoreBtn($this);
            });
          }
        }

        tabScript.each(function() {
          var $this = $(this);
          var sData = wrap.data('swiper');

          if (sData !== {}) {
            var aniSpeed = speed === undefined ? 200 : speed;
            tab.methodes.tabScrollMove(wrap, target, aniSpeed);
          }
        });
        wrap.find('[class^="tabType"]').trigger('scroll');
      },
      tabScrollMove: function(wrap, target, speed) {
        var sData = wrap.data('swiper');
        var wrapW = wrap.outerWidth(true);
        var wrapInnerW = tab.methodes.tabInnerWidth(wrap) - wrapW;
        var targetLeft = target.position().left;
        var scrollLeft = -sData.translate;
        var moveVal =
          targetLeft /*+ scrollLeft*/ - wrapW / 2 + target.width() / 2;
        if (moveVal < 0) {
          moveVal = 0;
        }

        if (moveVal > wrapInnerW) {
          moveVal = wrapInnerW;
        }
        sData.translateTo(-moveVal, speed);
      },
      tabInnerWidth: function(wrap) {
        var innerW = 0;
        wrap.children('li').each(function() {
          var $this = $(this);
          innerW += $this.outerWidth(true);
        });
        return innerW;
      }
    },
    handler: {
      click: function(e) {
        //탭 클릭 시
        var $this = $(this);
        if ($this.children('a').attr('href') === '#') {
          e.preventDefault();
        }
        tab.methodes.tabOn($this);
      },
      scroll: function() {
        //탭 가로 스크롤 시
        var $this = $(this.el);
        var wrap = $this.children('ul');
        var wrapW = $this.children('ul').outerWidth(true) + 10;
        var scrollLeft = -this.translate;
        var nextBtn = $this.children('.next');
        var prevBtn = $this.children('.prev');
        var idx = wrap.find('a[aria-selected=true]').closest('li').index();

        if (nextBtn.length > 0) {
          if (scrollLeft < tab.methodes.tabInnerWidth(wrap) - wrapW) {
            nextBtn.show();
          } else {
            nextBtn.hide();
          }

          if (scrollLeft > 0) {
            prevBtn.show();
          } else {
            prevBtn.hide();
          }
        }
      },
      resize: function() {
        $(common.selector.tab).each(function() {
          var $this = $(this);
          $this.trigger('scroll.tab');
        });
      },
      moveBtn: function() {
        //prev next 버튼
        var $this = $(this);
        var wrap = $this.siblings('ul');
        var sData = wrap.data('swiper');
        wrap.children('li').each(function() {
          var cont = $(this);
          var viewSize = wrap.width() + -sData.getTranslate();
          var targetSize = cont.position().left + cont.outerWidth(true);

          if ($this.hasClass('next')) {
            if (viewSize < targetSize) {
              sData.translateTo(wrap.width() - targetSize - $this.width(), 200);
              return false;
            }
          } else {
            if (-sData.getTranslate() < targetSize) {
              sData.translateTo(-cont.position().left + $this.width(), 200);
              return false;
            }
          }
        });
      },
      winScroll: function() {
        // 윈도우 스크롤 시
        var doc = common.el.doc;
        var scrollTop = common.el.win.scrollTop();
        var viewTab = doc.find(
          '.viewTab > .tabWrap.tabScript, .viewTab > .tabBasics '
        );
        var header = doc.find('#wrapper>header');
        var headScrollTop = 0;
        // if (header.length > 0) {
        //   headScrollTop = scrollTop + header.height();
        // }

        // if (common.el.doc.find('.tripSelect>.inner').length > 0) {
        //   headScrollTop += common.el.doc
        //     .find('.tripSelect>.inner')
        //     .outerHeight();
        // }

        // if (viewTab.length > 0) {
        //   if (
        //     viewTab.offset().top <= headScrollTop &&
        //     !viewTab.hasClass('fixed')
        //   ) {
        //     viewTab.addClass('fixed');
        //   } else if (
        //     viewTab.offset().top > headScrollTop &&
        //     viewTab.hasClass('fixed')
        //   ) {
        //     viewTab.removeClass(['fixed', 'tabScroll']);
        //   }
        // }

        // var fixedTab = doc.find('.tabScript.fixed');
        // fixedTab.each(function() {
        //   var $this = $(this);
        //   if (scrollTop === 0 && $this.hasClass('tabScroll')) {
        //     $this.removeClass('tabScroll');
        //   }
        //   if (scrollTop > 0 && !$this.hasClass('tabScroll')) {
        //     $this.addClass('tabScroll');
        //   }
        // });
      }
    },
    setProperty: function(el) {
      this.el.tabWrap = el;
      this.el.tab = el.children('li');
      this.el.btn = this.el.tabWrap.siblings('button');
    },
    bind: function() {
      this.el.tab.off('click.tab').on('click.tab', tab.handler.click);
      // this.el.tabWrap.off('scroll.tab').on('scroll.tab', tab.handler.scroll);

      this.el.btn.each(function() {
        var $this = $(this);
        $this.off('click.tab').on('click.tab', tab.handler.moveBtn);
      });

      mySwiper.methodes.tabScrollSwiper(this.el.tabWrap);
      common.el.win.off('resize.tab').on('resize.tab', tab.handler.resize);
      common.el.win.off('scroll.tab').on('scroll.tab', tab.handler.winScroll);
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //아코디언
  var accordion = {
    el: {
      wrap: null
    },
    selector: {},
    methodes: {
      show: function(target, speed) {
        if (target.is(':animated')) {
          return false;
        }
        // if (target.hasClass('toggleCont')) {
        // 마이페이지 좌즉에 붙는 타입
        var aniSpeed = speed || 300;
        var btn = target.prev('.toggleBtn');
        if (target.hasClass('snbListDep2')) {
          btn = target.prev('.snbDep1');
          btn.attr('aria-selected', 'true');
        }
        btn.attr('aria-expanded', 'true');

        //필터 예외
        var filterWrap = target.closest('#filterWrap');
        if (filterWrap.length > 0) {
          filterWrap.find('.filterSelectWrap').each(function() {
            var $this = $(this);
            $this.find('.scroll-content').data('scrollbar').init();
          });
          return false;
        }

        target.hide().slideDown(aniSpeed);
        // 마이페이지 좌즉에 붙는 타입은 하나만 열리게 처리
        if (target.hasClass('snbListDep2')) {
          target
            .closest('li')
            .siblings('li')
            .children('.snbDep1[aria-expanded=true]')
            .each(function() {
              var $this = $(this);
              var con = $this.next('.snbListDep2');
              con.slideUp(aniSpeed, function() {
                $this.attr({
                  'aria-expanded': 'false',
                  'aria-selected': 'false'
                });
              });
            });
        }

        // 가는편 오는편 컨텐츠 테두리 작업
        if (target.closest('.k1_sch_result').length > 0) {
          target.closest('li').addClass('toggleON');
        }

        mySwiper.methodes.swiperUpdate(target);
        // }
      },
      hide: function(target, speed) {
        if (target.is(':animated')) {
          return false;
        }
        // if (target.hasClass('toggleCont')) {
        // 마이페이지 좌즉에 붙는 타입
        var aniSpeed = speed || 300;
        var btn = target.prev('.toggleBtn');
        if (target.hasClass('snbListDep2')) {
          btn = target.prev('.snbDep1');
          btn.attr('aria-selected', 'true');
        }
        //필터 예외
        var filterWrap = target.closest('#filterWrap');
        if (filterWrap.length > 0) {
          btn.attr('aria-expanded', 'false');
          filterWrap.find('.filterSelectWrap').each(function() {
            var $this = $(this);
            $this.find('.scroll-content').data('scrollbar').init();
          });
          return false;
        }

        target.slideUp(aniSpeed, function() {
          btn.attr('aria-expanded', 'false');
          // 마이페이지 좌즉에 붙는 타입
          if (target.hasClass('snbListDep2')) {
            btn.attr('aria-selected', 'false');
          }
          // 가는편 오는편 컨텐츠 테두리 작업
          if (target.closest('.k1_sch_result').length > 0) {
            target.closest('li').removeClass('toggleON');
          }
        });
        // }
      }
    },
    handler: {
      toggle: function() {
        var $this = $(this);
        var check = $this.attr('aria-expanded');
        var con = $this.next('.toggleCont');
        if ($this.hasClass('snbDep1')) {
          con = $this.next('.snbListDep2');
        }

        if (check === 'true') {
          accordion.methodes.hide(con);
        } else if (check === 'false') {
          accordion.methodes.show(con);
        }
      }
    },
    setProperty: function(el) {
      this.el.wrap = el;
      this.el.btn = el.find('.toggleBtn');
      if (!el.hasClass('toggleList')) {
        this.el.btn = el.find('.snbDep1');
      }
    },
    bind: function() {
      this.el.btn.each(function() {
        var $this = $(this);
        $this
          .off('click.accordion')
          .on('click.accordion', accordion.handler.toggle);
      });
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //플로팅 컨텐츠
  var floating = {
    el: {
      area   : null,
      sorting: null,
      filter : null,
      search : null
    },
    selector: {},
    methodes: {},
    handler : {
      scroll: function(e) {
        var win = common.el.win;
        var scrollTop = win.scrollTop();
        var header = $(common.selector.header);
        var headerH = 104;
        var headerH2 = 72;
        var fMarginTop = 32;
        var footer = $(common.selector.footer);
        var elData = e.data;
        var area = elData.area;
        var sorting = elData.sorting;
        var filter = elData.filter;
        // var search = elData.search;
        var btn = filter.find('.filterBtns');
        var accoArea = filter.find('.filterSelectWrap');
        var filterSorting = filter.find('.filterSorting');

        if (filter.hasClass('kf_paymentBox')) {
          // if (common.el.doc.find('.headFixed').length > 0) {
          //   filter.addClass('fixedPayment');
          //   //footer 도달 시 픽스
          //   // if (footer.offset().top - scrollTop <= win.height()) {
          //   //   filter.css('position', '');
          //   //   filter.addClass('filterFoot');
          //   // } else {
          //   //   filter.removeClass('filterFoot');
          //   // }
          // } else {
          //   filter.removeClass('fixedPayment');
          // }

          // if (filter.offset().top <= filter.prev('.kf_flightInner').offset().top) {
          //   console.log(123);
          // }

          if (
            filter.prevAll().last().offset().top <
            scrollTop + headerH2 + 32
          ) {
            filter.addClass('fixedPayment');
            if (footer.offset().top - scrollTop <= win.height()) {
              filter.css('position', '');
              filter.addClass('filterFoot');
            } else {
              filter.removeClass('filterFoot');
            }
          } else {
            filter.removeClass('fixedPayment filterFoot');
          }
        } else {
          // 출발 도착 정보 픽스
          // if (common.el.doc.find('.headFixed').length > 0) {
          //   search.addClass('fixed');
          // } else {
          //   search.removeClass('fixed');
          // }

          // 빠른정렬 픽스
          if (scrollTop >= sorting.offset().top - headerH2 - parseInt(sorting.css('margin-top'))) {
            sorting.each(function() {
              var $this = $(this);
              $this.addClass('fixed');
            });
          } else {
            sorting.each(function() {
              var $this = $(this);
              $this.removeClass('fixed');
            });
          }

          if (!filter.hasClass('filterFoot')) {
            if (sorting.hasClass('fixed')) {
              filter.css({ position: 'fixed',
                top     : '' });
            } else {
              filter.css({ position: 'absolute',
                top     : '0' });
            }
          }

          // footer 도달 시 픽스
          if (
            filter.offset().top > scrollTop + headerH2 + fMarginTop + sorting.height() &&
            filter.hasClass('filterFoot')
          ) {
            filter.removeClass('filterFoot');
          } else if (
            footer.offset().top <
              btn.offset().top + btn.outerHeight(true) + 20 &&
            !filter.hasClass('filterFoot')
          ) {
            filter.css('position', '');
            filter.addClass('filterFoot');
          }

          if (filter.css('position') === 'fixed') {
            accoArea.find('.scriptScroll').each(function() {
              var $this = $(this);
              var maxH =
                win.height() -
                btn.outerHeight(true) -
                filter.position().top -
                accoArea.position().top -
                parseInt(accoArea.css('margin-top')) -
                accoArea.children('.tit').height() -
                fMarginTop;
              $this.css('max-height', maxH);
              $this.children('.scroll-content').css('max-height', maxH);
            });
          }
        }
      },
      resize: function(e) {
        var elData = e.data;
        floating.handler.scroll({ data: elData });
      }
    },
    setProperty: function(el) {
      this.el.filter = el;
      this.el.area = el.closest('.k1_schedule_search');
      this.el.sorting = this.el.area.prevAll('.kf_quickFixed');
      // this.el.search = this.el.area.prevAll('.kf_searchFixed');
    },
    bind: function() {
      common.el.win
        .off('scroll.floating')
        .on('scroll.floating', this.el, this.handler.scroll);
      common.el.win
        .off('resize.floating')
        .on('resize.floating', this.el, this.handler.resize);
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //툴팁
  var tooltip = {
    el: {
      btn : null,
      cont: null
    },
    selector: {
      header: '#wrapper > header'
    },
    handler: {
      show: function() {
        var $this = $(this);
        var cont = $this.next();
        if (!cont.is(':visible')) {
          cont.show();
        }
      },
      close: function() {
        var $this = $(this);
        if ($this.hasClass('btClose')) {
          $this.closest('.notiView').hide();
        } else {
          $this.closest('.tooltipCont').hide();
        }
      }
    },
    setProperty: function(el) {
      this.el.showBtn = el;
      this.el.cont = el.next();

      if (el.hasClass('btNoti')) {
        this.el.closeBtn = this.el.cont.find('.btClose');
      } else {
        this.el.closeBtn = this.el.cont.find('.btnClose');
      }
    },
    bind: function() {
      this.el.showBtn.off('.tooltip').on('click.tooltip', this.handler.show);
      this.el.closeBtn.off('.tooltip').on('click.tooltip', this.handler.close);
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //빠른 정렬 선택
  var tabAhcnor = {
    el: {
      tripArea : null,
      con      : null,
      morning  : null,
      afternoon: null,
      evening  : null
    },
    selector: {
      wrapper: '#wrapper'
    },
    handler: {
      click: function(e) {
        var bh = $(common.selector.bh);
        var $this = $(this);
        var idx = $this.closest('li').index();
        var tab = tabAhcnor.el.tripArea;
        var tabT =
          parseInt(tab.parent().css('top')) +
          tab.closest('.tabSorting').outerHeight();
        var moveTop;

        moveTop = $('#' + $this.attr('aria-controls')).offset().top;
        if (!$(tabAhcnor.selector.wrapper).hasClass('headFixed')) {
          moveTop -= 32;

          $this.closest('.kf_quickFixed').addClass('fixed');
          tabT =
            parseInt(tab.parent().css('top')) +
            tab.closest('.tabSorting').outerHeight();
          $this.closest('.kf_quickFixed').removeClass('fixed');
        }

        bh.stop().animate({ scrollTop: moveTop - tabT });
      },
      scroll: function() {
        var win = common.el.win;
        var con = tabAhcnor.el.con;
        var tab = tabAhcnor.el.tripArea;
        var scrollTop = tab.offset().top + tab.outerHeight() + 20;

        con.children('button').each(function(idx) {
          var $this = $(this);
          var target = $('#' + $this.attr('aria-controls'));
          var top = target.offset().top;
          var nextArea = target.nextAll('li[id*=anchor]').eq(0);
          var nextTop;
          if (nextArea.length) {
            nextTop = nextArea.offset().top;
          } else {
            nextTop =
              $this.closest('#container').offset().top +
              $this.closest('#container').height();
          }
          if (idx === 0 && top > scrollTop) {
            $this.attr('aria-selected', 'true');
          } else if (top <= scrollTop && scrollTop < nextTop) {
            $this.attr('aria-selected', 'true');
          } else {
            $this.attr('aria-selected', 'false');
          }
        });
      }
    },
    setProperty: function(el) {
      var doc = common.el.doc;
      this.el.tripArea = el;
      this.el.con = this.el.tripArea.children('li').not('.sorting');
      this.el.morning = doc.find('#anchorMorning');
    },
    bind: function() {
      if (this.el.morning.length > 0) {
        this.el.con.children('button').each(function() {
          var $this = $(this);
          $this.off('click.trip').on('click.trip', tabAhcnor.handler.click);
        });
        common.el.win
          .off('scroll.trip')
          .on('scroll.trip', tabAhcnor.handler.scroll);
      }
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //달력
  var datepicker = {
    el: {
      area: null
    },
    selector: {},
    methodes: {
      init: function(area) {
        var template = '';
        var wrap = area.find('.swiper-wrapper');
        var today = new Date();
        var toYear = today.getFullYear();
        var toMonth = today.getMonth() + 1;
        var toDay = today.getDate();
        var options = {
          monthLength: 1,
          week       : ['일', '월', '화', '수', '목', '금', '토'],
          startTxt   : '체크인',
          endTxt     : '체크아웃'
        };
        var optionData = area.data('options') || {};

        // 현재 월 기준으로 나올 계월 수
        if (optionData.monthLength) {
          options.monthLength = optionData.monthLength;
        }

        // 시작일 텍스트
        if (optionData.startTxt) {
          options.startTxt = optionData.startTxt;
        }

        // 종료일 텍스트
        if (optionData.endTxt) {
          options.endTxt = optionData.endTxt;
        }

        // 템플릿 생성
        for (var i = 0; i < options.monthLength; i++) {
          var year = today.getFullYear();
          var month = today.getMonth() + 1;
          var startDay = new Date(year, month - 1, 1).getDay();
          var dayLength = new Date(year, month, 0).getDate();
          var prevDayLength = new Date(year, month - 1, 0).getDate();
          var col = Math.ceil((startDay + dayLength) / 7);

          template += '<li class="swiper-slide"><div class="k1_calendar_wrap">';
          template +=
            '<div class="k1_sel_month">' + year + '년 ' + month + '월</div>';
          template += '<table class="k1_board_mcal">';
          template += '<thead><tr>';
          options.week.forEach(function(val) {
            template += '<th>' + val + '</th>';
          });
          template += '</tr></thead>';
          template += '<tbody>';

          for (var j = 0; j < col; j++) {
            template += '<tr>';
            for (var s = 1; s < 8; s++) {
              var num = s + j * 7 - startDay;

              if (num <= 0) {
                // 이전 월 표시
                template +=
                  '<td class="off prevMonth">' +
                  (prevDayLength + num) +
                  '</td>';
              } else if (num > dayLength) {
                // 다음 월 표시
                template +=
                  '<td class="off nextMonth">' + (num - dayLength) + '</td>';
              } else if (
                new Date(year, month, num) < new Date(toYear, toMonth, toDay)
              ) {
                // 오늘 이전 날
                template += '<td class="off">' + num + '</td>';
              } else {
                template +=
                  '<td><a href="#" role="button">' + num + '</a></td>';
              }
            }
            template += '</tr>';
          }
          template += '</tbody>';
          template += '</table>';
          template += '</div></li>';
          today.setMonth(today.getMonth() + 1);
        }

        // 기존 폼 제거 후 템플릿 적용
        wrap.children().remove();
        wrap.append(template);
        mySwiper.methodes.swiperUpdate(area);
        // 기본 세팅
        wrap.find('.k1_calendar_wrap').each(function() {
          var $this = $(this);
          var ymTxt = $this.find('.k1_sel_month').text();
          var onDay = $this.find('tbody td').not('.off');
          var evtData = {
            year  : toYear,
            month : toMonth,
            day   : toDay,
            option: options
          };

          // 토, 일 체크
          $this
            .find('tbody')
            .children('tr')
            .each(function() {
              var $this = $(this);
              var td = $this.children('td');
              td.first().not('.off').addClass('sun');
              td.last().not('.off').addClass('sat');
            });

          // 오늘 날짜 체크
          if (ymTxt.indexOf(toYear) > -1) {
            if (ymTxt.indexOf(toMonth) > -1) {
              onDay
                .children('a:contains(' + toDay + ')')
                .filter(function(idx, target) {
                  return target.innerText === String(toDay);
                })
                .closest('td')
                .addClass('today');
            }
          }

          onDay.children('a').each(function() {
            var $this = $(this);
            $this
              .off('click.datepicker')
              .on('click.datepicker', evtData, datepicker.handler.dayPick);
          });
        });
      }
    },
    handler: {
      dayPick: function(e) {
        e.preventDefault();
        var $this = $(this);
        var regex = /[^0-9]/g;
        var pick = $this.closest('td');
        var area = $this.closest('.multiCalendar');
        var wrap = $this.closest('.k1_calendar_wrap');
        var dateArea = wrap.find('.k1_sel_month');
        var tbody = area.find('tbody');
        var tr = tbody.children('tr');
        var td = tr.children('td');
        var start = tr.children('td.start');
        var end = tr.children('td.end');
        var evtData = e.data;
        var yy = dateArea.text().split(' ')[0].replace(regex, ''); //년도
        var mm = dateArea.text().split(' ')[1].replace(regex, ''); //월
        if (mm.length < 2) {
          mm = '0' + mm;
        }
        var dd = $this.text(); //일
        if (dd.length < 2) {
          dd = '0' + dd;
        }
        var options = e.data.option;

        if (start.length > 0 && end.length > 0) {
          start.removeClass('start').children('.txt').remove();
          start = area.find('tbody td.start');
          end.removeClass('end').children('.txt').remove();
          end = area.find('tbody td.end');
          area.find('.range').removeClass('range');
        } else if (td.index(start) > td.index(pick)) {
          start.removeClass('start').children('.txt').remove();
          start = area.find('tbody td.start');
        }

        if (start.length === 0) {
          $this.after('<span class="txt">' + options.startTxt + '</span>');
          pick.addClass('start');
          //선택 날짜 val 로 전달
          area
            .val(yy + '-' + mm + '-' + dd)
            .attr('value', yy + '-' + mm + '-' + dd);
        } else if (end.length === 0) {
          var startDate = area.val();
          if ($this.siblings('.txt').length > 0) {
            return false;
          } else {
            $this.after('<span class="txt">' + options.endTxt + '</span>');
            area
              .val(startDate + ' ~ ' + yy + '-' + mm + '-' + dd)
              .attr('value', startDate + ' ~ ' + yy + '-' + mm + '-' + dd);
          }
          pick.addClass('end');

          // 범위 표시
          start.nextAll('td').not('.off, .end').addClass('range');
          pick.prevAll('td').not('.off, .range, .start').addClass('range');
          start.prevAll('td').not('.off').removeClass('range');
          pick.nextAll('td').not('.off').removeClass('range');

          var startCol = tr.index(start.closest('tr'));
          var endCol = tr.index(pick.closest('tr'));

          if (endCol - startCol > 1) {
            for (var i = 1; i < endCol - startCol; i++) {
              tr.eq(startCol + i)
                .find('td')
                .not('.off')
                .addClass('range');
            }
          }
        }
      }
    },
    setProperty: function(el) {
      this.el.area = el;
    },
    init: function(el) {
      this.setProperty($(el));
      datepicker.methodes.init(this.el.area);
    }
  };

  //슬라이더
  var slider = {
    el: {
      target  : null,
      viewArea: null
    },
    selector: {},
    methodes: {
      init: function() {
        //기본 옵션
        var optionData = slider.el.target.data('options') || {};
        var options = {
          range : optionData.range || false,
          min   : optionData.min || null,
          max   : optionData.max || null,
          step  : optionData.step || null,
          value : optionData.value || 0,
          values: optionData.values || null,
          text  : optionData.text || null,
          slide : function() {}
        };

        var mySlider = slider.el.target.slider(options);

        if (slider.el.viewArea.length > 0) {
          slider.el.viewArea.children('.amount').each(function(idx) {
            var $this = $(this);
            $this.val(
              slider.methodes.comma(optionData.values[idx]) + optionData.text
            );
          });
        }
        mySlider.on('slide', options, slider.handler.slide);
      },
      comma: function(number) {
        return number.toLocaleString('en');
      }
    },
    handler: {
      slide: function(e, ui) {
        var options = e.data;
        var target = $(e.target);
        var amount = target.next('.fp_slideInp').children('.amount');

        if (options.range === true) {
          if (ui.values[0] + options.step > ui.values[1]) {
            return false;
          }
        }
        if (
          options.range === 'min' &&
          target.closest('.slideReview').length > 0
        ) {
          target.next('.amount').val(ui.value);
        }

        amount.each(function(idx) {
          var $this = $(this);
          var val = ui.values[idx];
          if (val === null) {
            val = 0;
          }
          $this.val(slider.methodes.comma(val) + options.text);
        });
      }
    },
    setProperty: function(el) {
      this.el.target = el;
      this.el.viewArea = el.next('.fp_slideInp');

      this.methodes.init();
    },
    bind: function() {},
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //정렬
  var sortable = {
    el: {
      target: null
    },
    selector: {},
    methodes: {
      init: function() {
        sortable.el.target.sortable({
          handle     : '.btIco',
          cancel     : '',
          containment: sortable.el.target,
          animation  : 150,
          axis       : 'y',
          scroll     : false,
          revert     : 150,
          start      : function() {
            var sort = $(this).sortable('instance');
            sort.containment[3] += 25;
            sort.containment[1] -= 25;
          }
        });
        sortable.el.target.disableSelection();
      }
    },
    handler    : {},
    setProperty: function(el) {
      this.el.target = el;

      this.methodes.init();
    },
    bind: function() {},
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //기타
  var etc = {
    el      : {},
    selector: {
      inpDeleteAni: '.inpDeleteAni',
      allCheck    : '.agree> .large, .chkTotalSel > .total',
      toggleAgree : '.agreeList.toggleList',
      frmAcctList :
        '.frmAcctList .inpAcct, .frmColGroup .frmInp, .rentcarStoreList .rentcarStore ',
      selTotal     : '.selTotal',
      searchIcon   : '.searchIcon',
      rentercarList: '.rentercarList > .rentcarItemGroup',
      eagVisual    : '.eagVisual',
      setting      : '.kf_areaNum .setting',
      btTop        : '.btTop',
      viewInfoWrap : '.viewInfoWrap',
      fileInput    : '.file',
      reviewList   : '.reviewList'
    },
    methodes: {
      // 리뷰 영역 더보기/닫기 버튼 노출 유무 및 이벤트 바인딩
      reviewMoreBtn: function(target) {
        target.children('li').each(function() {
          var $this = $(this);
          var txtArea = $this.children('.txt');
          var txtAreaH = txtArea.height();
          var clone = txtArea.clone().prependTo($this).css({
            visibility          : 'hidden',
            position            : 'absolute',
            textOverflow        : 'inherit',
            display             : 'block',
            '-webkit-box-orient': 'inherit',
            'max-height'        : 'inherit'
          });
          var cloneH = clone.height();
          clone.remove();

          if (txtAreaH < cloneH || txtArea.hasClass('txtFull')) {
            if ($this.find('.btLink').length === 0) {
              txtArea.after(
                '<button type="button" class="btLink btLine light"><span class="more">더보기</span><span class="close">닫기</span></button>'
              );
            }
          }

          $this.off('click.etc').on('click.etc', '.btLink', function() {
            var $this = $(this);
            $this.prev('.txt').toggleClass('txtFull');
          });
        });
      }
    },
    handler: {
      scroll: function() {
        var win = $(this);
        var scrollTop = win.scrollTop();
        var topBtn = $(etc.selector.btTop);
        var aside = topBtn.closest('aside');
        var footer = $(common.selector.footer);
        var footerTop = 0;
        if (footer.length > 0) {
          footerTop = footer.offset().top;
        }

        //렌터카 페이지 고정 컨텐츠 제어
        $(etc.selector.rentercarList).each(function() {
          var $this = $(this);
          var $thisH = $this.outerHeight();
          var $thisTop = $this.offset().top;
          var summaryInfo = $this.children('.summaryInfo');
          var headerH = $('#wrapper').children('header').height();
          var tripSelect = common.el.doc.find('.tripSelect');
          var tripSelectH = 0;
          if (tripSelect.length > 0) {
            tripSelectH = tripSelect.children('.inner').outerHeight();
          }

          if (
            scrollTop + headerH + tripSelectH > $thisH + $thisTop ||
            scrollTop === 0
          ) {
            summaryInfo.hide();
          } else if (scrollTop + headerH + tripSelectH >= $thisTop) {
            summaryInfo.show();
          } else {
            summaryInfo.hide();
          }
        });

        // 탑버튼 제어
        if (topBtn.length > 0) {
          if (scrollTop > 0) {
            if (!topBtn.is(':visible')) {
              topBtn.show();
            }
          } else {
            topBtn.hide();
          }
          //탑버튼 고정
          if (
            footerTop - scrollTop < win.height() &&
            !aside.hasClass('footON')
          ) {
            aside.addClass('footON');
          } else if (
            footerTop - scrollTop >= win.height() &&
            aside.hasClass('footON')
          ) {
            aside.removeClass('footON');
          }
        }
      },
      resize       : function() {},
      // 인풋박스 내용이 있을 때 내용 삭제 버튼 노출
      inputValCheck: function() {
        var $this = $(this);
        var removeBtn = $this.next(etc.selector.icDel);
        setTimeout(function() {
          var val = $this.val();
          if (val !== '') {
            removeBtn.show();
          } else {
            removeBtn.hide();
          }
        }, 10);
      },
      // 인풋박스 내용 삭제
      inputRemoveBtn: function() {
        var $this = $(this);
        var input = $this.prev('input');
        input.val('');
        input.trigger('keydown');
      },
      // 전체 선택 체크 박스 기능
      allCheck: function(e) {
        var $this = $(this);
        var checked = $this.prop('checked');
        var conts = $(e.data.conts);
        var toggleAgree = $(e.data.toggleAgree);
        var count = 0;
        if (checked) {
          if ($this.closest('.agreeList.toggleList').length > 0) {
            conts.each(function() {
              if ($(this).is(':checked')) {
                count++;
              }
            });
            if (count > 0) {
              return true;
            }
          }
          conts.prop('checked', true);
          toggleAgree.prop('checked', true).trigger('change');
        } else {
          conts.prop('checked', false);
          toggleAgree.prop('checked', false).trigger('change');
        }
      },
      // 전체 선택 체크 박스의 목록 체크박스 기능
      allCheckCon: function(e) {
        var conts = $(e.data.conts);
        var all = $(e.data.all);
        var type = e.data.type;
        var count = 0;

        conts.each(function() {
          var $this = $(this);
          if ($this.prop('checked') === true) {
            count++;
          }
        });

        var checkOn = count === conts.length;
        if (type === 'once') {
          checkOn = count > 0;
        }

        if (checkOn) {
          all.prop('checked', true);
          accoCheck();
        } else {
          all.prop('checked', false);
          accoCheck();
        }

        // 아코디언 체크박스 체크
        function accoCheck() {
          if (
            all.closest('.toggleList').length > 0 &&
            all.closest('.chkTotalSel').length === 0
          ) {
            all.trigger('change');
          }
        }
      },
      //radio, checkbox 선택 시 컨텐츠 show/hide
      frmChange: function() {
        var $this = $(this);
        var span = $this.closest('span');
        var wrap = $this.closest('.frmAcctList');
        var frmColGroup = $this.closest('.frmColGroup');
        var rentcarStoreList = $this.closest('.rentcarStoreList');

        if (rentcarStoreList.length > 0) {
          rentcarStoreList.find('.chkON').removeClass('chkON');
          $this.closest('.rentcarStore').addClass('chkON');
        } else if (frmColGroup.length > 0) {
          frmColGroup.find('.chkON').removeClass('chkON');
          $this.closest('.frmInp').addClass('chkON');
        } else {
          if ($this.attr('type') === 'radio') {
            wrap.find('.inpAcct>input[type=radio]').each(function() {
              var $this = $(this);
              var span = $this.closest('span');
              span.attr('aria-expanded', $this.prop('checked'));
            });
          } else {
            span.attr('aria-expanded', $this.prop('checked'));
          }
        }
        mySwiper.methodes.swiperUpdate(wrap);
      },
      //검색input 포커스 in 시 클래스 on
      searchFocusIn: function(e) {
        var $this = $(this);
        if ($(e.target).hasClass('icDel')) {
          return false;
        }
        $this.addClass('inpFocus');
      },
      //검색input 포커스 out 시 클래스 off
      searchFocusOut: function() {
        var $this = $(this);
        $this.removeClass('inpFocus');
      }
    },
    bind: function() {
      common.el.win.off('scroll.etc').on('scroll.etc', etc.handler.scroll);
      common.el.win.off('resize.etc').on('resize.etc', etc.handler.resize);

      // 인풋박스 내용 삭제 버튼 기능
      $(etc.selector.inpDeleteAni).each(function() {
        var $this = $(this);
        var btn = $this.find('.icDel');
        var input = $this.find('input');
        btn
          .off('click.removeBtn')
          .on('click.removeBtn', etc.handler.inputRemoveBtn);
        input
          .off('keydown.removeBtn')
          .on('keydown.removeBtn', etc.handler.inputValCheck);
        input.trigger('keydown.removeBtn');
      });

      // 체크 박스 전체 선택 제어
      $(etc.selector.allCheck).each(function() {
        var $this = $(this);
        var allCheck = $this.find('input[type=checkbox]');
        var checkCon = $this.next('.agreeList').find('input[type=checkbox]');
        var checkCon2 = $this
          .nextAll('.agreeList.toggleList')
          .find('.acctItem > .frmInp input[type=checkbox]');

        if (checkCon2.length > 0) {
          checkCon = checkCon.add(checkCon2);
        }
        //필터 영역 전체 체크
        if ($this.hasClass('total')) {
          checkCon = $this.nextAll('.frmInp').find('input[type=checkbox]');
        }

        var data = {
          all        : allCheck,
          conts      : checkCon,
          toggleAgree:
            $this
              .nextAll('.agreeList.toggleList')
              .find('.acctItem > .frmInp input[type=checkbox]') || {}
        };
        allCheck
          .off('change.allCheck')
          .on('change.allCheck', data, etc.handler.allCheck);
        checkCon
          .off('change.allCheck')
          .on('change.allCheck', data, etc.handler.allCheckCon);
      });
      // 전체 선택 체크 박스의 목록 체크박스 제어
      $(etc.selector.toggleAgree).each(function() {
        var $this = $(this);
        var tit = $this.find('.acctItem > .frmInp input[type=checkbox]');
        var cont = $this.find('.toggleCont input[type=checkbox]');
        tit
          .off('change.allCheck2')
          .on('change.allCheck2', { conts: cont }, etc.handler.allCheck);
        cont
          .off('change.allCheck2')
          .on(
            'change.allCheck2',
            { all  : tit,
              conts: cont,
              type : 'once' },
            etc.handler.allCheckCon
          );
      });

      //radio, checkbox 선택 시 컨텐츠 show/hide
      $(etc.selector.frmAcctList).each(function() {
        var $this = $(this);
        var box = $this.children('input');
        box.off('change.etc').on('change.etc', etc.handler.frmChange);
      });

      //전체 박스가 있는 목록 체크 시 목록 초기화
      $(etc.selector.selTotal).each(function() {
        var $this = $(this);
        var total = $this.children('.total').children('input');
        var conts = $this.children('li').not('.total').children('input');
        conts.off('change.etc').on('change.etc', function() {
          var count = 0;
          conts.each(function() {
            var $this = $(this);
            if ($this.prop('checked') === false) {
              count += 1;
            }
          });
          if (!count) {
            conts.prop('checked', false);
            conts.attr('checked', 'false');
            total.prop('checked', true);
            total.attr('checked', 'true');
            return false;
          }
          total.prop('checked', false);
          total.attr('checked', 'false');
        });
        total.off('change.etc').on('change.etc', function() {
          conts.prop('checked', false);
          conts.attr('checked', 'false');
        });
      });

      //검색input 포커스 시 클래스 on/off
      $(etc.selector.searchIcon).each(function() {
        var $this = $(this);
        $this.off('focusin.etc').on('focusin.etc', etc.handler.searchFocusIn);
        $this
          .off('focusout.etc')
          .on('focusout.etc', etc.handler.searchFocusOut);
      });

      // 플러스, 마이너스 버튼 클릭 시 카운트 기능
      $(etc.selector.setting).each(function() {
        var $this = $(this);
        var plusBtn = $this.children('.plus');
        var minusBtn = $this.children('.minus');
        var num = $this.children('.num');
        var thisNum = Number(num.val());
        var max = Number(num.attr('maxlength'));
        var min = 0;
        plusBtn.off('click.etc').on('click.etc', function() {
          num.val(++thisNum);
          minusBtn.attr('disabled', false);
        });
        minusBtn.off('click.etc').on('click.etc', function() {
          num.val(--thisNum);
          plusBtn.attr('disabled', false);
          if (thisNum - 1 < min) {
            minusBtn.attr('disabled', true);
          }
        });
      });

      // a 태그 클릭 시 탭 변경 기능
      $(etc.selector.viewInfoWrap).each(function() {
        var $this = $(this);
        $this
          .find('a[href*=tabContents]')
          .off('click.etc')
          .on('click.etc', function(e) {
            e.preventDefault();
            var $this = $(this);
            var href = $this.attr('href').split('#')[1];
            var target = common.el.doc.find('a[data-controls*=' + href + ']');
            target.trigger('click');
            // $(common.selector.bh).animate({scrollTop: target.closest('.tabAllCont').offset().top}, 300);
          });
      });

      // 첨부파일 선택 시 파일 이름 삽입
      $(etc.selector.fileInput).each(function() {
        var txtArea = $(this);
        var input = txtArea.prev('input[type=file]');
        input.off('change.etc').on('change.etc', function(e) {
          var $this = $(this);
          txtArea.val($this[0].files[0].name);
          txtArea.attr('value', $this[0].files[0].name);
        });
      });

      // 리뷰 영역 더보기 버튼 기능
      $(etc.selector.reviewList).each(function() {
        var $this = $(this);
        etc.methodes.reviewMoreBtn($this);
      });

      //탑버튼
      // $(etc.selector.btTop).each(function() {
      //   var $this = $(this);
      //   $this.off('click.etc').on('click.etc', function(e) {
      //     e.preventDefault();
      //     $(common.selector.bh).stop().animate({scrollTop: 0});
      //   });
      // });
    },
    init: function() {
      this.bind();
    }
  };

  // mvJs interface
  var mvJs = {
    // js 초기화
    init : common.handler.ready,
    utils: {
      //window 스크롤 비활성화
      scrollDisabled: utils.scrollDisabled,
      //window 스크롤 활성화
      scrollEnabled : utils.scrollEnabled,
      //dim 활성화
      dimmedShow    : utils.dimmedShow,
      //dim 비활성화
      dimmedHide    : utils.dimmedHide
    },
    swiper: {
      /**
       * 스와이프 업데이트
       * mvJs.swiper.update(target: jQuerySeletor)
       * target: 스와이프를 감싸고 있는 태그의 셀렉터
       * 스와이프 swiper-wrapper 안쪽 컨텐츠만 바뀌었을 때 실행
       * target의 자식으로 있는 스와이프를 update
       * mvJs.swiper.update($('.swiperWrap'))
       */
      update: mySwiper.methodes.swiperUpdate
    },
    popup: {
      /**
       * 팝업 show
       * mvJs.popup.show(target: jQuerySeletor)
       * target: 팝업 셀렉터
       * mvJs.popup.show($('.layer_popup'));
       */
      show: popup.methodes.show,
      /**
       * 팝업 hide
       * mvJs.popup.show(target: jQuerySeletor)
       * target: 팝업 셀렉터
       * mvJs.popup.hide($('.layer_popup'));
       */
      hide: popup.methodes.hide
    },
    ect: {
      /**
       * 리뷰 말줄임 시 더보기 버튼 및 이벤트 바인딩
       * mvJs.ect.reviewMoreBtn(target: jQuerySeletor)
       * target: 리뷰 리스트 셀렉터
       * mvJs.ect.reviewMoreBtn($('.reviewList'))
       */
      reviewMoreBtn: etc.methodes.reviewMoreBtn
    }
  };
  window.mvJs = mvJs;
})(window.jQuery, window);
