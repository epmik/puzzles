"use strict";

var app = window.app || {};

app.gameElementType = {
    ellipse: 0,
    rectangle: 1,
}

app.gameElementState = {
    min: 0,
    white: 0,
    black: 1,
    max: 2
}

app.gameElement = function(){
    
    this.type = app.gameElementType.rectangle;
    this.state = app.gameElementState.black;
    this.position = { x: 0, y: 0 };
    this.width = 40;
    this.height = 40;
    this.index = 0;
    this.rowIndex = 0;
    this.columnIndex = 0;
}

app.gameElement.prototype.nextState = function(){
    
    this.state++;
    
    if(this.state == app.gameElementState.max)
    {
        this.state = app.gameElementState.min;
    }
}

app.gameElement.prototype.clearState = function(){
    
    this.state = app.flipState.black;
}

app.gameElement.prototype.setFill = function()
{
    switch(this.state)
    {
        case app.gameElementState.white:
            fill(255);
            break;
        case app.gameElementState.black:
            fill(0);
            break;
    }
}

app.gameElement.prototype.isInside = function(px, py){
    
    switch(this.type){
        case app.gameElementType.rectangle:
            return app.collision.isPointInsideRectangle(px, py, this.position.x, this.position.y, this.width, this.height);
        case app.gameElementType.ellipse:
            return app.collision.isPointInsideEllipse(px, py, this.position.x, this.position.y, this.width, this.height);
    }
}

app.gameElement.prototype.draw = function()
{
    this.setFill();
    
    switch(this.type){
        case app.gameElementType.rectangle:
            rect(
                this.position.x,
                this.position.y,
                this.width,
                this.height,
                this.width * 0.1
            );
            break;
        case app.gameElementType.ellipse:
            ellipseMode(CORNER);
            ellipse(
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
            break;
    }
    
}

app.gameElement.prototype.handleClicks = function(px, py){
    
    if(this.isInside(px, py)){
        this.nextState();
    }
    
}