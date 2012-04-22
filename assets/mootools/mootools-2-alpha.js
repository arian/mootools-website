(function(modules) {
    var cache = {}, require = function(id) {
        var module = cache[id];
        if (!module) {
            module = cache[id] = {
                exports: {}
            };
            var exports = module.exports;
            modules[id].call(exports, require, module, exports, window);
        }
        return module.exports;
    };
    require("0");
})({
    "0": function(require, module, exports, global) {
        "use strict";
        var prime = require("1");
        var type = require("2");
        var map = require("3");
        var list = require("6");
        var hash = require("7");
        var string = require("8");
        var number = require("a");
        var ghost = require("c");
        var array = require("4");
        prime.type = type;
        prime.map = map;
        prime.list = list;
        prime.hash = hash;
        prime.string = string;
        prime.number = number;
        var mootools = {};
        mootools._ = ghost;
        mootools.prime = prime;
        mootools.array = array;
        var slick = require("d");
        var nodes = require("g");
        nodes.use(slick);
        mootools.$ = nodes;
        var moofx = require("p");
        mootools.moofx = moofx;
        global.mootools = mootools;
    },
    "1": function(require, module, exports, global) {
        "use strict";
        var has = function(self, key) {
            return Object.hasOwnProperty.call(self, key);
        };
        var each = function(object, method, context) {
            for (var key in object) if (method.call(context, object[key], key, object) === false) break;
            return object;
        };
        if (!{
            valueOf: 0
        }.propertyIsEnumerable("valueOf")) {
            var buggy = "constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(","), proto = Object.prototype;
            each = function(object, method, context) {
                var i = buggy.length, key, value;
                for (key in object) if (method.call(context, object[key], key, object) === false) return object;
                while (i--) {
                    key = buggy[i];
                    value = object[key];
                    if (value !== proto[key] && method.call(context, value, key, object) === false) break;
                }
                return object;
            };
        }
        var create = Object.create || function(self) {
            var F = function() {};
            F.prototype = self;
            return new F;
        };
        var mutator = function(key, value) {
            this.prototype[key] = value;
        };
        var implement = function(obj) {
            each(obj, function(value, key) {
                if (key !== "constructor" && key !== "inherits" && key !== "mutator") this.mutator(key, value);
            }, this);
            return this;
        };
        var prime = function(proto) {
            var superprime = proto.inherits, superproto;
            if (superprime) superproto = superprime.prototype;
            var constructor = has(proto, "constructor") ? proto.constructor : superprime ? function() {
                return superproto.constructor.apply(this, arguments);
            } : function() {};
            if (superprime) {
                var cproto = constructor.prototype = create(superproto);
                constructor.parent = superproto;
                cproto.constructor = constructor;
            }
            constructor.mutator = proto.mutator || superprime && superprime.mutator || mutator;
            constructor.implement = implement;
            return constructor.implement(proto);
        };
        prime.each = each;
        prime.has = has;
        prime.create = create;
        module.exports = prime;
    },
    "2": function(require, module, exports, global) {
        "use strict";
        var toString = Object.prototype.toString, types = /number|object|array|string|function|date|regexp|boolean/;
        var type = function(object) {
            if (object == null) return "null";
            var string = toString.call(object).slice(8, -1).toLowerCase();
            if (string === "number" && isNaN(object)) return "null";
            if (types.test(string)) return string;
            return "object";
        };
        module.exports = type;
    },
    "3": function(require, module, exports, global) {
        "use strict";
        var prime = require("1"), array = require("4"), proto = array.prototype;
        var Map = prime({
            constructor: function() {
                if (!(this instanceof Map)) return new Map;
                this.length = 0;
                this._keys = [];
                this._values = [];
            },
            set: function(key, value) {
                var index = proto.indexOf.call(this._keys, key);
                if (index === -1) {
                    this._keys[this.length] = key;
                    this._values[this.length] = value;
                    this.length++;
                } else {
                    this._values[index] = value;
                }
                return this;
            },
            get: function(key) {
                var index = proto.indexOf.call(this._keys, key);
                return index === -1 ? null : this._values[index];
            },
            count: function() {
                return this.length;
            },
            each: function(method, context) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (method.call(context, this._values[i], this._keys[i], this) === false) break;
                }
                return this;
            },
            map: function(method, context) {
                var results = new Map;
                this.each(function(value, key) {
                    results.set(key, method.call(context, value, key, this));
                }, this);
                return results;
            },
            filter: function(method, context) {
                var results = new Map;
                this.each(function(value, key) {
                    results.set(key, method.call(context, value, key, this));
                }, this);
                return results;
            },
            every: function(method, context) {
                var every = true;
                this.each(function(value, key) {
                    if (!method.call(context, value, key, this)) return every = false;
                }, this);
                return every;
            },
            some: function(method, context) {
                var some = false;
                this.each(function(value, key) {
                    if (method.call(context, value, key, this)) return !(some = true);
                }, this);
                return some;
            },
            index: function(value) {
                var index = proto.indexOf.call(this._values, value);
                return index > -1 ? this._keys[index] : null;
            },
            remove: function(key) {
                var index = proto.indexOf.call(this._keys, key);
                if (index !== -1) {
                    this._keys.splice(index, 1);
                    return this._values.splice(index, 1)[0];
                    this.length--;
                }
                return null;
            },
            keys: function() {
                return this._keys.slice();
            },
            values: function() {
                return this._values.slice();
            },
            toString: function() {
                return "[object Map]";
            }
        });
        module.exports = Map;
    },
    "4": function(require, module, exports, global) {
        "use strict";
        var shell = require("5");
        var proto = Array.prototype;
        var array = shell({
            filter: proto.filter || function(fn, context) {
                var results = [];
                for (var i = 0, l = this.length >>> 0; i < l; i++) if (i in this) {
                    var value = this[i];
                    if (fn.call(context, value, i, this)) results.push(value);
                }
                return results;
            },
            indexOf: proto.indexOf || function(item, from) {
                for (var l = this.length >>> 0, i = from < 0 ? Math.max(0, l + from) : from || 0; i < l; i++) {
                    if (i in this && this[i] === item) return i;
                }
                return -1;
            },
            map: proto.map || function(fn, context) {
                var length = this.length >>> 0, results = Array(length);
                for (var i = 0, l = length; i < l; i++) {
                    if (i in this) results[i] = fn.call(context, this[i], i, this);
                }
                return results;
            },
            forEach: proto.forEach || function(fn, context) {
                for (var i = 0, l = this.length >>> 0; i < l; i++) {
                    if (i in this) fn.call(context, this[i], i, this);
                }
            },
            every: proto.every || function(fn, context) {
                for (var i = 0, l = this.length >>> 0; i < l; i++) {
                    if (i in this && !fn.call(context, this[i], i, this)) return false;
                }
                return true;
            },
            some: proto.some || function(fn, context) {
                for (var i = 0, l = this.length >>> 0; i < l; i++) {
                    if (i in this && fn.call(context, this[i], i, this)) return true;
                }
                return false;
            }
        });
        array.isArray = Array.isArray || function(self) {
            return Object.prototype.toString.call(self) === "[object Array]";
        };
        var methods = {};
        var names = "pop,push,reverse,shift,sort,splice,unshift,concat,join,slice,lastIndexOf,reduce,reduceRight".split(",");
        for (var i = 0, name, method; name = names[i++]; ) if (method = proto[name]) methods[name] = method;
        array.implement(methods);
        module.exports = array;
    },
    "5": function(require, module, exports, global) {
        "use strict";
        var prime = require("1"), slice = Array.prototype.slice;
        var shell = prime({
            mutator: function(key, method) {
                this[key] = function(self) {
                    var args = arguments.length > 1 ? slice.call(arguments, 1) : [];
                    return method.apply(self, args);
                };
                this.prototype[key] = method;
            },
            constructor: {
                prototype: {}
            }
        });
        module.exports = function(proto) {
            var inherits = proto.inherits || (proto.inherits = shell);
            proto.constructor = prime.create(inherits);
            return prime(proto);
        };
    },
    "6": function(require, module, exports, global) {
        "use strict";
        var shell = require("5");
        var list = shell({
            inherits: require("4"),
            set: function(i, value) {
                this[i] = value;
                return this;
            },
            get: function(i) {
                return i in this ? this[i] : null;
            },
            count: function() {
                return this.length;
            },
            each: function(method, context) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (i in this && method.call(context, i, this[i], this) === false) break;
                }
                return this;
            },
            index: function(value) {
                var index = list.indexOf(value);
                return index == -1 ? null : index;
            },
            remove: function(i) {
                return list.splice(this, i, 1)[0];
            },
            keys: function() {
                return list.map(this, function(v, i) {
                    return i;
                });
            },
            values: function() {
                return list.slice(this);
            }
        });
        module.exports = list;
    },
    "7": function(require, module, exports, global) {
        "use strict";
        var prime = require("1"), shell = require("5");
        var hash = shell({
            set: function(key, value) {
                this[key] = value;
                return this;
            },
            get: function(key) {
                return prime.has(this, key) ? this[key] : null;
            },
            count: function() {
                var length = 0;
                prime.each(this, function() {
                    length++;
                });
                return length;
            },
            each: function(method, context) {
                return prime.each(this, method, context);
            },
            map: function(method, context) {
                var results = {};
                prime.each(this, function(value, key, self) {
                    results[key] = method.call(context, value, key, self);
                });
                return results;
            },
            filter: function(method, context) {
                var results = {};
                prime.each(this, function(value, key, self) {
                    if (method.call(context, value, key, self)) results[key] = value;
                });
                return results;
            },
            every: function(method, bind) {
                var every = true;
                prime.each(this, function(value, key, self) {
                    if (!method.call(context, value, key, self)) return every = false;
                });
                return every;
            },
            some: function(method, bind) {
                var some = false;
                prime.each(this, function(value, key, self) {
                    if (!some && method.call(context, value, key, self)) return !(some = true);
                });
                return some;
            },
            index: function(value) {
                var key = null;
                prime.each(this, function(match, k) {
                    if (value === match) {
                        key = k;
                        return false;
                    }
                });
                return key;
            },
            remove: function(key) {
                delete this[key];
            },
            keys: function() {
                var keys = [];
                prime.each(this, function(value, key) {
                    keys.push(key);
                });
                return keys;
            },
            values: function() {
                var values = [];
                prime.each(this, function(value, key) {
                    values.push(value);
                });
                return values;
            }
        });
        hash.each = prime.each;
        if (typeof JSON !== "undefined") hash.implement({
            encode: function() {
                return JSON.stringify(this);
            }
        });
        module.exports = hash;
    },
    "8": function(require, module, exports, global) {
        "use strict";
        var shell = require("5");
        var string = shell({
            inherits: require("9"),
            contains: function(string, separator) {
                return (separator ? (separator + this + separator).indexOf(separator + string + separator) : (this + "").indexOf(string)) > -1;
            },
            clean: function() {
                return string.trim((this + "").replace(/\s+/g, " "));
            },
            camelize: function() {
                return (this + "").replace(/-\D/g, function(match) {
                    return match.charAt(1).toUpperCase();
                });
            },
            hyphenate: function() {
                return (this + "").replace(/[A-Z]/g, function(match) {
                    return "-" + match.toLowerCase();
                });
            },
            capitalize: function() {
                return (this + "").replace(/\b[a-z]/g, function(match) {
                    return match.toUpperCase();
                });
            },
            escape: function() {
                return (this + "").replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
            },
            number: function() {
                return parseFloat(this);
            }
        });
        if (typeof JSON !== "undefined") string.implement({
            decode: function() {
                return JSON.parse(this);
            }
        });
        module.exports = string;
    },
    "9": function(require, module, exports, global) {
        "use strict";
        var shell = require("5");
        var proto = String.prototype;
        var string = shell({
            trim: proto.trim || function() {
                return (this + "").replace(/^\s+|\s+$/g, "");
            }
        });
        var methods = {};
        var names = "charAt,charCodeAt,concat,indexOf,lastIndexOf,match,quote,replace,search,slice,split,substr,substring,toLowerCase,toUpperCase".split(",");
        for (var i = 0, name, method; name = names[i++]; ) if (method = proto[name]) methods[name] = method;
        string.implement(methods);
        module.exports = string;
    },
    a: function(require, module, exports, global) {
        "use strict";
        var shell = require("5");
        var number = shell({
            inherits: require("b"),
            limit: function(min, max) {
                return Math.min(max, Math.max(min, this));
            },
            round: function(precision) {
                return parseFloat(number.toPrecision(this, precision));
            },
            times: function(fn, context) {
                for (var i = 0; i < this; i++) fn.call(context, i, null, this);
                return this;
            },
            random: function(max) {
                return Math.floor(Math.random() * (max - this + 1) + this);
            }
        });
        module.exports = number;
    },
    b: function(require, module, exports, global) {
        "use strict";
        var shell = require("5");
        var proto = Number.prototype;
        var number = shell({
            toExponential: proto.toExponential,
            toFixed: proto.toFixed,
            toPrecision: proto.toPrecision
        });
        module.exports = number;
    },
    c: function(require, module, exports, global) {
        "use strict";
        var prime = require("1"), type = require("2"), string = require("8"), number = require("a"), map = require("3"), list = require("6"), hash = require("7");
        var ghosts = map();
        var ghost = function(self) {
            var responders = ghosts._keys, hashes = ghosts._values;
            var Ghost;
            for (var i = responders.length, responder; responder = responders[--i]; ) if (responder(self)) {
                Ghost = hashes[i].ghost;
                break;
            }
            return Ghost ? new Ghost(self) : self;
        };
        ghost.register = function(responder, base) {
            if (ghosts.get(responder)) return ghost;
            var Ghost = prime({
                mutator: function(key, method) {
                    this.prototype[key] = function() {
                        return ghost(method.apply(this.valueOf(), arguments));
                    };
                },
                constructor: function(self) {
                    this.valueOf = function() {
                        return self;
                    };
                    this.toString = function() {
                        return self + "";
                    };
                    this.is = function(object) {
                        return self === object;
                    };
                }
            });
            var mutator = base.mutator;
            base.mutator = function(key, method) {
                mutator.call(this, key, method);
                Ghost.mutator(key, method);
            };
            Ghost.implement(base.prototype);
            ghosts.set(responder, {
                base: base,
                ghost: Ghost,
                mutator: mutator
            });
            return ghost;
        };
        ghost.unregister = function(responder) {
            var hash = ghosts.remove(responder);
            if (hash) hash.base.mutator = hash.mutator;
            return ghost;
        };
        ghost.register(function(self) {
            return self && (type(self) === "array" || type(self.length) === "number");
        }, list);
        ghost.register(function(self) {
            return type(self) === "object";
        }, hash);
        ghost.register(function(self) {
            return type(self) === "number";
        }, number);
        ghost.register(function(self) {
            return type(self) === "string";
        }, string);
        ghost.register(function(self) {
            return self && self.toString() == "[object Map]";
        }, map);
        module.exports = ghost;
    },
    d: function(require, module, exports, global) {
        "use strict";
        var parse = require("e"), slick = require("f");
        slick.parse = parse;
        module.exports = slick;
    },
    e: function(require, module, exports, global) {
        "use strict";
        var escapeRe = /([-.*+?^${}()|[\]\/\\])/g, unescapeRe = /\\/g;
        var escape = function(string) {
            return (string + "").replace(escapeRe, "\\$1");
        };
        var unescape = function(string) {
            return (string + "").replace(unescapeRe, "");
        };
        var slickRe = RegExp("^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|(:+)(<unicode>+)(?:\\((?:(?:([\"'])([^\\13]*)\\13)|((?:\\([^)]+\\)|[^()]*)+))\\))?)".replace(/<combinator>/, "[" + escape(">+~`!@$%^&={}\\;</") + "]").replace(/<unicode>/g, "(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])").replace(/<unicode1>/g, "(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])"));
        var Part = function Part(combinator) {
            this.combinator = combinator || " ";
            this.tag = "*";
        };
        Part.prototype.toString = function() {
            if (!this.raw) {
                var xpr = "", k, part;
                xpr += this.tag || "*";
                if (this.id) xpr += "#" + this.id;
                if (this.classes) xpr += "." + this.classList.join(".");
                if (this.attributes) for (k = 0; part = this.attributes[k++]; ) {
                    xpr += "[" + part.name + (part.operator ? part.operator + '"' + part.value + '"' : "") + "]";
                }
                if (this.pseudos) for (k = 0; part = this.pseudos[k++]; ) {
                    xpr += ":" + part.name;
                    if (part.value) xpr += "(" + part.value + ")";
                }
                this.raw = xpr;
            }
            return this.raw;
        };
        var Expression = function Expression() {
            this.length = 0;
        };
        Expression.prototype.toString = function() {
            if (!this.raw) {
                var xpr = "";
                for (var j = 0, bit; bit = this[j++]; ) {
                    if (j !== 1) xpr += " ";
                    if (bit.combinator !== " ") xpr += bit.combinator + " ";
                    xpr += bit;
                }
                this.raw = xpr;
            }
            return this.raw;
        };
        var replacer = function(rawMatch, separator, combinator, combinatorChildren, tagName, id, className, attributeKey, attributeOperator, attributeQuote, attributeValue, pseudoMarker, pseudoClass, pseudoQuote, pseudoClassQuotedValue, pseudoClassValue) {
            var expression, current;
            if (separator || !this.length) {
                expression = this[this.length++] = new Expression;
                if (separator) return "";
            }
            if (!expression) expression = this[this.length - 1];
            if (combinator || combinatorChildren || !expression.length) {
                current = expression[expression.length++] = new Part(combinator);
            }
            if (!current) current = expression[expression.length - 1];
            if (tagName) {
                current.tag = unescape(tagName);
            } else if (id) {
                current.id = unescape(id);
            } else if (className) {
                var unescaped = unescape(className);
                var classes = current.classes || (current.classes = {});
                if (!classes[unescaped]) {
                    classes[unescaped] = escape(className);
                    (current.classList || (current.classList = [])).push(unescaped);
                }
            } else if (pseudoClass) {
                pseudoClassValue = pseudoClassValue || pseudoClassQuotedValue;
                (current.pseudos || (current.pseudos = [])).push({
                    type: pseudoMarker.length == 1 ? "class" : "element",
                    name: unescape(pseudoClass),
                    escapedName: escape(pseudoClass),
                    value: pseudoClassValue ? unescape(pseudoClassValue) : null,
                    escapedValue: pseudoClassValue ? escape(pseudoClassValue) : null
                });
            } else if (attributeKey) {
                attributeValue = attributeValue ? escape(attributeValue) : null;
                (current.attributes || (current.attributes = [])).push({
                    operator: attributeOperator,
                    name: unescape(attributeKey),
                    escapedName: escape(attributeKey),
                    value: attributeValue ? unescape(attributeValue) : null,
                    escapedValue: attributeValue ? escape(attributeValue) : null
                });
            }
            return "";
        };
        var Expressions = function Expressions(expression) {
            this.length = 0;
            var self = this;
            while (expression) expression = expression.replace(slickRe, function() {
                return replacer.apply(self, arguments);
            });
        };
        Expressions.prototype.toString = function() {
            if (!this.raw) {
                var expressions = [];
                for (var i = 0, expression; expression = this[i++]; ) expressions.push(expression);
                this.raw = expressions.join(", ");
            }
            return this.raw;
        };
        var cache = {};
        var parse = function(expression) {
            if (expression == null) return null;
            expression = ("" + expression).replace(/^\s+|\s+$/g, "");
            return cache[expression] || (cache[expression] = new Expressions(expression));
        };
        module.exports = parse;
    },
    f: function(require, module, exports, global) {
        "use strict";
        var parse = require("e");
        var uniqueIndex = 0;
        var uniqueID = function(node) {
            return node.uniqueNumber || (node.uniqueNumber = "s:" + uniqueIndex++);
        };
        var uniqueIDXML = function(node) {
            var uid = node.getAttribute("uniqueNumber");
            if (!uid) {
                uid = "s:" + uniqueIndex++;
                node.setAttribute("uniqueNumber", uid);
            }
            return uid;
        };
        var isArray = Array.isArray || function(object) {
            return Object.prototype.toString.call(object) === "[object Array]";
        };
        var HAS = {
            GET_ELEMENT_BY_ID: function(test, id) {
                test.innerHTML = '<a id="' + id + '"></a>';
                return !!this.getElementById(id);
            },
            QUERY_SELECTOR: function(test) {
                test.innerHTML = "_<style>:nth-child(2){}</style>";
                test.innerHTML = '<a class="MiX"></a>';
                return test.querySelectorAll(".MiX").length === 1;
            },
            EXPANDOS: function(test, id) {
                test._custom_property_ = id;
                return test._custom_property_ === id;
            },
            MATCHES_SELECTOR: function(test) {
                test.innerHTML = '<a class="MiX"></a>';
                var matches = test.matchesSelector || test.mozMatchesSelector || test.webkitMatchesSelector;
                if (matches) try {
                    matches.call(test, ":slick");
                } catch (e) {
                    return matches.call(test, ".MiX") ? matches : false;
                }
                return false;
            },
            GET_ELEMENTS_BY_CLASS_NAME: function(test) {
                test.innerHTML = '<a class="f"></a><a class="b"></a>';
                if (test.getElementsByClassName("b").length !== 1) return false;
                test.firstChild.className = "b";
                if (test.getElementsByClassName("b").length !== 2) return false;
                test.innerHTML = '<a class="a"></a><a class="f b a"></a>';
                if (test.getElementsByClassName("a").length !== 2) return false;
                return true;
            },
            GET_ATTRIBUTE: function(test) {
                var shout = "fus ro dah";
                test.innerHTML = '<a class="' + shout + '"></a>';
                return test.firstChild.getAttribute("class") === shout;
            }
        };
        var Finder = function Finder(document) {
            this.document = document;
            var root = this.root = document.documentElement;
            this.tested = {};
            this.uniqueID = this.has("EXPANDOS") ? uniqueID : uniqueIDXML;
            this.getAttribute = this.has("GET_ATTRIBUTE") ? function(node, name) {
                return node.getAttribute(name);
            } : function(node, name) {
                var node = node.getAttributeNode(name);
                return node && node.specified ? node.value : null;
            };
            this.hasAttribute = root.hasAttribute ? function(node, attribute) {
                return node.hasAttribute(attribute);
            } : function(node, attribute) {
                node = node.getAttributeNode(attribute);
                return !!(node && node.specified);
            };
            this.contains = document.contains && root.contains ? function(context, node) {
                return context.contains(node);
            } : root.compareDocumentPosition ? function(context, node) {
                return context === node || !!(context.compareDocumentPosition(node) & 16);
            } : function(context, node) {
                do {
                    if (node === context) return true;
                } while (node = node.parentNode);
                return false;
            };
            this.sorter = root.compareDocumentPosition ? function(a, b) {
                if (!a.compareDocumentPosition || !b.compareDocumentPosition) return 0;
                return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
            } : "sourceIndex" in root ? function(a, b) {
                if (!a.sourceIndex || !b.sourceIndex) return 0;
                return a.sourceIndex - b.sourceIndex;
            } : document.createRange ? function(a, b) {
                if (!a.ownerDocument || !b.ownerDocument) return 0;
                var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
                aRange.setStart(a, 0);
                aRange.setEnd(a, 0);
                bRange.setStart(b, 0);
                bRange.setEnd(b, 0);
                return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
            } : null;
            this.failed = {};
            var nativeMatches = this.has("MATCHES_SELECTOR");
            if (nativeMatches) this.matchesSelector = function(node, expression) {
                if (this.failed[expression]) return true;
                try {
                    return nativeMatches.call(node, expression);
                } catch (e) {
                    if (slick.debug) console.warn("matchesSelector failed on " + expression);
                    return this.failed[expression] = true;
                }
            };
            if (this.has("QUERY_SELECTOR")) {
                this.querySelectorAll = function(node, expression) {
                    if (this.failed[expression]) return true;
                    var result, _id, _expression, _slick_id, _combinator;
                    if (node !== this.document) {
                        _combinator = expression[0].combinator;
                        _id = node.getAttribute("id");
                        _expression = expression;
                        if (!_id) {
                            _slick_id = true;
                            _id = "__slick__";
                            node.setAttribute("id", _id);
                        }
                        expression = "#" + _id + " " + _expression;
                        if (_combinator.indexOf("~") > -1 || _combinator.indexOf("+") > -1) {
                            node = node.parentNode;
                            if (!node) result = true;
                        }
                    }
                    if (!result) try {
                        result = node.querySelectorAll(expression);
                    } catch (e) {
                        if (slick.debug) console.warn("querySelectorAll failed on " + (_expression || expression));
                        result = this.failed[_expression || expression] = true;
                    }
                    if (_slick_id) node.removeAttribute("id");
                    return result;
                };
            }
        };
        Finder.prototype.has = function(FEATURE) {
            var tested = this.tested, testedFEATURE = tested[FEATURE];
            if (testedFEATURE != null) return testedFEATURE;
            var root = this.root, document = this.document, testNode = document.createElement("div");
            testNode.setAttribute("style", "display: none;");
            root.appendChild(testNode);
            var TEST = HAS[FEATURE], result = false;
            if (TEST) try {
                result = TEST.call(document, testNode, "s:" + uniqueIndex++);
            } catch (e) {}
            if (slick.debug && !result) console.warn("document has no " + FEATURE);
            root.removeChild(testNode);
            return tested[FEATURE] = result;
        };
        Finder.prototype.search = function(context, expression, found) {
            if (!context) context = this.document; else if (context.document) context = context.document;
            var expressions = parse(expression);
            if (!expressions || !expressions.length) throw new Error("invalid expression");
            if (!found) found = [];
            var uniques, push = isArray(found) ? function(node) {
                found[found.length] = node;
            } : function(node) {
                found[found.length++] = node;
            };
            if (expressions.length > 1) {
                uniques = {};
                var plush = push;
                push = function(node) {
                    var uid = uniqueID(node);
                    if (!uniques[uid]) {
                        uniques[uid] = true;
                        plush(node);
                    }
                };
            }
            var expression, node;
            main : for (var i = 0; expression = expressions[i++]; ) {
                if (!slick.noQSA && this.querySelectorAll) {
                    var nodes = this.querySelectorAll(context, expression);
                    if (nodes !== true) {
                        if (nodes && nodes.length) for (var j = 0; node = nodes[j++]; ) if (node.nodeName > "@") {
                            push(node);
                        }
                        continue main;
                    }
                }
                var expressionLength = expression.length;
                var nodes = this.last(context, expression[expressionLength - 1], uniques);
                if (!nodes.length) continue;
                var expressionIndex = expressionLength - 2;
                for (var n = 0; node = nodes[n++]; ) if (this.validate(context, node, expressionIndex, expression)) {
                    push(node);
                }
            }
            if (uniques && found && found.length > 1) this.sort(found);
            return found;
        };
        Finder.prototype.sort = function(nodes) {
            return this.sorter ? Array.prototype.sort.call(nodes, this.sorter) : nodes;
        };
        Finder.prototype.validate = function(context, node, expressionIndex, expression) {
            var bit = expression[expressionIndex], check, combinator;
            if (!bit) {
                combinator = expression[expressionIndex + 1].combinator;
                check = function(node) {
                    return node === context;
                };
            } else {
                combinator = expression[expressionIndex-- + 1].combinator;
                var self = this;
                check = function(node) {
                    return self.match(node, bit) && self.validate(context, node, expressionIndex, expression);
                };
            }
            switch (combinator) {
              case " ":
                while (node = node.parentNode) {
                    if (check(node)) return true;
                }
                break;
              case ">":
                {
                    node = node.parentNode;
                    if (check(node)) return true;
                }
                break;
              case "~":
                while (node = node.previousSibling) {
                    if (node.nodeType === 1 && check(node)) return true;
                }
                break;
              case "+":
                while (node = node.previousSibling) {
                    if (node.nodeType === 1) return check(node);
                }
                break;
              case "!+":
                while (node = node.nextSibling) {
                    if (node.nodeType === 1) return check(node);
                }
                break;
              case "!~":
                while (node = node.nextSibling) {
                    if (node.nodeType === 1 && check(node)) return true;
                }
                break;
            }
            return false;
        };
        var pseudos = {
            empty: function() {
                var child = this.firstChild;
                return !(this && this.nodeType === 1) && !(this.innerText || this.textContent || "").length;
            },
            not: function(expression) {
                return !slick.match(this, expression);
            },
            contains: function(text) {
                return (this.innerText || this.textContent || "").indexOf(text) > -1;
            },
            "first-child": function() {
                var node = this;
                while (node = node.previousSibling) if (node.nodeType == 1) return false;
                return true;
            },
            "last-child": function() {
                var node = this;
                while (node = node.nextSibling) if (node.nodeType == 1) return false;
                return true;
            },
            "only-child": function() {
                var prev = this;
                while (prev = prev.previousSibling) if (prev.nodeType == 1) return false;
                var next = this;
                while (next = next.nextSibling) if (next.nodeType == 1) return false;
                return true;
            },
            "first-of-type": function() {
                var node = this, nodeName = node.nodeName;
                while (node = node.previousSibling) if (node.nodeName == nodeName) return false;
                return true;
            },
            "last-of-type": function() {
                var node = this, nodeName = node.nodeName;
                while (node = node.nextSibling) if (node.nodeName == nodeName) return false;
                return true;
            },
            "only-of-type": function() {
                var prev = this, nodeName = this.nodeName;
                while (prev = prev.previousSibling) if (prev.nodeName == nodeName) return false;
                var next = this;
                while (next = next.nextSibling) if (next.nodeName == nodeName) return false;
                return true;
            },
            enabled: function() {
                return !this.disabled;
            },
            disabled: function() {
                return this.disabled;
            },
            checked: function() {
                return this.checked || this.selected;
            },
            selected: function() {
                return this.selected;
            },
            focus: function() {
                var doc = this.ownerDocument;
                return doc.activeElement === this && (this.href || this.type || slick.hasAttribute(this, "tabindex"));
            },
            root: function() {
                return this === this.ownerDocument.documentElement;
            }
        };
        Finder.prototype.match = function(node, bit, noTag, noId, noClass) {
            if (!slick.noQSA && this.matchesSelector) {
                var matches = this.matchesSelector(node, bit);
                if (matches !== true) return matches;
            }
            if (!noTag && bit.tag) {
                var nodeName = node.nodeName.toLowerCase();
                if (bit.tag === "*") {
                    if (nodeName < "@") return false;
                } else if (nodeName != bit.tag) {
                    return false;
                }
            }
            if (!noId && bit.id && node.getAttribute("id") !== bit.id) return false;
            var i, part;
            if (!noClass && bit.classes) {
                var className = this.getAttribute(node, "class");
                if (!className) return false;
                for (var part in bit.classes) if (!RegExp("(^|\\s)" + bit.classes[part] + "(\\s|$)").test(className)) return false;
            }
            if (bit.attributes) for (i = 0; part = bit.attributes[i++]; ) {
                var operator = part.operator, name = part.name, value = part.value, escaped = part.escapedValue;
                if (!operator) {
                    if (!this.hasAttribute(node, name)) return false;
                } else {
                    var actual = this.getAttribute(node, name);
                    if (actual == null) return false;
                    switch (operator) {
                      case "^=":
                        if (!RegExp("^" + escaped).test(actual)) return false;
                        break;
                      case "$=":
                        if (!RegExp(escaped + "$").test(actual)) return false;
                        break;
                      case "~=":
                        if (!RegExp("(^|\\s)" + escaped + "(\\s|$)").test(actual)) return false;
                        break;
                      case "|=":
                        if (!RegExp("^" + escaped + "(-|$)").test(actual)) return false;
                        break;
                      case "=":
                        if (actual !== value) return false;
                        break;
                      case "*=":
                        if (actual.indexOf(value) === -1) return false;
                        break;
                      default:
                        return false;
                    }
                }
            }
            if (bit.pseudos) for (i = 0; part = bit.pseudos[i++]; ) {
                var name = part.name, value = part.value;
                if (pseudos[name]) return pseudos[name].call(node, value);
                if (value != null) {
                    if (this.getAttribute(node, name) !== value) return false;
                } else {
                    if (!this.hasAttribute(node, name)) return false;
                }
            }
            return true;
        };
        Finder.prototype.matches = function(node, expression) {
            var expressions = parse(expression);
            if (expressions.length === 1 && expressions[0].length === 1) {
                return this.match(node, expressions[0][0]);
            }
            if (!slick.noQSA && this.matchesSelector) {
                var matches = this.matchesSelector(node, expressions);
                if (matches !== true) return matches;
            }
            var nodes = this.search(node, expression, {
                length: 0
            });
            for (var i = 0, res; res = nodes[i++]; ) if (node === res) return true;
            return false;
        };
        Finder.prototype.last = function(node, bit, uniques) {
            var item, items, found = {
                length: 0
            };
            var noId = !bit.id, noTag = !bit.tag, noClass = !bit.classes;
            if (bit.id && node.getElementById && this.has("GET_ELEMENT_BY_ID")) {
                item = node.getElementById(bit.id);
                if (item && item.getAttribute("id") === bit.id) {
                    items = [ item ];
                    noId = true;
                    if (bit.tag === "*") noTag = true;
                }
            }
            if (!items) {
                if (bit.classes && node.getElementsByClassName && this.has("GET_ELEMENTS_BY_CLASS_NAME")) {
                    items = node.getElementsByClassName(bit.classList);
                    if (!items || !items.length) return found;
                    noClass = true;
                    if (bit.tag === "*") noTag = true;
                } else {
                    items = node.getElementsByTagName(bit.tag);
                    if (!items || !items.length) return found;
                    if (bit.tag !== "*") noTag = true;
                }
            }
            if (!uniques && noTag && noId && noClass && !bit.attributes && !bit.pseudos) return items;
            for (var i = 0; item = items[i++]; ) if ((!uniques || !uniques[this.uniqueID(item)]) && (noTag && noId && noClass && !bit.attributes && !bit.pseudos || this.match(item, bit, noTag, noId, noClass))) found[found.length++] = item;
            return found;
        };
        var finders = {};
        var finder = function(context) {
            var doc = context || document;
            if (doc.document) doc = doc.document; else if (doc.ownerDocument) doc = doc.ownerDocument;
            if (doc.nodeType !== 9) throw new TypeError("invalid document");
            var uid = uniqueID(doc);
            return finders[uid] || (finders[uid] = new Finder(doc));
        };
        var slick = function(expression, context) {
            return slick.search(expression, context);
        };
        slick.search = function(expression, context, found) {
            return finder(context).search(context, expression, found);
        };
        slick.find = function(expression, context) {
            return finder(context).search(context, expression)[0] || null;
        };
        slick.getAttribute = function(node, name) {
            return finder(node).getAttribute(node, name);
        };
        slick.hasAttribute = function(node, name) {
            return finder(node).hasAttribute(node, name);
        };
        slick.contains = function(context, node) {
            return finder(context).contains(context, node);
        };
        slick.matches = function(node, expression) {
            return finder(node).matches(node, expression);
        };
        slick.sort = function(nodes) {
            if (nodes && nodes.length > 1) finder(nodes[0]).sort(nodes);
            return nodes;
        };
        module.exports = slick;
    },
    g: function(require, module, exports, global) {
        "use strict";
        var $ = require("h");
        require("i");
        require("k");
        require("l");
        require("j");
        require("n");
        require("o");
        module.exports = $;
    },
    h: function(require, module, exports, global) {
        "use strict";
        var prime = require("1");
        var uniqueIndex = 0;
        var uniqueID = function(n) {
            return n === global ? "global" : n.uniqueNumber || (n.uniqueNumber = "n:" + (uniqueIndex++).toString(36));
        };
        var instances = {};
        var search, sort;
        var $ = prime({
            constructor: function nodes(n, context) {
                if (n == null) return null;
                if (n instanceof Nodes) return n;
                var self = new Nodes;
                if (n.nodeType || n === global) {
                    self[self.length++] = n;
                } else if (typeof n === "string") {
                    if (search) search(n, context, self);
                } else if (n.length) {
                    var uniques = {};
                    for (var i = 0, l = n.length; i < l; i++) {
                        var nodes = $(n[i], context);
                        if (nodes && nodes.length) for (var j = 0, k = nodes.length; j < k; j++) {
                            var node = nodes[j], uid = uniqueID(node);
                            if (!uniques[uid]) {
                                self[self.length++] = node;
                                uniques[uid] = true;
                            }
                        }
                    }
                    if (sort && self.length > 1) sort(self);
                }
                if (!self.length) return null;
                if (self.length === 1) {
                    var uid = uniqueID(self[0]);
                    return instances[uid] || (instances[uid] = self);
                }
                return self;
            }
        });
        var Nodes = prime({
            inherits: $,
            constructor: function Nodes() {
                this.length = 0;
            },
            handle: function handle(method) {
                var buffer = [], length = this.length;
                if (length === 1) {
                    var res = method.call(this, this[0], 0, buffer);
                    if (res != null && res !== false && res !== true) buffer.push(res);
                } else for (var i = 0; i < length; i++) {
                    var node = this[i], res = method.call($(node), node, i, buffer);
                    if (res === false || res === true) break;
                    if (res != null) buffer.push(res);
                }
                return buffer;
            }
        });
        $.use = function(extension) {
            $.implement(prime.create(extension.prototype));
            if (extension.search) search = extension.search;
            if (extension.sort) sort = extension.sort;
            return this;
        };
        module.exports = $;
    },
    i: function(require, module, exports, global) {
        "use strict";
        var $ = require("j"), string = require("8"), array = require("4");
        $.implement({
            setAttribute: function(name, value) {
                this.forEach(function(node) {
                    node.setAttribute(name, value);
                });
                return this;
            },
            getAttribute: function(name) {
                var attr = this[0].getAttributeNode(name);
                return attr && attr.specified ? attr.value : null;
            },
            hasAttribute: function(name) {
                var node = this[0];
                if (node.hasAttribute) return node.hasAttribute(name);
                var attr = node.getAttributeNode(name);
                return !!(attr && attr.specified);
            },
            removeAttribute: function(name) {
                this.forEach(function(node) {
                    var attr = node.getAttributeNode(name);
                    if (attr) node.removeAttributeNode(attr);
                });
                return this;
            }
        });
        $.implement(function() {
            var properties = {};
            array.forEach("type,value,name,href,title".split(","), function(name) {
                properties[name] = function(value) {
                    if (arguments.length) {
                        this.forEach(function(node) {
                            node[name] = value;
                        });
                        return this;
                    }
                    return this[0][name];
                };
            });
            return properties;
        }());
        $.implement(function() {
            var booleans = {};
            array.forEach("checked,disabled,selected".split(","), function(name) {
                booleans[name] = function(value) {
                    if (arguments.length) {
                        this.forEach(function(node) {
                            node[name] = !!value;
                        });
                        return this;
                    }
                    return !!this[0][name];
                };
            });
            return booleans;
        }());
        var classes = function(className) {
            var classNames = string.clean(className).split(" "), uniques = {};
            return array.filter(classNames, function(className) {
                if (className !== "" && !uniques[className]) return uniques[className] = className;
            }).sort();
        };
        $.implement({
            classNames: function() {
                return classes(this[0].className);
            },
            className: function(className) {
                if (arguments.length) {
                    this.forEach(function(node) {
                        node.className = classes(className).join(" ");
                    });
                    return this;
                }
                return this.classNames().join(" ");
            },
            id: function(id) {
                var node = this[0];
                if (arguments.length) node.id = id; else return node.id;
                return this;
            },
            tag: function() {
                return this[0].tagName.toLowerCase();
            }
        });
        $.implement({
            hasClass: function(className) {
                return array.indexOf(this.classNames(), className) > -1;
            },
            addClass: function(className) {
                this.forEach(function(node) {
                    var nodeClassName = node.className;
                    var classNames = classes(nodeClassName + " " + className).join(" ");
                    if (nodeClassName != classNames) node.className = classNames;
                });
                return this;
            },
            removeClass: function(className) {
                this.forEach(function(node) {
                    var classNames = classes(node.className);
                    array.forEach(classes(className), function(className) {
                        var index = array.indexOf(classNames, className);
                        if (index > -1) classNames.splice(index, 1);
                    });
                    node.className = classNames.join(" ");
                });
                return this;
            }
        });
        $.prototype.toString = function() {
            var tag = this.tag(), id = this.id(), classes = this.classNames();
            var str = tag;
            if (id) str += "#" + id;
            if (classes.length) str += "." + classes.join(".");
            return str;
        };
        module.exports = $;
    },
    j: function(require, module, exports, global) {
        "use strict";
        var $ = require("h"), list = require("4").prototype;
        module.exports = $.implement({
            forEach: list.forEach,
            map: list.map,
            filter: list.filter,
            every: list.every,
            some: list.some
        });
    },
    k: function(require, module, exports, global) {
        "use strict";
        var $ = require("j");
        $.implement({
            appendChild: function(child) {
                this[0].appendChild($(child)[0]);
                return this;
            },
            insertBefore: function(child) {
                this[0].insertBefore($(child)[0]);
                return this;
            },
            removeChild: function(child) {
                this[0].removeChild($(child)[0]);
                return this;
            },
            replaceChild: function(child) {
                this[0].replaceChild($(child)[0]);
                return this;
            }
        });
        $.implement({
            before: function(element) {
                element = $(element)[0];
                var parent = element.parentNode;
                if (parent) this.forEach(function(node) {
                    parent.insertBefore(node, element);
                });
                return this;
            },
            after: function(element) {
                element = $(element)[0];
                var parent = element.parentNode;
                if (parent) this.forEach(function(node) {
                    parent.insertBefore(node, element.nextSibling);
                });
                return this;
            },
            bottom: function(element) {
                element = $(element)[0];
                this.forEach(function(node) {
                    element.appendChild(node);
                });
                return this;
            },
            top: function(element) {
                element = $(element)[0];
                this.forEach(function(node) {
                    element.insertBefore(node, element.firstChild);
                });
                return this;
            }
        });
        $.implement({
            insert: $.prototype.bottom,
            remove: function() {
                this.forEach(function(node) {
                    var parent = node.parentNode;
                    if (parent) parent.removeChild(node);
                });
                return this;
            },
            replace: function(element) {
                element = $(element)[0];
                element.parentNode.replaceChild(this[0], element);
                return this;
            }
        });
        module.exports = $;
    },
    l: function(require, module, exports, global) {
        "use strict";
        var $ = require("h"), prime = require("1"), Emitter = require("m");
        var html = document.documentElement;
        var addEventListener = html.addEventListener ? function(node, event, handle) {
            node.addEventListener(event, handle, false);
            return handle;
        } : function(node, event, handle) {
            node.attachEvent("on" + event, handle);
            return handle;
        };
        var removeEventListener = html.removeEventListener ? function(node, event, handle) {
            node.removeEventListener(event, handle, false);
        } : function(node, event, handle) {
            node.detachEvent("on" + event, handle);
        };
        var NodesEmitter = prime({
            inherits: Emitter,
            on: function(event, handle) {
                this.handle(function(node) {
                    NodesEmitter.parent.on.call(this, event, handle);
                    var self = this, domListeners = this._domListeners || (this._domListeners = {});
                    if (!domListeners[event]) domListeners[event] = addEventListener(node, event, function(e) {
                        self.emit(event, e || window.event);
                    });
                });
                return this;
            },
            off: function(event, handle) {
                this.handle(function(node) {
                    NodesEmitter.parent.off.call(this, event, handle);
                    var domListeners = this._domListeners, domEvent, listeners = this._listeners, events;
                    if (domListeners && (domEvent = domListeners[event]) && listeners && (events = listeners[event]) && !events.length) {
                        removeEventListener(node, event, domEvent);
                        delete domListeners[event];
                    }
                });
                return this;
            },
            emit: function(event) {
                var args = arguments;
                this.handle(function(node) {
                    NodesEmitter.parent.emit.apply(this, args);
                });
                return this;
            }
        });
        module.exports = $.use(NodesEmitter);
    },
    m: function(require, module, exports, global) {
        "use strict";
        var prime = require("1"), array = require("4");
        module.exports = prime({
            on: function(event, fn) {
                var listeners = this._listeners || (this._listeners = {}), events = listeners[event] || (listeners[event] = []);
                if (!events.length || array.indexOf(events, fn) === -1) events.push(fn);
                return this;
            },
            off: function(event, fn) {
                var listeners = this._listeners, events;
                if (listeners && (events = listeners[event]) && events.length) {
                    var index = array.indexOf(events, fn);
                    if (index > -1) events.splice(index, 1);
                }
                return this;
            },
            emit: function(event) {
                var listeners = this._listeners, events;
                if (listeners && (events = listeners[event]) && events.length) {
                    var args = arguments.length > 1 ? array.slice(arguments, 1) : [];
                    array.forEach(events.slice(), function(event) {
                        event.apply(this, args);
                    }, this);
                }
                return this;
            }
        });
    },
    n: function(require, module, exports, global) {
        "use strict";
        var $ = require("l");
        var readystatechange = "onreadystatechange" in document, shouldPoll = false, loaded = false, readys = [], checks = [], ready = null, timer = null, test = document.createElement("div"), doc = $(document), win = $(window);
        var domready = function() {
            if (timer) timer = clearTimeout(timer);
            if (!loaded) {
                if (readystatechange) doc.off("readystatechange", check);
                doc.off("DOMContentLoaded", domready);
                win.off("load", domready);
                loaded = true;
                for (var i = 0; ready = readys[i++]; ) ready.call($);
            }
            return loaded;
        };
        var check = function() {
            for (var i = checks.length; i--; ) if (checks[i]()) return domready();
            return false;
        };
        var poll = function() {
            clearTimeout(timer);
            if (!check()) timer = setTimeout(poll, 1e3 / 60);
        };
        if (document.readyState) {
            var complete = function() {
                return !!/loaded|complete/.test(document.readyState);
            };
            checks.push(complete);
            if (!complete()) {
                if (readystatechange) doc.on("readystatechange", check); else shouldPoll = true;
            } else {
                domready();
            }
        }
        if (test.doScroll) {
            var scrolls = function() {
                try {
                    test.doScroll();
                    return true;
                } catch (e) {}
                return false;
            };
            if (!scrolls()) {
                checks.push(scrolls);
                shouldPoll = true;
            }
        }
        if (shouldPoll) poll();
        doc.on("DOMContentLoaded", domready);
        win.on("load", domready);
        $.ready = function(ready) {
            loaded ? ready.call($) : readys.push(ready);
            return $;
        };
        module.exports = $;
    },
    o: function(require, module, exports, global) {
        "use strict";
        var styleString = Element.getComputedStyle;
        function styleNumber(element, style) {
            return styleString(element, style).toInt() || 0;
        }
        function borderBox(element) {
            return styleString(element, "-moz-box-sizing") == "border-box";
        }
        function topBorder(element) {
            return styleNumber(element, "border-top-width");
        }
        function leftBorder(element) {
            return styleNumber(element, "border-left-width");
        }
        function isBody(element) {
            return /^(?:body|html)$/i.test(element.tagName);
        }
        function getCompatElement(element) {
            var doc = element.getDocument();
            return !doc.compatMode || doc.compatMode == "CSS1Compat" ? doc.html : doc.body;
        }
        var element = document.createElement("div"), child = document.createElement("div");
        element.style.height = "0";
        element.appendChild(child);
        var brokenOffsetParent = child.offsetParent === element;
        element = child = null;
        var isOffset = function(el) {
            return styleString(el, "position") != "static" || isBody(el);
        };
        var isOffsetStatic = function(el) {
            return isOffset(el) || /^(?:table|td|th)$/i.test(el.tagName);
        };
        var $ = require("j");
        $.implement({
            scrollTo: function(x, y) {
                var el = this[0];
                if (isBody(el)) {
                    el.getWindow().scrollTo(x, y);
                } else {
                    el.scrollLeft = x;
                    el.scrollTop = y;
                }
                return el;
            },
            getSize: function() {
                var el = this[0];
                if (isBody(el)) return el.getWindow().getSize();
                return {
                    x: el.offsetWidth,
                    y: el.offsetHeight
                };
            },
            getScrollSize: function() {
                var el = this[0];
                if (isBody(el)) return el.getWindow().getScrollSize();
                return {
                    x: el.scrollWidth,
                    y: el.scrollHeight
                };
            },
            getScroll: function() {
                var el = this[0];
                if (isBody(el)) return el.getWindow().getScroll();
                return {
                    x: el.scrollLeft,
                    y: el.scrollTop
                };
            },
            getScrolls: function() {
                var element = el[0].parentNode, position = {
                    x: 0,
                    y: 0
                };
                while (element && !isBody(element)) {
                    position.x += element.scrollLeft;
                    position.y += element.scrollTop;
                    element = element.parentNode;
                }
                return position;
            },
            getOffsetParent: brokenOffsetParent ? function() {
                var element = this[0];
                if (isBody(element) || styleString(element, "position") == "fixed") return null;
                var isOffsetCheck = styleString(element, "position") == "static" ? isOffsetStatic : isOffset;
                while (element = element.parentNode) {
                    if (isOffsetCheck(element)) return element;
                }
                return null;
            } : function() {
                var element = this[0];
                if (isBody(element) || styleString(element, "position") == "fixed") return null;
                try {
                    return element.offsetParent;
                } catch (e) {}
                return null;
            },
            getPosition: function(relative) {
                var el = this[0];
                var offset = $(el).getOffsets(), scroll = $(el).getScrolls();
                var position = {
                    x: offset.x - scroll.x,
                    y: offset.y - scroll.y
                };
                if (relative && (relative = document.id(relative))) {
                    var relativePosition = relative.getPosition();
                    return {
                        x: position.x - relativePosition.x - leftBorder(relative),
                        y: position.y - relativePosition.y - topBorder(relative)
                    };
                }
                return position;
            },
            getCoordinates: function(element) {
                var el = this[0];
                if (isBody(el)) return el.getWindow().getCoordinates();
                var position = $(el).getPosition(element), size = $(el).getSize();
                var obj = {
                    left: position.x,
                    top: position.y,
                    width: size.x,
                    height: size.y
                };
                obj.right = obj.left + obj.width;
                obj.bottom = obj.top + obj.height;
                return obj;
            },
            computePosition: function(obj) {
                var el = this[0];
                return {
                    left: obj.x - styleNumber(el, "margin-left"),
                    top: obj.y - styleNumber(el, "margin-top")
                };
            },
            setPosition: function(obj) {
                var el = this[0];
                return el.setStyles(el.computePosition(obj));
            }
        });
        module.exports = $;
    },
    p: function(require, module, exports, global) {
        "use strict";
        var color = require("q"), frame = require("r");
        var moofx = typeof document !== "undefined" ? require("s") : {};
        moofx.requestFrame = function(callback) {
            frame.request(callback);
            return this;
        };
        moofx.cancelFrame = function(callback) {
            frame.cancel(callback);
            return this;
        };
        moofx.color = color;
        module.exports = moofx;
    },
    q: function(require, module, exports, global) {
        "use strict";
        var colors = {
            maroon: "#800000",
            red: "#ff0000",
            orange: "#ffA500",
            yellow: "#ffff00",
            olive: "#808000",
            purple: "#800080",
            fuchsia: "#ff00ff",
            white: "#ffffff",
            lime: "#00ff00",
            green: "#008000",
            navy: "#000080",
            blue: "#0000ff",
            aqua: "#00ffff",
            teal: "#008080",
            black: "#000000",
            silver: "#c0c0c0",
            gray: "#808080",
            transparent: "#0000"
        };
        var RGBtoRGB = function(r, g, b, a) {
            if (a == null || a === "") a = 1;
            r = parseFloat(r);
            g = parseFloat(g);
            b = parseFloat(b);
            a = parseFloat(a);
            if (!(r <= 255 && r >= 0 && g <= 255 && g >= 0 && b <= 255 && b >= 0 && a <= 1 && a >= 0)) return null;
            return [ Math.round(r), Math.round(g), Math.round(b), a ];
        };
        var HEXtoRGB = function(hex) {
            if (hex.length === 3) hex += "f";
            if (hex.length === 4) {
                var h0 = hex.charAt(0), h1 = hex.charAt(1), h2 = hex.charAt(2), h3 = hex.charAt(3);
                hex = h0 + h0 + h1 + h1 + h2 + h2 + h3 + h3;
            }
            if (hex.length === 6) hex += "ff";
            var rgb = [];
            for (var i = 0, l = hex.length; i < l; i += 2) rgb.push(parseInt(hex.substr(i, 2), 16) / (i === 6 ? 255 : 1));
            return rgb;
        };
        var HUEtoRGB = function(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var HSLtoRGB = function(h, s, l, a) {
            var r, b, g;
            if (a == null || a === "") a = 1;
            h /= 360;
            s /= 100;
            l /= 100;
            a /= 1;
            if (h > 1 || h < 0 || s > 1 || s < 0 || l > 1 || l < 0 || a > 1 || a < 0) return null;
            if (s === 0) {
                r = b = g = l;
            } else {
                var q = l < .5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = HUEtoRGB(p, q, h + 1 / 3);
                g = HUEtoRGB(p, q, h);
                b = HUEtoRGB(p, q, h - 1 / 3);
            }
            return [ r * 255, g * 255, b * 255, a ];
        };
        var keys = [];
        for (var c in colors) keys.push(c);
        var shex = "(?:#([a-f0-9]{3,8}))", sval = "\\s*([.\\d%]+)\\s*", sop = "(?:,\\s*([.\\d]+)\\s*)?", slist = "\\(" + [ sval, sval, sval ] + sop + "\\)", srgb = "(?:rgb)a?", shsl = "(?:hsl)a?", skeys = "(" + keys.join("|") + ")";
        var xhex = RegExp(shex, "i"), xrgb = RegExp(srgb + slist, "i"), xhsl = RegExp(shsl + slist, "i");
        var color = function(input, array) {
            if (input == null) return null;
            input = (input + "").replace(/\s+/, "");
            var match = colors[input];
            if (match) {
                return color(match, array);
            } else if (match = input.match(xhex)) {
                input = HEXtoRGB(match[1]);
            } else if (match = input.match(xrgb)) {
                input = match.slice(1);
            } else if (match = input.match(xhsl)) {
                input = HSLtoRGB.apply(null, match.slice(1));
            } else return null;
            if (!(input && (input = RGBtoRGB.apply(null, input)))) return null;
            if (array) return input;
            if (input[3] === 1) input.splice(3, 1);
            return "rgb" + (input.length === 4 ? "a" : "") + "(" + input + ")";
        };
        color.x = RegExp([ skeys, shex, srgb + slist, shsl + slist ].join("|"), "gi");
        module.exports = color;
    },
    r: function(require, module, exports, global) {
        "use strict";
        var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame || function(callback) {
            return setTimeout(callback, 1e3 / 60);
        };
        var callbacks = [], running = false;
        var iterator = function(time) {
            if (time == null) time = +(new Date);
            running = false;
            for (var i = callbacks.length; i--; ) {
                var callback = callbacks.shift();
                if (callback) callback(time);
            }
        };
        var cancel = function(match) {
            for (var i = callbacks.length; i--; ) if (callbacks[i] === match) {
                callbacks.splice(i, 1);
                break;
            }
        };
        var request = function(callback) {
            callbacks.push(callback);
            if (!running) {
                running = true;
                requestFrame(iterator);
            }
            return function() {
                cancel(callback);
            };
        };
        exports.request = request;
        exports.cancel = cancel;
    },
    s: function(require, module, exports, global) {
        "use strict";
        var color = require("q"), frame = require("r");
        var cancelFrame = frame.cancel, requestFrame = frame.request;
        var bezier = require("t");
        var prime = require("1"), array = require("4"), string = require("8");
        var camelize = string.camelize, hyphenate = string.hyphenate, clean = string.clean, capitalize = string.capitalize;
        var map = array.map, each = array.forEach, indexOf = array.indexOf;
        var nodes = require("h");
        var round = function(number) {
            return +(+number).toPrecision(3);
        };
        var compute = global.getComputedStyle ? function(node) {
            var cts = getComputedStyle(node);
            return function(property) {
                return cts ? cts.getPropertyValue(hyphenate(property)) : "";
            };
        } : function(node) {
            var cts = node.currentStyle;
            return function(property) {
                return cts ? cts[camelize(property)] : "";
            };
        };
        var test = document.createElement("div");
        var cssText = "border:none;margin:none;padding:none;visibility:hidden;position:absolute;height:0;";
        var pixelRatio = function(element, u) {
            var parent = element.parentNode, ratio = 1;
            if (parent) {
                test.style.cssText = cssText + ("width:100" + u + ";");
                parent.appendChild(test);
                ratio = test.offsetWidth / 100;
                parent.removeChild(test);
            }
            return ratio;
        };
        var mirror4 = function(values) {
            var length = values.length;
            if (length === 1) values.push(values[0], values[0], values[0]); else if (length === 2) values.push(values[0], values[1]); else if (length === 3) values.push(values[1]);
            return values;
        };
        var sLength = "([-.\\d]+)(%|cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vm)", sLengthLax = "([-.\\d]+)([\\w%]+)?", sBorderStyle = "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|inherit", sCubicBezier = "cubic-bezier\\(([-.\\d]+),([-.\\d]+),([-.\\d]+),([-.\\d]+)\\)", sDuration = "([\\d.]+)(s|ms)?";
        var rgLength = RegExp(sLength, "g"), rLengthLax = RegExp(sLengthLax), rgLengthLax = RegExp(sLengthLax, "g"), rBorderStyle = RegExp(sBorderStyle), rCubicBezier = RegExp(sCubicBezier), rgCubicBezier = RegExp(sCubicBezier, "g"), rDuration = RegExp(sDuration);
        var parseString = function(value) {
            return value == null ? "" : value + "";
        };
        var parseOpacity = function(value, normalize) {
            if (value == null || value === "") return normalize ? "1" : "";
            var number = +value;
            return isFinite(number) ? number + "" : "1";
        };
        try {
            test.style.color = "rgba(0,0,0,0.5)";
        } catch (e) {}
        var rgba = /^rgba/.test(test.style.color);
        var parseColor = function(value, normalize) {
            if (!value) return normalize ? "rgba(0,0,0,1)" : "";
            if (value === "transparent") return normalize ? "rgba(0,0,0,0)" : value;
            var c = color(value, true);
            if (!c) return normalize ? "rgba(0,0,0,1)" : "";
            if (c[3] === 0 && !normalize) return "transparent";
            return !normalize && (!rgba || c[3] === 1) ? "rgb(" + c.slice(0, 3) + ")" : "rgba(" + c + ")";
        };
        var parseLength = function(value, normalize, node) {
            if (value == null || value === "") return normalize ? "0px" : "";
            var match = string.match(value, rLengthLax);
            if (!match) return value;
            var value = +match[1], unit = match[2] || "px";
            if (value === 0) return value + unit;
            return node && unit !== "px" ? round(pixelRatio(node, unit) * value) + "px" : value + unit;
        };
        var parseBorderStyle = function(value, normalize) {
            if (value == null || value === "") return normalize ? "none" : "";
            var match = value.match(rBorderStyle);
            return match ? value : normalize ? "none" : "";
        };
        var parseBorder = function(value, normalize, node) {
            var normalized = "0px none rgba(0,0,0,1)";
            if (value == null || value === "") return normalize ? normalized : "";
            if (value === 0 || value === "none") return normalize ? normalized : value;
            var c;
            value = value.replace(color.x, function(match) {
                c = match;
                return "";
            });
            var s = value.match(rBorderStyle), l = value.match(rgLengthLax);
            return clean([ parseLength(l ? l[0] : "", normalize, node), parseBorderStyle(s ? s[0] : "", normalize), parseColor(c, normalize) ].join(" "));
        };
        var parseShort4 = function(value, normalize, node) {
            if (value == null || value === "") return normalize ? "0px 0px 0px 0px" : "";
            return clean(mirror4(map(clean(value).split(" "), function(v) {
                return parseLength(v, normalize, node);
            })).join(" "));
        };
        var parseShadow = function(value, normalize, node, len) {
            var ncolor = "rgba(0,0,0,0)", normalized = len === 3 ? ncolor + " 0px 0px 0px" : ncolor + " 0px 0px 0px 0px";
            if (value == null || value === "") return normalize ? normalized : "";
            if (value === "none") return normalize ? normalized : value;
            var colors = [], value = clean(value).replace(color.x, function(match) {
                colors.push(match);
                return "";
            });
            return map(value.split(","), function(shadow, i) {
                var c = parseColor(colors[i], normalize), inset = /inset/.test(shadow), lengths = shadow.match(rgLengthLax) || [ "0px" ];
                lengths = map(lengths, function(m) {
                    return parseLength(m, normalize, node);
                });
                while (lengths.length < len) lengths.push("0px");
                var ret = inset ? [ "inset", c ] : [ c ];
                return ret.concat(lengths).join(" ");
            }).join(", ");
        };
        var parse = function(value, normalize, node) {
            if (value == null || value === "") return "";
            return value.replace(color.x, function(match) {
                return parseColor(match, normalize);
            }).replace(rgLength, function(match) {
                return parseLength(match, normalize, node);
            });
        };
        var getters = {}, setters = {}, parsers = {}, aliases = {};
        var getter = function(key) {
            return getters[key] || (getters[key] = function() {
                var alias = aliases[key] || key, parser = parsers[key] || parse;
                return function() {
                    return parser(compute(this)(alias), true, this);
                };
            }());
        };
        var setter = function(key) {
            return setters[key] || (setters[key] = function() {
                var alias = aliases[key] || key, parser = parsers[key] || parse;
                return function(value) {
                    this.style[alias] = parser(value);
                };
            }());
        };
        var trbl = [ "Top", "Right", "Bottom", "Left" ], tlbl = [ "TopLeft", "TopRight", "BottomRight", "BottomLeft" ];
        each(trbl, function(d) {
            var bd = "border" + d;
            each([ "margin" + d, "padding" + d, bd + "Width", d.toLowerCase() ], function(n) {
                parsers[n] = parseLength;
            });
            parsers[bd + "Color"] = parseColor;
            parsers[bd + "Style"] = parseBorderStyle;
            parsers[bd] = parseBorder;
            getters[bd] = function() {
                return [ getter(bd + "Width").call(this), getter(bd + "Style").call(this), getter(bd + "Color").call(this) ].join(" ");
            };
        });
        each(tlbl, function(d) {
            parsers["border" + d + "Radius"] = parseLength;
        });
        parsers.color = parsers.backgroundColor = parseColor;
        parsers.width = parsers.height = parsers.fontSize = parsers.backgroundSize = parseLength;
        each([ "margin", "padding" ], function(name) {
            parsers[name] = parseShort4;
            getters[name] = function() {
                return map(trbl, function(d) {
                    return getter(name + d).call(this);
                }, this).join(" ");
            };
        });
        parsers.borderWidth = parseShort4;
        parsers.borderStyle = function(value, normalize, node) {
            if (value == null || value === "") return normalize ? mirror4([ "none" ]).join(" ") : "";
            value = clean(value).split(" ");
            return clean(mirror4(map(value, function(v) {
                parseBorderStyle(v, normalize);
            })).join(" "));
        };
        parsers.borderColor = function(value, normalize) {
            if (!value || !(value = string.match(value, color.x))) return normalize ? mirror4([ "rgba(0,0,0,1)" ]).join(" ") : "";
            return clean(mirror4(map(value, function(v) {
                return parseColor(v, normalize);
            })).join(" "));
        };
        each([ "Width", "Style", "Color" ], function(name) {
            getters["border" + name] = function() {
                return map(trbl, function(d) {
                    return getter("border" + d + name).call(this);
                }, this).join(" ");
            };
        });
        parsers.borderRadius = parseShort4;
        getters.borderRadius = function() {
            return map(tlbl, function(d) {
                return getter("border" + d + "Radius").call(this);
            }, this).join(" ");
        };
        parsers.border = parseBorder;
        getters.border = function() {
            var pvalue;
            for (var i = 0; i < trbl.length; i++) {
                var value = getter("border" + trbl[i]).call(this);
                if (pvalue && value !== pvalue) return null;
                pvalue = value;
            }
            return pvalue;
        };
        parsers.zIndex = parseString;
        var filterName = test.style.MsFilter != null && "MsFilter" || test.style.filter != null && "filter";
        parsers.opacity = parseOpacity;
        if (filterName && test.style.opacity == null) {
            var matchOp = /alpha\(opacity=([\d.]+)\)/i;
            setters.opacity = function(value) {
                value = (value = +value) === 1 ? "" : "alpha(opacity=" + value * 100 + ")";
                var filter = compute(this)(filterName);
                return this.style[filterName] = matchOp.test(filter) ? filter.replace(matchOp, value) : filter + value;
            };
            getters.opacity = function() {
                var match = compute(this)(filterName).match(matchOp);
                return (!match ? 1 : match[1] / 100) + "";
            };
        }
        var parseBoxShadow = parsers.boxShadow = function(value, normalize, node) {
            return parseShadow(value, normalize, node, 4);
        };
        var parseTextShadow = parsers.textShadow = function(value, normalize, node) {
            return parseShadow(value, normalize, node, 3);
        };
        each([ "Webkit", "Moz", "ms" ], function(prefix) {
            each([ "transition", "transform", "transformOrigin", "transformStyle", "perspective", "perspectiveOrigin", "backfaceVisibility" ], function(style) {
                var cc = prefix + capitalize(style);
                if (test.style[cc] != null) aliases[style] = cc;
            });
        });
        var transitionName = aliases.transition || test.style.transition != null && "transition";
        var equations = {
            "default": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
            linear: "cubic-bezier(0, 0, 1, 1)",
            "ease-in": "cubic-bezier(0.42, 0, 1.0, 1.0)",
            "ease-out": "cubic-bezier(0, 0, 0.58, 1.0)",
            "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1.0)"
        };
        equations.ease = equations["default"];
        var BrowserAnimation = prime({
            constructor: function BrowserAnimation(node, property) {
                var _getter = getter(property), _setter = setter(property);
                this.get = function() {
                    return _getter.call(node);
                };
                this.set = function(value) {
                    return _setter.call(node, value);
                };
                this.node = node;
                this.property = property;
                this.parse = parsers[property] || parse;
                var self = this;
                this.bExit = function(time) {
                    self.exit(time);
                };
            },
            setOptions: function(options) {
                if (options == null) options = {};
                var duration = options.duration;
                if (!(this.duration = this.parseDuration(duration || "500ms"))) throw new Error(this.duration + " is not a valid duration");
                if (!(this.equation = this.parseEquation(options.equation || "default"))) throw new Error(this.equation + " is not a valid equation");
                this.callback = options.callback || function() {};
                return this;
            },
            exit: function(time) {
                if (this.exitValue != null) this.set(this.exitValue);
                this.cancelExit = null;
                this.callback(time);
                return null;
            },
            prepare: function(to) {
                this.exitValue = null;
                if (this.duration === 0) {
                    this.exitValue = to;
                    this.cancelExit = requestFrame(this.bExit);
                } else {
                    var node = this.node, p = this.parse, fromParsed = this.get(), toParsed = p(to, true);
                    if (p === parseLength || p === parseBorder || p === parseShort4) {
                        var toUnits = toParsed.match(rgLength), i = 0;
                        if (toUnits) fromParsed = fromParsed.replace(rgLength, function(fromMatch) {
                            var toMatch = toUnits[i++], fromValue = fromMatch.match(rLengthLax)[1], toUnit = toMatch.match(rLengthLax)[2];
                            return toUnit !== "px" ? round(fromValue / pixelRatio(node, toUnit)) + toUnit : fromMatch;
                        });
                        if (i > 0) this.set(fromParsed);
                    }
                    if (fromParsed === toParsed) {
                        this.cancelExit = requestFrame(this.bExit);
                    } else {
                        return [ fromParsed, toParsed ];
                    }
                }
            },
            parseDuration: function(duration) {
                if (duration = string.match(duration, rDuration)) {
                    var time = +duration[1], unit = duration[2] || "ms";
                    if (unit === "s") return time * 1e3;
                    if (unit === "ms") return time;
                }
                return null;
            },
            parseEquation: function(equation) {
                equation = equations[equation] || equation;
                var match = equation.replace(/\s+/g, "").match(rCubicBezier);
                return match && map(match.slice(1), function(v) {
                    return +v;
                });
            }
        });
        var divide = function(string) {
            var numbers = [];
            string = string.replace(/[-.\d]+/g, function(number) {
                numbers.push(+number);
                return "@";
            });
            return [ numbers, string ];
        };
        var calc = function(from, to, delta) {
            return (to - from) * delta + from;
        };
        var JSAnimation = prime({
            inherits: BrowserAnimation,
            constructor: function JSAnimation(node, property) {
                JSAnimation.parent.constructor.call(this, node, property);
                var self = this;
                this.bStep = function(t) {
                    return self.step(t);
                };
            },
            start: function(to) {
                this.stop();
                var prepared = this.prepare(to), p = this.parse;
                if (prepared) {
                    this.time = 0;
                    var from_ = divide(prepared[0]), to_ = divide(prepared[1]);
                    if (from_[0].length !== to_[0].length || (p === parseBoxShadow || p === parseTextShadow || p === parse) && from_[1] !== to_[1]) {
                        this.exit(to);
                    } else {
                        this.from = from_[0];
                        this.to = to_[0];
                        this.template = to_[1];
                        this.cancelStep = requestFrame(this.bStep);
                    }
                }
                return this;
            },
            stop: function() {
                if (this.cancelExit) this.cancelExit = this.cancelExit(); else if (this.cancelStep) this.cancelStep = this.cancelStep();
                return this;
            },
            step: function(now) {
                this.time || (this.time = now);
                var factor = (now - this.time) / this.duration;
                if (factor > 1) factor = 1;
                var delta = this.equation(factor), tpl = this.template, from = this.from, to = this.to;
                for (var i = 0, l = from.length; i < l; i++) {
                    var f = from[i], t = to[i];
                    tpl = tpl.replace("@", t !== f ? calc(f, t, delta) : t);
                }
                this.set(tpl);
                if (factor !== 1) this.cancelStep = requestFrame(this.bStep); else {
                    this.cancelStep = null;
                    this.callback(now);
                }
            },
            parseEquation: function(equation) {
                var equation = JSAnimation.parent.parseEquation.call(this, equation);
                if (equation == [ 0, 0, 1, 1 ]) return function(x) {
                    return x;
                };
                return bezier(equation[0], equation[1], equation[2], equation[3], 1e3 / 60 / this.duration / 4);
            }
        });
        var remove3 = function(value, a, b, c) {
            var index = indexOf(a, value);
            if (index !== -1) {
                a.splice(index, 1);
                b.splice(index, 1);
                c.splice(index, 1);
            }
        };
        var CSSAnimation = prime({
            inherits: BrowserAnimation,
            constructor: function CSSAnimation(node, property) {
                CSSAnimation.parent.constructor.call(this, node, property);
                this.hproperty = hyphenate(aliases[property] || property);
                var self = this;
                this.bSetTransitionCSS = function(time) {
                    self.setTransitionCSS(time);
                };
                this.bSetStyleCSS = function(time) {
                    self.setStyleCSS(time);
                };
                this.bComplete = function() {
                    self.complete();
                };
            },
            start: function(to) {
                this.stop();
                var prepared = this.prepare(to);
                if (prepared) {
                    this.to = prepared[1];
                    this.cancelSetTransitionCSS = requestFrame(this.bSetTransitionCSS);
                }
                return this;
            },
            setTransitionCSS: function() {
                this.cancelSetTransitionCSS = null;
                this.resetCSS(true);
                this.cancelSetStyleCSS = requestFrame(this.bSetStyleCSS);
            },
            setStyleCSS: function(time) {
                this.cancelSetStyleCSS = null;
                var duration = this.duration;
                this.cancelComplete = setTimeout(this.bComplete, duration);
                this.endTime = time + duration;
                this.set(this.to);
            },
            complete: function() {
                this.cancelComplete = null;
                this.resetCSS();
                this.callback(this.endTime);
                return null;
            },
            stop: function(hard) {
                if (this.cancelExit) this.cancelExit = this.cancelExit(); else if (this.cancelSetTransitionCSS) {
                    this.cancelSetTransitionCSS = this.cancelSetTransitionCSS();
                } else if (this.cancelSetStyleCSS) {
                    this.cancelSetStyleCSS = this.cancelSetStyleCSS();
                    if (hard) this.resetCSS();
                } else if (this.cancelComplete) {
                    this.cancelComplete = clearTimeout(this.cancelComplete);
                    if (hard) {
                        this.resetCSS();
                        this.set(this.get());
                    }
                }
                return this;
            },
            resetCSS: function(inclusive) {
                var rules = compute(this.node), properties = rules(transitionName + "Property").replace(/\s+/g, "").split(","), durations = rules(transitionName + "Duration").replace(/\s+/g, "").split(","), equations = rules(transitionName + "TimingFunction").replace(/\s+/g, "").match(rgCubicBezier);
                remove3("all", properties, durations, equations);
                remove3(this.hproperty, properties, durations, equations);
                if (inclusive) {
                    properties.push(this.hproperty);
                    durations.push(this.duration + "ms");
                    equations.push("cubic-bezier(" + this.equation + ")");
                }
                var nodeStyle = this.node.style;
                nodeStyle[transitionName + "Property"] = properties;
                nodeStyle[transitionName + "Duration"] = durations;
                nodeStyle[transitionName + "TimingFunction"] = equations;
            }
        });
        var BaseAnimation = transitionName ? CSSAnimation : JSAnimation;
        var moofx = function(x, y) {
            return nodes(x, y);
        };
        nodes.implement({
            animate: function(A, B, C) {
                var styles = A, options = B;
                if (typeof A === "string") {
                    styles = {};
                    styles[A] = B;
                    options = C;
                }
                if (options == null) options = {};
                var type = typeof options;
                options = type === "function" ? {
                    callback: options
                } : type === "string" || type === "number" ? {
                    duration: options
                } : options;
                var callback = options.callback || function() {}, completed = 0, length = 0;
                options.callback = function(t) {
                    if (++completed === length) callback(t);
                };
                for (var property in styles) {
                    var value = styles[property], property = camelize(property);
                    this.handle(function(node) {
                        length++;
                        var anims = this._animations || (this._animations = {});
                        var anim = anims[property] || (anims[property] = new BaseAnimation(node, property));
                        anim.setOptions(options).start(value);
                    });
                }
            },
            style: function(A, B) {
                var styles = A;
                if (typeof A === "string") {
                    styles = {};
                    styles[A] = B;
                }
                for (var property in styles) {
                    var value = styles[property], set = setter(property = camelize(property));
                    this.handle(function(node) {
                        var anims = this._animations, anim;
                        if (anims && (anim = anims[property])) anim.stop(true);
                        set.call(node, value);
                    });
                }
                return this;
            },
            compute: function(property) {
                return getter(camelize(property)).call(this[0]);
            }
        });
        moofx.version = "3.0.9";
        moofx.parse = function(property, value, normalize, node) {
            if (!parsers[property = camelize(property)]) return null;
            return parsers[property](value, normalize, node);
        };
        module.exports = moofx;
    },
    t: function(require, module, exports, global) {
        module.exports = function(x1, y1, x2, y2, epsilon) {
            var curveX = function(t) {
                var v = 1 - t;
                return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
            };
            var curveY = function(t) {
                var v = 1 - t;
                return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
            };
            var derivativeCurveX = function(t) {
                var v = 1 - t;
                return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
            };
            return function(t) {
                var x = t, t0, t1, t2, x2, d2, i;
                for (t2 = x, i = 0; i < 8; i++) {
                    x2 = curveX(t2) - x;
                    if (Math.abs(x2) < epsilon) return curveY(t2);
                    d2 = derivativeCurveX(t2);
                    if (Math.abs(d2) < 1e-6) break;
                    t2 = t2 - x2 / d2;
                }
                t0 = 0, t1 = 1, t2 = x;
                if (t2 < t0) return curveY(t0);
                if (t2 > t1) return curveY(t1);
                while (t0 < t1) {
                    x2 = curveX(t2);
                    if (Math.abs(x2 - x) < epsilon) return curveY(t2);
                    if (x > x2) t0 = t2; else t1 = t2;
                    t2 = (t1 - t0) * .5 + t0;
                }
                return curveY(t2);
            };
        };
    }
});
