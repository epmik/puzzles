"use strict";

var app = window.app || {};

app.canvas = null;
app.debug = true;
//app.debugFunctionCalls = true;
app.debugHoverAreas = false;
app.game = null;
app.clickedTriangles = [];
app.settings = {
    elementWidth:60,
    elementHeight:60,
    elementMargin:6,
    elementColumnCount:3,
    elementRowCount:3,
    buttonOffset:60,
    buttonWidth:20,
    buttonHeight:10,
    triangleRadius:60,
    triangleHorizontalMargin:16,
    triangleVerticalMargin:16,
	triangleMinPulseFactor:1,
	triangleMaxPulseFactor:1.3,
	trianglePulseSpeed:2,	// pulse duration from min to max in seconds
	dotMinPulseFactor:1,
	dotMaxPulseFactor:1.5,
	dotPulseSpeed:2,			// pulse duration from min to max in seconds
	dotSize:12,			// pulse duration from min to max in seconds
};

app.log = function(argument){
    if(app.debug === true){
        console.log(argument);
    }
}
