"use strict";

var app = window.app || {};

app.flipper = function(){
    
    this.layout = app.flipLayout.diamond;
    this.position = { x : 0, y : 0 };
    this.width = 60;
    this.height = 60;
    this.triangles = [];
    this.kind = app.flipKind.triangle;
    this.index;
}

app.flipper.prototype.draw = function(){
    
    push();
    
    translate(this.position.x, this.position.y);
    
    var x1 = 0;
    var y1 = 0;
    
    var x2 = this.width;
    var y2 = 0;
    
    var x3 = this.width;
    var y3 = this.height;
    
    var x4 = 0;
    var y4 = this.height;
     
    noFill();
    
    strokeWeight(1);
    stroke(127);  
    
//    rect(0, 0, this.width, this.height);
//    rect(0, 0, this.width, this.height, (this.width + this.height) * 0.05);
    
//    noStroke();
    
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
    
    var x1 = 0;
    var y1 = 0;
    
    var x2 = this.width;
    var y2 = 0;
    
    var x3 = this.width;
    var y3 = this.height;
    
    var x4 = 0;
    var y4 = this.height;
    
    var t = null;
    
    switch(this.layout){
        case app.flipLayout.diamond:

            t = new app.flipTriangle();
            t.x1 = x1;
            t.y1 = y1;
            t.x2 = x2;
            t.y2 = y2;
            t.x3 = xc;
            t.y3 = yc;        
            this.triangles.push(t);

            t = new app.flipTriangle();
            t.x1 = x2;
            t.y1 = y2;
            t.x2 = x3;
            t.y2 = y3;
            t.x3 = xc;
            t.y3 = yc;        
            this.triangles.push(t);

            t = new app.flipTriangle();
            t.x1 = x3;
            t.y1 = y3;
            t.x2 = x4;
            t.y2 = y4;
            t.x3 = xc;
            t.y3 = yc;        
            this.triangles.push(t);

            t = new app.flipTriangle();
            t.x1 = x4;
            t.y1 = y4;
            t.x2 = x1;
            t.y2 = y1;
            t.x3 = xc;
            t.y3 = yc;        
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

app.flipper.prototype.clearState = function(){
    
    for(var i = 0; i < this.triangles.length; i++){
        this.triangles[i].clearState();
    }
}

app.flipper.prototype.nextState = function(triangleIndex){
    
    if(triangleIndex === undefined || triangleIndex === null){
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
