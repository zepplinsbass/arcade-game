//Variables to save the difficulty selected at the start of the game, along
//with number of remaining lives.
let difficulty = null;
let lives = 3;

//Function that adds event listeners to Settings modal (character and
//difficulty selection).
function selection() {
  const container = document.body.querySelector('.settings');
  container.style.display = 'flex';

  function addListeners() {
    const stars = document.body.querySelector('.difficulty');
    const star = stars.getElementsByTagName('li');

    const characters = document.body.querySelector('.characters');
    const character = characters.getElementsByTagName('li');

    for (let j = 0; j < star.length; j++) {
      star[j].addEventListener('click', function() {
        for (let k = 0; k < star.length; k++) {
          star[k].className = 'diff-icon';
        }
        selected(star[j]);
      });
    }

    for (let i = 0; i < character.length; i++) {
      character[i].addEventListener('click', function() {
        for (let k = 0; k < character.length; k++) {
          character[k].className = 'char-icon';
        }
        selected(character[i]);
      });
    }

    const submit = document.body.querySelector('.submit');
      submit.addEventListener('click', submitted);
  }

  function submitted() {
    const modal = document.body.querySelector('.settings');

    modal.style.display = 'none';
    createEnemies();
  }

  function selected(elem) {
    const diffList = document.body.querySelector('.game-stats');
    const diffText = diffList.querySelector('#diff-value');

    if (elem.className === 'diff-icon') {
      elem.className = 'select-diff';
      difficulty = elem.innerHTML;
      if (difficulty === 'easy') {
        diffText.innerHTML = '1';
      } else if (difficulty === 'not so easy') {
        diffText.innerHTML = '2';
      } else if (difficulty === `you can't win`) {
        diffText.innerHTML = '3';
      }
    } else if (elem.className === 'char-icon') {
      elem.className = 'select-char';
      player.sprite = `images/${elem.id}.png`;
    }
  }

  addListeners();

}

selection();

//Enemies our player must avoid
var Enemy = function(x, y, speed) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images

  this.sprite = 'images/enemy-bug.png';
  this.x = x;
  this.y = y;
  this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

  this.x += (this.speed) * dt;

  if (this.x >= 505) {
    this.x = -100;
  }

  //Check for collision with Player object. Then changes the number of
  //remaining lives if a collision occurs.
  if (player.x < (this.x + 65) &&
    player.x > (this.x - 65) &&
    player.y < (this.y + 30) &&
    player.y > (this.y - 50)) {
    player.x = 200;
    player.y = 400;
    checkLives();
  }

  //Decrements lives after each collision.
  //IF lives = 0, then player speed is reduced to 0 and gameOver runs.
  function checkLives() {
    const elem = document.body.querySelector('.game-stats');
    const lifeText = elem.querySelector('#life-value');

    lives -= 1;
    if (lives < 0) {
      lives = 0;
    }
    lifeText.innerHTML = lives;

    if (lives === 0) {
      player.speed = 0;
      gameOver();
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

const Player = function(x, y, speed, sprite) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.speed = speed;
}

Player.prototype.update = function() {

  //If the player touches the water, then the gameWin function runs.
  if (this.y <= 0) {
    this.x = 200;
    this.y = 400;
    gameWin();
  }

  //Restrict player movements, such that the player cannot move outside of the
  //game tiles or onto the water.
 /* if (this.y <= 0) {
      this.y = 0;
  }*/

  if (this.y >= 400) {
      this.y = 400;
  }

  if (this.x <= -15) {
      this.x = -15;
  }

  if (this.x >= 415) {
      this.x = 415;
  }
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(input) {
  if (input === 'left') {
    this.x -= this.speed * 2;
  }

  if (input === 'up') {
    this.y -= this.speed;
  }

  if (input === 'right') {
    this.x += this.speed * 2;
  }

  if (input === 'down') {
    this.y += this.speed;
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [];

function createEnemies() {
  let diff = null;
  if (difficulty === 'easy') {
    diff = 100;
  } else if (difficulty === 'not so easy') {
    diff = 250;
  } else if (difficulty === `you can't win`) {
    diff = 400;
  }

  //Creates 4 enemies, spacing them out evenly along the y axis of the canvas.
  //Enemy speed is equal to the 'diff' variable multipled by a random number.
  //'diff' changes based on the difficulty chosen at the beginning of the game.
  //The harder the difficulty chosen, the faster the enemies move.
  for (let i = 1; i < 5; i++) {
    const speed = diff + ((Math.floor(Math.random() * Math.floor(10)) * 10));
    const position = (i * 90) - 50;
    allEnemies[i] = new Enemy(0, position, speed);
  }

  return allEnemies;
}


// Place the player object in a variable called player
let player = null;

//The image in passed to this object is a placeholder, in case the player does
//not select a character at the start of the game.
function createPlayer() {
  player = new Player(200, 400, 15, 'images/char-boy.png');
}

createPlayer();

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
//
// Added the 'W, A, S, D' keys, so that the player has options for controlling
// movement.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Displays the game over modal after lives have reached 0.
function gameOver() {
  const endModal = document.body.querySelector('.end-modal');
  const buttons = endModal.getElementsByTagName('button');

  endModal.style.display = 'flex';
  endListeners(buttons, endModal);
}

//Displays the game over modal with new text, telling the player that he/she
//has won.
function gameWin() {
  const endModal = document.body.querySelector('.end-modal');
  const buttons = endModal.getElementsByTagName('button');
  const winText = endModal.querySelector('.end-text');
  const h1Text = winText.getElementsByTagName('h1');
  const h3Text = winText.getElementsByTagName('h3');

  h1Text[0].innerHTML = 'YOU WIN!';
  h3Text[0].innerHTML = 'You made it to the water before the bugs could touch you! Next step, ending world hunger.';

  endModal.style.display = 'flex';
  endListeners(buttons, endModal);
}

//Adds event listeners to the game over modal. Resets number of lives and
//player speed if the 'Play Again' button is clicked.
function endListeners(elem, modal) {
  const lifeText = document.body.querySelector('#life-value');

  elem[0].addEventListener('click', function() {
    player.speed = 15;
    lives = 3;
    lifeText.innerHTML = lives;
    modal.style.display = 'none';
  });

  elem[1].addEventListener('click', function() {
    window.location.reload();
  });
}
