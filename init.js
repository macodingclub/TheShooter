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

var deathAnimation;
var spriteSheet;
var spriteSheetFairy;

var enemyXPos=100;
var enemyYPos=100;

var fairyXPos=300;
var fairyYPos=50;

var batXPos = 1000;
var batYPos = 700;

var enemyXSpeed = 1.5;
var enemyYSpeed = 1.75;

var fairyXSpeed = 2.8;
var fairyYSpeed = 0.7;

var batXSpeed = 2.5;
var batYSpeed = 5.2;
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
        {id: 'batDeath', src: 'assets/batDeath.png'}
    ]

window.onload = function()
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

    // Create crosshair
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    stage.addChild(crossHair);

    // Add ticker
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);
    createjs.Ticker.addEventListener('tick', tickEventFairy);
	createjs.Ticker.addEventListener('tick', tickEventBat);


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
    stage.removeChild(crossHair);
    var si =createjs.Sound.play("gameOverSound");
    clearInterval(gameTimer);
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
    enemyXSpeed *= 1.05;
    enemyYSpeed *= 1.06;

	batXSpeed *= 1.06;
	batYSpeed *= 1.07;

	fairyXSpeed *= 1.07;
	fairyYSpeed *= 1.08;

    //Obtain Shot position
    var shotX = Math.round(event.clientX);
    var shotY = Math.round(event.clientY);

    var spriteX = Math.round(animation.x);
    var spriteY = Math.round(animation.y);

	var spriteXFairy = Math.round(animationf.x);
	var spriteYFairy = Math.round(animationf.y);

	var spriteXBat = Math.round(animationBat.x);
	var spriteYBat = Math.round(animationBat.y);

    // Compute the X and Y distance using absolte value
    var distX = Math.abs(shotX - spriteX);
    var distY = Math.abs(shotY - spriteY);

	var distXFairy = Math.abs(shotX - spriteXFairy);
	var distYFairy = Math.abs(shotY - spriteYFairy);

	var distXBat = Math.abs(shotX - spriteXBat);
	var distYBat = Math.abs(shotY - spriteYBat);

	ifHitTarget(distX, distY, animation, createEnemy, dragonFlyDeath);
	ifHitTarget(distXFairy, distYFairy, animationf, createFairy, fairyDeath);
	ifHitTarget(distXBat, distYBat, animationBat, createBat, batDeath);

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
     enemyYSpeed *= 1.25;
     enemyXSpeed *= 1.3;

	 batXSpeed *= 1.25;
	 batYSpeed *= 1.3;

	 fairyXSpeed *= 1.25;
	 fairyYSpeed *= 1.3;

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
        var si = createjs.Sound.play("gameOverSound");
        clearInterval(gameTimer);
    }
    else
    {
        timerText.text = "Time: " + gameTime;
        createjs.Sound.play("tick");
    }
}
