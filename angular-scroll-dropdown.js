/*
 * angular-scroll-dropdown
 *
 * display dropdown even in div who have overflow=[auto|hidden|scroll]
 *
 */

(function() {

  'use strict';

  angular.module('angular-scroll-dropdown', ['ui.bootstrap'])
  .directive('dropdownscroll', [
    '$window',
    function($window) {
      return {
        restrict: 'C',
        link: function (scope, elm) {
          var modal = document.querySelector('.modal');
          var modalDialog = document.querySelector('div.modal-dialog')
          var button = elm.find('.dropdown-toggle');

          // change dropdown position if click on button
          button.bind('click', function() {
            var dropdown = elm.find('.dropdown-menu-scoll');
            var dropDownTopInTop = modal.scrollTop + modalDialog.offsetTop + button.offset().top;
            var dropDownTopInBottom = dropDownTopInTop + button.outerHeight();

            dropdown.css('top', (dropDownTopInTop - dropdown.height()) + "px");
            dropdown.css('left', (modalDialog.offsetRight - button.offset().left) + "px");
          });

          // parent is scrolling => updates the position  of the active dropdown (if there is one)
          scope.$on('contentScroll:scrolling', function (event, scroll) {
            var modalDialog = document.querySelector('div.modal-dialog')
            var dropdown = elm.find('.dropdown-menu-scoll:visible');
            if (dropdown.length !== 0) {

              var dropDownTopInTop = button.offset().top + $window.pageYOffset;
              var dropDownTopInBottom = dropDownTopInTop + button.outerHeight() -  $window.pageYOffset;

              dropdown.css('top', modal.scrollTop + dropDownTopInTop + "px");
              dropdown.css('left', (modalDialog.offsetRight - button.offset().left) + "px");

              if (dropDownTopInTop < scroll.top || dropDownTopInBottom > scroll.bottom) {
                button.click();
              }
            }
          });
        },
      };
    }])
  .directive('contentscroll', [
    '$document', '$window',
    function($document, $window) {
      return {
        restrict: 'C',
        link: function(scope, elm) {
          var doc = angular.element($document);

          // send message to children if scrolling
          elm.bind('scroll', function() {
            scope.$broadcast(
              'contentScroll:scrolling',
              {
                top: elm.offset().top,
                bottom: (elm.offset().top + elm.height()),
              });
          });

          // Window has scrolling also
          doc.bind("scroll", function() {
            scope.$broadcast(
              'contentScroll:scrolling',
              {
                top: elm.offset().top,
                bottom: (elm.offset().top + elm.height()),
              });
          });
        },
      };
    }]);

})();
