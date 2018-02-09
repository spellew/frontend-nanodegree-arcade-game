const Engine = (function (global) {
  const doc = document,
    win = window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d');
  let playerSprite, dt, now, interval, lastTime, level, music,
    shouldReset = false,
    nextLevel = false,
    tick = 0,
    floor = 15,
    slots = [86, 172, 258, 344],
    div = doc.createElement("div"),
    btn = doc.createElement("button"),
    scoreBoard = JSON.parse(localStorage.getItem('score-board')) || [],
    score = 0;
  
  canvas.width = 1001;
  canvas.height = 750;

  doc.body.appendChild(canvas);
  doc.body.appendChild(div);

  div.classList.add("flex");
  div.style.marginTop = "-200px";
  div.appendChild(btn);

  btn.classList.add("btn");
  btn.innerText = "START";
  btn.onclick = () => {
    startCountdown(true);
  };

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

  global.ctx = ctx;
  global.score = score;

  function startScreen() {
    music = new Audio("sounds/doodle.mp3");
    music.loop = true;
    music.play();
    global.level = 1;
    global.score = 0;
    let charBoy = Resources.get('images/char-boy.png'),
      charCatGirl = Resources.get('images/char-cat-girl.png'),
      charHornGirl = Resources.get('images/char-horn-girl.png'),
      charPinkGirl = Resources.get('images/char-pink-girl.png');
    ctx.lineWidth = 4;
    selectCharacter(charBoy, charCatGirl, charHornGirl, charPinkGirl);
    playerSprite = localStorage.getItem('player-sprite');
    switch (playerSprite) {
      case "char-boy.png":
        ctx.strokeStyle = "sienna";
        ctx.strokeRect(canvas.width / 6, canvas.height / 28 * 9, charBoy.width, charBoy.height * 0.6);
        break;
      case "char-cat-girl.png":
        ctx.strokeStyle = "seagreen";
        ctx.strokeRect(canvas.width / 6 * 2, canvas.height / 28 * 9, charCatGirl.width, charCatGirl.height * 0.6);
        break;
      case "char-horn-girl.png":
        ctx.strokeStyle = "darkblue";
        ctx.strokeRect(canvas.width / 6 * 3, canvas.height / 28 * 9, charHornGirl.width, charHornGirl.height * 0.6);
        break;
      case "char-pink-girl.png":
        ctx.strokeStyle = "mediumvioletred";
        ctx.strokeRect(canvas.width / 6 * 4, canvas.height / 28 * 9, charPinkGirl.width, charPinkGirl.height * 0.6);
        break;
    }
    canvas.onclick = function (evt) {
      const marginW = (innerWidth - canvas.width) / 2,
        clientX = evt.clientX,
        clientY = evt.clientY;
      if (((clientX - marginW >= canvas.width / 6) && (clientX - marginW <= canvas.width / 6 + charBoy.width)) && ((clientY >= canvas.height / 4) && (clientY <= charBoy.height + canvas.height / 4))) {
        selectCharacter(charBoy, charCatGirl, charHornGirl, charPinkGirl);
        playerSprite = "char-boy.png";
        ctx.strokeStyle = "sienna";
        ctx.strokeRect(canvas.width / 6, canvas.height / 28 * 9, charBoy.width, charBoy.height * 0.6);
      } else if (((clientX - marginW >= canvas.width / 6 * 2) && (clientX - marginW <= canvas.width / 6 * 2 + charCatGirl.width)) && ((clientY >= canvas.height / 4) && (clientY <= charCatGirl.height + canvas.height / 4))) {
        selectCharacter(charBoy, charCatGirl, charHornGirl, charPinkGirl);
        playerSprite = "char-cat-girl.png";
        ctx.strokeStyle = "seagreen";
        ctx.strokeRect(canvas.width / 6 * 2, canvas.height / 28 * 9, charCatGirl.width, charCatGirl.height * 0.6);
      } else if (((clientX - marginW >= canvas.width / 6 * 3) && (clientX - marginW <= canvas.width / 6 * 3 + charHornGirl.width)) && ((clientY >= canvas.height / 4) && (clientY <= charHornGirl.height + canvas.height / 4))) {
        selectCharacter(charBoy, charCatGirl, charHornGirl, charPinkGirl);
        playerSprite = "char-horn-girl.png";
        ctx.strokeStyle = "darkblue";
        ctx.strokeRect(canvas.width / 6 * 3, canvas.height / 28 * 9, charHornGirl.width, charHornGirl.height * 0.6);
      } else if (((clientX - marginW >= canvas.width / 6 * 4) && (clientX - marginW <= canvas.width / 6 * 4 + charPinkGirl.width)) && ((clientY >= canvas.height / 4) && (clientY <= charPinkGirl.height + canvas.height / 4))) {
        selectCharacter(charBoy, charCatGirl, charHornGirl, charPinkGirl);
        playerSprite = "char-pink-girl.png";
        ctx.strokeStyle = "mediumvioletred";
        ctx.strokeRect(canvas.width / 6 * 4, canvas.height / 28 * 9, charPinkGirl.width, charPinkGirl.height * 0.6);
      }
      localStorage.setItem('player-sprite', playerSprite);
    };
    div.classList.remove("display-none");
  }

  function selectCharacter(charBoy, charCatGirl, charHornGirl, charPinkGirl) {
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "36px bold sans-serif";
    ctx.fillText("Select a character.", canvas.width / 3, canvas.height / 4);
    ctx.font = "24px bold sans-serif";
    ctx.drawImage(charBoy, canvas.width / 6, canvas.height / 4);
    ctx.fillText("Boy", canvas.width / 6 + 30, canvas.height / 4 * 2);
    ctx.drawImage(charCatGirl, canvas.width / 6 * 2, canvas.height / 4);
    ctx.fillText("Cat Girl", +canvas.width / 6 * 2, canvas.height / 4 * 2);
    ctx.drawImage(charHornGirl, canvas.width / 6 * 3, canvas.height / 4);
    ctx.fillText("Horn Girl", canvas.width / 6 * 3, canvas.height / 4 * 2);
    ctx.drawImage(charPinkGirl, canvas.width / 6 * 4, canvas.height / 4);
    ctx.fillText("Pink Girl", canvas.width / 6 * 4, canvas.height / 4 * 2);
  }
  
  function endGame() {
    document.removeEventListener('keyup', playerInput);
    global.score ? scoreBoard.push(global.score) : null;
    localStorage.setItem('score-board', JSON.stringify(scoreBoard));
    music.pause();
    music = new Audio("sounds/lose.ogg");
    music.play();
    startScreen();
  }

  function main() {
    if (!shouldReset && !nextLevel) {
      now = Date.now(), dt = (now - lastTime) / 1005.0;
      update(dt);
      !countdown ? render() : null;
      lastTime = now;
      win.requestAnimationFrame(main);
    } else {
      shouldReset ? endGame() : nextLevel ? levelUp() : null;
    }
  }

  function startGame() {
    player = new Player(playerSprite);
    allEnemies = [];
    allGems = [];
    lastTime = Date.now();
    let gemLocations = [],
      x = [5.1, 105.1, 205.2, 305.3, 405.4, 505.5, 605.6, 705.7, 805.8, 905.9],
      y = [166, 249, 332, 415];
    for (let i = 0; i < 4; i++) {
      let gemCoordinates = [x[Math.floor(Math.random() * x.length)], y[Math.floor(Math.random() * y.length)]];
      if (gemLocations.includes(JSON.stringify(gemCoordinates))) {
        i--;
        continue;
      } else {
        gemLocations.push(JSON.stringify(gemCoordinates));
        new Gem(gemCoordinates[0], gemCoordinates[1]);
      }
    }
    main();
  }

  function update(dt) {
    if (!shouldReset) {
      updateEntities(dt);
      checkCollisions();
      if (tick < 50) {
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

  function checkCollisions() {
    let playerWidth = player.x + 18,
      playerHeight = player.y + 64,
      enemyWidth = null,
      enemyHeight = null;
    allEnemies.forEach(function (enemy) {
      enemyWidth = enemy.x + 96;
      enemyHeight = enemy.y + 64;
      if (((playerHeight >= enemy.y) && (playerHeight <= enemyHeight)) && (((playerWidth + 50) >= enemy.x) && ((playerWidth + 10) <= enemyWidth))) {
        shouldReset = true;
      }
    });
    allGems.forEach(function (gem) {
      if (((gem.x >= player.x) && ((gem.x + gem.sprite.width/2) <= player.x + player.sprite.width)) && ((gem.y - 66 >= player.y - 61) && ((gem.y - 29 + gem.sprite.height/2 - 4) <= player.y + player.sprite.height))) {
        gem.kill();
      }
    });
  }

  function updateEntities(dt) {
    if (player.y === 0) {
      document.removeEventListener('keyup', playerInput);
      nextLevel = true;
      music.pause();
      music = new Audio("sounds/doodle.mp3");
      music.play();
    } else {
      allEnemies.forEach(function (enemy) {
        enemy.x <= canvas.width ? enemy.update(dt) : enemy.kill();
      });
    }
  }

  function render() {
    var rowImages = [
        'images/water-block.png', // Row 1 of 1 of water
        'images/stone-block.png', // Row 1 of 4 of water
        'images/stone-block.png', // Row 2 of 4 of stone
        'images/stone-block.png', // Row 3 of 4 of stone
        'images/stone-block.png', // Row 4 of 4 of stone
        'images/grass-block.png', // Row 1 of 2 of grass
        'images/grass-block.png', // Row 2 of 2 of grass
      ],
      row, col;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (row = 0; row < 7; row++) {
      for (col = 0; col < 10; col++) {
        ctx.drawImage(Resources.get(rowImages[row]), col * 100, row * 86 + 25.25);
      }
    }
    renderEntities();
    ctx.font = "44px bold sans-serif";
    ctx.strokeStyle = "black";
    ctx.strokeText("Level: " + global.level, 710, 575);
    ctx.strokeText("Score: " + global.score, 710, 635);
    ctx.font = "44px bold sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText("Level: " + global.level, 710, 575);
    ctx.fillText("Score: " + global.score, 710, 635);
  }

  function renderEntities() {
    allGems.forEach(function (gem) {
      gem.render();
    });

    allEnemies.forEach(function (enemy) {
      enemy.render();
    });
    
    player.render();   
  }

  function levelUp() {
    floor += 5;
    global.level++;
    global.score += 100;
    nextLevel = false;
    startCountdown();
  }

  function startCountdown(hardReset) {
    ctx.font = "48px bold sans-serif";
    countdown = 10;
    canvas.onclick = null;
    shouldReset = false;
    document.removeEventListener('keyup', playerInput);
    hardReset ? (
      div.classList.add("display-none"),
      document.addEventListener('keyup', escapeStart),
      ctx.font = "18px bold sans-serif"
    ) : null;
    interval = setInterval(() => {
      countdown--;
      displayCountdown(countdown);
      scoreBoard.length ? displayScores() : null;
      hardReset ? (
        ctx.font = "18px bold sans-serif",
        ctx.fillText("(Hint: Press ESC to quit the countdown.)", canvas.width / 48 * 16, canvas.height / 4 * 3)
      ) : null;
      !countdown ? endCountdown() : null;
    }, 1000);
    startGame();
  }

  function displayScores() {
    ctx.fillStyle = "black";
    ctx.font = "48px bold sans-serif";
    ctx.fillText("High Scores", canvas.width/8 * 3, canvas.height/6);
    ctx.font = "32px bold sans-serif";
    let y = 20, topEight = scoreBoard.sort((a, b) => b > a).slice(0, 8);
    topEight.slice(0, 4).forEach((score, i) => {
      ctx.fillText((i + 1) + ": " + score + " points", canvas.width/4, canvas.height/4 + y);
      y+=50;
    });
    y = 20;
    topEight.slice(4, 8).forEach((score, i) => {
      ctx.fillText((i + 5) + ": " + score + " points", canvas.width/4 * 2 + 50, canvas.height/4 + y);
      y+=50;
    });
    ctx.drawImage(Resources.get('images/star.png'), canvas.width/5 * 3 + 100, canvas.height/6 - 130);
  }

  function displayCountdown(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time = String(time).length === 1 ? "0" + time : time;
    ctx.font = "48px bold sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText("Countdown: " + time, canvas.width / 3, canvas.height / 3 * 2);
  }

  function endCountdown() {
    document.removeEventListener('keyup', escapeStart);
    document.addEventListener('keyup', playerInput);
    clearInterval(interval);
    interval = null;
    music.pause();
    music = new Audio("sounds/polka.mp3");
    music.loop = true;
    music.play();
  }

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