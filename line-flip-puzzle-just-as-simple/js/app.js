"use strict";

var app = window.app || {};

app.canvas = null;    
app.debug = true;    
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
};

app.log = function(argument){
    if(app.debug === true){
        console.log(argument);
    }
}
