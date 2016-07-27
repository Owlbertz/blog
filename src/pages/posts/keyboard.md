```config
title: Leveraging Foundation's Keyboard Util
published: July 25, 2016
url: keyboard
tags:
  - JavaScript
  - Foundation
  - Keyboard
layout: posts
```
Foundation 6 comes with some very useful utilities. They are deeply integrated into the Foundation plugins, but also provide functions to be used in the surrounding JavaScript code as well.

## Accessing Foundation's Utils
A basic documentation of each Util can be found in [the Foundation documentation](http://foundation.zurb.com/sites/docs/javascript-utilities.html). While this page gives a quick overview about the purpose of each component, usage examples can of course be found in the Foundation component code.

The Utils are all part of the global Foundation object, which bundles all publicly available functionalities of the framework. Each Util can be invoked as a property pf the `Foundation` object by its name. For example the Box Util, which offers functionalities to detect collisions between elements, can be invoked using `Foundation.Box`. The Keyboard Util is accessible with `Foundation.Keyboard` and so on.

So in general, one can easily make use of the utility functions anywhere in the JavaScript code, as long as the Foundation JavaScript file has been included before usage. For custom bundled JavaScript, the respective files of course have to be included.

## Introducing the Keyboard Util
In this article, I will give an introduction on how to use the Keyboard Util. This utility is used in the framework to handle keyboard inputs and therefore has a special meaning for the accessibility of Foundation. But besides handling tabbing and arrow keys, this Util can be used to handle every other character as well, allowing you to create rich internet applications (RIAs) that offer shortcuts to the users.

The Keyboard Util comes with the following public functions:
- `findFocusable(jQueryElement)`: Returns all elements inside of the given element that can potentially be focussed. This is used to increase the accessibility of complex components and useful for trapping the focus inside a modal or focussing the next link inside a Dropdown Menu.
- `parseKey(event)`: Takes the native JavaScript event and returns a string representation of the pressed keys, like `A`, `CTRL_A`, `SHIFT` or `ARROW_LEFT`. Of course this should be used inside a `keyDown` event-listener. This is the function that can be used to implement any kind of shortcut in a website.
- ``register('pluginName', configuration)`: Registers a conneciton between a key value and an action for a given plugin/component. This allows you to use terms like `open` and `close` when using `handeKey` to handle a keyboard event.
- `handleKey(event, 'pluginName', functions)`: Once a plugin has been registered using `register`, this function can be used inside a `keyDown` event-listener to automatically execute a function based on the pressed key. This function is almost present in every Foundation component, but could also be used to register event to any custom part of the page since the mapping is done using a string.

## Using Keyboard Util for RIAs
Now that we learned about the possibilities the Keyboard Util offers, we can go ahead developing an application using it. As mentioned above there are two ways of handling key events with the Keyboard Util, either `parseKey` or `handleKey`, with the latter one bundling the functionalities of the former one into components.

With that being said, it depends on the application what approach to use: If the application is rather complex, it makes sense to bundle keyboard events in components with `handleKey` for better maintainability. If it's all about handling a few keys, going with the plain usage of `parseKey` should be enough. 

Because we want some rich application, I will go ahead with the component based approach. Let's imagine we have some sort of rich text editor. Besides the main requirements of formatting text, we want allow the users to save and load files. To fit to the example, let's assume we have some component that handles the menu and one that deals with the shortcuts for the editor.

```js
// Register editor
Foundation.Keyboard.register('editor', {
  'CTRL_I': 'italic',
  'CTRL_B': 'bold',
  'CTRL_U': 'underlined'
});
// Register file menu
Foundation.Keyboard.register('fileMenu', {
  'CTRL_S': 'save'
});
```

We now have two different components that will work independently by calling `handleKey` with the component name. Besides the possibility to register the components in different locations (or files) the handling can also take place in different event-handlers. For example the `fileMenu` component can be handled globally (i.e. on `<body>`) and the `editor` component can be listening to events inside the `<textarea>` only.

```js
// Handle actions for the editor (e.g. in event handler on textarea)
Foundation.Keyboard.handleKey(event, 'editor', {
  bold: function() {
    /* Some logic here */
  },
  italic: function() {
    /* Some logic here */
  },
  underline: function() {
    /* Some logic here */
  }
});
// Handle actions for the menu (e.g. in event handler on body)
Foundation.Keyboard.handleKey(event, 'fileMenu', {
  save: function() {
    /* Some logic here */
  }
  /* More events... */
});
```
There are two reserved mappings, that have a special purpose: `handled` and `unhandled` can be used as keys in the `handleKey` mapping to execute standard actions when dealing with events, e.g. call `event.preventDefault()`. The function mapped to `handled` will be invoked if the actual mapped function returns `true`, otherwise `unhandled` will be executed. 

For example when the tab key should be used to follow a complex navigation pattern (e.g. within the Drilldown Menu), the `register` function can be used to map the `TAB`-key to the `next` action. Within the `handleKey` call, this action can then be associated with a function to be executed. This function should then return `true` to trigger the `handled` action, which is mapped to a function that performs a `event.preventDefault()` call. This will prevent the browser from executing the default behavior for the tab key which would mess up the custom navigation pattern.


## Summing it up
The following CodePen sums up the article by providing a basic text editor that offers some features like saving and text formatting. Don't expect too much - it's all about the keyboard usage!

[Open the Pen](http://codepen.io/Owlbertz/pen/ZOomgz).

<iframe src="http://s.codepen.io/Owlbertz/debug/ZOomgz" width="100%" height="380"></iframe>

*Please note that the example makes use of `$.extend` several times to avoid duplicate code. This is of course related to the fact that the demo is focused on the keyboard usage and not the editing functionality and therefore there is not much detail in the rest of the application.*