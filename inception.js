/**
 * Created by felix on 02.11.15.
 https://github.com/felixroos/angular-inception.git
 */
'use strict';
angular.module('inception', ['RecursionHelper']).directive('inception', function(RecursionHelper) {
  return {
    scope:       {
      level:   '='
    },
    templateUrl: 'inception.tpl.html',
    compile: function(element) {
      return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
        scope.level = scope.level || 1;
      });
    }
  };
});