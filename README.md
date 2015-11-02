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

![Inception](http://i0.kym-cdn.com/photos/images/original/000/384/176/d2f.jpg)

##How it really works
Thanks to Mark Lagendijk and [this Stackoverflow](http://stackoverflow.com/questions/14430655/recursion-in-angular-directives), the most clean Solution is this:

```javascript
/* 
 * An Angular service which helps with creating recursive directives.
 * @author Mark Lagendijk
 * @license MIT
 */
angular.module('RecursionHelper', []).factory('RecursionHelper', ['$compile', function($compile) {
  return {
    /**
     * Manually compiles the element, fixing the recursion loop.
     * @param element
     * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
     * @returns An object containing the linking functions.
     */
    compile: function(element, link) {
      // Normalize the link parameter
      if (angular.isFunction(link)) {
        link = {post: link};
      }

      // Break the recursion loop by removing the contents
      var contents = element.contents().remove();
      var compiledContents;
      return {
        pre:  (link && link.pre) ? link.pre : null,
        /**
         * Compiles and re-adds the contents
         */
        post: function(scope, element) {
          // Compile the contents
          if (!compiledContents) {
            compiledContents = $compile(contents);
          }
          // Re-add the compiled contents to the element
          compiledContents(scope, function(clone) {
            element.append(clone);
          });

          // Call the post-linking function, if any
          if (link && link.post) {
            link.post.apply(null, arguments);
          }
        }
      };
    }
  };
}]);
```
The updated inception.js now looks like this:

```javascript
angular.module('inception', ['RecursionHelper'])
.directive('inception', function(RecursionHelper) {
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
```
The contents of the link function have been moved into the RecursionHelper's compile function (inside the directives compile function). Also see [this Plunkr](http://plnkr.co/edit/JAIyolmqPqO9KsynSiZp?p=preview).

Screenshot:

![Angular Inception](/screenshots/inception.png?raw=true)

![Cheers](https://imgflip.com/s/meme/Leonardo-Dicaprio-Cheers.jpg)

##Building a Tree List
With this knowledge, a (arbitrary deep) list can be built:

```javascript
angular.module('inception', ['RecursionHelper'])
.directive('inceptionList', function(RecursionHelper) {
  return {
    scope:       {
      list:        '=',
      level:       '=',
      index:       '='
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
```

Template:

```html
<ul>
  <li>Level {{level}}.{{index}} | <a ng-click="addElement()">Add</a></li>
  <inception-list level="level+1" index="$index" ng-repeat="element in list track by $index">
  </inception-list>
</ul>
```
Screenshot:

![Angular Inception List](/screenshots/list.png?raw=true)

