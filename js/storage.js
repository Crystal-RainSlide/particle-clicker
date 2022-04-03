'use strict';
/** Allows to save objects to HTML5 local storage.
 * However, it can only save properties, not functions.
 */
var ObjectStorage = (function() {

  if ('localStorage' in window) {

    return {
      save: function(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
      },
      load: function(key) {
        return JSON.parse(localStorage.getItem(key));
      },
      clear: function() {
        localStorage.clear();
      }
    };

  } else {

    alert(
      'Your browser does not support local storage, ' +
      'if you refresh this page, all progress will be lost.\n\n' +
      'Switch to a modern browser to prevent this.'
    );

    return {
      save: function(key, item) {},
      load: function(key) { return null; },
      clear: function() {}
    };

  };

}());
