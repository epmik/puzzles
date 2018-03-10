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
    elementColumnCount:7,
    elementRowCount:7,
    buttonOffset:60,
    buttonWidth:20,
    buttonHeight:10,
};

app.log = function(){
    if(app.debug === true){
        console.log(object)
    }
}

