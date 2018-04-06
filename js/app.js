const Enemy = function (x, y, floor, multiplicity) {
  // The x argument is stored in the Enemy object.
  // It is the enemy's horizontal position.
  this.x = x;
  // The y argument is stored in the Enemy object.
  // It is the enemy's vertical position.
  this.y = y;
  // 10 is multiplied by a random number, from 0 to 1, so the Enemy's
  // velocity varies and isn't always the same, and the product is added
  // to the floor argument. This ensures all Enemy velocities are at least
  // a certain speed and varied, the output is stored in the Enemy object
  // as "velocity".
  this.velocity = (Math.random() * 15 + floor);
  // The newly created Enemy is pushed to the allEnemies array, and this
  // function (Array.push) returns the length of the array that the
  // function is used on, and 1 is subtracted from this value to account
  //  for the fact that array indices start at 0.
  this.id = allEnemies.push(this) - 1;
};

Enemy.prototype.kill = function () {
  // The delete keyword, in this case, will remove the Enemy object from
  // the allEnemies array. This method ensures that the array length will
  // remain the same after an Enemy is deleted, and that there won't be
  //  an issue with assigning ids.
  delete allEnemies[this.id];
};

Enemy.prototype.render = function () {
  // The canvas is cleared and the entities and map are redrawn everytime
  // the window requests another animation frames. This function is called
  // at such a time and draws the Enemy's sprite, at the Enemy's current
  // position. The sprite is kept the same throughout so no variables
  // are used.
  ctx.drawImage(Resources.get('images/enemy-bug.png'), this.x, this.y);
};

Enemy.prototype.update = function (dt) {
  // If the Enemy's current x position is within the bounds of the
  // canvas, increase it's position incrementally. The position is
  // increased by the time delta multiplied by the velocity, assigned when
  // the Enemy is created, and by the an arbitary value which ensures
  // the bugs aren't moving too slow. If the Enemy is not within bounds
  // it is killed the Enemy.
  this.x <= ctx.canvas.width ? this.x += (dt * this.velocity * 5) : this.kill();
};

const Gem = function (x, y) {
  this.x = x;
  this.y = y;
  this.id = allGems.push(this) - 1;
  this.sprite = Resources.get('images/gem-' + ['blue', 'orange', 'green'][Math.floor(Math.random() * 3)] + '.png');
}

Gem.prototype.kill = function () {
  // The delete keyword, in this case, will remove the Enemy object from
  // the allEnemies array. This method ensures that the array length will
  // remain the same after an Enemy is deleted, and that there won't be
  //  an issue with assigning ids.
  score += 50;
  delete allGems[this.id];
};

Gem.prototype.render = function () {
  // The canvas is cleared and the entities and map are redrawn everytime
  // the window requests another animation frames. This function is called
  // at such a time and draws the Enemy's sprite, at the Enemy's current
  // position. The sprite is kept the same throughout so no variables
  // are used.
  ctx.drawImage(this.sprite, this.x + this.sprite.width / 5, this.y - this.sprite.height / 10, this.sprite.width / 2, this.sprite.height / 2);
};

const Player = function (sprite) {
  // Whenever a new Player is made, it will always be spawned at the same
  // position in the bottom corner of the map.
  this.x = 0;
  this.y = 498;
  // The only necessary argument is the sprite the user selects, because
  // the spawn position is constant and the player controls their own
  // movement. The default sprite is the boy, if the sprite argument is
  // undefined the default is selected.
  this.sprite = Resources.get('images/' + (sprite || "char-boy.png"));
};

Player.prototype.render = function () {
  // Like Enemy.prototype.render, after the canvas is cleared, this line
  // draws the Player's sprite, at a specific location on the canvas.
  ctx.drawImage(this.sprite, this.x, this.y);
}

Player.prototype.handleInput = function (direction) {
  // When this function is called it is passed an argument, and depending on
  // the argument a function is returned from the object and stored in the
  // "movePlayer" variable. A function is only returned if the argument exists
  // as a key within the object. "movePlayer" is then checked to see if is truthy,
  // if so the function stored in "movePlayer" is then called. 
  const movePlayer = {
    left: () => {
      this.x > 0 ? this.x -= 100.1 : null
    },
    up: () => {
      this.y > 0 ? this.y -= 83 : null
    },
    right: () => {
      this.x < 900.9 ? this.x += 100.1 : null
    },
    down: () => {
      this.y < 498 ? this.y += 83 : null
    }
  }[direction];
  movePlayer ? movePlayer() : null;
}

// The function has been modified to allow W, A, S, D keys as legal input.
const playerInput = function (e) {
  const allowedKeys = {
    37: 'left',
    65: 'left',
    87: 'up',
    38: 'up',
    39: 'right',
    68: 'right',
    40: 'down',
    83: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
}