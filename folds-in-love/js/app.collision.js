"use strict";

var app = window.app || {};

app.collision = {
    
    isPointInsideTriangle: function(px, py, x1, y1, x2, y2, x3, y3){
        
        // taken from https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle

        var s = { x: px, y: py };
        var a = { x: x1, y: y1 };
        var b = { x: x2, y: y2 };
        var c = { x: x3, y: y3 };

        var as_x = s.x-a.x;
        var as_y = s.y-a.y;

        var s_ab = (b.x-a.x)*as_y-(b.y-a.y)*as_x > 0;

        if((c.x-a.x)*as_y-(c.y-a.y)*as_x > 0 == s_ab) return false;

        if((c.x-b.x)*(s.y-b.y)-(c.y-b.y)*(s.x-b.x) > 0 != s_ab) return false;

        return true;    
    },
    
    isPointInsideEllipse: function(px, py, x, y, w, h){
        
        return this.isPointInsideEllipseFromCenter(px, py, x + w / 2, y + h / 2, w, h);
    },
    
    isPointInsideEllipseFromCenter: function(px, py, centerx, centery, w, h){
        
        // taken from https://stackoverflow.com/questions/13285007/how-to-determine-if-a-point-is-within-an-ellipse
        
        if(h === undefined || h === null){
            h = w;
        }

        var radiusx = w / 2;
        var radiusy = h / 2;

        if (radiusx <= 0 || radiusy <= 0){
            return false;
        }

        var normalized = { x: px - centerx, y: py - centery };

        return ((normalized.x * normalized.x) / (radiusx * radiusx)) + ((normalized.y * normalized.y) / (radiusy * radiusy)) <= 1;
    },
    
    isPointInsideRectangle: function(px, py, x, y, w, h){

        if(px < x || px > x + w){
            return false;
        }

        if(py < y || py > y + h){
            return false;
        }

        return true;
    },   
}