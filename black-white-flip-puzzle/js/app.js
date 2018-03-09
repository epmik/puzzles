"use strict";

var app = window.app || {};

app.playStyles = {
    selfAndNeighbours: 0,
    neighboursOnly : 1,
    opposites : 2,
}

app.canvas = null;    
app.game = null;    
app.clickedTriangles = [];
app.settings = { 
    flipWidth:60,
    flipHeight:60,
    flipperColumnCount:3,
    flipperRowCount:3,
    //flipperMarginFactor:0.2,
    flipperLayout:app.flipLayout.diamond,
    flipperKind:app.flipKind.triangle
};

//var flipper = null;

function setup() {
  
    app.canvas = createCanvas(
        app.settings.flipWidth * (app.settings.flipperColumnCount + 1), 
        app.settings.flipHeight * (app.settings.flipperRowCount + 1));
    
    app.canvas.parent("canvas-container");
    
    app.game = new app.flipGame();
    
    app.game.setup();
    
//    flipper = new app.flipper();
//    
//    flipper.width = 60;
//    flipper.height = 60;
//    flipper.position.x = app.canvas.width / 2;
//    flipper.position.y = app.canvas.height / 2;
//    
//    flipper.setupTriangles();
    
    setupOptionsUi();
    
    setupEventHandlers();
}

function setupOptionsUi(){
    
//    $(".puzzle-options-difficulty").val(app.settings.playDifficulty);
//    $(".puzzle-options-type").val(app.settings.playStyle);
}

function setupEventHandlers(){

    $(".clear-state").on("click", function() {
        app.game.clearState();
        return false;
    });
    
//    $(".reset-puzzle").on("click", function() {
//        resetPlay();
//        return false;
//    });
//    
//    $(".puzzle-options-difficulty").on("change", function() {
//        app.settings.playDifficulty = parseInt($(this).val());
////        console.log("puzzle difficulty is now " + app.settings.playDifficulty);
//        resetPlay();
//        return false;
//    });
//    
//    $(".puzzle-options-type").on("change", function() {
//        app.settings.playStyle = parseInt($(this).val());
////        console.log("puzzle type is now " + app.settings.playStyle);
//        resetElementsToSwitch();
//        resetPlay();
//        return false;
//    });
}

function draw() {
  
    background(255);
    
    app.game.draw();
}

function mousePressed() {

    app.game.handleClicks();
}