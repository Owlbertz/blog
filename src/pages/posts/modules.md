```config
title: Building Modules for Angular and Node
published: May 5, 2016
url: modules
tags:
  - JavaScript
  - Angular
  - Node
  - Modules
layout: posts
```

With some magic wrapping it is possible to easily re-use modules for Node in Angular apps and vice versa. By leveraging the concept of unified module definitions (UMD) creating platform independent services becomes easy.

## Why care about re-useable modules?
Putting stuff that belongs together into modules or services is a pretty good thing to do, because it allows you (and of course others) to re-use your code across multiple placed or even multiple projects. Just imagine a world without Node modules, where you would have re-invent the wheel every time or at least struggle with the integration of foreign code snippets into your project.

In some rare cases you might need to share the same functionalities (i.e. the same code) with your frontend as well as your backend. When I came across this point by having an Angular and a Node application that both need to access the same external API, I did not want to write the same code twice and immideately thought about a unified module definition.

## Unified module definitions
Unified module definitions allow you to use the same code in various environments, like on a Node server or in the browser &dash; with or without a module definition framework like requireJS. This is done by wrapping the module in a function that is passed as a parameter to the respective framework. The following example from the [UMDJS repository](https://github.com/umdjs/umd) shows a basic UMD wrapping.

```js
!(function (root, factory) {
  if (typeof define === 'function' && define.amd) {  // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') { // Node, CommonJS-like
    module.exports = factory(require('jquery'));
  } else { // Browser globals (root is window)
    root.returnExports = factory(root.jQuery);
  }
}(this, function ($) {
  var service = {};
  /* some magic code enhancing the service... */
  return service;
}));
```
## Wrapping for Angular
The given code can be adjusted to also fit Angular's way of defining dependencies by adding another branch in the `if` / `else` statments.

```js
!(function (root, factory) {
  if (typeof module === 'object' && module.exports) { // Node
    /* export your service as module... */
  } else if (typeof angular === 'object') { // Angular  
    /* export your service as factory... */
  } 
}(this, function ($) {
  var service = {};
  /* some magic code enhancing the service... */
  return service;
}));
```
Like when working with requireJS the new block to check for Angular will only be executed when your app is using Angular. It makes sense to define a factory for your app here that then can be used by the controllers.

## Injecting dependencies
In the example above jQuery is defined as a dependency for the service. That's an easy thing to do because jQuery offers the same functionality for browsers and Node (at least for some utilities like `$.extend`). But what if you need to make use of some more core components. For example, if you want to do some HTTP(S) requests, wouldn't it be nice to make use of an already existing module that offers such a functionality? Trick question: it would. So, just add the `$http` service to the example above and you are ready to go.

Unfortunately not, because when you run your module in a Node component, you will most likely get something like `ReferenceError: $http is not defined`.
So what can you do? Passing the Node `request` module would result in the same error when using the code in a browser. This problem can be easily solved by defining some helper service that returns either the `$http` or the `request` module.
```js
!(function (root, service) {
  if (typeof module === 'object' && module.exports) { // Node
    var request = require('request'),
      requestUtil = function(options, callback) {
        request(options, function(err, response, body) {
          callback(body);
        });
      };
    module.exports = service(requestUtil);
  } else if (typeof angular === 'object') { // Angular  
    app.factory('myService', ['$rootScope', '$http', function ($rootScope, $http) {
      var requestUtil = function(options, callback) {
        $http(options)
        .success(function (data) {
          callback(data);
        });
      };
      return service(requestUtil);
    }]);
  } 
}(this, function (requestUtil) {
  var service = {};
  service.get = function(id, callback) {
    requestUtil({
      url: 'http://someurl.com/items/' + id
    }, function(data, err) {
      callback(data);
    });
  };
  return service;
}));
```
Now you can safely access the `requestUtil` in your code and it will work in your Angular app as well as its Node backend. This short example allows you to query an item with a given ID from some API.

## What now?
Now that your code is usable accross Angular and Node, maybe you want to also offer it to those poor people that don't use either of those, but only the basic jQuery. If so, just go ahead and create another case in the `requestUtìl` that uses `$.ajax` to perform HTTP requests.
