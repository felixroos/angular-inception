#Angular Directive Inception
Here's an experiment on self containing Directives in AngularJS.
##How you would expect it to work
Naturally, one would expect Directives be nestable recursively like this:

index.html

```html
<!doctype html>
<html ng-app="inception">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"></script>
  <script src="inception.js"></script>
</head>
<body>
<h1>Angular Inception</h1>
<inception></inception>
</body>
</html>
```
inception.js

```javascript
angular.module('inception', [])
.directive('inception', function() {
  return {
    scope:       {
      ngModel: '=',
      level:   '='
    },
    templateUrl: 'inception.tpl.html',
    link:        function(scope) {
      scope.level = scope.level || 1;
    }
  };
});
```
inception.tpl.html

```html
<div ng-if="level!==10">Level {{level}}!</div>
<div ng-if="level===10">INCEPTION!</div>
<inception ng-if="level<10" level="level+1"></inception>
```
*Result*: Endless Loading.
