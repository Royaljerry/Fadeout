/*-------------------------------------------------
Get Radio Button Value

Get the selected value of a RadioButton group
---------------------------------------------------
:param        «NAME»       «TYPE»:           «DESC»
---------------------------------------------------
:return:      The value of the selected button
:rtype:       Number
:raises:      -
-------------------------------------------------*/
function getRadioValue(element)
{
	var r = '';
	for (var i in element)
	{
		if (element[i] instanceof RadioButton)
		{
			r += element[i].text + "\n";
		}
	}
	return(r);
}

var FadeoutOptions =
{
	createDialog: function()
	{
		var options = "dialog {text: 'Fadeout', " +
			"\
			untsPn: Panel\
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
					vmnTx:          EditText            {text:'10', characters: 3}\
				},\
				vmxGr:               Group\
				{\
					orientation:    'row',\
					label:          StaticText          {text:'Maximum:'},\
					vmxTx:          EditText            {text:'10', characters: 3}\
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
		this.getWindowOptions();
		this.win = null;
	},

	getWindowOptions: function()
	{
		var v = getRadioValue(this.win.untsPn);
		alert("FINALLY\n\n" + v);
	}
}

/*-------------------------------------------------
Main Entry Point
-------------------------------------------------*/
function main()
{
	if (app.documents.length > 0)
	{
		FadeoutOptions.getUserOptions();
	}
}

main();
