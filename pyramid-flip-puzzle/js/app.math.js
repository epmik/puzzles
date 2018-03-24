"use strict";

var app = window.app || {};

app.math = {
    
    computeTriangleCentroid: function(x1, y1, x2, y2, x3, y3){
        
        if(x1.length !== undefined && x1.length === 3){
            
            y1 = x1[0].y;   

            x2 = x1[1].x;   
            y2 = x1[1].y;   

            x3 = x1[2].x;   
            y3 = x1[2].y;   
            
            x1 = x1[0].x;
        }
        
        // taken from https://stackoverflow.com/questions/524755/finding-center-of-2d-triangle?rq=1
        
        return {
            x : (x1 + x2 + x3) / 3,
            y : (y1 + y2 + y3) / 3
        };
    },
}