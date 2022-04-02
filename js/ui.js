'use strict';

/** Define UI specific stuff.
 */
var UI = (function () {

  /** Resize the scrollable containers and make sure they are resized whenever
   * the window is resized.
   */
  $(function () {

    // Introduce FastClick for faster clicking on mobile.
    FastClick.attach(document.body);

    function resize() {

      var windowWidth = $(window).width();
      var windowHeight = $(window).height();

      // offset = navbar + panel-heading + padding-top + padding-bottom
      var offset = windowWidth < 992 ? 112 : 111;
      var scrollableHeight = windowHeight - offset;
      $('.scrollable').height(scrollableHeight + 'px');

      // move content elements to different-sized container elementss
      var types = ['research', 'hr', 'upgrades'];
      if (windowWidth < 992) {
        for (var i = 0; i < types.length; i++) {
          var $elem = $('#' + types[i] + 'Content');
          if ($elem.parent().attr('id') == types[i] + 'Large') {
            $elem.detach().appendTo('#' + types[i]);
          }
        }
      } else {
        for (var i = 0; i < types.length; i++) {
          var $elem = $('#' + types[i] + 'Content');
          if ($elem.parent().attr('id') != types[i] + 'Large') {
            $elem.detach().appendTo('#' + types[i] + 'Large');
          }
        }
      }

      // Used for column width and detector size
      var magicWidth = Math.max(windowWidth - (windowHeight - 90 + 10), 300);

      // set column width
      if (windowWidth < 600) {
        $('#column-lab').width(windowWidth - magicWidth);
        $('#column-tabs').width(magicWidth);
      } else {
        $('#column-lab').removeAttr('style');
        $('#column-tabs').removeAttr('style');
      }

      // init detector
      var detectorSize;
      if (windowWidth >= 1200) {
        detectorSize = 500;
      } else if (windowWidth < 768 && windowHeight - 90 < 300) {
        detectorSize = windowWidth - magicWidth - 10;
      } else if (windowWidth < 992) {
        detectorSize = 300;
      } else {
        detectorSize = 400;
      }

      if (detector.width != detectorSize) {
        $('#detector').width(detectorSize).height(detectorSize);
        detector.init(detectorSize);
      }

    }

    // set event listener on resize, then run one to init
    $(window).resize(resize);
    resize();

  });

  /** Show a bootstrap modal with dynamic content. */
  // TODO: make use or get rid of the `level` argument
  function showModal(title, text, level) {
    var $modal = $('#infoBox');
    $modal.find('#infoBoxLabel').html(title);
    $modal.find('.modal-body').html(text);
    $modal.modal({ show: true });
  };

  /** Display only the elements with data-min-level above a certain
   * threshold.
   */
  function showLevels(level) {
    $('#infoBox').find('[data-min-level]').each(function() {
      var $this = $(this);
      if (level >= $this.data('min-level')) {
        $this.show();
      } else {
        $this.hide();
      }
    });
  };

  function showUpdate(ident, insert) {
    var $ident = $(ident);
    $ident.append(insert);
    insert.animate({
      bottom: "+=30px",
      opacity: 0
    }, {
      duration: 500,
      complete: function() { $(this).remove(); }
    });
  }

  function showUpdateValue(ident, num) {
    if (num != 0) {
      var formatted = Helpers.formatNumberPostfix(num);
      var $update = $("<div></div>");
      if (num > 0) {
        $update.attr("class", "update-plus").html("+" + formatted);
      } else {
        $update.attr("class", "update-minus").html(formatted);
      }
      showUpdate(ident, $update);
    }
  }

  function slideUpRemove($element) {
    $element.slideUp(300, function() {
      $element.remove();
    });
  }

  function showAchievement(obj) {

    var $alert = $(
      '<div class="alert alert-success alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
          '<span aria-hidden="true">&times;</span>' +
          '<span class="sr-only">Close</span>' +
        '</button>' +
        '<i class="fa ' + obj.icon + ' alert-glyph"></i> ' +
        '<span class="alert-text">' + obj.description + '</span>' +
      '</div>'
    );

    $('#achievements-container').prepend($alert);

    window.setTimeout(slideUpRemove, 2000, $alert);

  }

  if ($.cookie('cookielaw') === undefined) {

    var $alert = $(
      '<div id="cookielaw" class="alert alert-info" role="alert">' +
        '<button type="button" class="btn btn-primary">OK</button>'+
        '<i class="fa fa-info-circle alert-glyph"></i> ' +
        '<span class="alert-text">' +
          'Particle Clicker uses local storage to store your current progress.' +
        '</span>'+
      '</div>'
    );

    $alert.find('button').click(function () {
      $.cookie('cookielaw', 'informed', { expires: 365 });
      slideUpRemove($('#cookielaw'));
    })

    $('#messages-container').append($alert);
  }

  if ($.cookie('cern60') === undefined) {

    var url = "https://home.web.cern.ch/news/news/computing/take-part-cern-60-public-computing-challenge";
    var $alert = $(
      '<div id="cern60" class="alert alert-info" role="alert">' +
        '<button type="button" class="btn btn-primary">Close</button>' +
        '<i class="fa fa-area-chart alert-glyph"></i> ' +
        '<span class="alert-text">' +
          '<a class="alert-link" href="' + url + '" target="_blank">' +
            'Join the CERN 60 computing challenge!' +
          '</a>' +
        '</span>' +
      '</div>'
    );

    $alert.find('button').click(function () {
      $.cookie('cern60', 'closed', { expires: 365 });
      slideUpRemove($('#cern60'));
    })

    $('#messages-container').append($alert);

  }

  return {
    showAchievement : showAchievement,
    showModal       : showModal,
    showLevels      : showLevels,
    showUpdateValue : showUpdateValue
  }
})();

// Reduce resource usage in the background by set detector.visible
// to false when the page is out of focus.
// https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
(function() {

	if ("visibilityState" in document) {

		// Modern
		document.addEventListener("visibilitychange", function () {
			detector.visible = document.visibilityState === "visible";
		});

	} else {

		var hidden = "hidden";

		function onchange() {
			detector.visible = !document[hidden];
		}

		// Standard
		if (hidden in document)
			document.addEventListener("visibilitychange", onchange);

		// Prefixed
		else if ((hidden = "mozHidden") in document)
			document.addEventListener("mozvisibilitychange", onchange);
		else if ((hidden = "webkitHidden") in document)
			document.addEventListener("webkitvisibilitychange", onchange);
		else if ((hidden = "msHidden") in document)
			document.addEventListener("msvisibilitychange", onchange);

		// Old
		else {
			function visible() { detector.visible = true; }
			function hidden() { detector.visible = false; }
			if ("onfocusin" in document) { // IE 9 and lower:
				document.onfocusin = visible;
				document.onfocusout = hidden;
			} else { // All others:
				window.onpageshow = window.onfocus = visible;
				window.onpagehide = window.onblur = hidden;
			}
		}

	}

})();
