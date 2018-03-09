"use strict";

var app = window.app || {};

app.playStyles = {
    selfAndNeighbours: 0,
    neighboursOnly : 1,
    opposites : 2,
}

app.playDifficulty = {
    easy: 0,
    normal : 1,
//    hard : 2,
}

app.canvas = null;    
app.game = null;    
app.settings = { 
    flipHeight:80,
    flipWidth:60,
    flipperCount:9,
    flipperMarginFactor:0.2,
    flipperLayout:app.flipLayout.diamond,
    flipperKind:app.flipKind.triangle
};

function setup() {
  
    var root = parseInt(Math.sqrt(app.settings.flipperCount)) + 1;
    
    app.canvas = createCanvas(app.settings.flipWidth * root, app.settings.flipHeight * root);
    
    app.canvas.parent("canvas-container");
    
    app.game = new app.flipGame();
    
    app.game.setup();
    
//    var flipper = new app.flipper();
//    
//    flipper.position.x = app.canvas.width / 2;
//    flipper.position.y = app.canvas.height / 2;
//    
//    flipper.setupTriangles();
//    
//    app.flippers.push(flipper);
    
    setupOptionsUi();
    
    setupEventHandlers();
}

function setupOptionsUi(){
    
//    $(".puzzle-options-difficulty").val(app.settings.playDifficulty);
//    $(".puzzle-options-type").val(app.settings.playStyle);
}

function setupEventHandlers(){
    
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
  
    noStroke();
    
    app.game.draw();
}

function mousePressed() {

    app.game.handleClicks();
}