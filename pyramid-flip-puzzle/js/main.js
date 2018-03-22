"use strict";

//var element = null;
//var grid = null;
//var button = null;

function setup() {
  
    app.game = new app.pyramidFlip();
 
    app.canvas = createCanvas(app.game.width(), app.game.height());
    
    app.canvas.parent("canvas-container");
    
    app.game.setup();
}

function draw() {
    
    app.game.update();
    
    app.game.draw();
}

function mousePressed() {

    app.game.handleClicks();
    
}

function mouseMoved() {

    app.game.handleHover();
    
}

function keyPressed() {
    
    app.game.handleKeyPress();

}

function keyReleased() {

    app.game.handleKeyRelease();
    
}