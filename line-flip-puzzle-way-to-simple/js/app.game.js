"use strict";

var app = window.app || {};

app.gameDifficulty = {
    easy: 0,
    normal : 1,
    hard : 2,
}

app.lineFlipPuzzle = function(){
    
    this.grid = [];
    this.buttons = [];
}

app.lineFlipPuzzle.prototype.setup = function () {
      
    this.setupGrid();
    
    this.setupButtons();
                               
    this.setupNewGame();
}

app.lineFlipPuzzle.prototype.setupButtons = function () {
      
    // top row
    
    var centerx = app.settings.buttonOffset + (app.settings.elementWidth * 0.5);
    var centery = app.settings.buttonOffset - app.settings.elementMargin - app.settings.elementMargin - (app.settings.buttonHeight * 0.5);
    
    for(var i = 0; i < app.settings.elementColumnCount; i++){
        
        var button = new app.gameButton();
        button.center.x = centerx;
        button.center.y = centery;
        button.width = app.settings.buttonWidth;
        button.height = app.settings.buttonHeight;
        button.columnIndex = i;        
        
        this.buttons.push(button);
        
        centerx += app.settings.elementWidth + app.settings.elementMargin;
    }
    
    // left column
    
    var centerx = app.settings.buttonOffset - app.settings.elementMargin - app.settings.elementMargin - (app.settings.buttonHeight * 0.5);
    var centery = app.settings.buttonOffset + (app.settings.elementWidth * 0.5);
    
    for(var i = 0; i < app.settings.elementRowCount; i++){
        
        var button = new app.gameButton();
        button.center.x = centerx;
        button.center.y = centery;
        button.width = app.settings.buttonWidth;
        button.height = app.settings.buttonHeight;
        button.rowIndex = i;        
        
        this.buttons.push(button);
        
        centery += app.settings.elementWidth + app.settings.elementMargin;
    }
    
}

app.lineFlipPuzzle.prototype.setupGrid = function () {

    this.grid = new app.gameGrid();
    
    this.grid.position.x = app.settings.buttonOffset;
    this.grid.position.y = app.settings.buttonOffset;
    
    this.grid.setupGrid();
}

app.lineFlipPuzzle.prototype.setupUi = function(){
    
}

app.lineFlipPuzzle.prototype.setupEventHandlers = function(){

    $(".clear-state").on("click", function() {
        app.game.clearState();
        return false;
    });
    
    $(".reset-state").on("click", function() {
        app.game.resetState();
        return false;
    });
    
    $(".new-game").on("click", function() {
        app.game.newGame();
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

app.lineFlipPuzzle.prototype.width = function ()
{
    return app.settings.buttonOffset 
        + (app.settings.elementWidth * app.settings.elementColumnCount) 
        + (app.settings.elementMargin * app.settings.elementColumnCount - 1) 
        + app.settings.buttonOffset;
}

app.lineFlipPuzzle.prototype.height = function ()
{
    return app.settings.buttonOffset 
        + (app.settings.elementHeight * app.settings.elementRowCount) 
        + (app.settings.elementMargin * app.settings.elementRowCount - 1);
}

app.lineFlipPuzzle.prototype.setupNewGame = function ()
{
    this.resetState();
}

app.lineFlipPuzzle.prototype.resetState = function ()
{
    this.clearState();

}

app.lineFlipPuzzle.prototype.clearState = function ()
{
//    app.clickedTriangles = [];
    
//    for(var i = 0; i < this.elements.length; i++)
//    {
//        this.elements[i].clearState();
//    }
}

app.lineFlipPuzzle.prototype.draw = function () {
  
    background(255);
    
    this.grid.draw();
    
    for(var i = 0; i < this.buttons.length; i++)
    {
        this.buttons[i].draw();
    }
}

app.lineFlipPuzzle.prototype.handleClicks = function () {
        
//    grid.handleClicks(mouseX, mouseY);
    
    for(var i = 0; i < this.buttons.length; i++)
    {
        var button = this.buttons[i];
        
        if(button.handleClicks(mouseX, mouseY)){
            
            if(button.rowIndex === -1){
                this.grid.nextColumnState(button.columnIndex);
            }
            else{
                this.grid.nextRowState(button.rowIndex);
            }
        }
    }
    
}
