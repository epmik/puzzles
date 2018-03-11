"use strict";

//var element = null;
//var grid = null;
//var button = null;

function setup() {
  
    app.game = new app.foldsInLove();
 
//    app.canvas = createCanvas(app.game.canvasWidth(), app.game.canvasHeight());
    app.canvas = createCanvas(app.game.width(), app.game.height());
    
    app.canvas.parent("canvas-container");
    
//    
//    grid = new app.gameGrid();
//    grid.position.y = 40;
//    
//    grid.setupGrid();
    
//    element = new app.gameElement();
    
    app.game.setup();
    
    
//    button = new app.gameButton();
//    button.center.x = 40;
//    button.center.y = 4;
//    button.columnIndex = 0;
    
    setupUi();
    
    setupEventHandlers();
}

function setupUi(){
    
    if(app.debug === true){
        $(".debug-only").show();
    }
    else{
        $(".debug-only").hide();
    }

    app.game.setupUi();
    
//    $(".puzzle-options-difficulty").val(app.settings.playDifficulty);
//    $(".puzzle-options-type").val(app.settings.playStyle);
}

function setupEventHandlers(){

    app.game.setupEventHandlers();
    
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
    
    app.game.draw();
}

function mousePressed() {

    app.game.handleClicks();
    
}