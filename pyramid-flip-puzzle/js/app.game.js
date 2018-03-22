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
    blue:   { id: 1, r: 251, g: 136, b: 0   },
    orange: { id: 2, r: 5,   g: 98,  b: 214 },
    red:    { id: 3, r: 226, g: 27,  b: 27  },
    grey:   { id: 4, r: 175, g: 175, b: 175 },
}

app.players = {
    one: { id: 1, name: "player one", color: app.colors.orange, position: { x: 0, y: 0 } },
    two: { id: 2, name: "player two", color: app.colors.blue, position: { x: 0, y: 0 } },
}

app.board = function(){
    this.elements = [];
    this.currentPlayer = app.players.one;
	this.highlightedElement = null;
}

app.board.prototype.setup = function(){

    // 7 triangles per row
    // 6 rows
    
    app.players.one.position.x = app.game.width() * 0.5 - 88;
    app.players.one.position.y = app.game.height() - 60;
    app.players.two.position.x = app.game.width() * 0.5 - 88;
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

    this.elements[2].backgroundColor = app.colors.blue;
    this.elements[3].backgroundColor = app.colors.blue;
    this.elements[4].backgroundColor = app.colors.blue;
    this.elements[10].backgroundColor = app.colors.blue;

    this.elements[37].backgroundColor = app.colors.orange;
    this.elements[38].backgroundColor = app.colors.orange;
    this.elements[39].backgroundColor = app.colors.orange;
    this.elements[31].backgroundColor = app.colors.orange;

    this.elements[2].player = app.players.one;
    this.elements[3].player = app.players.one;
    this.elements[4].player = app.players.one;
    this.elements[10].player = app.players.one;

    this.elements[37].player = app.players.two;
    this.elements[38].player = app.players.two;
    this.elements[39].player = app.players.two;
    this.elements[31].player = app.players.two;

    this.logCurrentPlayer();
}

app.board.prototype.logCurrentPlayer = function(){

    app.log("current " + this.currentPlayer.name);
}

app.board.prototype.nextPlayer = function(){

    this._resetHighlightedDotColors();
	this.highlightedElement = null;

    if(this.currentPlayer === app.players.one){
        this.currentPlayer = app.players.two;
    }
    else{
        this.currentPlayer = app.players.one;
    }

    this.logCurrentPlayer();
}

app.board.prototype.canMoveTo = function(element, movetoElement){

    if(movetoElement.player !== null){
		// destination isn't empty
      	return false;
    }

    var needsToMove = this._surroundedByOtherPlayerCount(element) > 0;

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
	var count = this._surroundedByOtherPlayerCount(movetoElement);

    return count < 2;
}

app.board.prototype._surroundedByOtherPlayerCount = function(element){

    var otherPlayerState = this.currentPlayer === app.players.one ? app.players.two : app.players.one;

	var count = 0;

    for(var i = 0; i < element.neighbours.length; i++)
    {
        var n = this.elements[element.neighbours[i]];

        if(n.player === otherPlayerState){
          	count++;
        }
    }

    return count;
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
    
	this._handlePointer(mouseX, mouseY);

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

            if(this.highlightedElement.isNeighbour(element) === false){

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

                var canMoveTo = this.canMoveTo(this.highlightedElement, neighbour);

                if(canMoveTo === true){
                    neighbour.color = this.currentPlayer.color;
                    neighbour.isPulsing = true;
                    canMoveToCount++;
                }
//                else{
//                    neighbour.color = app.colors.red;
//                }
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

		if(neighbour.isInside(mousex, mousey) && this.canMoveTo(this.highlightedElement, neighbour)){
            
            app.log("clicked on element " + neighbour.index);

			neighbour.player = this.currentPlayer;
            neighbour.currentPulse = 0;

            this.highlightedElement.player = null;
            this.highlightedElement.currentPulse = 0;

			this.nextPlayer();

			return;
		}
	}
}

app.board.prototype._detectElementAtPointer = function(mousex, mousey){
    
    for(var i = 0; i < this.elements.length; i++){

        var element = this.elements[i];

        if(element.isInside(mousex, mousey) === true){
            
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

        this.elements[i].draw();

    }

//	this.drawHighlightedElementNeighbours(this.highlightedElement);

    pop();
    
    this._drawPlayers();
}

app.board.prototype._drawPlayers = function(){

    this._drawPlayer(app.players.one);
    this._drawPlayer(app.players.two);
}

app.board.prototype._drawPlayer = function(player){

    push();

    noStroke();
    
    if(this.currentPlayer === player){
        fill(player.color.r, player.color.g, player.color.b);
    }
    else{
        fill(app.colors.grey.r, app.colors.grey.g, app.colors.grey.b);
    }
    
    var size = app.settings.triangleRadius * 0.25;
    
    translate(player.position.x - 30, player.position.y - 10);
    
    triangle(
        -size, size, 
        0, -size, 
        size, size);
    
    translate(30, 10);
    
    textSize(32);
    
    text(player.name + " turn", 0, 0);

    pop();
}


//app.board.prototype.drawHighlightedElementNeighbours = function(){
//
//	if(this.highlightedElement === null){
//
//		return;
//	}
//
//	var r, g, b;
//
//    for(var i = 0; i < this.highlightedElement.neighbours.length; i++){
//
//        var neighbour = this.elements[this.highlightedElement.neighbours[i]];
//
//		if(neighbour.state !== app.boardElementState.empty){
//
//            continue;
//        }
//
//		var canMoveTo = this.canMoveTo(this.highlightedElement, neighbour);
//
//		if(canMoveTo === false){
//			r = 190; g = 0; b = 0;
//		}
//		else{
//
//			neighbour.isPulsing = true;
//
//			if(this.currentPlayer === app.boardElementState.black){
//				r = 251; g = 136; b = 0;
//			}
//			else{
//				r = 5; g = 98; b = 214;
//			}
//		}
//
//        neighbour.drawHoverState(r, g, b);
//    }
//}










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

app.boardElement.prototype.isNeighbour = function(element){

	for(var i = 0; i < this.neighbours.length; i++){
		if(this.neighbours[i] === element.index){
			return true;
		}
	}
	return false;
}

app.boardElement.prototype.isInside = function(mousex, mousey){

    mousex -= this.center.x;
    mousey -= this.center.y;

    return app.collision.isPointInsideTriangle(mousex, mousey, this.backgroundPoints);
}

app.boardElement.prototype.draw = function(){

    push();
    
//    app.log(this.center.x + " | " + this.center.y)

    translate(this.center.x, this.center.y);
    
    this._drawBackground();

    if(this.player === null){

        this._drawDot();
    }
    else{
        fill(this.player.color.r, this.player.color.g, this.player.color.b);

        var d = app.settings.triangleMinPulseFactor + (app.settings.triangleMaxPulseFactor - app.settings.triangleMinPulseFactor) * this.currentPulse;

        triangle(
            this.trianglePoints[0].x * d,
            this.trianglePoints[0].y * d,
            this.trianglePoints[1].x * d,
            this.trianglePoints[1].y * d,
            this.trianglePoints[2].x * d,
            this.trianglePoints[2].y * d
        );
    }

    pop();
}

app.boardElement.prototype._drawBackground = function(){

    noStroke();

    fill(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b);

    triangle(
        this.backgroundPoints[0].x,
        this.backgroundPoints[0].y,
        this.backgroundPoints[1].x,
        this.backgroundPoints[1].y,
        this.backgroundPoints[2].x,
        this.backgroundPoints[2].y
    );
}

app.boardElement.prototype._drawDot = function(){

    noStroke();

	fill(this.color.r, this.color.g, this.color.b);

	var center = app.math.computeTriangleCentroid(this.trianglePoints);
     
    var d = app.settings.dotMinPulseFactor + (app.settings.dotMaxPulseFactor - app.settings.dotMinPulseFactor) * this.currentPulse;

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

//    this.player.handleKeyPress();
}

app.pyramidFlip.prototype.handleKeyRelease = function () {

//    this.player.handleKeyRelease();
}
