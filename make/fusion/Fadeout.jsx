var FadeoutOptions =
{
	defaults:
	{
		wMin: 10,
		wMax: 100,
		wTrans: 'linear',
		wUnit: '%'
	},

	createDialog: function()
	{
		var options = "dialog { text:'Fadeout', " + 
			"radioPanel: Panel { orientation:'column', alignment:'fill', alignChildren:'left',\
					text: 'Control Point Options', \
					anchorsRb: RadioButton { text:'Anchors Only (Spikey)', value:true	}, \
					handlesRb: RadioButton { text:'Handles Only (Bulbous)'}, \
					bothRb: RadioButton { text:'Anchors and Handles (Chaotic)' } \
				}, \
			stray: Group { orientation: 'row', \
					label: StaticText { text:'Amount to stray (in points):' }, \
					amount: EditText { text:'30', characters: 10 } \
				}, \
			buttons: Group { orientation: 'row', alignment:'right', \
					cancelBtn:	 Button { text:'cancel', properties:{name:'cancel'} }, \
					okBtn: Button { text:'organify', properties:{name:'ok'}	} \
				} \
			}";
		 this.win = new Window(options);
		 w = this.win;
		 this.win.buttons.cancelBtn.onClick = function () {w.close(-1);};
		 this.win.buttons.okBtn.onClick = function () {w.close(1);};
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
		// ToDo
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
