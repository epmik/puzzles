"use strict";

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