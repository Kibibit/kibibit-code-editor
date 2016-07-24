angular.module('kibibitCodeEditor')

// ===================================================
// event manager factory to listen to or emit events
// this is application wide events that allow
// controllers & services to communicate
// with one another.
// ===================================================
.factory('EventManagerService', function() {

  // create event manager factory object
  var eventManagerFactory = {};

  eventManagerFactory.$events = {};
  eventManagerFactory.$context = {};

  // Register a function on an event
  eventManagerFactory.on = function(eventName, callback, thisArg) {
    // Initialize new event
    if (!eventManagerFactory.$events[eventName]) {
      eventManagerFactory.$events[eventName] = [];
      eventManagerFactory.$context[eventName] = [];
    }
    // Callback exists and is a function
    if (callback instanceof Function) {
      eventManagerFactory.$events[eventName].push(callback);
      // Add 'this' (if exists) as context. defaults to window
      eventManagerFactory.$context[eventName].push(thisArg ? thisArg : window);
    }
  };

  // Trigger an event
  eventManagerFactory.trigger = function(event, data) {
    // run all of the event's callbacks.
    // pass the data and run in the right context.
    eventManagerFactory.$events[event] = eventManagerFactory.$events[event] || [];
    eventManagerFactory.$context[event] = eventManagerFactory.$context[event] || [];
    eventManagerFactory.$events[event].forEach(function(callback, index) {
      eventManagerFactory.$events[event][index]
        .call(eventManagerFactory.$context[event][index], data);
    });
  };

  eventManagerFactory.off = function(event, fn) {
    // remove all events
    if (!event) {
      eventManagerFactory.$events = {};
      eventManagerFactory.$context = {};
    }
    // remove for a single event
    if (eventManagerFactory.$events[event]) {
      // remove a specific function
      if (fn) {
        eventManagerFactory.$events[event].forEach(function(element, index) {
          if (eventManagerFactory.$events[event][index] === fn) {
            eventManagerFactory.$events[event].slice(index, 1);
            eventManagerFactory.$context[event].slice(index, 1);
          }
        });
      }
      // remove all callbacks for a single event OR delete an empty event
      if (!fn || eventManagerFactory.$events[event] == []) {
        delete eventManagerFactory.$events[event];
        delete eventManagerFactory.$context[event];
      }
    }
  };

  // return event manager factory object
  return eventManagerFactory;

});
