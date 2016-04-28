```config
title: Creating Foundation 6 plugins
published: April 26, 2016
url: plugins
tags:
  - Foundation
  - Plugin
  - JavaScript
layout: posts
```

Foundation for sites already comes with a huge amount of features and possibilities. Tons of options and events for each one allow you to customize each of them.
But for some use cases even that might not give you the functionality you need - so you decide to create your own component.

Luckily, writing Foundation plugins is quite easy because of the modular structure. This allows you to re-use the existing plugins or at least make use of the stunning utilities that come with the framework. To make use of existing plugins one can simply invoke them via JavaScript like so:

```js
var tooltip = new Foundation.Tooltip($element, {
  disableHover: true,  
  clickOpen: false
});
```

Or you can create them on the fly:
```js
var modal = new Foundation.Reveal($('<div class="reveal"/>').appendTo($('body')));
```
Of course using Foundation features requires you to include their code in your site before you call them. This can be done by simply including the whole Foundation JavaScript before your own plugin or by bundling them into your component's file, creating a lightweight module that can be used everywhere without the need of having unused Foundation code in your site.

## Leveraging JavaScript utilities
Foundation also offers many [JavaScript utilities](http://foundation.zurb.com/sites/docs/javascript-utilities.html) with the following being the most helpful when creating complex functionality:
* __Box:__ Gives you multiple possibilities to handle element dimensions and collisions. This is very helpful if you create markup in your code or toggle visibility of existing elements.
* __Keyboard:__ Helps you handle keyboard interactions with your plugin. You can either register your plugin like it's done for Foundation's plugins or you just use it to parse the pressed key.
* __Triggers:__ Offers a lot of event listeners that you can use to hook your code into. Useful for toggling visibility or opening/closing elements.

You can access them by using `Foundation.UtilName.functionName` anywhere in your code.

## Add a little UMD
By adding a UMD (unified module definition) wrapper around your module definition you can make it usable with tools like requireJS (the below code is written using ES2015):
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
  class PluginName {
    constructor(element, options) {
      [...]
    }
  }
  Foundation.plugin(PluginName, 'PluginName');
  return PluginName;
}));
```

## Next steps
Now that you know the basics of Foundation plugin creation you can start writing components that exactly fit your needs while leveraging the strong palette of Foundation features. You may check out [Joyride](https://github.com/zurb/joyride/tree/develop), which was part of Foundation 5 and is now an optional plugin for Foundation 6.