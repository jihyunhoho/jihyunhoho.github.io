$(function() {
  admin.init();
});

(function($) {
  var m = window.admin = {};
  m.gnb = function() {
    var snb = $('#snb');
    snb.each(function() {
      accordion.init($(this));
    });

    // nav.on('mouseenter', function(e) {
    //   $(this).parent().siblings().find('>div').hide();
    //   $(this).next().show();
    // });
    // $('nav>ul>li>div')
    //   .on('mouseenter', function(e) {
    //     $(this).show();
    //   })
    //   .on('mouseleave', function(e) {
    //     $('nav>ul>li>div').hide();
    //   });
  };
  m.datepicker = function() {
    $('.cal')
      .prev()
      .datepicker({
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        monthNames : [
          '1월',
          '2월',
          '3월',
          '4월',
          '5월',
          '6월',
          '7월',
          '8월',
          '9월',
          '10월',
          '11월',
          '12월'
        ],
        showMonthAfterYear: true,
        yearSuffix        : '년',
        dateFormat        : 'yy/mm/dd',
        beforeShow        : function(el, ob) {
          if ($(el).attr('readonly')) {
            return false;
          }
          setTimeout(function() {
            changeDatepicker();
          }, 0);
        },
        onChangeMonthYear: function() {
          setTimeout(function() {
            changeDatepicker();
          }, 0);
        },
        onSelect: function(date, ob) {
          if ($(ob.input).closest('ul').find('.hasDatepicker').length > 1) {
            if (
              $(ob.input).index('.dataSearch .hasDatepicker') === 0 &&
              $(ob.input)
                .closest('ul')
                .find('.hasDatepicker')
                .last()
                .datepicker('getDate') !== null
            ) {
              setStardEndDate(ob, '조회기간(일)을 정확히 입력해주세요.');
            } else if (
              $(ob.input).index('.dataSearch .hasDatepicker') === 1 &&
              $(ob.input)
                .closest('ul')
                .find('.hasDatepicker')
                .first()
                .datepicker('getDate') !== null
            ) {
              setStardEndDate(ob, '조회기간(일)을 정확히 입력해주세요.');
            }
          } else {
            if ($('h1').text().match(/약관/)) {
              if (
                new Date().getTime() >
                $(ob.input).datepicker('getDate').getTime()
              ) {
                alert('당일 이전 날짜는 선택하실 수 없습니다.');
                $(ob.input).datepicker('hide');
                $(ob.input).datepicker('setDate', new Date());
              }
            }
          }
        }
      });
    $('#' + $.datepicker._mainDivId).addClass('calendarWrap');
    function changeDatepicker() {
      $('.ui-state-highlight').parent().addClass('today');
      $('.ui-datepicker-calendar tr').each(function(k) {
        $(this).find('.ui-datepicker-week-end:first').addClass('sun');
        $(this).find('.ui-datepicker-week-end:last').addClass('sat');
      });
      //jquery-ui.min 수정  a -> button , class :prev, next , div -> strong , headerClass + termWrap
    }
    function setStardEndDate(ob, txt) {
      var last = ob.lastVal;
      var startTime = $(ob.input)
        .closest('ul')
        .find('.hasDatepicker')
        .first()
        .datepicker('getDate')
        .getTime();
      var endTime = $(ob.input)
        .closest('ul')
        .find('.hasDatepicker')
        .last()
        .datepicker('getDate')
        .getTime();
      if (endTime < startTime) {
        alert(txt);
        $(ob.input).datepicker('hide');
        $(ob.input).datepicker('setDate', last);
      }
    }
    $('.cal').on('focus', function(e) {
      $.datepicker._showDatepicker($(this).prev()[0]);
    });
  };
  m.tab = function() {
    var tab = $('.toggleTab a');
    tab.on('click', function(e) {
      e.preventDefault();
      $(this).parent().addClass('on');
      $(this).parent().siblings().removeClass('on');
      $(this).closest('.toggleTab').nextAll('div.tabCont').hide();
      $(this)
        .closest('.toggleTab')
        .nextAll('div.tabCont')
        .eq($(this).parent().index())
        .show();
    });
  };
  m.layer = function() {
    var $btn = $('[data-path]');
    $btn.on('click', function(e) {
      e.preventDefault();
      m.layershow($(this).attr('data-path'));
    });
    $(document).on('click', '.popLayer .close', function(e) {
      e.preventDefault();
      m.layerhide();
    });
  };
  m.layershow = function(id) {
    $('.dimmed').show();
    $('#' + id).show();
  };
  m.layerhide = function() {
    $('.dimmed').hide();
    $('.popLayer').hide();
  };
  m.init = function() {
    m.gnb();
    m.datepicker();
    m.tab();
    m.layer();
  };

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
        if (target.hasClass('snbListDep2') || target.hasClass('snbListDep3')) {
          btn = target.prev('a');
          btn.attr('aria-selected', 'true');
        }
        btn.attr('aria-expanded', 'true');

        target.hide().slideDown(aniSpeed);
        // 마이페이지 좌즉에 붙는 타입은 하나만 열리게 처리
        if (target.hasClass('snbListDep2') || target.hasClass('snbListDep3')) {
          target
            .closest('li')
            .siblings('li')
            .children(
              '.snbDep1[aria-expanded=true], .snbDep2[aria-expanded=true]'
            )
            .each(function() {
              var $this = $(this);
              var con = $this.next('ul');
              con.slideUp(aniSpeed, function() {
                $this.attr({
                  'aria-expanded': 'false',
                  'aria-selected': 'false'
                });
              });
            });
        }
        // }
      },
      hide: function(target, speed) {
        if (target.is(':animated')) {
          return false;
        }
        // 마이페이지 좌즉에 붙는 타입
        var aniSpeed = speed || 300;
        var btn = target.prev('.toggleBtn');
        if (target.hasClass('snbListDep2') || target.hasClass('snbListDep3')) {
          btn = target.prev('a');
          btn.attr('aria-selected', 'true');
        }

        target.slideUp(aniSpeed, function() {
          btn.attr('aria-expanded', 'false');
          // 마이페이지 좌즉에 붙는 타입
          if (
            target.hasClass('snbListDep2') ||
            target.hasClass('snbListDep3')
          ) {
            btn.attr('aria-selected', 'false');
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
        if ($this.hasClass('snbDep1') || $this.hasClass('snbDep2')) {
          con = $this.next('ul');
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
      this.el.btn2 = el.find('.snbDep2');
    },
    bind: function() {
      this.el.btn.each(function() {
        var $this = $(this);
        $this
          .off('click.accordion')
          .on('click.accordion', accordion.handler.toggle);
      });
      this.el.btn2.each(function() {
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
})(jQuery);
