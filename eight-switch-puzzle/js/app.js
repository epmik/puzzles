"use strict";

var app = window.app || {};

app.canvas = null;    
app.scene = null;    
app.camera = null;    
app.renderer = null;    
app.stats = null;    
app.switches = [];    
app.settings = { 
    switchSize:80,
    near: 0.1,
    far: 1000,
};

function setup() {
  
    app.canvas = createCanvas(app.settings.switchSize * 4, app.settings.switchSize * 4);
    
    app.canvas.parent("canvas-container");
    
    var x = 0;
    var y = 0;
    
    for(var j = 0; j < 3; j++)
    {
        x = 0;
        
        for(var i = 0; i < 3; i++)
        {
            if(j == 1 && i == 1)
            {
                x += app.settings.switchSize + app.settings.switchSize * 0.5;
                continue;
            }
            
            var s = new app.switch();
            
            app.switches[app.switches.length] = s;

            s.position.x = x;
            s.position.y = y;
            s.size = app.settings.switchSize;
            
            x += app.settings.switchSize + app.settings.switchSize * 0.5;
        }
        
        y += app.settings.switchSize + app.settings.switchSize * 0.5;
    }
    
    app.switches[0].neighbours.a = 1;
    app.switches[0].neighbours.b = 3;
    
    app.switches[1].neighbours.a = 0;
    app.switches[1].neighbours.b = 2;
    
    app.switches[2].neighbours.a = 1;
    app.switches[2].neighbours.b = 4;
    
    app.switches[3].neighbours.a = 0;
    app.switches[3].neighbours.b = 5;
    
    app.switches[4].neighbours.a = 2;
    app.switches[4].neighbours.b = 7;
    
    app.switches[5].neighbours.a = 3;
    app.switches[5].neighbours.b = 6;
    
    app.switches[6].neighbours.a = 5;
    app.switches[6].neighbours.b = 7;
    
    app.switches[7].neighbours.a = 6;
    app.switches[7].neighbours.b = 4;
    
    permutate(6);

}

function permutate(amount)
{
    var last = parseInt(Math.random() * app.switches.length);
    
    for(var i = 0; i < amount; i++)
    {
        var index = randomSwitch(last);
        
        switchStates(app.switches[index]);
    }
    
    for(var i = 0; i < app.switches.length; i++)
    {
        app.switches[i].state == app.switchStates.closed;
        
        return;
    }
    
    permutate(amount);
}

function randomSwitch(not)
{
    var p = parseInt(Math.random() * app.switches.length);
    
    if(p != not)
    {
        return p;
    }
    
    return randomSwitch(not);
}

function switchStates(s)
{
    s.switchState(); 
    app.switches[s.neighbours.a].switchState(); 
    app.switches[s.neighbours.b].switchState(); 
}

function draw() {
  
    background(255);
  
    noStroke();
    
    for(var i = 0; i < app.switches.length; i++)
    {
        app.switches[i].draw();
    }

}

function mousePressed() {
        
    for(var i = 0; i < app.switches.length; i++)
    {
        var s = app.switches[i];
        
        if(s.isClicked(mouseX, mouseY)){
            switchStates(s);
        }
    }
}