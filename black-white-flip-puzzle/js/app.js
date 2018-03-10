"use strict";

var app = window.app || {};

app.playStyles = {
    selfAndNeighbours: 0,
    neighboursOnly : 1,
    opposites : 2,
}

app.canvas = null;    
app.debug = false;    
app.game = null;    
app.clickedTriangles = [];
app.settings = { 
    flipWidth:60,
    flipHeight:60,
    flipperMargin:0,
    flipperColumnCount:3,
    flipperRowCount:3,
    //flipperMarginFactor:0.2,
    flipperLayout:app.flipLayout.diamond,
    flipperKind:app.flipKind.triangle
};

app.log = function(){
    if(app.debug === true){
        console.log(object)
    }
}

