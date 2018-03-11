"use strict";

var app = window.app || {};

app.foldElementShape = {
    rectangle: 0,
    triangle: 1
}

app.splitEdge = function(){
    
}

app.foldElement = function(){
    
    this.id = -1;
    this.position = { x: 0, y: 0 };
    this.width = 0;
    this.height = 0;
    this.shape = app.foldElementShape.rectangle;
    this.children = [];
    this.splitEdges = [];
}

app.foldElement.prototype.draw = function(){
    
    push();
    
    if(this.children.length > 0){
        for(var i = 0; i < this.children.length; i++)        {
            this.children[i].draw();
        }
        
        return;
    }
    
    switch(this.shape){
        case app.foldElementShape.rectangle:
            noStroke();
            fill(0);
            rect(this.position.x, this.position.y, this.width, this.height);
            break;
        case app.foldElementShape.triangle:
            throw "unknown app.foldElementShape shape";
            break;
    }

    pop();
}

app.foldElement.prototype.handleClicks = function(mousex, mousey){
    
//    mousex -= this.position.x;
//    mousey -= this.position.y;
    
    if(app.collision.isPointInsideRectangle(mousex, mousey, this.position.x, this.position.y, this.width, this.height)){
        app.log("element clicked: id " + this.id);
    }
    
}

app.foldsInLoveScene = function(){
    
    this.elements = [];
}

app.foldsInLoveScene.prototype.draw = function(){
    
    for(var i = 0; i < this.elements.length; i++)        {
        this.elements[i].draw();
    }
}

app.foldsInLoveScene.prototype.handleClicks = function(mousex, mousey){
    
    for(var i = 0; i < this.elements.length; i++)        {
        this.elements[i].handleClicks(mousex, mousey);
    }
}

app.foldsInLove = function(){
    
    this.scene = null;
}

app.foldsInLove.prototype.setup = function () {
    
    this.scene = new app.foldsInLoveScene();
    
    var element = new app.foldElement();
    element.id = 1;
    element.position.x = 100;
    element.position.y = 40;
    element.width = 60;
    element.height = 60;
    
    this.scene.elements.push(element);
}

app.foldsInLove.prototype.setupUi = function(){
    
}

app.foldsInLove.prototype.setupEventHandlers = function(){

//    $(".clear-state").on("click", function() {
//        app.game.clearState();
//        return false;
//    });
//    
//    $(".reset-state").on("click", function() {
//        app.game.resetState();
//        return false;
//    });
//    
//    $(".new-game").on("click", function() {
//        app.game.newGame();
//        return false;
//    });
    
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

app.foldsInLove.prototype.width = function ()
{
    return 800;
}

app.foldsInLove.prototype.height = function ()
{
    return 600;
}

app.foldsInLove.prototype.draw = function () {
  
    background(255);
    
    this.scene.draw();
//    
//    this.grid.draw();
//    
//    for(var i = 0; i < this.buttons.length; i++)
//    {
//        this.buttons[i].draw();
//    }
}

app.foldsInLove.prototype.handleClicks = function () {
    
    this.scene.handleClicks(mouseX, mouseY);
    
//    grid.handleClicks(mouseX, mouseY);
    
//    for(var i = 0; i < this.buttons.length; i++)
//    {
//        var button = this.buttons[i];
//        
//        if(button.isClicked(mouseX, mouseY)){
//            
//            if(button.rowIndex === -1){
//                this.grid.nextColumnState(button.columnIndex, button.stateToSwitch);
//            }
//            else{
//                this.grid.nextRowState(button.rowIndex, button.stateToSwitch);
//            }
//        }
//    }
    
}
