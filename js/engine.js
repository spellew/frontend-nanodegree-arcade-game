const Engine = (function (global) {
  
  // The images necessary for the game are loaded, and when finished the startScreen function
  // is called.
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
    'images/gem-blue.png',
    'images/gem-green.png',
    'images/gem-orange.png',
    'images/star.png',
  ]);
  Resources.onReady(startScreen);

  // Variables whose values won't change are constant, and the ones that will change are 
  // initialized with let.
  const doc = document,
    win = window,
    // The 'canvas' variable is initialized with a canvas element, and the 'ctx' variable 
    // is initialized with the canvas' context.
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d');
  let playerSprite, dt, now, interval, lastTime, level, music, charBoy, charCatGirl, charHornGirl, charPinkGirl,
    // shouldReset is a boolean that controls whether or not the game should reset.
    shouldReset = false,
    // nextLevel is a boolean that controls whether or not the game should progress on
    // to the next level.
    nextLevel = false,
    // tick will store the amount of time since the game last updated.
    tick = 0,
    // floor controls the minimum speed enemies should spawn with.
    floor = 15,
    // slots is an array holding the y-values at which enemies should spawn.
    slots = [86, 172, 258, 344],
    div = doc.createElement('div'),
    btn = doc.createElement('button'),
    // localStorage is checked to see if it holds a stringified array of high scores, 
    // and this string is parsed. If there are no scores, the value of parse is null and a
    // new empty array is instead used. scoreBoard holds either this new array or a previously
    // stored one.
    scoreBoard = JSON.parse(localStorage.getItem('score-board')) || [],
    // The score variable holds the amount of points earned by the player.
    score = 0;

  canvas.width = 1001;
  canvas.height = 750;
  
  // Styling is added to center the start button, and make the button's purpose clear.
  div.classList.add('flex');
  div.style.marginTop = '-200px';
  div.appendChild(btn);

  btn.classList.add('btn');
  btn.innerText = 'START';
  // When the button is pressed, a countdown is started through the 'startCountdown' function.
  btn.addEventListener('click', () => {
    startCountdown(true);
  });

  // The button and the canvas are added to the document.
  doc.body.appendChild(canvas);
  doc.body.appendChild(div);

  // The canvas' context and the score are made global so they can be accessed by app.js.
  global.ctx = ctx;
  global.score = score;

  // This function is the game's 'menu', in it music is played, the game's default level and
  // score are set, and the characters' sprites are drawn. We listen in on the canvas to determine
  // which character the user selects.
  function startScreen() {
    music = new Audio('sounds/doodle.mp3');
    music.loop = true;
    music.play();
    global.level = 1;
    global.score = 0;
    ctx.lineWidth = 4;
    charBoy = Resources.get('images/char-boy.png');
    charCatGirl = Resources.get('images/char-cat-girl.png');
    charHornGirl = Resources.get('images/char-horn-girl.png');
    charPinkGirl = Resources.get('images/char-pink-girl.png');
    selectCharacter();
    playerSprite = localStorage.getItem('player-sprite');
    canvas.addEventListener('click', handlePlayerSelect);
    div.classList.remove('display-none');
  }

  // The canvas is divided up in this function, and when one of these divisions is clicked,
  // the current sprite is selected and recorded in storage. The character last selected is
  // highlighted by a colored box surrounding it.
  function handlePlayerSelect(evt) {
    const marginW = (innerWidth - canvas.width) / 2,
      clientX = evt.clientX,
      clientY = evt.clientY;
    if (((clientX - marginW >= canvas.width / 6) && (clientX - marginW <= canvas.width / 6 + charBoy.width)) && ((clientY >= canvas.height / 4) && (clientY <= charBoy.height + canvas.height / 4))) {
      selectCharacter();
      playerSprite = 'char-boy.png';
      ctx.strokeStyle = 'sienna';
      ctx.strokeRect(canvas.width / 6, canvas.height / 28 * 9, charBoy.width, charBoy.height * 0.6);
    } else if (((clientX - marginW >= canvas.width / 6 * 2) && (clientX - marginW <= canvas.width / 6 * 2 + charCatGirl.width)) && ((clientY >= canvas.height / 4) && (clientY <= charCatGirl.height + canvas.height / 4))) {
      selectCharacter();
      playerSprite = 'char-cat-girl.png';
      ctx.strokeStyle = 'seagreen';
      ctx.strokeRect(canvas.width / 6 * 2, canvas.height / 28 * 9, charCatGirl.width, charCatGirl.height * 0.6);
    } else if (((clientX - marginW >= canvas.width / 6 * 3) && (clientX - marginW <= canvas.width / 6 * 3 + charHornGirl.width)) && ((clientY >= canvas.height / 4) && (clientY <= charHornGirl.height + canvas.height / 4))) {
      selectCharacter();
      playerSprite = 'char-horn-girl.png';
      ctx.strokeStyle = 'darkblue';
      ctx.strokeRect(canvas.width / 6 * 3, canvas.height / 28 * 9, charHornGirl.width, charHornGirl.height * 0.6);
    } else if (((clientX - marginW >= canvas.width / 6 * 4) && (clientX - marginW <= canvas.width / 6 * 4 + charPinkGirl.width)) && ((clientY >= canvas.height / 4) && (clientY <= charPinkGirl.height + canvas.height / 4))) {
      selectCharacter();
      playerSprite = 'char-pink-girl.png';
      ctx.strokeStyle = 'mediumvioletred';
      ctx.strokeRect(canvas.width / 6 * 4, canvas.height / 28 * 9, charPinkGirl.width, charPinkGirl.height * 0.6);
    }
    localStorage.setItem('player-sprite', playerSprite);
  };

  // This clears the canvas, the selectedCharacter, and resets the fillStyle.
  // It then draws the characters, their names, and the "Select a character." heading.
  function selectCharacter() {
    playerSprite = '';
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '36px bold sans-serif';
    ctx.fillText('Select a character.', canvas.width / 3, canvas.height / 4);
    ctx.font = '24px bold sans-serif';
    ctx.drawImage(charBoy, canvas.width / 6, canvas.height / 4);
    ctx.fillText('Boy', canvas.width / 6 + 30, canvas.height / 4 * 2);
    ctx.drawImage(charCatGirl, canvas.width / 6 * 2, canvas.height / 4);
    ctx.fillText('Cat Girl', +canvas.width / 6 * 2, canvas.height / 4 * 2);
    ctx.drawImage(charHornGirl, canvas.width / 6 * 3, canvas.height / 4);
    ctx.fillText('Horn Girl', canvas.width / 6 * 3, canvas.height / 4 * 2);
    ctx.drawImage(charPinkGirl, canvas.width / 6 * 4, canvas.height / 4);
    ctx.fillText('Pink Girl', canvas.width / 6 * 4, canvas.height / 4 * 2);
  }

  // When the game is over, the player is no longer allowed to move, the player's score is
  // added to 'scoreBoard' – the array full of scores. Also, the in-game music is no longer
  // played. Instead the losing sound is played, and the start screen is showed once again.
  function endGame() {
    document.removeEventListener('keyup', playerInput);
    global.score ? scoreBoard.push(global.score) : null;
    localStorage.setItem('score-board', JSON.stringify(scoreBoard));
    music.pause();
    music = new Audio('sounds/lose.ogg');
    music.play();
    startScreen();
  }

  // After the game is begun, this function is called every time the browser repaints the animation.
  function main() {
    // If the game shouldn't reset and shouldn't progress to the next level...
    if (!shouldReset && !nextLevel) {
      // The time when this function is called is recorded, subtracted from the last time this
      // function was called, and divided into seconds. This value is used to update the game's
      // entities.
      now = Date.now(), dt = (now - lastTime) / 1005.0;
      update(dt);
      // If the game isn't currently counting down, render the game.
      !countdown ? render() : null;
      // lastTime now holds the 'current' time, so it can be subtracted the next time the function
      // is called.
      lastTime = now;
      // The browser now knows we want to preform an animation, and it will call this function
      // every time te animation is to be updated,
      win.requestAnimationFrame(main);
    } else {
      // If the game should reset do so, if not, check if it should progress on to the next
      // level. If it should, do so, if not, do nothing.
      shouldReset ? endGame() : nextLevel ? levelUp() : null;
    }
  }

  // Called after the countdown ends, this function initializes a level.
  function startGame() {
    // A new player is made, and empty arrays are stored in the 'allEnemies', 'allGems',
    // and 'gemLocations' variables to hold enemies, gems, and where the gems should be.
    player = new Player(playerSprite), allEnemies = [], allGems = [];
    let gemLocations = [],
    // These are the x and y coordinates at which to draw the gems.
      x = [5.1, 105.1, 205.2, 305.3, 405.4, 505.5, 605.6, 705.7, 805.8, 905.9],
      y = [166, 249, 332, 415];
    // Four gems are spawned each time, 
    for (let i = 0; i < 4; i++) {
      // Random coordinates from the "x" and "y" arrays are selected.
      // To check if a gem has already been spawned with those coordinates,
      // the randomized coordinates are stringified. If the random coordinates aren't
      // already in an array containing all gemCoordinates, the coordinates are
      // pushed into the array, and a new gem is made using these coordinates.
      // If they are in the array, another iteration is added, and the loop
      // continues, generating new randomized coordinates and checking them.
      let gemCoordinates = [x[Math.floor(Math.random() * x.length)], y[Math.floor(Math.random() * y.length)]];
      if (gemLocations.includes(JSON.stringify(gemCoordinates))) {
        i--;
        continue;
      } else {
        gemLocations.push(JSON.stringify(gemCoordinates));
        new Gem(gemCoordinates[0], gemCoordinates[1]);
      }
    }
    // The function that paints the entities, and updates their positions is called.
    main();
  }

  // This function is passed the difference between now and the last time it was called.
  // This value is used to update the positions of the entities.
  function update(dt) {
    // If the game shouldn't be reset, the function that updates the entities 
    // and the function the checks for collisions is called. Also it the tick
    // variable is checked to see if contains a value less than 60 divided by
    // the game's level. If so tick is incremented, if not tick is reset to 0
    // and an enemy is spawned. This enemy is randomly spawned, on one of four
    //  y-values. The value it is spawned on is removed from the array, and 
    // enemies can no longer spawn at this y-location. Once the array is empty,
    // it is reset to it's default values.
    if (!shouldReset) {
      updateEntities(dt);
      checkCollisions();
      if (tick < 60/global.level) {
        tick++;
      } else {
        if (slots.length) {
          let rand = Math.floor(Math.random() * slots.length);
          new Enemy(-100,
            slots[rand],
            floor
          );
          slots.splice(rand, 1);
          tick = 0;
        } else {
          slots = [86, 172, 258, 344];
        }
      }
    }
  }

  // The player's x and y coordinates are added to the player's length and height
  // the sprite and stored in playerWidth and playerHeight. Then all enemies x
  // and y coordinates are added to the enemies's length and width. If any of the
  // enemies overlap with the player, shouldReset is given a value of true,
  // and the next time the screen is updated the game will end. Gems are also checked
  // for overlap with the player, if there is an overlap the gem is killed and the
  // user's score incremented.
  function checkCollisions() {
    let playerWidth = player.x + 18,
      playerHeight = player.y + 64;
    allEnemies.forEach(function (enemy) {
      let enemyWidth = enemy.x + 96,
      enemyHeight = enemy.y + 64;
      if (((playerHeight >= enemy.y) && (playerHeight <= enemyHeight)) && (((playerWidth + 50) >= enemy.x) && ((playerWidth + 10) <= enemyWidth))) {
        shouldReset = true;
      }
    });
    allGems.forEach(function (gem) {
      if (((gem.x >= player.x) && ((gem.x + gem.sprite.width / 2) <= player.x + player.sprite.width)) && ((gem.y - 66 >= player.y - 61) && ((gem.y - 29 + gem.sprite.height / 2 - 4) <= player.y + player.sprite.height))) {
        gem.kill();
      }
    });
  }

  // If the player reaches the other end of the screen, the player can no longer
  // move, the music changes, and the levelUp function will be called next update.
  // If not the enemies' locations are updated, and if they're off the screen
  // the enemies are killed.
  function updateEntities(dt) {
    if (player.y === 0) {
      document.removeEventListener('keyup', playerInput);
      nextLevel = true;
      music.pause();
      music = new Audio('sounds/doodle.mp3');
      music.play();
    } else {
      allEnemies.forEach(function (enemy) {
        enemy.x <= canvas.width ? enemy.update(dt) : enemy.kill();
      });
    }
  }

  // The canvas is cleared and the backdrop is redrawn first. Then entities are
  // drawn, and then the game's level and the user's score are recorded on the screen.
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 10; col++) {
        ctx.drawImage(Resources.get([
          'images/water-block.png', // Row 1 of 1 of water
          'images/stone-block.png', // Row 1 of 4 of water
          'images/stone-block.png', // Row 2 of 4 of stone
          'images/stone-block.png', // Row 3 of 4 of stone
          'images/stone-block.png', // Row 4 of 4 of stone
          'images/grass-block.png', // Row 1 of 2 of grass
          'images/grass-block.png', // Row 2 of 2 of grass
        ][row]), col * 100, row * 86 + 25.25);
      }
    }
    renderEntities();
    ctx.font = '44px bold sans-serif';
    ctx.strokeStyle = 'black';
    ctx.strokeText('Level: ' + global.level, 710, 575);
    ctx.strokeText('Score: ' + global.score, 710, 635);
    ctx.font = '44px bold sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText('Level: ' + global.level, 710, 575);
    ctx.fillText('Score: ' + global.score, 710, 635);
  }

  // The render functions are called, and the entities are drawn at the position
  // stored in the objects.
  function renderEntities() {
    allGems.forEach(function (gem) {
      gem.render();
    });
    allEnemies.forEach(function (enemy) {
      enemy.render();
    });
    player.render();
  }

  // The difficulty floor is increased, and the level, score, and the countdown for
  // the next level is started. nextLevel is set to false, so the next time the game
  // is updated, enemies will start to move.
  function levelUp() {
    floor += 10, global.level++, global.score += 100, nextLevel = false;
    startCountdown();
  }

  // The game is softly reset if true isn't passed to the functon as hardReset,
  // meaning that the start button will disappear, and the user can opt out of
  // the countdown. Either way, the user can no longer select a player, or move
  // the player. The countdown will last 10 seconds, and the game has already
  // been reset, so shouldReset is set to false. An interval is set so every second,
  // the screenw will countdown.
  function startCountdown(hardReset) {
    hardReset ? (
      div.classList.add('display-none'),
      document.addEventListener('keyup', escapeStart)
    ) : null;
    canvas.removeEventListener('click', handlePlayerSelect);
    document.removeEventListener('keyup', playerInput);
    countdown = 10, shouldReset = false, interval = setInterval(onInterval, 1000, hardReset);
    startGame();
  }

  // Every second the countdown is decreased by 1, and displayed. If the user has
  // any scores stored in the scoreBoard array the scores will be shown. If the game
  // is being softly reset for a new level, the escape hint shouldn't be shown.
  // Once countdown is 0 and falsey the endCountdown function is called.
  function onInterval(hardReset) {
    countdown--;
    displayCountdown(countdown);
    scoreBoard.length ? displayScores() : null;
    hardReset ? (
      ctx.font = '18px bold sans-serif',
      ctx.fillText('(Hint: Press ESC to quit the countdown.)', canvas.width / 48 * 16, canvas.height / 4 * 3)
    ) : null;
    !countdown ? endCountdown() : null;
  }

  // The heading and a star is drawn. Then the scores are sorted, and the top
  // eight scores are drawn in order. After four scores are drawn, the rest are
  // drawn in another row.
  function displayScores() {
    ctx.fillStyle = 'black';
    ctx.font = '48px bold sans-serif';
    ctx.fillText('High Scores', canvas.width / 8 * 3, canvas.height / 6);
    ctx.font = '32px bold sans-serif';
    ctx.drawImage(Resources.get('images/star.png'), canvas.width / 5 * 3 + 100, canvas.height / 6 - 130);
    let y = 20, topScores = scoreBoard.sort((a, b) => b > a).slice(0, 8);
    topScores.forEach((score, i) => {
      i <= 3 ? (
        ctx.fillText((i + 1) + ': ' + score + ' points', canvas.width / 4, canvas.height / 4 + y),
        y = i === 3 ? 20 : y + 50
      ) : (
        ctx.fillText((i + 5) + ': ' + score + ' points', canvas.width / 4 * 2 + 50, canvas.height / 4 + y),
        y += 50
      );
    });
  }

  // When this function is called, the canvas is cleared, and if the seconds left
  // is a single digit number, the time is prefixed with a zero. The time is then
  // displayed.
  function displayCountdown(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time = String(time).length === 1 ? '0' + time : time;
    ctx.font = '48px bold sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText('Countdown: ' + time, canvas.width / 3, canvas.height / 3 * 2);
  }

  // When the countdown is over, the interval is cleared, and the interval variable
  // is set equal to null. The music is paused and a new song is played. Also, the
  // user can no longer escape the countdown. Instead the user can now move the
  // player sprite.
  function endCountdown() {
    document.removeEventListener('keyup', escapeStart);
    document.addEventListener('keyup', playerInput);
    clearInterval(interval);
    interval = null;
    music.pause();
    music = new Audio('sounds/polka.mp3');
    music.loop = true;
    music.play();
  }

  // If the user presses the escape key, the game will be reset, the countdown
  // interval will be cleared. The listener that made this possible is then removed,
  // so the user can only exit the countdown once.
  function escapeStart(e) {
    if (e.keyCode === 27) {
      document.removeEventListener('keyup', escapeStart);
      document.addEventListener('keyup', playerInput);
      clearInterval(interval);
      interval = null;
      shouldReset = true;
    }
  }
})(this);