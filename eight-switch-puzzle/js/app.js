"use strict";

var app = window.app || {};

app.playStyles = {
    selfAndNeighbours: 0,
    neighboursOnly : 1,
    opposites : 2,
}

app.playDifficulty = {
    easy: 0,
    normal : 1,
//    hard : 2,
}

app.canvas = null;    
app.scene = null;    
app.camera = null;    
app.renderer = null;    
app.stats = null;    
app.switches = [];    
app.settings = { 
    switchSize:80,
    numberOfPermutionsEasy: 2,
    numberOfPermutionsNormal: 6,
    playStyle: app.playStyles.selfAndNeighbours,
    playDifficulty: app.playDifficulty.normal,
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
    
    resetElementsToSwitch();
    
    resetPlay();
    
    $(".puzzle-options-difficulty").val(app.settings.playDifficulty);
    $(".puzzle-options-type").val(app.settings.playStyle);
    
    $(".reset-puzzle").on("click", function() {
        resetPlay();
        return false;
    });
    
    $(".puzzle-options-difficulty").on("change", function() {
        app.settings.playDifficulty = parseInt($(this).val());
//        console.log("puzzle difficulty is now " + app.settings.playDifficulty);
        resetPlay();
        return false;
    });
    
    $(".puzzle-options-type").on("change", function() {
        app.settings.playStyle = parseInt($(this).val());
//        console.log("puzzle type is now " + app.settings.playStyle);
        resetElementsToSwitch();
        resetPlay();
        return false;
    });
}

function resetElementsToSwitch()
{
    for(let s of app.switches)
    {
        s.elementsToSwitch = [];
    }    
    
    if(app.settings.playStyle == app.playStyles.neighboursOnly || app.settings.playStyle == app.playStyles.selfAndNeighbours)
    {
        app.switches[0].elementsToSwitch.push(1);
        app.switches[0].elementsToSwitch.push(3);

        app.switches[1].elementsToSwitch.push(0);
        app.switches[1].elementsToSwitch.push(2);

        app.switches[2].elementsToSwitch.push(1);
        app.switches[2].elementsToSwitch.push(4);

        app.switches[3].elementsToSwitch.push(0);
        app.switches[3].elementsToSwitch.push(5);

        app.switches[4].elementsToSwitch.push(2);
        app.switches[4].elementsToSwitch.push(7);

        app.switches[5].elementsToSwitch.push(3);
        app.switches[5].elementsToSwitch.push(6);

        app.switches[6].elementsToSwitch.push(5);
        app.switches[6].elementsToSwitch.push(7);

        app.switches[7].elementsToSwitch.push(6);
        app.switches[7].elementsToSwitch.push(4);
    }
    
    if(app.settings.playStyle == app.playStyles.selfAndNeighbours)
    {
        app.switches[0].elementsToSwitch.push(0);

        app.switches[1].elementsToSwitch.push(1);

        app.switches[2].elementsToSwitch.push(2);

        app.switches[3].elementsToSwitch.push(3);

        app.switches[4].elementsToSwitch.push(4);

        app.switches[5].elementsToSwitch.push(5);

        app.switches[6].elementsToSwitch.push(6);

        app.switches[7].elementsToSwitch.push(7);
    }
    
    if(app.settings.playStyle == app.playStyles.opposites)
    {
        app.switches[0].elementsToSwitch.push(4);
        app.switches[0].elementsToSwitch.push(6);

        app.switches[1].elementsToSwitch.push(5);
        app.switches[1].elementsToSwitch.push(7);

        app.switches[2].elementsToSwitch.push(3);
        app.switches[2].elementsToSwitch.push(6);

        app.switches[3].elementsToSwitch.push(2);
        app.switches[3].elementsToSwitch.push(7);

        app.switches[4].elementsToSwitch.push(0);
        app.switches[4].elementsToSwitch.push(5);

        app.switches[5].elementsToSwitch.push(1);
        app.switches[5].elementsToSwitch.push(4);

        app.switches[6].elementsToSwitch.push(0);
        app.switches[6].elementsToSwitch.push(2);

        app.switches[7].elementsToSwitch.push(1);
        app.switches[7].elementsToSwitch.push(3);
    }
    
}

function resetPlay()
{
    for(let s of app.switches)
    {
        s.state = app.switchStates.open;
    }
    
    permutate(
        app.settings.playDifficulty == app.playDifficulty.easy 
        ? app.settings.numberOfPermutionsEasy 
        : app.settings.numberOfPermutionsNormal);
}

function permutate(numberOfPermutions)
{
    var last = parseInt(Math.random() * app.switches.length);
    
    for(var i = 0; i < numberOfPermutions; i++)
    {
        var index = randomSwitch(last);
        
        switchStates(app.switches[index]);
    }
    
    for(let s of app.switches)
    {
        if(s.state == app.switchStates.closed)
        {
            return;
        }        
    }
    
    permutate(numberOfPermutions);
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
    for(let index of s.elementsToSwitch)
    {
        app.switches[index].switchState();
    }
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