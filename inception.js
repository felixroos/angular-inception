/**
 * Created by felix on 02.11.15.
 https://github.com/felixroos/angular-inception.git
 */
'use strict';
angular.module('inception', []).directive('inception', function() {
  return {
    scope:       {
      level:   '='
    },
    templateUrl: 'inception.tpl.html',
    link:        function(scope) {
      scope.level = scope.level || 1;
    }
  };
});