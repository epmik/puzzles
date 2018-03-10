"use strict";

var app = window.app || {};

app.flipState = {
    min: 0,
    white: 0,
    black: 1,
    max: 2
}

app.flipKind = {
    triangle: 1,
}

app.flipLayout = {
    diamond: 2,
}

app.location = {
    top: 0,
    right: 1,
    bottom: 2,
    left: 3,
}

app.difficulty = {
    easy: 0,
    normal : 1,
    hard : 2,
}

app.flipGame = function(){
    
    this.flippers = [];
    this.currentInitializer = 0;
}

app.flipInitializers = [
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [0, 2, 8, 6, 4, 4, 5, 3, 7, 1] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [0, 2, 8, 6, 7, 1, 3, 5] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [4, 7, 1, 5, 3] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [4, 7, 1, 5, 3, 7, 1, 3, 5, 3, 5, 8, 2, 0, 6] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [1, 4, 7, 5, 3, 4, 6, 8, 5, 0, 1] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [0, 1, 2, 5, 4, 3, 6, 7, 8] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [0, 4, 8, 2, 4, 6] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [6, 2, 5, 3, 8, 0] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [6, 7, 8, 2, 1, 0, 4] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [8, 5, 1, 0, 3, 6, 7, 8] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [7, 1, 2, 8, 6, 0] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [0, 7, 2, 3, 8, 1, 6] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [1, 6, 5, 0, 7, 2] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [8, 7, 6, 4, 0, 2] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [0, 1, 2, 5, 4, 3, 6, 7, 8, 8, 7, 6, 3, 5, 4] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [1, 3, 5, 8, 7, 6, 7, 5, 3] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [0, 2, 4, 8, 6, 5, 3, 7, 1, 4, 6, 8, 2, 0] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [6, 8, 2, 0, 1, 3, 7, 5, 4] },
    { difficulty: app.difficulty.normal, rows: 3, columns: 3, indices: [6, 8, 2, 0, 1, 3, 7, 5, 4, 7, 7, 7, 1] },
];

app.flipGame.prototype.setup = function () {
      
    for(var i = 0; i < app.settings.flipperRowCount * app.settings.flipperColumnCount; i++){
        
        var flipper = new app.flipper();
        
        flipper.width = app.settings.flipWidth;
        flipper.height = app.settings.flipHeight;
        flipper.kind = app.settings.flipperKind;
        flipper.layout = app.settings.flipperLayout;
        flipper.index = i;
        
        this.flippers.push(flipper);
    }
    
    this.setupFlipperPositions();
                               
    this.newGame();
}

app.flipGame.prototype.setupUi = function(){
    
}

app.flipGame.prototype.setupEventHandlers = function(){

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

app.flipGame.prototype.setupFlipperPositions = function ()
{
    var x = (app.canvas.width - ((app.settings.flipperColumnCount * app.settings.flipWidth) + ((app.settings.flipperColumnCount - 1) * app.settings.flipperMargin))) / 2;
    var y = (app.canvas.height - ((app.settings.flipperRowCount * app.settings.flipHeight) + ((app.settings.flipperRowCount - 1) * app.settings.flipperMargin))) / 2;
    var w = app.settings.flipWidth + app.settings.flipperMargin;
    var h = app.settings.flipHeight + app.settings.flipperMargin;
    var index = 0;
    
    for(var j = 0; j < app.settings.flipperRowCount; j++)
    {
        x = (app.canvas.width - (app.settings.flipperColumnCount * app.settings.flipWidth)) / 2;
        
        for(var i = 0; i < app.settings.flipperColumnCount; i++)
        {
            this.flippers[index].position.x = x;
            this.flippers[index].position.y = y;
            
            this.flippers[index].setupTriangles();
            
            index++;
            
            x += w;
        }

        y += h;
    }
}

app.flipGame.prototype.findNeighbour = function(triangle, location)
{
    if(location == app.location.top)
    {
        var index = triangle.index - app.settings.flipperColumnCount;
        
        return index < 0 ? null : this.flippers[index];
    }

    if(location == app.location.bottom)
    {
        var index = triangle.index + app.settings.flipperColumnCount;
        
        return index >= this.flippers.length ? null : this.flippers[index];
    }

    var row = Math.floor(triangle.index / app.settings.flipperColumnCount); 

    var index = location == app.location.right ? triangle.index + 1 : triangle.index - 1;
    
    var r = Math.floor(index / app.settings.flipperColumnCount); 
        
    return r != row ? null : this.flippers[index];
}

app.flipGame.prototype.findNeighbours = function(triangle)
{
    var neighbours = [];
    
    for(var i = 0; i < 4; i++){
        neighbours.push(this.findNeighbour(triangle, i));
    }
    
    return neighbours;
}

app.flipGame.prototype.newGame = function ()
{
    var i = this.currentInitializer;
    
    while(i === this.currentInitializer){
        this.currentInitializer = parseInt(Math.random() * app.flipInitializers.length);
    }

    this.resetState();
}

app.flipGame.prototype.resetState = function ()
{
    this.clearState();
    
    var initializer = app.flipInitializers[this.currentInitializer];
    
    for(var i = 0; i < initializer.indices.length; i++) {
        
        this.nextState(this.flippers[initializer.indices[i]]);
    }
}

app.flipGame.prototype.clearState = function ()
{
    app.clickedTriangles = [];
    
    for(var i = 0; i < this.flippers.length; i++)
    {
        this.flippers[i].clearState();
    }
}

app.flipGame.prototype.draw = function () {
  
    background(255);
    
    noStroke();
    
    for(var i = 0; i < this.flippers.length; i++)
    {
        this.flippers[i].draw();
    }

}

app.flipGame.prototype.oppositeLocation = function (location) {

    return this.clampLocation(location + 2);
}

app.flipGame.prototype.clampLocation = function (location) {

    return location >= 4 ? location - 4 : location < 0 ? location + 4 : location;
}

app.flipGame.prototype.handleClicks = function () {
        
    for(var i = 0; i < this.flippers.length; i++){
        
        var location = this.flippers[i].isClicked(mouseX, mouseY);
        
        if(location !== -1){
            
            this.nextState(this.flippers[i]);
        }
    }
}

app.flipGame.prototype.nextState = function (flipper) {
        
    app.clickedTriangles.push(flipper.index);

    app.log(app.clickedTriangles);
            
    flipper.nextState();

    var neighbours = this.findNeighbours(flipper);

    for(var j = 0; j < neighbours.length; j++){

        if(neighbours[j] == null){
            continue;
        }

        neighbours[j].nextState(this.oppositeLocation(j));
    }
}