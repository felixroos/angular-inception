/**
 * Created by felix on 02.11.15.
 https://github.com/felixroos/angular-inception.git
 */
'use strict';
angular.module('inception', ['RecursionHelper', 'jsonFormatter']).directive('conditionBuilder', function(RecursionHelper) {
  return {
    scope:       {
      ngModel:       '=',
      level:         '=',
      index:         '=',
      elevator:      '=',
      plantFunction: '=', //function that returns an end object
      template:      '='
    },
    templateUrl: 'condition-builder.tpl.html',
    compile:     function(element) {
      return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
        scope.ngModel = scope.ngModel || {value: "Root"};
        scope.nodeTemplate = scope.nodeTemplate || 'node.tpl.html';
        scope.level = scope.level || 0;
        scope.index = scope.index || 0;
        scope.plantFunction = _.isFunction(scope.plantFunction) || function(level, index) {
            return {value: 'Condition ' + scope.level};
          };

        scope.isArray = function(element) {
          return _.isArray(element);
        };
        scope.isObject = function(element) {
          return _.isObject(element);
        };

        scope.goDeeper = function(element, operator) {
          scope.ngModel = [element, operator, scope.plantFunction(scope.level, scope.index)];
        };

        scope.elevate = function(index) {
          scope.ngModel = scope.ngModel[index];
        };
      });
    }
  };
});