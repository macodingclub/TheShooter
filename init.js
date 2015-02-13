var context;
var crossHair;
var queue;
var WIDTH = 1024;
var HEIGHT = 768;
var mouseXPosition;
var mouseYPosition;
var batImage;
var stage;

var animation;
var animationf;
var animationBat;
var animationBubble;


var bubblePopAnimation
var deathAnimationBat;
var deathAnimation;
var spriteSheet;
var spriteSheetFairy;
var spriteSheetBubble;


var enemyXPos=100;
var enemyYPos=100;

var fairyXPos=300;
var fairyYPos=50;

var bubbleXPos=50;
var bubbleYPos=50;

var batXPos = 1000;
var batYPos = 700;

var enemyXSpeed = 1.5;
var enemyYSpeed = 1.75;

var fairyXSpeed = 2.8;
var fairyYSpeed = 0.7;

var bubbleXSpeed = 2.3;
var bubbleYSpeed = 1.8;

var batXSpeed = 1.2;
var batYSpeed = 2.8;

var score = 0;
var scoreText;
var gameTimer;
var gameTime = 0;
var timerText;

var manifest = [
    {id: 'backgroundImage', src: 'assets/waterlilies.png'},
    {id: 'crossHair', src: 'assets/crosshair.png'},
    {id: 'shot', src: 'assets/shot.mp3'},
    {id: 'background', src: 'assets/countryside.mp3'},
    {id: 'gameOverSound', src: 'assets/gameOver.mp3'},
    {id: 'tick', src: 'assets/tick.mp3'},
    {id: 'deathSound', src: 'assets/die.mp3'},
    {id: 'batSpriteSheet', src: 'assets/batSpriteSheet.png'},
    {id: 'dragonFlySpritesheet', src: 'assets/dragonFlySpritesheet.png'},
    {id: 'fairySpritesheet', src: 'assets/fairySpritesheet.png'},
    {id: 'bubbleSpritesheet', src: 'assets/bubble.png'},
    {id: 'batDeath', src: 'assets/batDeath.png'}
];

function init()
{
    /*
     *      Set up the Canvas with Size and height
     *
     */
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");

    /*
     *      Set up the Asset Queue and load sounds
     *
     */
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", queueLoaded, this);
    createjs.Sound.alternateExtensions = ["ogg"];

    /*
     *      Create a load manifest for all assets
     *
     */
    queue.loadManifest(manifest);
    queue.load();

    /*
     *      Create a timer that updates once per second
     *
     */
    gameTimer = setInterval(updateTime, 1000);

}

function queueLoaded(event)
{
    // Add background image
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"));

    stage.addChild(backgroundImage);

    //Add Score
    scoreText = new createjs.Text("1UP: " + score.toString(), "36px Arial", "#FFF");
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);

    //Ad Timer
    timerText = new createjs.Text("Time: " + gameTime.toString(), "36px Arial", "#FFF");
    timerText.x = 800;
    timerText.y = 10;
    stage.addChild(timerText);

    // Play background sound
    createjs.Sound.play("background", {loop: -1});

    // Create dragonFly spritesheet
    spriteSheet = {
        spriteSheet: new createjs.SpriteSheet({
            "images": [queue.getResult('dragonFlySpritesheet')],
            "frames": {"width": 198, "height": 117},
            "animations": {"flap": [0, 4]}
        }),

        // Create fairy spritesheet
        spriteSheetFairy : new createjs.SpriteSheet({
            "images": [queue.getResult('fairySpritesheet')],
            "frames": {"width": 150, "height": 170},
            "animations": {"flap": [0, 8]}
        }),

        // Create buble spritesheet
        spriteSheetBubble : new createjs.SpriteSheet({
            "images": [queue.getResult('bubbleSpritesheet')],
            "frames": {"width": 50, "height": 50},
            "animations": {"flap": [0, 7]}
        }),

        // Create bat spritesheet
        spriteSheetBat : new createjs.SpriteSheet({
            "images": [queue.getResult('batSpriteSheet')],
            "frames": {"width": 198, "height": 117},
            "animations": {"flap": [0, 4]}
        })
    };

    // Create bat death spritesheet
    batDeathSpriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('batDeath')],
        "frames": {"width": 198, "height" : 148},
        "animations": {"die": [0,7, false,1 ] }
    });

    // Create bat sprite
    createEnemy();

    //Create bat sprite

    createBat();

    // Create fairy sprite
    createFairy();

    // Create fairy sprite
    createBubble();

    // Create crosshair
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    stage.addChild(crossHair);

    // Add ticker
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);
    createjs.Ticker.addEventListener('tick', tickEventFairy);
    createjs.Ticker.addEventListener('tick', tickEventBat);
    createjs.Ticker.addEventListener('tick', tickEventBubble);



    // Set up events AFTER the game is loaded
    window.onmousemove = handleMouseMove;
    window.onmousedown = handleMouseDown;
}

function createEnemy()
{
    animation = new createjs.Sprite(spriteSheet.spriteSheet, "flap");
    animation.regX = 99;
    animation.regY = 58;
    animation.x = enemyXPos;
    animation.y = enemyYPos;
    animation.gotoAndPlay("flap");
    stage.addChildAt(animation,1);
}

function createBat()
{
    animationBat = new createjs.Sprite(spriteSheet.spriteSheetBat, "flap");
    animationBat.regX = 99;
    animationBat.regY = 58;
    animationBat.x = batXPos;
    animationBat.y = batYPos;
    animationBat.gotoAndPlay("flap");
    stage.addChildAt(animationBat,1);
}

function createFairy()
{
    animationf = new createjs.Sprite(spriteSheet.spriteSheetFairy, "flap");
    animationf.regX = 76.81;
    animationf.regY = 86.5;
    animationf.x = fairyXPos;
    animationf.y = fairyYPos;
    animationf.gotoAndPlay("flap");
    stage.addChildAt(animationf,1);
}

function createBubble()
{
    animationBubble = new createjs.Sprite(spriteSheet.spriteSheetBubble, "flap");
    animationBubble.regX = 25;
    animationBubble.regY = 25;
    animationBubble.x = bubbleXPos;
    animationBubble.y = bubbleYPos;
    animationBubble.gotoAndPlay("flap");
    stage.addChildAt(animationBubble,1);
}

function batDeath()
{
    deathAnimationBat = new createjs.Sprite(batDeathSpriteSheet, "die");
    deathAnimationBat.regX = 99;
    deathAnimationBat.regY = 58;
    deathAnimationBat.x = batXPos;
    deathAnimationBat.y = batYPos;
    deathAnimationBat.gotoAndPlay("die");
    stage.addChild(deathAnimationBat);
}

function dragonFlyDeath()
{
    deathAnimation = new createjs.Sprite(batDeathSpriteSheet, "die");
    deathAnimation.regX = 99;
    deathAnimation.regY = 58;
    deathAnimation.x = enemyXPos;
    deathAnimation.y = enemyYPos;
    deathAnimation.gotoAndPlay("die");
    stage.addChild(deathAnimation);
}

function fairyDeath()
{
    timerText.text = "GAME OVER";
    stage.removeChild(animation);
    stage.removeChild(animationf);
    stage.removeChild(animationBat);
    stage.removeChild(animationBubble);
    stage.removeChild(crossHair);
    var si =createjs.Sound.play("gameOverSound");
    clearInterval(gameTimer);
}

//to do
function bubblePop()
{
    bubblePopAnimation = new createjs.Sprite(batDeathSpriteSheet, "die");
    bubblePopAnimation.regX = 25;
    bubblePopAnimation.regY = 25;
    bubblePopAnimation.x = bubbleXPos;
    bubblePopAnimation.y = bubbleYPos;
    bubblePopAnimation.gotoAndPlay("die");
    stage.addChild(bubblePopAnimation);


}

function tickEvent()
{
    //Make sure enemy bat is within game boundaries and move enemy Bat
    if(enemyXPos < WIDTH && enemyXPos > 0)
    {
        enemyXPos += enemyXSpeed;
    } else
    {
        enemyXSpeed = enemyXSpeed * (-1);
        enemyXPos += enemyXSpeed;
    }
    if(enemyYPos < HEIGHT && enemyYPos > 0)
    {
        enemyYPos += enemyYSpeed;
    } else
    {
        enemyYSpeed = enemyYSpeed * (-1);
        enemyYPos += enemyYSpeed;
    }

    animation.x = enemyXPos;
    animation.y = enemyYPos;


}

function tickEventFairy()
{
    //Make sure enemy bat is within game boundaries and move enemy Bat
    if(fairyXPos < WIDTH && fairyXPos > 0)
    {
        fairyXPos += fairyXSpeed;
    } else
    {
        fairyXSpeed = fairyXSpeed * (-1);
        fairyXPos += fairyXSpeed;
    }
    if(fairyYPos < HEIGHT && fairyYPos > 0)
    {
        fairyYPos += fairyYSpeed;
    } else
    {
        fairyYSpeed = fairyYSpeed * (-1);
        fairyYPos += fairyYSpeed;
    }

    animationf.x = fairyXPos;
    animationf.y = fairyYPos;


}

function tickEventBat()
{
    //Make sure enemy bat is within game boundaries and move enemy Bat
    if(batXPos < WIDTH && batXPos > 0)
    {
        batXPos += batXSpeed;
    } else
    {
        batXSpeed = batXSpeed * (-1);
        batXPos += batXSpeed;
    }
    if(batYPos < HEIGHT && batYPos > 0)
    {
        batYPos += batYSpeed;
    } else
    {
        batYSpeed = batYSpeed * (-1);
        batYPos += batYSpeed;
    }

    animationBat.x = batXPos;
    animationBat.y = batYPos;

}

function tickEventBubble()
{
    //Make sure enemy bat is within game boundaries and move enemy Bat
    if(bubbleXPos < WIDTH && bubbleXPos > 0)
    {
        bubbleXPos += bubbleXSpeed;
    } else
    {
        bubbleXSpeed = bubbleXSpeed * (-1);
        bubbleXPos += bubbleXSpeed;
    }
    if(bubbleYPos < HEIGHT && bubbleYPos > 0)
    {
        bubbleYPos += bubbleYSpeed;
    } else
    {
        bubbleYSpeed = bubbleYSpeed * (-1);
        bubbleYPos += bubbleYSpeed;
    }

    animationBubble.x = bubbleXPos;
    animationBubble.y = bubbleYPos;

}



function handleMouseMove(event)
{
    //Offset the position by 45 pixels so mouse is in center of crosshair
    crossHair.x = event.clientX-45;
    crossHair.y = event.clientY-45;
}

function handleMouseDown(event)
{

    //Play Gunshot sound
    createjs.Sound.play("shot");

    //Increase speed of enemy slightly
    enemyXSpeed *= 1.03;
    enemyYSpeed *= 1.04;

    batXSpeed *= 1.04;
    batYSpeed *= 1.05;

    fairyXSpeed *= 1.06;
    fairyYSpeed *= 1.07;

    bubbleXSpeed *= 1.1;
    bubbleYSpeed *= 0.9;

    //Obtain Shot position
    var shotX = Math.round(event.clientX);
    var shotY = Math.round(event.clientY);

    var spriteX = Math.round(animation.x);
    var spriteY = Math.round(animation.y);

    var spriteXFairy = Math.round(animationf.x);
    var spriteYFairy = Math.round(animationf.y);

    var spriteXBat = Math.round(animationBat.x);
    var spriteYBat = Math.round(animationBat.y);

    var spriteXBubble = Math.round(animationBubble.x);
    var spriteYBubble = Math.round(animationBubble.y);


    // Compute the X and Y distance using absolte value
    var distX = Math.abs(shotX - spriteX);
    var distY = Math.abs(shotY - spriteY);

    var distXFairy = Math.abs(shotX - spriteXFairy);
    var distYFairy = Math.abs(shotY - spriteYFairy);

    var distXBat = Math.abs(shotX - spriteXBat);
    var distYBat = Math.abs(shotY - spriteYBat);

    var distXBubble = Math.abs(shotX - spriteXBubble);
    var distYBubble = Math.abs(shotY - spriteYBubble);


    ifHitTarget(distX, distY, animation, createEnemy, dragonFlyDeath);
    ifHitTarget(distXFairy, distYFairy, animationf, createFairy, fairyDeath);
    ifHitTarget(distXBat, distYBat, animationBat, createBat, batDeath);
    ifHitTarget(distXBubble, distYBubble, animationBubble, createBubble, bubblePop);


    // Anywhere in the body or head is a hit - but not the wings
    function ifHitTarget(distX, distY, animation, createObject, death){
        if(distX < 30 && distY < 59 )
        {
            //Hit
            stage.removeChild(animation);
            death();
            score += 100;
            scoreText.text = "1UP: " + score.toString();
            createjs.Sound.play("deathSound");

            //Make it harder next time
            enemyYSpeed *= 1.15;
            enemyXSpeed *= 1.2;

            batXSpeed *= 1.15;
            batYSpeed *= 1.2;

            //fairyXSpeed *= 1.15;
            //fairyYSpeed *= 1.2;

            bubbleXSpeed *= 1.05;
            bubbleYSpeed *= 1.02;



            //Create new enemy
            var timeToCreate = Math.floor((Math.random()*3500)+1);
            setTimeout(createObject,timeToCreate);

        } else
        {
            //Miss
            score -= 10;
            scoreText.text = "1UP: " + score.toString();

        }
    }
}

function updateTime()
{
    gameTime += 1;
    if(gameTime > 60)
    {
        //End Game and Clean up
        timerText.text = "GAME OVER";
        stage.removeChild(animation);
        stage.removeChild(animationf);
        stage.removeChild(animationBat);
        stage.removeChild(crossHair);
        stage.removeChild(animationBubble);

        var si = createjs.Sound.play("gameOverSound");
        clearInterval(gameTimer);
    }
    else
    {
        timerText.text = "Time: " + gameTime;
        createjs.Sound.play("tick");
    }
}
