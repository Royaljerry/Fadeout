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

function getCenter(path)
{
	var r =
	{
		px: path.left + (path.width / 2),
		py: path.top - (path.height / 2)
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

function getMetrics(paths)
{
	var minX = getCenter(paths[0]).px;
	var maxX = getCenter(paths[0]).px;
	var minY = getCenter(paths[0]).py;
	var maxY = getCenter(paths[0]).py;
	for(var i in paths)
	{
		var c = getCenter(paths[i]);
		if (c.px < minX) {minX = c.px;}
		if (c.px > maxX) {maxX = c.px;}
		if (c.py < minY) {minY = c.py;}
		if (c.py > maxY) {maxY = c.py;}
	}
	r =
	{
		ox: (minX + maxX) / 2,
		oy: (minY + maxY) / 2,
		sw: Math.abs(maxX - minX),
		sh: Math.abs(maxY - minY)
	}
	return(r);
}

function getFurthest(paths, origin)
{
	var m = 0;
	var p1 = {x: origin.ox, y: origin.oy};
	for(var i in paths)
	{
		var cPath = paths[i];
		var p = getCenter(cPath);
		var p2 = {x: p.px, y: p.py};
		var d = getDistance(p1, p2);
		if (m < d) {m = d;}
	}
	return(m);
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
function getPaths(items, paths)
{
	for(var i = 0; i < items.length; i++)
	{
		if(items[i].typename == "PathItem" && !items[i].guides && !items[i].clipping) {paths.push(items[i]);}
		else if(items[i].typename == "GroupItem") {getPaths(items[i].pageItems, paths);}
		else if(items[i].typename == "CompoundPathItem") {getPaths(items[i].pathItems, paths);}
	}
}

/*-----------------------------------------------
Set path values

Loop thru' all paths and its descendants and modify their values
-------------------------------------------------
:param        paths          Array:         Array of paths to be modified
:param        origin         Object:        Origin coords
:param        options        Object:        Options object
-------------------------------------------------
:return:      -
:rtype:       -
:raises:      -
-----------------------------------------------*/
function setPaths(paths, origin, options)
{
	var o = getMetrics(paths);
	// alert("Longest distance: " + m);
	// alert("Origin:\n\n" + o.ox + ", " + o.oy);
	var co = {x: o.ox, y: o.oy};
	var absDist = getFurthest(paths, origin);
	var usrMin = options.valsMin;
	var usrMax = options.valsMax;
	var usrDist = usrMax - usrMin;
	for(var i in paths)
	{
		var cPath = paths[i];
		var cPathC = getCenter(cPath);
		var cp = {x: cPathC.px, y: cPathC.py};
		var curDist = getDistance(co, cp);
		var absRat = curDist / absDist;
		var usrRat = usrMin + (curDist / usrDist);
		var usrRat = 1 - ((usrMin / 100) + ((absRat * usrDist) / 100));
		var s = cPath.strokeWidth;
		var stkRat = s * usrRat;
		
		// var rAbs = (100 / m) * d;
		// var rUsr = uSR * d;
		// var cAR = 1 - (rAbs / 100);
		// var cUR = 1 - (rUsr / 100);
		switch (options.unts)
		{
			// Units in percent (relative)
			case 'relRd':
				cPath.strokeWidth = stkRat;
				break;
			case 'absRd':
				cPath.strokeWidth = s + stkRat;
				// cPath.strokeWidth = s + (s * cAR + cUR);
				break;
		}
		s = cPath.strokeWidth;
		switch (options.trns)
		{
			case 'cubRd':
				cPath.strokeWidth = Math.pow(s, 2);
				break;
			case 'logRd':
				if (s > 0) {cPath.strokeWidth = Math.log(s);}
				else {cPath.strokeWidth = 0;}
				break;
		}
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
				relRd:              RadioButton         {text: 'Relative (%)', value: true},\
				absRd:              RadioButton         {text: 'Absolute (px)'}\
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
					vmnTx:          EditText            {text:'0', characters: 4}\
				},\
				vmxGr:               Group\
				{\
					orientation:    'row',\
					label:          StaticText          {text:'Maximum:'},\
					vmxTx:          EditText            {text:'100', characters: 4}\
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
		setPaths(paths, getMetrics(paths), FadeoutOptions.panelOptions);
	}
}

main();
