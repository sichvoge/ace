define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var RAMLHighlightRules = require("./raml_highlight_rules").RAMLHighlightRules;
// TODO: pick appropriate fold mode
var FoldMode = require("./folding/cstyle").FoldMode;
var WorkerClient = require("../worker/worker_client").WorkerClient;

var Mode = function() {
    this.HighlightRules = RAMLHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    // this.lineCommentStart = ""#"";
    // this.blockComment = {start: ""/*"", end: ""*/""};
    // Extra logic goes here.

    this.createWorker = function(session) {
        var worker = new WorkerClient(["ace"], "ace/mode/raml_worker", "RamlWorker");
        worker.attachToDocument(session.getDocument());

        worker.on("annotate", function(e) {
            session.setAnnotations(e.data);
        });

        worker.on("terminate", function() {
            session.clearAnnotations();
        });

        return worker;
    };

    this.$id = "ace/mode/raml"
}).call(Mode.prototype);

exports.Mode = Mode;
});
