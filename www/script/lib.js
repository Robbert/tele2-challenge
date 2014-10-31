var HTML = (function (doc) {

"use strict";

var HTML = {};

/**
 * @param {string} tagName
 * @return {HTMLElement}
 */
HTML.createElement = function (tagName)
{
	return doc.createElement(tagName);
};

/**
 * @param {HTMLSelectElement} el
 * @param {string} value
 */
HTML.setSelectValue = function (el, value)
{
	// TODO
};

/**
 * @return {?HTMLBodyElement}
 */
HTML.getBody = function ()
{
	return doc.body || doc.getElementsByTagName("body")[0] || null;
};

/**
 * @return {DocumentFragment}
 */
HTML.createFragment = function ()
{
	return doc.createDocumentFragment();
};

/** @const {boolean} */
var SUPPORT_INNERTEXT = !!doc.documentElement && typeof doc.documentElement.innerText == "string";

/** @const {boolean} */
var SUPPORT_TEXTCONTENT = !!doc.documentElement && typeof doc.documentElement.textContent == "string";

/**
 * @param {HTMLElement} el
 * @param {string} value
 */
HTML.setTextContent = function (el, value)
{
	if (SUPPORT_TEXTCONTENT)
		el.textContent = value;
	else if (SUPPORT_INNERTEXT)
		el.innerText = value;
};

return HTML;

})(document);

var NumberFormat = (function () {

"use strict";

/**
 * @constructor
 * @param {string} format
 */
function NumberFormat(format)
{
	// TODO
}

/**
 * @param {number} n
 * @return {string}
 */
NumberFormat.prototype.format = function (n)
{
	if (typeof n !== "number")
		return "";

	// HACK
	return "€ " + n.toPrecision(5);
};

return NumberFormat;

})();