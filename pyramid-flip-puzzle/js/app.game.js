"use strict";

var app = window.app || {};

app.rotation = {
    up: 0,
    down: 1
}

//app.elementState = {
//    empty: 0,
//    taken: 1,
//}

app.colors = {
    white:  { id: 0, r: 255, g: 255, b: 255 },
    orange: { id: 1, r: 251, g: 136, b: 0   },
    blue:   { id: 2, r: 5,   g: 98,  b: 214 },
    red:    { id: 3, r: 226, g: 27,  b: 27  },
    grey:   { id: 4, r: 175, g: 175, b: 175 },
}

app.players = {
    one: { id: 1, name: "blue player", color: app.colors.blue, position: { x: 0, y: 0 } },
    two: { id: 2, name: "orange player", color: app.colors.orange, position: { x: 0, y: 0 } },
}

app.board = function(){
    this.elements = [];
    this.currentPlayer = app.players.one;
    this.winningPlayer = null;
	this.highlightedElement = null;
	this.forceFlipElement = null;
    this.playerActions = [];
}

app.board.prototype.setup = function(){

    // 7 triangles per row
    // 6 rows
    
    app.players.one.position.x = app.game.width() * 0.5 - 66;
    app.players.one.position.y = app.game.height() - 60;
    app.players.two.position.x = app.game.width() * 0.5 - 84;
    app.players.two.position.y = 70;

    var upElement = new app.boardElement();

    upElement.setup(0, 0, app.settings.triangleRadius, app.settings.triangleHorizontalMargin * 2, app.rotation.up);

    var width = upElement.backgroundPoints[0].x - upElement.backgroundPoints[1].x;
    var halfwidth = Math.round(width * 0.5);
    var height = Math.abs(upElement.backgroundPoints[2].y - upElement.backgroundPoints[0].y);

    var center = app.math.computeTriangleCentroid(upElement.backgroundPoints);

    var upOffset = Math.abs(upElement.backgroundPoints[0].y);
    var downOffset = Math.abs(upElement.backgroundPoints[2].y);

    var up = true;

    var y = (app.game.height() * 0.5) + (3 * height) + (app.settings.triangleVerticalMargin);

    for(var row = 0; row < 6; row++){

        var x = (app.game.width() * 0.5) - (3 * halfwidth) - (app.settings.triangleHorizontalMargin * 1.5);

        for(var t = 0; t < 7; t++){

            var element = new app.boardElement();

            element.setup(
                x,
                up === true ? y - upOffset : y - downOffset,
                app.settings.triangleRadius,
                app.settings.triangleHorizontalMargin * 2,
                up === true ? app.rotation.up : app.rotation.down);

            element.index = this.elements.length;

            this._setupNeighbours(element);

            this.elements.push(element);

            x += halfwidth + (app.settings.triangleHorizontalMargin * 0.5);

            up = !up;
        }

        y -= height + (app.settings.triangleVerticalMargin * 0.5);

    }
    
    var playerTriangleIndices = this._playerDestinationTriangleIndices(app.players.one);
    
    for(var i = 0; i < playerTriangleIndices.length; i++){
        
        this.elements[playerTriangleIndices[i]].backgroundColor = app.colors.blue;
        this.elements[playerTriangleIndices[i]].player = app.players.two;
    }
    
    playerTriangleIndices = this._playerDestinationTriangleIndices(app.players.two);
    
    for(var i = 0; i < playerTriangleIndices.length; i++){
        
        this.elements[playerTriangleIndices[i]].backgroundColor = app.colors.orange;
        this.elements[playerTriangleIndices[i]].player = app.players.one;
    }

    this._logCurrentPlayer();
}



app.board.prototype._playerDestinationTriangleIndices = function(player){

    if(player === app.players.one){
        return [37, 38, 39, 31];
    }
    return [2, 3, 4, 10];
}

app.board.prototype._logCurrentPlayer = function(){

    app.log("current " + this.currentPlayer.name);
}

app.board.prototype._logWinningPlayer = function(){

    app.log("winning " + this.winningPlayer.name);
}

app.board.prototype._nextPlayer = function(){

    if(this.currentPlayer === app.players.one){
        this.currentPlayer = app.players.two;
    }
    else{
        this.currentPlayer = app.players.one;
    }

    this._logCurrentPlayer();
}

app.board.prototype._canMoveTo = function(thisPlayer, element, movetoElement){

    if(movetoElement.player !== null){
		// destination isn't empty
      	return false;
    }
    
    var otherPlayer = this._otherPlayer(thisPlayer);

    var needsToMove = this._surroundedByPlayerCount(otherPlayer, element) > 0;

    if(needsToMove === false){

		// element doesn't need to move, so cannot move backwards

        var elementRow = this._rowIndex(element.index);

        var moveToRowIndex = this._rowIndex(movetoElement.index);

		// 'backward' is different for top or bottom player
        if(element.player === app.players.two){
            if(moveToRowIndex > elementRow){
              	return false
            }
        }
        else{
            if(moveToRowIndex < elementRow){
              	return false
            }
        }
    }

	// is the destination surrounded by 2 element of the other player
	var count = this._surroundedByPlayerCount(otherPlayer, movetoElement);

    return count < 2;
}

app.board.prototype._surroundedByPlayerCount = function(thisPlayer, element){

	var count = 0;

    for(var i = 0; i < element.neighbours.length; i++)
    {
        var n = this.elements[element.neighbours[i]];

        if(n.player === thisPlayer){
          	count++;
        }
    }

    return count;
}

app.board.prototype._otherPlayer = function(thisPlayer){

    return thisPlayer === app.players.one ? app.players.two : app.players.one;
}

app.board.prototype._setupNeighbours = function(element){

    if(this._isOnSameRow(element.index, element.index - 1)){
        // left
        this._conditionalSetupNeighbour(element, element.index - 1);
    }

    if(this._isOnSameRow(element.index, element.index + 1)){
        // right
        this._conditionalSetupNeighbour(element, element.index + 1);
    }

    if(element.rotation === app.rotation.down){
        // top
        this._conditionalSetupNeighbour(element, element.index + 7);
    }
    else{
        // bottom
        this._conditionalSetupNeighbour(element, element.index - 7);
    }
}

app.board.prototype._conditionalSetupNeighbour = function(element, neighbourIndex){

    if(neighbourIndex < 0 || neighbourIndex >= 42){
        return;
    }

    element.neighbours.push(neighbourIndex);
}

app.board.prototype._rowIndex = function(elementIndex){

    return parseInt(elementIndex / 7);
}

app.board.prototype._isOnSameRow = function(elementIndex, neighbourIndex){

    return this._rowIndex(elementIndex) === this._rowIndex(neighbourIndex);
}

app.board.prototype.update = function(elapsed){
    
    if(this.winningPlayer !== null){
        return;
    }
    else if(this.forceFlipElement !== null){
        
        this.forceFlipElement.isPulsing = true;        

        for(var i = 0; i < this.forceFlipElement.neighbours.length; i++){

            var neighbour = this.elements[this.forceFlipElement.neighbours[i]];
            
            if(this._canMoveTo(this.currentPlayer, this.forceFlipElement, neighbour)){
                neighbour.isPulsing = true;
                neighbour.color = this.forceFlipElement.player.color;
            }
        }        
    }
    else{
        this._handlePointer(mouseX, mouseY);
    }

	for(var i = 0; i < this.elements.length; i++){
		this.elements[i].update(elapsed);
	}
}

app.board.prototype._handlePointer = function(mousex, mousey){
    
    var element = this._detectElementAtPointer(mousex, mousey);

    if(element !== null){

        // we're hovering over an element
//        app.log("hovering over element " + element.index);

        if(element.player === this.currentPlayer){
            
            // the element is owned by the current player
            // highlight the element and start the pulse
            
            if(this.highlightedElement !== element){
                this._resetHighlightedDotColors();
                this.highlightedElement = element;
            }            
            
            this.highlightedElement.isPulsing = true;
        }
        else if(element.player === null && this.highlightedElement !== null){

            // hovering over an empty element

            if(this.highlightedElement._isNeighbour(element) === false){

                // the empty element is NOT a neighbour of the current highlighted element
                // release the highlight element
                this._resetHighlightedDotColors();
                
                this.highlightedElement = null;
            }
            else{
                // the empty element is a neighbour of the current highlighted element
                // maintain the pulse of the highlighted element and it's neighbours
                this.highlightedElement.isPulsing = true;
            }
        }

        if(this.highlightedElement !== null){

            var canMoveToCount = 0;

            for(var i = 0; i < this.highlightedElement.neighbours.length; i++){

                var neighbour = this.elements[this.highlightedElement.neighbours[i]];

                if(neighbour.player !== null){

                    continue;
                }

                var canMoveTo = this._canMoveTo(this.currentPlayer, this.highlightedElement, neighbour);

                if(canMoveTo === true){
                    neighbour.color = this.currentPlayer.color;
                    neighbour.isPulsing = true;
                    canMoveToCount++;
                }
                else{
                    neighbour.color = app.colors.red;
                }
            }

            if(canMoveToCount === 0){
                this.highlightedElement.isPulsing = false;
            }                
        }
    }

}

app.board.prototype.handleClicks = function(mousex, mousey){

	if(this.highlightedElement === null){
		return;
	}
    
	for(var i = 0; i < this.highlightedElement.neighbours.length; i++){

		var neighbour = this.elements[this.highlightedElement.neighbours[i]];

		if(neighbour._isInside(mousex, mousey) && this._canMoveTo(this.currentPlayer, this.highlightedElement, neighbour)){
            
            app.log("clicked on element " + neighbour.index);
            
            this.playerActions.push({ player: this.currentPlayer.id, from: this.highlightedElement.index, to: neighbour.index});

			neighbour.player = this.currentPlayer;
            neighbour.currentPulse = 0;

            this.highlightedElement.player = null;
            this.highlightedElement.currentPulse = 0;
            this._resetHighlightedDotColors();
	        this.highlightedElement = null;
            this.forceFlipElement = null;
            
            this._detectForcedFlipElement(neighbour);
            
            if(this.forceFlipElement !== null){
                this.highlightedElement = this.forceFlipElement;
            }
            
            this._detectWin();
            
            if(this.winningPlayer !== null){
                this._logWinningPlayer();
            }
            else{
                this._nextPlayer();
            }
            
            app.log(this.playerActions);

			return;
		}
	}
}

app.board.prototype.handleKeyPress = function(){

    if(keyCode === 34){ // page down
        
        var playerActions = this.playerActions.pop();
        
        var player = playerActions.player == 1 ? app.players.one : app.players.two;
        
        this.elements[playerActions.to].player = null;
        this.elements[playerActions.from].player = player;
    }
}

app.board.prototype.handleKeyRelease = function(){

}

app.board.prototype._detectWin = function(){
    
    if(this.forceFlipElement !== null){
        
        var canMoveToCount = 0;
        
        var otherPlayer = this._otherPlayer(this.currentPlayer);
        
        for(var i = 0; i < this.forceFlipElement.neighbours.length; i++){

            var neighbour = this.elements[this.forceFlipElement.neighbours[i]];

            if(this._canMoveTo(otherPlayer, this.forceFlipElement, neighbour) === true){
                canMoveToCount++;
            }
        }
        
        if(canMoveToCount === 0){
            
            this.winningPlayer = this.currentPlayer;
            
            return;
        }
    }
    
    var destinationCount = 0;
         
    var playerDestinationTriangleIndices = this._playerDestinationTriangleIndices(this.currentPlayer);
    
    for(var i = 0; i < playerDestinationTriangleIndices.length; i++){
        
        destinationCount += this.elements[playerDestinationTriangleIndices[i]].player === this.currentPlayer ? 1 : 0;
    }
            
    if(destinationCount === playerDestinationTriangleIndices.length){

        this.winningPlayer = this.currentPlayer;
    }
}

app.board.prototype._detectForcedFlipElement = function(element){
    
    var otherPlayer = this._otherPlayer(this.currentPlayer);
    
	for(var i = 0; i < element.neighbours.length; i++){

		var neighbour = this.elements[element.neighbours[i]];

		if(neighbour.player === otherPlayer){
            
            app.log("forced flip element " + neighbour.index);

            this.forceFlipElement = neighbour;

			return;
		}
	}
}

app.board.prototype._detectElementAtPointer = function(mousex, mousey){
    
    for(var i = 0; i < this.elements.length; i++){

        var element = this.elements[i];

        if(element._isInside(mousex, mousey) === true){
            
            return element;
        }
    }
    return null;
}

app.board.prototype._resetHighlightedDotColors = function(){
    
    if(this.highlightedElement !== null){
        
        for(var i = 0; i < this.highlightedElement.neighbours.length; i++){
                    
            var neighbour = this.elements[this.highlightedElement.neighbours[i]];
            
            neighbour.color = app.colors.white;
        }
    }
}

app.board.prototype.draw = function(){
    
    push();

    noStroke();

    fill(0);

    for(var i = 0; i < this.elements.length; i++){

        this._drawElement(this.elements[i]);

    }

    pop();
    
    this._drawPlayers();
    
    if(this.winningPlayer !== null){
        this._drawWinningPlayer();
    }
}

app.board.prototype._drawWinningPlayer = function(){
    
    var width = app.game.width();
    var height = app.game.height();
    var x = 0;
    var y = 0;
    
    push();

    noStroke();

    fill(255, 255, 255, 200);

    rect(x, y, width, height, 24);
    
    fill(this.winningPlayer.color.r, this.winningPlayer.color.g, this.winningPlayer.color.b);
    
    textAlign(CENTER, CENTER);
    
    textSize(32);
    
    text(this.winningPlayer.name + " wins!", x, y, width, height);    

    pop();
}

app.board.prototype._drawPlayers = function(){

    this._drawPlayer(app.players.one);
    this._drawPlayer(app.players.two);
}

app.board.prototype._drawPlayer = function(player){

    push();

    noStroke();
    
    if(this.currentPlayer === player && this.winningPlayer === null){
        fill(player.color.r, player.color.g, player.color.b);
    }
    else{
        fill(app.colors.grey.r, app.colors.grey.g, app.colors.grey.b);
    }
    
    var size = app.settings.triangleRadius * 0.25;
    
    translate(player.position.x - 30, player.position.y - 10);
    
    triangle(
        -(size + 3), size, 
        0, -size, 
        size + 3, size);
    
    translate(30, 10);
    
    textSize(24);
    
    text(player.name + " moves", 0, 0);

    pop();
}










app.boardElement = function(){
    this.index = 0;
    this.center = { x:0, y:0 };
    this.trianglePoints = [];
    this.backgroundPoints = [];
    this.neighbours = [];
    this.rotation = app.rotation.up;

	this.isPulsing = false;
	this.currentPulse = 0.00;	// no pulse applied
	this.pulseDirection = 1;	// positive pulse

    this.backgroundColor = app.colors.grey;
    
    this.color = app.colors.white;
    this.player = null;
}

app.boardElement.prototype.setup = function(centerx, centery, radius, margin, rotation){

    var third = radians(120);

    // clock wise rotation
    var offset = rotation === app.rotation.down ? radians(-30) : radians(30);

    this.center.x = centerx;
    this.center.y = centery;

    this.trianglePoints.push({
        x: Math.cos(offset),
        y: Math.sin(offset)
    });

    this.trianglePoints.push({
        x: Math.cos(offset + third),
        y: Math.sin(offset + third)
    });

    this.trianglePoints.push({
        x: Math.cos(offset + third + third),
        y: Math.sin(offset + third + third)
    });

    for(var i = 0; i < 3; i++){

        this.backgroundPoints.push({
            x: Math.round(this.trianglePoints[i].x * radius),
            y: Math.round(this.trianglePoints[i].y * radius) });

        this.trianglePoints[i].x = Math.round(this.trianglePoints[i].x * (radius - margin));
        this.trianglePoints[i].y = Math.round(this.trianglePoints[i].y * (radius - margin));
    }

    this.rotation = rotation;
}

app.boardElement.prototype.update = function(elapsed){

	if(this.isPulsing === true || this.currentPulse !== 0.00){
		this._updatePulse(elapsed);
	}

}

app.boardElement.prototype._updatePulse = function(elapsed){

	if(this.player === null){
		// pulse dot
		this._applyPulse(
            elapsed, 
            app.settings.dotPulseSpeed);
	}
	else{
		// pulse triangle
		this._applyPulse(
            elapsed, 
            app.settings.trianglePulseSpeed);
	}
}

app.boardElement.prototype._applyPulse = function(elapsed, speed){

    // 1 pulse iterates from 0 to 1 (grow) and then from 0 to -1 (shrink)
    // and then back to 0 again, which stops the pulse
    
	if(this.pulseDirection === 1){
		this.currentPulse += speed * elapsed;
	}
	else{
		this.currentPulse -= speed * elapsed;
	}

	if(this.currentPulse > 1.00){
		this.currentPulse = 1 - (this.currentPulse - 1);
        this.pulseDirection = -1;
	}
	else if(this.currentPulse < 0.00){
        this.pulseDirection = 1;
		this.currentPulse = 0;	
        // stop pulse
        this.isPulsing = false;
	}
}

app.boardElement.prototype._isNeighbour = function(element){

	for(var i = 0; i < this.neighbours.length; i++){
		if(this.neighbours[i] === element.index){
			return true;
		}
	}
	return false;
}

app.boardElement.prototype._isInside = function(mousex, mousey){

    mousex -= this.center.x;
    mousey -= this.center.y;

    return app.collision.isPointInsideTriangle(mousex, mousey, this.backgroundPoints);
}

app.board.prototype._drawElement = function(element){

    push();
    
//    app.log(this.center.x + " | " + this.center.y)

    translate(element.center.x, element.center.y);
    
    this._drawElementBackground(element);

    if(element.player === null){

        this._drawElementDot(element);
    }
    else{
        
        if(this.forceFlipElement === element){
            fill(app.colors.red.r, app.colors.red.g, app.colors.red.b);
        }
        else{
            fill(element.player.color.r, element.player.color.g, element.player.color.b);
        }

        if(element.backgroundColor === element.player.color){
        	strokeWeight(2);
        	stroke(255);
        }
        

        var d = app.settings.triangleMinPulseFactor + (app.settings.triangleMaxPulseFactor - app.settings.triangleMinPulseFactor) * element.currentPulse;

        triangle(
            element.trianglePoints[0].x * d,
            element.trianglePoints[0].y * d,
            element.trianglePoints[1].x * d,
            element.trianglePoints[1].y * d,
            element.trianglePoints[2].x * d,
            element.trianglePoints[2].y * d
        );
    }

    pop();
}

app.board.prototype._drawElementBackground = function(element){

    noStroke();

    fill(element.backgroundColor.r, element.backgroundColor.g, element.backgroundColor.b, 240);

    triangle(
        element.backgroundPoints[0].x,
        element.backgroundPoints[0].y,
        element.backgroundPoints[1].x,
        element.backgroundPoints[1].y,
        element.backgroundPoints[2].x,
        element.backgroundPoints[2].y
    );
}

app.board.prototype._drawElementDot = function(element){

    noStroke();
    
    if(element.backgroundColor === element.color){
        fill(255);
    }
    else{
        fill(element.color.r, element.color.g, element.color.b);
    }


	var center = app.math.computeTriangleCentroid(element.trianglePoints);
     
    var d = app.settings.dotMinPulseFactor + (app.settings.dotMaxPulseFactor - app.settings.dotMinPulseFactor) * element.currentPulse;

    ellipse(center.x, center.y, app.settings.dotSize * d);
}







app.pyramidFlip = function(){

    this.board = null;
}

app.pyramidFlip.prototype.setup = function () {

    this.board = new app.board();

    this.board.setup();
}

app.pyramidFlip.prototype._setupUi = function(){

}

app.pyramidFlip.prototype._setupEventHandlers = function(){

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

app.pyramidFlip.prototype.width = function (){

	var w = Math.round(Math.cos(radians(30)) * app.settings.triangleRadius) * 2;

    return 80 + ((w * 4) + (3 * app.settings.triangleHorizontalMargin));
}

app.pyramidFlip.prototype.height = function (){

	var h = Math.round(Math.cos(radians(30)) * app.settings.triangleRadius) * 2;

    return 80 + ((h * 6) + (5 * app.settings.triangleVerticalMargin));
}

app.pyramidFlip.prototype.draw = function () {

    background(255);

//    this.scene.draw();
//
//    this.grid.draw();
//
//    for(var i = 0; i < this.buttons.length; i++)
//    {
//        this.buttons[i].draw();
//    }
//
//    fill(255, 0, 0);
//
//    triangle(-87, 50, 0, -100, 87, 50);

    push();

    noStroke();

    fill(0);

    this.board.draw();

    pop();
}

app.pyramidFlip.prototype.update = function(){

    this.lastTimestamp = this.currentTimestamp;
    this.currentTimestamp = millis();

    var elapsed = (this.currentTimestamp - this.lastTimestamp) * 0.001;

    this.board.update(elapsed);
}

app.pyramidFlip.prototype.handleClicks = function () {

    this.board.handleClicks(mouseX, mouseY);
}

app.pyramidFlip.prototype.handleHover = function () {

    
}

app.pyramidFlip.prototype.handleKeyPress = function () {

//    this.board.handleKeyPress();
}

app.pyramidFlip.prototype.handleKeyRelease = function () {

    this.board.handleKeyRelease();
}
