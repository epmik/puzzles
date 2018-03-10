"use strict";

var app = window.app || {};

app.elementState = {
    min : 0,
    white : 0,
    black : 1,
    max : 2
}

app.flipKind = {
    all : 0,
    triangle : 1,
}

app.flipLayout = {
//    vertical : 0,
//    horizontal : 1,
    diamond:2,
}

app.location = {
    topLeft : 0,
    topRight : 1,
    bottomRight: 2,
    bottomLeft: 3,
}

app.flipGame = function(){
    
    this.flippers = [];
}

app.flipGame.prototype.setup = function () {
      
    for(var i = 0; i < app.settings.flipperCount; i++){
        var flipper = new app.flipper();
        
        flipper.width = app.settings.flipWidth;
        flipper.height = app.settings.flipHeight;
        flipper.kind = app.settings.flipperKind;
        flipper.layout = app.settings.flipperLayout;
        flipper.index = i;
        
        this.flippers.push(flipper);
    }
    
    this.setupFlipperPositions();
}

app.flipGame.prototype.setupFlipperPositions = function ()
{
    var halfcount = parseInt(this.flippers.length / 2);
    
    var rowIndex = 0;
    var rowTriangleCount = 1;
    var index = 0;
    
    var centerx = parseInt(app.canvas.width / 2);
    
    var x = 0;
    var y = 0;
    
    var marginh = parseInt(app.settings.flipHeight * app.settings.flipperMarginFactor);
    var marginw = parseInt(app.settings.flipWidth * app.settings.flipperMarginFactor);
    
    var h = (app.settings.flipHeight / 2) + (marginh / 2);
    
    
    while(index < this.flippers.length){

        var w = parseInt((app.settings.flipWidth * rowTriangleCount) + ((rowTriangleCount - 1) * marginw));

        x = centerx - (w / 2);
        
        for(var rowTriangleIndex = 0; rowTriangleIndex < rowTriangleCount; rowTriangleIndex++)
        {
            this.flippers[index].position.x = x;
            this.flippers[index].position.y = y;
            this.flippers[index].setupTriangles();
            this.flippers[index].rowIndex = rowIndex;
            this.flippers[index].rowTriangleIndex = rowTriangleIndex;
            this.flippers[index].rowTriangleCount = rowTriangleCount;
            
            x += app.settings.flipWidth + marginw;
            
            index++;
        }
        
        if(index < halfcount){
            rowTriangleCount++;
        }
        else{
            rowTriangleCount--;
        } 
        
        rowIndex++;
        
        y += h;
    }
}

app.flipGame.prototype.findNeighbour = function(triangle, location)
{
    var root = parseInt(Math.sqrt(this.flippers.length));

    var rowTriangles = location === 0 || location === 1 
        ? this.findRowTriangles(triangle.rowIndex - 1)
        : this.findRowTriangles(triangle.rowIndex + 1);

    if(rowTriangles.length == 0){
        return null;        
    }
    
    if(location === app.location.topLeft){
        //  top left
        if(triangle.rowIndex < root){
            if(triangle.rowTriangleIndex == 0){
               return null;
            }
            return rowTriangles[triangle.rowTriangleIndex - 1];
        }
        else{
            return rowTriangles[triangle.rowTriangleIndex];
        }
    }
    
    if(location === app.location.topRight){
        //  top right
        if(triangle.rowIndex < root){
            if(triangle.rowTriangleIndex == triangle.rowTriangleCount - 1){
               return null;
            }
            return rowTriangles[triangle.rowTriangleIndex];
        }
        else{
            return rowTriangles[triangle.rowTriangleIndex + 1];
        }
    }
    
    if(location === app.location.bottomRight){
        //  bottom right        
        if(triangle.rowIndex + 1 >= root){
            if(triangle.rowTriangleIndex == triangle.rowTriangleCount - 1){
               return null;
            }
            return rowTriangles[triangle.rowTriangleIndex];
        }
        else{
            return rowTriangles[triangle.rowTriangleIndex + 1];
        }
    }
    
    if(location === app.location.bottomLeft){
        //  bottom left       
        if(triangle.rowIndex + 1 >= root){
            if(triangle.rowTriangleIndex == 0){
               return null;
            }
            return rowTriangles[triangle.rowTriangleIndex - 1];
        }
        else{
            return rowTriangles[triangle.rowTriangleIndex];
        }
    }
    
    //  bottom left
}

app.flipGame.prototype.findNeighbours = function(triangle)
{
    var neighbours = [];
    
    for(var i = 0; i < 4; i++){
        neighbours.push(this.findNeighbour(triangle, i));
    }
    
    return neighbours;
}

app.flipGame.prototype.findRowTriangles = function (rowIndex)
{
    var rowTriangles = [];
    
    for(var i = 0; i < this.flippers.length; i++)
    {
        if(this.flippers[i].rowIndex == rowIndex){
            rowTriangles.push(this.flippers[i]);
        }
    }
    
    return rowTriangles;
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
            
            this.flippers[i].nextState(location);
            
            var neighbours = this.findNeighbours(this.flippers[i]);
            
            if(neighbours[location] != null)
            {
                neighbours[location].nextState(this.oppositeLocation(location));
            }
        }
    }
}