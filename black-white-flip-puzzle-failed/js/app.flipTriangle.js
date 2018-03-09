"use strict";

var app = window.app || {};

app.flipTriangle = function(){
    
    this.state = app.flipState.black;
    this.x1 = 0;
    this.x2 = 0;
    this.x3 = 0;
    this.y1 = 0;
    this.y2 = 0;
    this.y3 = 0;
}

app.flipTriangle.prototype.nextState = function(){
    
    this.state++;
    
    if(this.state == app.flipState.max)
    {
        this.state = app.flipState.min;
    }
}

app.flipTriangle.prototype.setFlipColor = function()
{
    switch(this.state)
    {
        case app.flipState.white:
            fill(255);
            break;
        case app.flipState.black:
            fill(0);
            break;
    }
}
//
//app.flipTriangle.prototype.isInside = function(px, py){
//    
//    // taken from https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
//    
//    var p0 = { X: this.x1, Y: this.y1 };
//    var p1 = { X: this.x2, Y: this.y2 };
//    var p2 = { X: this.x3, Y: this.y3 };
//
//    var s = p0.Y * p2.X - p0.X * p2.Y + (p2.Y - p0.Y) * px + (p0.X - p2.X) * py;
//    var t = p0.X * p1.Y - p0.Y * p1.X + (p0.Y - p1.Y) * py + (p1.X - p0.X) * py;    
//    
//    if ((s < 0) != (t < 0)){
//        return false;
//    }
//
//    var area = -p1.Y * p2.X + p0.Y * (p2.X - p1.X) + p0.X * (p1.Y - p2.Y) + p1.X * p2.Y;
//    
//    if (area < 0.0)
//    {
//        s = -s;
//        t = -t;
//        A = -A;
//    }
//    
//    return s > 0 && t > 0 && (s + t) <= area;
//}

app.flipTriangle.prototype.isInside = function(px, py){
    
    // taken from https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
    
    var s = { x: px, y: py };
    var a = { x: this.x1, y: this.y1 };
    var b = { x: this.x2, y: this.y2 };
    var c = { x: this.x3, y: this.y3 };
    
    var as_x = s.x-a.x;
    var as_y = s.y-a.y;

    var s_ab = (b.x-a.x)*as_y-(b.y-a.y)*as_x > 0;

    if((c.x-a.x)*as_y-(c.y-a.y)*as_x > 0 == s_ab) return false;

    if((c.x-b.x)*(s.y-b.y)-(c.y-b.y)*(s.x-b.x) > 0 != s_ab) return false;

    return true;    
}

app.flipTriangle.prototype.draw = function()
{
    this.setFlipColor();
    
    triangle(
        this.x1,
        this.y1,
        this.x2,
        this.y2,
        this.x3,
        this.y3
    );
}