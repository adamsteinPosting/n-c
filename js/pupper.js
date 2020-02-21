"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var CoincidenceDetector = (function () {
    function CoincidenceDetector() {
        var _this = this;
        this.mutationList = [];
        this.mutationTimer = 0;
        this.mutationTimeoutSeconds = 0.1;
        this.mutationTasks = function (mutations) {
            _this.mutationRecord(mutations);
            if (_this.mutationTimer)
                clearTimeout(_this.mutationTimer);
            _this.mutationTimer = setTimeout(function () {
                var e_1, _a;
                try {
                    for (var _b = __values(_this.mutationList), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var node = _c.value;
                        _this.parseNode(node);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                _this.mutationList = [];
            }, _this.mutationTimeoutSeconds * 1000);
        };
        this.observer = new MutationObserver(this.mutationTasks);
        this.runObserver();
        this.parseNode(document.body);
    }
    CoincidenceDetector.prototype.parseNode = function (target) {
        var walk = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                return node.parentNode.nodeName !== "SCRIPT" &&
                    node.parentNode.nodeName !== "STYLE" &&
                    node.parentNode.nodeName !== "META" &&
                    node.parentNode.nodeName !== "INPUT" &&
                    node.parentNode.nodeName !== "FORM" &&
                    node.parentNode.nodeName !== "TEXTAREA" &&
                    node.parentNode.isContentEditable !== true &&
                    node.nodeValue.trim().length > 3
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            }
        }, false);
        while (walk.nextNode()) {
            var nodePointer = walk.currentNode;
            nodePointer.nodeValue = nodePointer.nodeValue.replace(coincidencePupperCompiledTrie, "(((" + "$1" + ")))");
        }
    };
    CoincidenceDetector.prototype.runObserver = function () {
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };
    CoincidenceDetector.prototype.mutationRecord = function (mutations) {
        var e_2, _a, e_3, _b;
        try {
            for (var mutations_1 = __values(mutations), mutations_1_1 = mutations_1.next(); !mutations_1_1.done; mutations_1_1 = mutations_1.next()) {
                var mutation = mutations_1_1.value;
                try {
                    for (var _c = (e_3 = void 0, __values(mutation.addedNodes)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var nodes = _d.value;
                        this.mutationList.push(nodes);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (mutations_1_1 && !mutations_1_1.done && (_a = mutations_1.return)) _a.call(mutations_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    return CoincidenceDetector;
}());
var coincidenceDetector = new CoincidenceDetector();
