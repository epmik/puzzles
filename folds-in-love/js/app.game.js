"use strict";

var app = window.app || {};

app.foldElementShape = {
    rectangle: 0,
    triangle: 1
}

app.splitEdge = function(){
    
}

app.expandOrCollapseResult = function(){
    this.edge = null;
    this.elements = [];
}

app.foldElement = function(element){
    
    app.logFunctionCall("app.foldElement() constructor called");
    
    this.id = -1;
    this.position = { x: 0, y: 0 };
    this.width = 0;
    this.height = 0;
    this.shape = app.foldElementShape.rectangle;
//    this.children = [];
//    this.splitEdges = [];
    this.hover = false;
    this.hoverArea = null;
    this.invalidEdges = [];
    
    if(element === undefined || element === null){
        return;
    }
    
    this.position.x = element.position.x;
    this.position.y = element.position.y;
    this.shape = element.shape;
    this.width = element.width;
    this.height = element.height;
}

app.foldElementEdgeTypeId = {
    top: 1,
    right: 2,
    bottom: 3,
    left: 4,
    horizontal: 5,
    vertical: 6,
    diagonalTopLeftBottomRight: 7,
    diagonalTopRightBottomLeft: 8,
    
    oppositeExpandEdge: function(edgeid){
        var o = edgeid + 2;
        
        if(o > 4){
            return o - 4;
        }
        return o;        
    }
}

app.foldElementEdgeType = {
    top: { id: app.foldElementEdgeTypeId.top, collapse: false },
    right: { id: app.foldElementEdgeTypeId.right, collapse: false },
    bottom: { id: app.foldElementEdgeTypeId.bottom, collapse: false },
    left: { id: app.foldElementEdgeTypeId.left, collapse: false },
    horizontal: { id: app.foldElementEdgeTypeId.horizontal, collapse: true },
    vertical: { id: app.foldElementEdgeTypeId.vertical, collapse: true },
    diagonalTopLeftBottomRight: { id: app.foldElementEdgeTypeId.diagonalTopLeftBottomRight, collapse: true },
    diagonalTopRightBottomLeft: { id: app.foldElementEdgeTypeId.diagonalTopRightBottomLeft, collapse: true },
}

app.foldElementHoverAreas = {
    rectangle: [ 
        { x: 0.50, y: 0.29, rx: 0.25, ry: 0.36, edge: app.foldElementEdgeType.vertical }, 
        { x: 0.50, y: 0.71, rx: 0.25, ry: 0.36, edge: app.foldElementEdgeType.vertical },
        
        { x: 0.29, y: 0.50, rx: 0.36, ry: 0.25, edge: app.foldElementEdgeType.horizontal },
        { x: 0.71, y: 0.50, rx: 0.36, ry: 0.25, edge: app.foldElementEdgeType.horizontal },
        
        { x: 0.23, y: 0.00, rx: 0.40, ry: 0.22, edge: app.foldElementEdgeType.top }, 
        { x: 0.77, y: 0.00, rx: 0.40, ry: 0.22, edge: app.foldElementEdgeType.top }, 
        { x: 0.50, y: 0.00, rx: 0.20, ry: 0.19, edge: app.foldElementEdgeType.top }, 
        
        { x: 0.23, y: 1.00, rx: 0.40, ry: 0.22, edge: app.foldElementEdgeType.bottom }, 
        { x: 0.77, y: 1.00, rx: 0.40, ry: 0.22, edge: app.foldElementEdgeType.bottom }, 
        { x: 0.50, y: 1.00, rx: 0.20, ry: 0.19, edge: app.foldElementEdgeType.bottom }, 
        
        { x: 1.00, y: 0.23, rx: 0.22, ry: 0.40, edge: app.foldElementEdgeType.right }, 
        { x: 1.00, y: 0.77, rx: 0.22, ry: 0.40, edge: app.foldElementEdgeType.right }, 
        { x: 1.00, y: 0.50, rx: 0.19, ry: 0.20, edge: app.foldElementEdgeType.right }, 
        
        { x: 0.00, y: 0.23, rx: 0.22, ry: 0.40, edge: app.foldElementEdgeType.left }, 
        { x: 0.00, y: 0.77, rx: 0.22, ry: 0.40, edge: app.foldElementEdgeType.left }, 
        { x: 0.00, y: 0.50, rx: 0.19, ry: 0.20, edge: app.foldElementEdgeType.left }, 
        
        { x: 0.24, y: 0.24, rx: 0.23, ry: 0.23, edge: app.foldElementEdgeType.diagonalTopLeftBottomRight }, 
        { x: 0.76, y: 0.76, rx: 0.23, ry: 0.23, edge: app.foldElementEdgeType.diagonalTopLeftBottomRight }, 
        
        { x: 0.76, y: 0.24, rx: 0.23, ry: 0.23, edge: app.foldElementEdgeType.diagonalTopRightBottomLeft }, 
        { x: 0.24, y: 0.76, rx: 0.23, ry: 0.23, edge: app.foldElementEdgeType.diagonalTopRightBottomLeft }, 
    ],
    triangle:[],
}

app.foldElement.prototype.draw = function(){

    app.logFunctionCall("app.foldElement.prototype.draw() called");
  
    push();
    
//    if(this.children.length > 0){
//        for(var i = 0; i < this.children.length; i++)        {
//            this.children[i].draw();
//        }
//        
//        return;
//    }
    
    switch(this.shape){
        case app.foldElementShape.rectangle:
            noStroke();
            fill(0);
            rect(this.position.x, this.position.y, this.width, this.height);
            break;
        case app.foldElementShape.triangle:
        default:
            throw "unknown app.foldElementShape shape";
            break;
    }
    
    this._drawEdgeForHoverArea(this.hoverArea);
    
    if(app.debug === true && app.debugHoverAreas === true){
        
        if(this.hover === true){
            this._drawHoverAreas(this._hoverAreasForShape(), 255, 255, 255);
        }
    
        this._drawHoverArea(this.hoverArea, 255, 0, 0);
    }

    pop();
}

app.foldElement.prototype._drawEdgeForHoverArea = function(area){

    app.logFunctionCall("app.foldElement.prototype._drawEdgeForHoverArea() called");

    if(area === null){
        return;
    }
    
    this._drawEdge(area.edge.id);
}

app.foldElement.prototype._isInvalidEdge = function(edgeid){
    
    for(var i = 0; i < this.invalidEdges.length; i++){
        
        if(this.invalidEdges[i] === edgeid){
            return true;
        }
        
    }
    return false;    
}

app.foldElement.prototype._drawEdge = function(edgeid){

    app.logFunctionCall("app.foldElement.prototype._drawEdge() called");
    
    push();
    
    noFill();
    strokeWeight(1);
    
    if(this._isInvalidEdge(edgeid)){
        stroke(255, 0, 0);
    }
    else{
        stroke(0, 255, 0);
    }
    
    switch(edgeid){
        case app.foldElementEdgeTypeId.top:
            line(
                this.position.x + 2,
                this.position.y + 2,
                this.position.x + this.width - 2,
                this.position.y + 2
            );
            break;
        case app.foldElementEdgeTypeId.right:
            line(
                this.position.x + this.width - 2,
                this.position.y + 2,
                this.position.x + this.width - 2,
                this.position.y + this.height - 2
            );
            break;
        case app.foldElementEdgeTypeId.bottom:
            line(
                this.position.x + 2,
                this.position.y + this.height - 2,
                this.position.x + this.width - 2,
                this.position.y + this.height - 2,
            );
            break;
        case app.foldElementEdgeTypeId.left:
            line(
                this.position.x + 2,
                this.position.y + 2,
                this.position.x + 2,
                this.position.y + this.height - 2
            );
            break;
        case app.foldElementEdgeTypeId.horizontal:
            line(
                this.position.x + 2,
                this.position.y + (this.height * 0.5),
                this.position.x + this.width - 2,
                this.position.y + (this.height * 0.5)
            );
            break;
        case app.foldElementEdgeTypeId.vertical:
            line(
                this.position.x + (this.width * 0.5),
                this.position.y + 2,
                this.position.x + (this.width * 0.5),
                this.position.y + this.height - 2
            );
            break;
        case app.foldElementEdgeTypeId.diagonalTopLeftBottomRight:
            line(
                this.position.x + 2,
                this.position.y + 2,
                this.position.x + this.width - 2,
                this.position.y + this.height - 2
            );
            break;
        case app.foldElementEdgeTypeId.diagonalTopRightBottomLeft:
            line(
                this.position.x + this.width - 2,
                this.position.y + 2,
                this.position.x + 2,
                this.position.y + this.height - 2
            );
            break;
        default:
            throw "_drawEdge(): unknown edgeid found";
    }

    pop();
}

app.foldElement.prototype._drawHoverAreas = function(areas, r, g, b){

    app.logFunctionCall("app.foldElement.prototype._drawHoverAreas() called");
        
    for(var i = 0; i < areas.length; i++){
        
        this._drawHoverArea(areas[i], r, g, b);
    }
}

app.foldElement.prototype._drawHoverArea = function(area, r, g, b){
 
    app.logFunctionCall("app.foldElement.prototype._drawHoverArea() called");
   
    if(area === null){
        return;
    }
    
    r = r === undefined || r === null ? 255 : r;
    g = g === undefined || g === null ? 255 : g;
    b = b === undefined || b === null ? 255 : b;        

    push();

    noFill();
    strokeWeight(1);
    stroke(r, g, b);

    ellipseMode(CENTER);

    ellipse(
        this.position.x + (area.x * this.width),
        this.position.y + (area.y * this.height),
        area.rx * this.width,
        area.ry * this.height
    );

    pop();
}
    
app.foldElement.prototype.handleHover = function(mousex, mousey){
  
    app.logFunctionCall("app.foldElement.prototype.handleHover() called");
  
//    mousex -= this.position.x;
//    mousey -= this.position.y;
    
    var h = this.hover;
    
    this.hover = app.collision.isPointInsideRectangle(mousex, mousey, this.position.x, this.position.y, this.width, this.height);
    
//    if(h !== this.hover){
//        app.log("element: id " + this.id + " hover: " + this.hover);
//    }
    
    if(this.hover === false){
        this.hoverArea = null;
        return;
    }
    
    this.hoverArea = this._detectHoverArea(mousex, mousey);
}

app.foldElement.prototype._hoverAreasForShape = function(){

    app.logFunctionCall("app.foldElement.prototype._hoverAreasForShape() called");

    switch(this.shape){
        case app.foldElementShape.rectangle:
            return app.foldElementHoverAreas.rectangle;
        case app.foldElementShape.triangle:
            return app.foldElementHoverAreas.triangle;
            break;
    }

}

app.foldElement.prototype._detectHoverArea = function(mousex, mousey){
 
    app.logFunctionCall("app.foldElement.prototype.detectHoverArea() called");
   
//    mousex -= this.position.x;
//    mousey -= this.position.y;
    
    switch(this.shape){
        case app.foldElementShape.rectangle:
            return this._detectHoverAreaFromAreas(this._hoverAreasForShape(), mousex, mousey);
        case app.foldElementShape.triangle:
//            return this._detectHoverAreaFromAreas(app.foldElementHoverAreas.triangle, mousex, mousey);
        default:
            throw "unknown app.foldElementShape shape";
            break;
    }
    
    return null;
}

app.foldElement.prototype._detectHoverAreaFromAreas = function(areas, mousex, mousey){

    app.logFunctionCall("app.foldElement.prototype._detectHoverArea() called");

    // mousex and mousey are in mouse coordinate space
    // translate them to the hoverareas coordinate space, which ranges from 0 to 1
    var px = (mousex - this.position.x) / this.width;
    var py = (mousey - this.position.y) / this.height;
    
    for(var i = 0; i < areas.length; i++){
        
        var area = areas[i];
        
//        if(this._isInvalidEdge(area.edge.id) === true){
//            continue;
//        }
        
        if(app.collision.isPointInsideEllipseFromCenter(px, py, area.x, area.y, area.rx, area.ry)){
//            app.log("hover over area");
//            app.log(area);
            
            return area;
        }
        
    }
    
    return null;
}

app.foldElement.prototype.handleClicks = function(mousex, mousey){
 
    app.logFunctionCall("app.foldElement.prototype.handleClicks() called");
   
//    mousex -= this.position.x;
//    mousey -= this.position.y;
    
    switch(this.shape){
        case app.foldElementShape.rectangle:
            var clicked = app.collision.isPointInsideRectangle(mousex, mousey, this.position.x, this.position.y, this.width, this.height);
            if(clicked === true){
                app.log("element clicked: id " + this.id);
            }
            if(clicked === true && this.hoverArea !== null){
                
                app.log("hover area clicked: edge id " + this.hoverArea.edge.id);
                
                return this._expandOrCollapseHoverArea(this.hoverArea);
            }
            break;
        case app.foldElementShape.triangle:
        default:
            throw "handleClicks(): unknown app.foldElementShape shape";
            break;
    }
    
    return null;
}

app.foldElement.prototype._expandOrCollapseHoverArea = function(area){
 
    app.logFunctionCall("app.foldElement.prototype._expandOrCollapseHoverArea() called");
   
    if(area === undefined || area === null){
        return null;
    }
    
    var edge = area.edge;
    
    if(this._isInvalidEdge(edge.id) === true){
        return null;
    }
    
    return this._expandOrCollapseEdge(edge);
}

app.foldElement.prototype._expandOrCollapseEdge = function(edge){
 
    app.logFunctionCall("app.foldElement.prototype._expandOrCollapseEdge() called");
   
    if(edge === undefined || edge === null){
        return null;
    }
    
    if(edge.collapse){
        return this._collapseEdge(edge);
    }
    
    return this._expandEdge(edge);
}

app.foldElement.prototype._collapseEdge = function(edge){

    app.logFunctionCall("app.foldElement.prototype._collapseEdge() called");

    return null;
}

app.foldElement.prototype._expandEdge = function(edge){

    app.logFunctionCall("app.foldElement.prototype._expandEdge() called");

    // duplicate geometry
    
    var result = new app.expandOrCollapseResult();
    
    result.edge = edge;
    
    var element = new app.foldElement(this);
    
    switch(edge.id){
        case app.foldElementEdgeTypeId.top:
            element.position.y = this.position.y - this.height - 2;
            break;
        case app.foldElementEdgeTypeId.right:
            element.position.x = this.position.x + this.width + 2;
            break;
        case app.foldElementEdgeTypeId.bottom:
            element.position.y = this.position.y + this.height + 2;
            break;
        case app.foldElementEdgeTypeId.left:
            element.position.x = this.position.x - this.width - 2;
            break;
        default:
            throw "_expandEdge(): unknown edge.id found";
    }
    
    result.elements.push(element);
    
    app.log("new expanded element created for element: " + this.id + " at edge: " + edge.id);
    
    this.invalidEdges.push(edge.id);

    element.invalidEdges.push(app.foldElementEdgeTypeId.oppositeExpandEdge(edge.id));
    
    return result;
}

app.foldsInLoveScene = function(){
 
    app.logFunctionCall("app.foldsInLoveScene() constructor called");
   
    this.elements = [];
}

app.foldsInLoveScene.prototype.draw = function(){
 
    app.logFunctionCall("app.foldsInLoveScene.prototype.draw() called");
   
    for(var i = 0; i < this.elements.length; i++)        {
        this.elements[i].draw();
    }
}

app.foldsInLoveScene.prototype.handleClicks = function(mousex, mousey){

    app.logFunctionCall("app.foldsInLoveScene.prototype.handleClicks() called: " + this.elements.length);
    
    var results = [];
    
    for(var i = 0; i < this.elements.length; i++) 
    {
        var result = this.elements[i].handleClicks(mousex, mousey);
        
        results.push(result);
    }
    
    for(var i = 0; i < results.length; i++){
        
        var result = results[i];
        
        if(result === null){
            continue;
        }
            
        if(result.edge.collapse === true){
            // remove current element
        }

        // add new elements to scene
        for(var j = 0; j < result.elements.length; j++){

            result.elements[j].id = this.elements.length + 1;

            app.log("adding element: " + result.elements[j].id + " to scene");

            this.elements.push(result.elements[j]);
        }
    }
}

app.foldsInLoveScene.prototype.handleHover = function(mousex, mousey){
 
    app.logFunctionCall("app.foldsInLoveScene.prototype.handleHover() called");
   
    for(var i = 0; i < this.elements.length; i++)        {
        this.elements[i].handleHover(mousex, mousey);
    }
}

app.foldsInLove = function(){

    app.logFunctionCall("app.foldsInLove() constructor called");
    
    this.scene = null;
}

app.foldsInLove.prototype.setup = function () {
 
    app.logFunctionCall("app.foldsInLove.prototype.setup() called");
   
    this.scene = new app.foldsInLoveScene();
    
    var element = new app.foldElement();
    element.id = 1;
    element.width = 100;
    element.height = 100;
    element.position.x = 300;
    element.position.y = 300;
    element.invalidEdges.push(app.foldElementEdgeTypeId.bottom);
    
    this.scene.elements.push(element);
}

app.foldsInLove.prototype.setupUi = function(){
    
}

app.foldsInLove.prototype.setupEventHandlers = function(){

//    $(".clear-state").on("click", function() {
//        app.game.clearState();
//        return false;
//    });
//    
//    $(".reset-state").on("click", function() {
//        app.game.resetState();
//        return false;
//    });
//    
//    $(".new-game").on("click", function() {
//        app.game.newGame();
//        return false;
//    });
    
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

app.foldsInLove.prototype.width = function ()
{
    return 800;
}

app.foldsInLove.prototype.height = function ()
{
    return 600;
}

app.foldsInLove.prototype.draw = function () {
  
    app.logFunctionCall("app.foldsInLove.prototype.draw() called");

    background(255);
    
    this.scene.draw();
//    
//    this.grid.draw();
//    
//    for(var i = 0; i < this.buttons.length; i++)
//    {
//        this.buttons[i].draw();
//    }
}

app.foldsInLove.prototype.handleClicks = function () {
    
    this.scene.handleClicks(mouseX, mouseY);
    
//    grid.handleClicks(mouseX, mouseY);
    
//    for(var i = 0; i < this.buttons.length; i++)
//    {
//        var button = this.buttons[i];
//        
//        if(button.isClicked(mouseX, mouseY)){
//            
//            if(button.rowIndex === -1){
//                this.grid.nextColumnState(button.columnIndex, button.stateToSwitch);
//            }
//            else{
//                this.grid.nextRowState(button.rowIndex, button.stateToSwitch);
//            }
//        }
//    }
    
}

app.foldsInLove.prototype.handleHover = function () {
    
    this.scene.handleHover(mouseX, mouseY);
    
//    grid.handleClicks(mouseX, mouseY);
    
//    for(var i = 0; i < this.buttons.length; i++)
//    {
//        var button = this.buttons[i];
//        
//        if(button.isClicked(mouseX, mouseY)){
//            
//            if(button.rowIndex === -1){
//                this.grid.nextColumnState(button.columnIndex, button.stateToSwitch);
//            }
//            else{
//                this.grid.nextRowState(button.rowIndex, button.stateToSwitch);
//            }
//        }
//    }
    
}
