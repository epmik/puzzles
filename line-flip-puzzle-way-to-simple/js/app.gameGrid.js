"use strict";

var app = window.app || {};

app.gameGrid = function(){
    
    this.position = { x: 0, y: 0 };
    this.columnCount = 3;
    this.rowCount = 3;
    this.elements = [];
}

app.gameGrid.prototype.nextRowState = function(row){
    
    for(var i = 0; i < this.elements.length; i++){
        var e = this.elements[i];
        
        if(e.rowIndex == row){
            e.nextState();        
        }
    }  
}

app.gameGrid.prototype.nextColumnState = function(column){
    
    for(var i = 0; i < this.elements.length; i++){
        var e = this.elements[i];
        
        if(e.columnIndex == column){
            e.nextState();        
        }
    }  
}

app.gameGrid.prototype.setupGrid = function(){
    
    this.columnCount = app.settings.elementColumnCount;
    this.rowCount = app.settings.elementRowCount;
    var y = 0;
    
    for(var j = 0; j < this.rowCount; j++){

        var x = 0;
        
        for(var i = 0; i < this.columnCount; i++){
            
            var e = new app.gameElement();
            
            e.position.x = x;
            e.position.y = y;
            e.width = app.settings.elementWidth;
            e.height = app.settings.elementHeight;
            e.index = j * this.rowCount + i;
            e.columnIndex = i;
            e.rowIndex = j;
            
            this.elements.push(e);
        
            x += app.settings.elementWidth + app.settings.elementMargin;    
        }            
        
        y += app.settings.elementHeight + app.settings.elementMargin;
    }
    
}

app.gameGrid.prototype.clearState = function(){
    
    for(var i = 0; i < this.elements.length; i++){
        this.elements[i].clearState();
    }
        
}

app.gameGrid.prototype.draw = function(){
    
    push();
    
    translate(this.position.x, this.position.y);
    
    for(var i = 0; i < this.elements.length; i++){
        this.elements[i].draw();
    }
    
    pop();
}

app.gameGrid.prototype.handleClicks = function(mousex, mousey){
    
    mousex -= this.position.x;
    mousey -= this.position.y;
    
    for(var i = 0; i < this.elements.length; i++){
//        this.elements[i].handleClicks(mousex, mousey);
    }
    
    for(var i = 0; i < this.elements.length; i++){
        if(this.elements[i].isInside(mousex, mousey)){
            this.nextRowState(this.elements[i].rowIndex);
        }
    }
    
    
}