/**
 * Created by felix on 02.11.15.
 https://github.com/felixroos/angular-inception.git
 */
'use strict';
angular.module('inception', ['RecursionHelper']).directive('inceptionList', function(RecursionHelper) {
  return {
    scope:       {
      list:  '=',
      level: '=',
      index: '='
    },
    templateUrl: 'inception-list.tpl.html',
    compile:     function(element) {
      return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
        scope.list = [];
        scope.level = scope.level || 0;
        scope.index = scope.index || 0;
        scope.addElement = function() {
          scope.list.push("New Element");
        };
      });
    }
  };
});