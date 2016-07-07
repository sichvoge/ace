define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var parse = require("./raml/ramlparse");

var RamlWorker = exports.RamlWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(200);
};

oop.inherits(RamlWorker, Mirror);

(function() {

    this.onUpdate = function() {
      var value = this.doc.getValue();
      var errors = [];

      var api = parse.parseRAML(value, {rejectOnErrors: true, attributeDefaults: true});

      api.then(function(content){
        sender.emit("annotate", []);
      }).catch(function(error) {
        var results = error.parserErrors;

        for (var i = 0; i < results.length; i++) {
          var error = results[i];

          // convert to ace gutter annotation
          errors.push({
              row: error.line, // must be 0 based
              column: error.column,  // must be 0 based
              text: error.message,  // text to show in tooltip
              type: error.isWarning ? "warning" : "error"
          });
        }

        sender.emit("annotate", errors);
      });
    };

}).call(RamlWorker.prototype);

});
