var ChallengeRendering = (function (HTML, JSON, NumberFormat) {

"use strict";

/**
 * @param {string} url
 * @param {Object} crop
 * @return {Element}
 */
function renderImage(url, crop)
{
	return new Image(uri);
}

/**
 * @constructor
 * @param {*} value
 * @param {Node} node
 */
function DataRendering(value, node)
{
	this.value = value;
	this.node = node;
}

/**
 * @template Data
 * @param {Array.<DataRendering>}
 * @param {function(Data, Data)=} onchange
 * @return {HTMLSelectElement}
 */
function createDropdown(values, descriptionCallback, onchange)
{
	var title;
	var select = HTML.createElement("select");
	var selected = null;
	for (var i = 0, l = values.length; i < l; i++)
	{
		var option = new Option;
		option.value = i;

		var data = values[i];

		if (descriptionCallback)
			title = descriptionCallback(data);
		else
			title = "" + data;

		HTML.setTextContent(option, title);

		select.appendChild(option);
	}

	select.onkeydown =
	select.onchange = function ()
	{
		var i = select.selectedIndex;

		var prev = selected;

		if (i >= 0)
		{
			selected = values[i];
		}
		else
		{
			selected = null;
		}

		onchange(selected, prev);
	};

	return select;
}

/**
 * @param {string} url
 * @param {?Object.<string, string>} headers
 * @param {function(*)=} onload
 * @param {function(*)=} onerror
 */
function fetch(url, headers, onload, onerror)
{
	onload  = onload  || function(){};
	onerror = onerror || function(){};

	var loaded = false;

	try
	{
		var xhr = new XMLHttpRequest();

		xhr.onload =
		xhr.onreadystatechange = function (evt)
		{
			console.log(xhr.readyState, xhr, url, evt)
			if (xhr.readyState === 4 && !loaded)
			{
				if (req.status >= 400 && req.status <= 599)
				{
					onerror(req.statusText);
				}
				else
				{
					onload(xhr.responseText);
				}
			}
		};

		xhr.onerror = function (evt) {
			console.log(evt);
		};

		xhr.open("GET", url, false);
		xhr.load();
	}
	catch (error)
	{
		onerror(error)
	}
}

/**
 * @constructor
 * @param {HTMLElement} root
 * @param {string} url
 */
function ChallengeRendering(root, url)
{
	console.log(root,url)
	this.dataRenderings = [];
	this.highlighted = null;
	this.url = url;
	this.root = HTML.createElement("div");
	this.root.className = "phones";
	root.appendChild(this.root);

	// HACK: loading data from variable
	// TODO: fetch() the data and parse the JSON
	this.data = data;
	// this.reload();

	this.redraw();
}

ChallengeRendering.prototype.destruct = function ()
{
	if (this.root && this.root.parentNode)
		this.root.parentNode.removeChild(this.root);

	this.highlighted = null;
	this.dataRenderings.length = 0;
};

ChallengeRendering.prototype.reload = function ()
{
	var self = this;

	/**
	 * @param {*} data
	 */
	function onload(data)
	{
		try
		{
			if (typeof data === "string")
			{
				try
				{
					throw new Error("Hi!")
					self.data = JSON.parse(data);
					self.error = null;
				}
				catch (e)
				{
					self.error = new TypeError("Response wasn't a valid JSON document")
				}

				self.redraw();
			}
		}
		catch (e)
		{
			onerror(e);
		}
	}

	function onerror(e)
	{
		self.error = new Error("Loading this page failed. Please try again later.");
		self.redraw();
	}

	fetch(this.url, { "Accept-Type": "application/json" }, onload);
};

ChallengeRendering.prototype.redraw = function ()
{
	var self = this;
	var currency = new NumberFormat("€ ######.##");
	this.headerLevel = "h2";
	var frag = HTML.createFragment();

	if (this.error)
	{
		this.drawError();
	}
	else
	{
		for (var i = 0, l = this.data.length; i < l; i++)
		{
			var item = this.data[i]

			// TODO: filter() the data first outside the rendering loop
			if (!item.name)
				continue;

			// console.log(item);

			var priceStr = currency.format(parseFloat(item.price)),
				titleStr = item.name;

			var phone = HTML.createElement("div");
			phone.className = "phone";
			var title = HTML.createElement(this.headerLevel);
			HTML.setTextContent(title, titleStr);
			var detail = HTML.createElement("p");
			HTML.setTextContent(detail, priceStr);

			phone.appendChild(title);
			phone.appendChild(detail);
			frag.appendChild(phone);

			this.dataRenderings.push(new DataRendering(item, phone));
		}

		var onchange = function (selectedData, previouslySelected) {
			self.highlight(selectedData);
		};

		var items = this.data;
		var dropdown = createDropdown(items, function (data) { return data.name }, onchange);

		// TODO: render in the right spot
		this.root.appendChild(dropdown);
	}

	this.root.appendChild(frag);
};

/**
 * @param {?Error=} e
 */
ChallengeRendering.prototype.drawError = function (e)
{
	e = e || this.error;

	// Replace any rendered content with the error message.
	this.root.innerHTML = "";
	var msg = this.root.appendChild(HTML.createElement("p"));
	msg.className = "error";
	HTML.setTextContent(msg, "" + e);
};

/**
 * @param {*} data
 */
ChallengeRendering.prototype.highlight = function (data)
{
	if (this.highlighted)
	{
		this.highlighted.node.className = "phone";
		// TODO:
		// HTML.removeClass(this.highlighted, "highlighted");
	}

	var newHighlight = null;

	// Find new highlight HTML
	for (var i = this.dataRenderings.length; i--;)
	{
		if (this.dataRenderings[i].value === data)
			newHighlight = this.dataRenderings[i];
	}

	if (newHighlight)
	{
		this.highlighted = newHighlight;
		newHighlight.node.className = "phone highlighted";
		// TODO:
		// HTML.addClass(newHighlight, "highlighted");
	}
};

return ChallengeRendering;

})(HTML, JSON, NumberFormat);