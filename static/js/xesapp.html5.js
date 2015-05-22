/**
 *
 * @authors Your Name (you@example.org)
 * @date    2014-05-21 09:37:41
 * @version $Id$
 */

(function(d, e) {
	var h = function(a) {
			return a.innerHTML = "<x-element></x-element>", a.childNodes.length === 1;
		}(e.createElement("a")),
		i = function(a, b, c) {
			return b.appendChild(a), (c = (c ? c(a) : a.currentStyle).display) && b.removeChild(a) && c === "block";
		}(e.createElement("nav"), e.documentElement, d.getComputedStyle),
		f = {
			elements: "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video".split(" "),
			shivDocument: function(a) {
				a = a || e;
				if (!a.documentShived) {
					a.documentShived = true;
					var b = a.createElement,
						c = a.createDocumentFragment,
						g = a.getElementsByTagName("head")[0];
					h || (f.elements.join(" ").replace(/\w+/g, function(a) {
						b(a);
					}), a.createElement = function(a) {
						a = b(a);
						return a.canHaveChildren && f.shivDocument(a.document), a;
					}, a.createDocumentFragment = function() {
						return f.shivDocument(c());
					});
					if (!i && g) {
						var d = b("div");
						d.innerHTML = "x<style>article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}audio{display:none}canvas,video{display:inline-block;*display:inline;*zoom:1}[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}mark{background:#FF0;color:#000}</style>";
						g.insertBefore(d.lastChild, g.firstChild);
					}
					return a;
				}
			}
		};
	f.shivDocument(e);
	d.html5 = f;
})(this, document);