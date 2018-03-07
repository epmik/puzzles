var app = window.app || {};

app.switchStates = {
    open : 0,
    closed : 1,
}

app.switch = function(){
    
    this.state = app.switchStates.open;
    this.position = { x : 0, y : 0 };
    this.size = 100;
    this.neighbours = { a : null, b : null };
}

app.switch.prototype.draw = function(){
    
    push();
    
    if(this.state == app.switchStates.closed)
    {
        fill(225, 52, 25);
    }
    else
    {
        fill(25, 132, 31);
    }
    
    translate(this.position.x, this.position.y);
    
    rect(0, 0, this.size, this.size, this.size * 0.1);
    
    pop();
}

app.switch.prototype.isClicked = function(mouseX, mouseY){

    if(mouseX < this.position.x || mouseX > this.position.x + this.size)
    {
        return false;
    }
    
    if(mouseY < this.position.y || mouseY > this.position.y + this.size)
    {
        return false;
    }
    
    return true;
}

app.switch.prototype.switchState = function(){

    if(this.state != app.switchStates.open)
    {
        this.state = app.switchStates.open;
    }
    else
    {
        this.state = app.switchStates.closed;
    }
}

app.switch.prototype.log = function(){
    
    console.log(this.position.x + " / " + this.position.y + " : " + this.state);
}