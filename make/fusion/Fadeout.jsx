/*-----------------------------------------------
Get Radio Button Value

Get the selected value of a RadioButton group
-------------------------------------------------
:param        element        Object:        Radio button group
-------------------------------------------------
:return:      The value of the selected button
:rtype:       Number
:raises:      -
-----------------------------------------------*/
function getRadioValue(element)
{
	for (var i in element)
	{
		if (element[i] instanceof RadioButton && element[i].value) {return(i);}
	}
}

function getCenter(p)
{
	var r =
	{
		px: p.left + (p.width / 2),
		py: p.top - (p.height / 2)
	}
	return(r);
}

function getDistance(p1, p2)
{
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	// alert("Distance of coords: " + dx + ", " + dy);
	return(d);
}

function getOrigin(p)
{
	var minX = getCenter(p[0]).px;
	var maxX = getCenter(p[0]).px;
	var minY = getCenter(p[0]).py;
	var maxY = getCenter(p[0]).py;
	for(var i in p)
	{
		var c = getCenter(p[i]);
		if (c.px < minX) {minX = c.px;}
		if (c.px > maxX) {maxX = c.px;}
		if (c.py < minY) {minY = c.py;}
		if (c.py > maxY) {maxY = c.py;}
	}
	r =
	{
		ox: (minX + maxX) / 2,
		oy: (minY + maxY) / 2
	}
	return(r);
}

/*-----------------------------------------------
Get all paths

Loop thru' all paths and groups and get them as arry elements
Thx. Hiroyuki :)
[Hiroyuki Sato](https://github.com/shspage)
-------------------------------------------------
:param        s              Object:        Items to investigate - can be path or group
:param        p              Array:         Array to collect path items in
-------------------------------------------------
:return:      Path items
:rtype:       Array
:raises:      -
-----------------------------------------------*/
function getPaths(s, p)
{
	for(var i = 0; i < s.length; i++)
	{
		if(s[i].typename == "PathItem" && !s[i].guides && !s[i].clipping) {p.push(s[i]);}
		else if(s[i].typename == "GroupItem") {getPaths(s[i].pageItems, p);}
		else if(s[i].typename == "CompoundPathItem") {getPaths(s[i].pathItems, p);}
	}
}

/*-----------------------------------------------
Set path values

Loop thru' all paths and its descendants and modify their values
-------------------------------------------------
:param        paths          Array:         Array of paths to be modified
:param        options        Object:        Options object
:param        origin         Object:        Origin coords
-------------------------------------------------
:return:      -
:rtype:       -
:raises:      -
-----------------------------------------------*/
function setPaths(paths, options, origin)
{
	var o = getOrigin(paths);
	// alert("Origin:\n\n" + o.ox + ", " + o.oy);
	for(var i in paths)
	{
		var cPath = paths[i];
		var p = getCenter(cPath);
		var p1 = {x: p.px, y: p.py}
		var p2 = {x: o.ox, y: o.oy}
		var d = getDistance(p1, p2);
		// alert("Distance: " + d);
	}
}

var FadeoutOptions =
{
	canceled:                       false,
	createDialog:                   function()
	{
		var options = "dialog {text: 'Fadeout', " +
			"\
			untsPn:                 Panel\
			{\
				orientation:        'row',\
				alignment:          'fill',\
				alignChildren:      'left',\
				text:               'Unit',\
				relRd:              RadioButton         {text: 'Relative (%)'},\
				absRd:              RadioButton         {text: 'Absolute (px)', value: true}\
			},\
			trnsPn: Panel\
			{\
				orientation:        'row',\
				alignment:          'fill',\
				alignChildren:      'left',\
				text:               'Transition',\
				linRd:              RadioButton         {text: 'Linear', value:true},\
				cubRd:              RadioButton         {text: 'Cubic'},\
				logRd:              RadioButton         {text: 'Logarithmic'}\
			},\
			valsPn: Panel\
			{\
				orientation:        'row',\
				alignment:          'fill',\
				alignChildren:      'left',\
				text:               'Values', \
				vmnGr:               Group\
				{\
					orientation:    'row',\
					label:          StaticText          {text:'Minimum:'},\
					vmnTx:          EditText            {text:'10', characters: 2}\
				},\
				vmxGr:               Group\
				{\
					orientation:    'row',\
					label:          StaticText          {text:'Maximum:'},\
					vmxTx:          EditText            {text:'10', characters: 2}\
				}\
			},\
			buttons: Group\
			{\
				orientation:        'row',\
				alignment:          'right',\
				cncBt:              Button             {text: 'Cancel', properties: {name: 'cancel'}},\
				fdtBt:              Button             {text: 'OK', properties: {name: 'ok'}}\
			}\
		}";

		this.win = new Window(options);
		var w = this.win;
		this.win.buttons.cncBt.onClick = function () {w.close(-1);};
		this.win.buttons.fdtBt.onClick = function () {w.close(1);};
	},

	getUserOptions: function()
	{
		this.createDialog();
		if (this.win.show() < 0) {this.canceled = true;}
		this.getPanelOption();
		this.win = null;
	},

	getPanelOption: function()
	{
		this.panelOptions =
		{
			unts: getRadioValue(this.win.untsPn),
			trns: getRadioValue(this.win.trnsPn),
			valsMin: this.win.valsPn.vmnGr.vmnTx.text,
			valsMax: this.win.valsPn.vmxGr.vmxTx.text
		}
	}
}

/*-------------------------------------------------
Main Entry Point
-------------------------------------------------*/
function main()
{
	if (app.documents.length > 0)
	{
		// Paths to be modified
		var paths = [];
		// Get selection
        var selections = activeDocument.selection;
		var sx = selections.left + (selections.width / 2);
		var sy = selections.top - (selections.top / 2);
		// Stop, if nothing has been selected
		if (selections == '') {alert('Nothing has been selected :('); return;}
		// Get options
		FadeoutOptions.getUserOptions();
		// Stop, if panel has been canceled
		if (FadeoutOptions.canceled) {return;}
		// Get exact pathes (even inside groups)
		getPaths(selections, paths);
		// Set path values
		setPaths(paths, FadeoutOptions.panelOptions, getOrigin(paths));
	}
}

main();
