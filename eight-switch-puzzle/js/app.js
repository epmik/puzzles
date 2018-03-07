"use strict";

var app = window.app || {};

app.scene = null;    
app.camera = null;    
app.renderer = null;    
app.stats = null;    
app.switches = [];    
app.settings = { 
    width: window.innerWidth,
    height: window.innerHeight,
    near: 0.1,
    far: 1000,
    switchSize:100,
};

function setup() {
  
    createCanvas(app.settings.width, app.settings.height);
    
    var x = (app.settings.width - (5 * app.settings.switchSize)) * 0.5;
    var y = (app.settings.height - (5 * app.settings.switchSize)) * 0.5;
    
    for(var j = 0; j < 3; j++)
    {
        x = (app.settings.width - (5 * app.settings.switchSize)) * 0.5;
        
        for(var i = 0; i < 3; i++)
        {
            if(j == 1 && i == 1)
            {
                x += app.settings.switchSize + app.settings.switchSize;
                continue;
            }
            
            var s = new app.switch();
            
            app.switches[app.switches.length] = s;

            s.position.x = x;
            s.position.y = y;
            s.size = app.settings.switchSize;
            
            x += app.settings.switchSize + app.settings.switchSize;
        }
        
        y += app.settings.switchSize + app.settings.switchSize;
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
    
    permutate(5);

}

function permutate(amount)
{
    var last = parseInt(Math.random() * app.switches.length);
    
    for(var i = 0; i < amount; i++)
    {
        var index = randomSwitch(last);
        
        switchStates(app.switches[index]);
    }
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
  
    background(127);
  
    noStroke();
    
    for(var i = 0; i < app.switches.length; i++)
    {
        app.switches[i].draw();
    }

}

// When the user clicks the mouse
function mousePressed() {
        
    for(var i = 0; i < app.switches.length; i++)
    {
        var s = app.switches[i];
        
        if(s.isClicked(mouseX, mouseY)){
            switchStates(s);
        }
    }

//  // Check if mouse is inside the circle
//  var d = dist(mouseX, mouseY, 360, 200);
//  if (d < 100) {
//    // Pick new random color values
//    r = random(255);
//    g = random(255);
//    b = random(255);
//  }
}