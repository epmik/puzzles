"use strict";

var app = window.app || {};

app.gameButton = function(){
    
    this.center = { x: 0, y: 0 };
    this.width = 40;
    this.height = 20;
    this.rowIndex = -1;
    this.columnIndex = -1;
}

app.gameButton.prototype.isInside = function(px, py){
    
    var m = Math.max(this.width, this.height);
    
    return app.collision.isPointInsideEllipseFromCenter(px, py, this.center.x, this.center.y, m, m);
}

app.gameButton.prototype.draw = function()
{
    strokeWeight(1);
    stroke(0);
    fill(0);
    
    var hwidth = this.rowIndex === -1 ? this.width * 0.5 : this.height * 0.5;
    var hheight = this.rowIndex === -1 ? this.height * 0.5 : this.width * 0.5;
    
    var x1 = this.center.x - hwidth; 
    var y1 = this.center.y - hheight; 
    var x2 = this.center.x + hwidth; 
    var y2 = this.center.y - hheight; 
    var x3 = this.center.x; 
    var y3 = this.center.y + hheight; 
    
    if(this.rowIndex !== -1){
    
        y2 = this.center.y;
        x3 = this.center.x - hwidth; 
    }
    
    triangle(
        x1,
        y1,
        x2,
        y2,
        x3,
        y3
    );
}

app.gameButton.prototype.handleClicks = function(px, py){
    
    return this.isInside(px, py);
    
}