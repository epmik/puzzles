"use strict";

var app = window.app || {};

app.canvas = null;
app.debug = true;
//app.debugFunctionCalls = true;
app.debugHoverAreas = false;
app.game = null;
app.clickedTriangles = [];
app.settings = {
    triangleRadius:50,
    triangleHorizontalMargin:12,
    triangleVerticalMargin:12,
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
