"use strict";

var app = window.app || {};

app.flipper = function(){
    
    this.layout = app.flipLayout.vertical;
    this.position = { x : 0, y : 0 };
    this.width = 40;
    this.height = 60;
    this.triangles = [];
    this.kind = app.flipKind.triangle;
    this.index;
    this.rowIndex;
    this.rowTriangleIndex;
    this.rowTriangleCount;
    this.neightbours = [];
}

app.flipper.prototype.draw = function(){
    
    push();
    
    translate(this.position.x, this.position.y);
    
    var x1 = this.width / 2;
    var y1 = 0;
    
    var x2 = this.width / 2;
    var y2 = this.height;
    
    var x3 = 0;
    var y3 = this.height / 2;
    
    var x4 = this.width;
    var y4 = this.height / 2;
     
    fill(0);
    
    strokeWeight(2);
    stroke(0);  
    
    quad(x1, y1, x4, y4, x2, y2, x3, y3);
    
    noStroke();
    
    for(var i = 0; i < this.triangles.length; i++){
        this.triangles[i].draw();
    }
    
    pop();
}

app.flipper.prototype.setupTriangles = function()
{
    this.triangles = [];

    var xc = this.width / 2;
    var yc = this.height / 2;
    
    var x1 = xc;
    var y1 = 0;
    
    var x2 = this.width;
    var y2 = yc;
    
    var x3 = xc;
    var y3 = this.height;
    
    var x4 = 0;
    var y4 = yc;
    
    var t = null;
    
    switch(this.layout){
//        case app.flipLayout.horizontal:
//            t = new app.flipTriangle();
//            t.x1 = x1;
//            t.y1 = y1;
//            t.x2 = x2;
//            t.y2 = y2;
//            t.x3 = x4;
//            t.y3 = y4;        
//            this.triangles.push(t);
//
//            t = new app.flipTriangle();
//            t.x1 = x4;
//            t.y1 = y4;
//            t.x2 = x2;
//            t.y2 = y2;
//            t.x3 = x3;
//            t.y3 = y3;        
//            this.triangles.push(t);
//           break;
//        case app.flipLayout.vertical:
//            t = new app.flipTriangle();
//            t.x1 = x1;
//            t.y1 = y1;
//            t.x2 = x3;
//            t.y2 = y3;
//            t.x3 = x4;
//            t.y3 = y4;        
//            this.triangles.push(t);
//
//            t = new app.flipTriangle();
//            t.x1 = x1;
//            t.y1 = y1;
//            t.x2 = x2;
//            t.y2 = y2;
//            t.x3 = x3;
//            t.y3 = y3;        
//            this.triangles.push(t);
//           break;
        case app.flipLayout.diamond:

            t = new app.flipTriangle();
            t.x1 = x1;
            t.y1 = y1;
            t.x2 = xc;
            t.y2 = yc;
            t.x3 = x4;
            t.y3 = y4;        
            this.triangles.push(t);

            t = new app.flipTriangle();
            t.x1 = x1;
            t.y1 = y1;
            t.x2 = x2;
            t.y2 = y2;
            t.x3 = xc;
            t.y3 = yc;        
            this.triangles.push(t);

            t = new app.flipTriangle();
            t.x1 = xc;
            t.y1 = yc;
            t.x2 = x2;
            t.y2 = y2;
            t.x3 = x3;
            t.y3 = y3;        
            this.triangles.push(t);

            t = new app.flipTriangle();
            t.x1 = x4;
            t.y1 = y4;
            t.x2 = xc;
            t.y2 = yc;
            t.x3 = x3;
            t.y3 = y3;        
            this.triangles.push(t);
            
           break;
    }
}

app.flipper.prototype.isClicked = function(mouseX, mouseY){
    
    mouseX -= this.position.x;
    mouseY -= this.position.y;
    
    for(var i = 0; i < this.triangles.length; i++){
        if(this.triangles[i].isInside(mouseX, mouseY))
        {
            return i;
        }
    }
    
    return -1;
}

app.flipper.prototype.nextState = function(triangleIndex){
    
    if(this.flip == app.flipKind.all){
        for(var i = 0; i < this.triangles.length; i++){
            this.triangles[i].nextState();
        }
        return;
    }
    
    this.triangles[triangleIndex].nextState();
}

app.flipper.prototype.log = function(){
    
    console.log(this.position.x + " / " + this.position.y + " : " + this.layout);
}
