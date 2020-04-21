const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');
var sprite = new Image();
sprite.src = "sprite/duckFull.png";
ctx.fillStyle = 'rgba(255,255,255,0)';
ctx.fill();

//sky backGround

const skyC = document.getElementById("skyBackGround");
const skyCtx = skyC.getContext('2d');
var sky = new Image();
sky.src = "sprite/newSky.png";
sky.onload = function(){
    skyCtx.drawImage(sky, 0,0, 400,300,0,0, 800, 600);
}
//Moving grass
var grass = new Image();
grass.src = "sprite/movingGrass.png";
var grassCanvas = document.getElementById('movingGrass');
var grassCtx = grassCanvas.getContext('2d');

grass.onload = function(){
    requestAnimationFrame(updateGrass);
}

var frameG = 0;
var grassCounter = 0;
function updateGrass(){
grassCounter++;
if(grassCounter == 15){
    if(frameG == 0 ){
        frameG = 1;
    }
    else if(frameG == 1){
        frameG = 2;
    }
    else if(frameG == 2){
        frameG = 0;
    }
    grassCounter = 0;
}


drawGrass(frameG);

requestAnimationFrame(updateGrass);
}

function drawGrass(frame){
    
    grassCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(frame == 0){
        ctx.drawImage(grass, 0,0,400,300,0,0,800,600);
    }
    else if (frame == 1){
        //Second Frame
        ctx.drawImage(grass, 0,300,400,300,0,0,800,600);
       }
    else if (frame == 2){
    //Second Frame
        ctx.drawImage(grass, 0,600,400,300,0,0,800,600);
    }
      
      
}




//Mouse part
var mouseSprite = new Image();
mouseSprite.src = "sprite/aim.png";
const canvasMouse = document.getElementById("mouseOverlay");
const mouseCtx = canvasMouse.getContext('2d');


mouseSprite.onload = function(){
    requestAnimationFrame(updateMouse);
}

var mx = 0;
var my = 0;

function updateMouse(){
    document.getElementById("body").onmousemove = getMousePos;
    function getMousePos(event){
        mx = event.clientX;
        my = event.clientY;
        drawMouse(mx, my);
        
    }    
    
}

function drawMouse(x,y){
    mouseCtx.clearRect(0, 0, canvas.width, canvas.height);
    mouseCtx.drawImage(mouseSprite,x-25,y-25);
}

//End mouse part


sprite.onload = function(){
    requestAnimationFrame(update);
};


var hitAudio = new Audio('audio/hit.mp3');

const scale = 100;

var x = 0;
var y = 0;
var shoot = {nx : 0, ny : 0};

let moveCounter = 0;
let moveInterval = 1000;

let lastTime = 0;
var frame = 0;

//When frame coutner reach 15, change sprite
var frameCounter = 0;

function update(time = 0){

const deltaTime = time - lastTime;
lastTime = time;
moveCounter += deltaTime;
frameCounter++;
if(frameCounter == 15){
    if(frame == 0 ){
        frame = 1;
    }
    else{
        frame = 0;
    }
    frameCounter = 0;
}

if(moveCounter > moveInterval){

    if(duck.direction == 0){
        duck.pos.x += duck.speed;
        if(duck.pos.x % 100 == 0){
            duck.up = !duck.up;
        }
     }
    else if(duck.direction == 1){
         duck.pos.x -= duck.speed;
         if(duck.pos.x % 100 == 0){
            duck.up = !duck.up;
        }
    }
    if(duck.up){
        duck.pos.y += 2; 
    }
    else if(!duck.up){
        duck.pos.y -= 2;
    }
    checkOutOfBox();
    if(shoot.nx > duck.pos.x 
        && shoot.nx < duck.pos.x + scale 
        && shoot.ny > duck.pos.y 
        && shoot.ny < duck.pos.y +scale){
        hitAudio.play();

        checkScoreForSetSpeed();
        
        randomDuck();
        player.point += 1;
        document.getElementById("score").innerHTML = "Score : "+player.point;

               
    }
    shoot.nx = 0;
    shoot.ny = 0;

}

drawTest(duck, frame);

requestAnimationFrame(update);
}

const duck = {
    pos : {x: 0, y:0},
    //0 go right, 1 go left
    direction: 0,
    speed: 2,
    up:true,
    destoy: false
}

function setMovePath(){

}
//When the "duck" reach the end of the box must be destroyed
function checkOutOfBox(){
    if(duck.direction == 0){
        if(duck.pos.x > 800){
            randomDuck();
            drawTest(duck);
            duck.destoy=true;
        }
    }
    else if(duck.direction == 1){
        if(duck.pos.x < 0){
            randomDuck();
            drawTest(duck);
            duck.destoy = true;
        }
    }

}


const Standardduck = {
    pos : {x: 0, y:0}
}

var duckSize = 100;

function drawTest(duckS, frame){
    //Clear the canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(duckS.direction == 0){
        if(frame == 0){
            ctx.drawImage(sprite, 0,0,duckSize,duckSize,duckS.pos.x,duckS.pos.y,duckSize,duckSize);
        }
        else if (frame == 1){
            //Second Frame
            ctx.drawImage(sprite, duckSize,0,duckSize,duckSize,duckS.pos.x,duckS.pos.y,duckSize,duckSize);
        }
    }
    else if (duck.direction == 1){
        if(frame == 0){
            ctx.drawImage(sprite, 0,duckSize,duckSize,duckSize,duckS.pos.x,duckS.pos.y,duckSize,duckSize);
        }
        else if (frame == 1){
            //Second Frame
            ctx.drawImage(sprite, duckSize,duckSize,duckSize,duckSize,duckS.pos.x,duckS.pos.y,duckSize,duckSize);
        }
    }

    
}


//update();

//Random Duck
function randomDuck(){
    //Random Y
    var min=0; 
    var max=canvas.height-scale;  
    var randomY = 
    Math.floor(Math.random() * (+max - +min)) + +min; 
    duck.pos.y = randomY;
    //Chose left or right
    var k = Math.floor(Math.random() * (+2 - +0)) + +0; 
    duck.direction = k;
    if(k == 0){
        duck.pos.x = 0;
    }
    else if(k == 1){
        duck.pos.x = 800;
    }
}

const player = {
    point: 0
}

function checkScoreForSetSpeed(){
    if(player.point % 10 == 0){
        duck.speed ++;
    }
}

//Shooting
function playerShoot(){
    event.preventDefault();
    shoot.nx = event.offsetX;
    shoot.ny = event.clientY;
}
canvas.addEventListener("click", playerShoot);