document.addEventListener('DOMContentLoaded', () => {
  let grid = document.querySelector('.grid');
  let pacman = document.createElement('div');
  let gameOver = false;
  let pacmanLeftSpace = 1;
  let pacmanBottomSpace = 178;
  let enemyLeftSpace = 360;
  let enemyBottomSpace = 7;
  let platformsLeftPositions = [17, 77, 177, 262, 312];
  let platformsBottomPositions = 140;
  let platformsWidth = [40, 80, 60, 30, 40];
  let platforms = [];
  let rightTimerId, downTimerId, leftTimerId, upTimerId;
  let rightTimerEnemyId, downTimerEnemyId, leftTimerEnemyId, upTimerEnemyId;
  let isGoingLeft = false;
  let isGoingRight = false;
  let isGoingUp = false;
  let isGoingDown = false;
  let isEnemyGoingLeft = false;
  let isEnemyGoingRight = false;
  let isEnemyGoingUp = false;
  let isEnemyGoingDown = false;
  let numberOfEnemeies = 1;
  let enemies = [];

  class Platform {
    constructor(left, bottom, width, height) {
      this.visual = document.createElement('div');
      this.left = left;
      this.bottom = bottom;
      this.width = width;
      this.height = height;

      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      visual.style.width = this.width + 'px';
      visual.style.height = this.height + 'px';
      grid.appendChild(visual);
    }
  }

  function drawingHorizontalPlatfors() {
    let lines = 0;
    while (lines < 5) {
      for (let i = 0; i < platformsLeftPositions.length; i++) {
        let platform = new Platform(
          platformsLeftPositions[i],
          platformsBottomPositions,
          platformsWidth[i],
          10
        );
        platforms.push(platform);
      }
      platformsBottomPositions -= 30;
      lines++;
    }
  }
  function drawingVerticalPlatfors() {
    let platform;
    let l = platforms.length;

    for (let i = 0; i < l; i++) {
      if (i % 3 === 0) {
        platform = new Platform(
          platforms[i].left + platforms[i].width - 10,
          platforms[i].bottom,
          10,
          35
        );
      } else if (i % 2 === 0) {
        platform = new Platform(platforms[i].left, platforms[i].bottom, 10, 35);
      }

      platform ? platforms.push(platform) : null;
    }
  }

  function createPacman() {
    grid.appendChild(pacman);
    pacman.classList.add('pacman');
    pacman.style.left = pacmanLeftSpace + 'px';
    pacman.style.bottom = pacmanBottomSpace + 'px';
  }

  function createFood() {
    console.log(platforms);
    console.log(pacmanLeftSpace);
    console.log(pacmanBottomSpace);
  }

  function createEnemies(num) {
    for (let i = 0; i < num; i++) {
      let enemy = document.createElement('div');
      grid.appendChild(enemy);
      enemy.classList.add(`enemy`);
      enemy.style.left = enemyLeftSpace + i * 15 + 'px';
      enemy.style.bottom = enemyBottomSpace + 'px';
      enemies.push(enemy);

      enemyMoveLeft(enemy);
    }
  }

  function moveRight() {
    if (isGoingLeft) {
      isGoingLeft = false;
      clearInterval(leftTimerId);
    } else if (isGoingUp) {
      isGoingUp = false;
      clearInterval(upTimerId);
    } else if (isGoingDown) {
      isGoingDown = false;
      clearInterval(downTimerId);
    }
    rightTimerId = setInterval(() => {
      isGoingRight = true;
      pacmanLeftSpace += 4;
      pacman.style.left = pacmanLeftSpace + 'px';

      checkForCollision(pacmanBottomSpace, pacmanLeftSpace);
    }, 65);
  }

  function moveDown() {
    if (isGoingLeft) {
      isGoingLeft = false;
      clearInterval(leftTimerId);
    } else if (isGoingUp) {
      isGoingUp = false;
      clearInterval(upTimerId);
    } else if (isGoingRight) {
      isGoingRight = false;
      clearInterval(rightTimerId);
    }
    downTimerId = setInterval(() => {
      isGoingDown = true;
      pacmanBottomSpace -= 4;
      pacman.style.bottom = pacmanBottomSpace + 'px';

      checkForCollision(pacmanBottomSpace, pacmanLeftSpace);
    }, 65);
  }

  function moveLeft() {
    if (isGoingRight) {
      isGoingRight = false;
      clearInterval(rightTimerId);
    } else if (isGoingUp) {
      isGoingUp = false;
      clearInterval(upTimerId);
    } else if (isGoingDown) {
      isGoingDown = false;
      clearInterval(downTimerId);
    }
    leftTimerId = setInterval(() => {
      isGoingLeft = true;
      pacmanLeftSpace -= 4;
      pacman.style.left = pacmanLeftSpace + 'px';

      checkForCollision(pacmanBottomSpace, pacmanLeftSpace);
    }, 65);
  }

  function moveUp() {
    if (isGoingLeft) {
      isGoingLeft = false;
      clearInterval(leftTimerId);
    } else if (isGoingRight) {
      isGoingRight = false;
      clearInterval(rightTimerId);
    } else if (isGoingDown) {
      isGoingDown = false;
      clearInterval(downTimerId);
    }
    upTimerId = setInterval(() => {
      isGoingUp = true;
      pacmanBottomSpace += 4;
      pacman.style.bottom = pacmanBottomSpace + 'px';

      checkForCollision(pacmanBottomSpace, pacmanLeftSpace);
    }, 65);
  }

  function enemyMoveRight(enemy) {
    if (isEnemyGoingLeft) {
      isEnemyGoingLeft = false;
      clearInterval(leftTimerEnemyId);
    } else if (isEnemyGoingUp) {
      isEnemyGoingUp = false;
      clearInterval(upTimerEnemyId);
    } else if (isEnemyGoingDown) {
      isEnemyGoingDown = false;
      clearInterval(downTimerEnemyId);
    }

    rightTimerEnemyId = setInterval(() => {
      isEnemyGoingRight = true;
      enemyLeftSpace += 4;
      enemy.style.left = enemyLeftSpace + 'px';

      for (let i = 0; i < platformsLeftPositions.length; i++) {
        if (enemyLeftSpace === platformsLeftPositions[i] - 15) {
          enemyMoveUp(enemy);
        }
      }

      let collision = checkEnemyForCollision(enemyBottomSpace, enemyLeftSpace);
      if (collision) {
        console.log(pacmanLeftSpace, pacmanBottomSpace, 'PACMAN');
        console.log(enemyLeftSpace, enemyBottomSpace, 'ENEMY');
        enemyMoveLeft(enemy);
      }
    }, 50);
  }
  function enemyMoveUp(enemy) {
    if (isEnemyGoingLeft) {
      isEnemyGoingLeft = false;
      clearInterval(leftTimerEnemyId);
    } else if (isEnemyGoingRight) {
      isEnemyGoingRight = false;
      clearInterval(rightTimerEnemyId);
    } else if (isEnemyGoingDown) {
      isEnemyGoingDown = false;
      clearInterval(downTimerEnemyId);
    }

    upTimerEnemyId = setInterval(() => {
      isEnemyGoingUp = true;
      enemyBottomSpace += 4;
      enemy.style.bottom = enemyBottomSpace + 'px';

      let collision = checkEnemyForCollision(enemyBottomSpace, enemyLeftSpace);

      console.log(collision);

      if (collision) {
        enemyBottomSpace -= 6;
        enemyMoveLeft(enemy);
      }
    }, 50);
  }

  function enemyMoveDown(enemy) {
    if (isEnemyGoingLeft) {
      isEnemyGoingLeft = false;
      clearInterval(leftTimerEnemyId);
    } else if (isEnemyGoingUp) {
      isEnemyGoingUp = false;
      clearInterval(upTimerEnemyId);
    } else if (isEnemyGoingRight) {
      isEnemyGoingRight = false;
      clearInterval(rightTimerEnemyId);
    }
    downTimerEnemyId = setInterval(() => {
      isEnemyGoingDown = true;
      enemyBottomSpace -= 4;
      enemy.style.bottom = enemyBottomSpace + 'px';

      checkEnemyForCollision(enemyBottomSpace, enemyLeftSpace);
    }, 50);
  }

  function enemyMoveLeft(enemy) {
    if (isEnemyGoingRight) {
      isEnemyGoingRight = false;
      clearInterval(rightTimerEnemyId);
    } else if (isEnemyGoingUp) {
      isEnemyGoingUp = false;
      clearInterval(upTimerEnemyId);
    } else if (isEnemyGoingDown) {
      isEnemyGoingDown = false;
      clearInterval(downTimerEnemyId);
    }
    leftTimerEnemyId = setInterval(() => {
      isEnemyGoingLeft = true;
      enemyLeftSpace -= 4;
      enemy.style.left = enemyLeftSpace + 'px';

      for (let i = 0; i < platformsLeftPositions.length; i++) {
        if (enemyLeftSpace === platformsLeftPositions[i] - 16) {
          enemyMoveUp(enemy);
        }
      }

      let collision = checkEnemyForCollision(enemyBottomSpace, enemyLeftSpace);

      if (collision) {
        enemyLeftSpace += 4;
        enemyMoveDown(enemy);
      }
    }, 50);
  }

  function control(e) {
    if (e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      moveUp();
    } else if (e.key === 'ArrowDown') {
      moveDown();
    }
  }

  function checkEnemyForCollision(playerBottomSpace, playerLeftSpace) {
    let collision = false;

    if (enemyBottomSpace <= 0) {
      isEnemyGoingDown = false;
      clearInterval(downTimerEnemyId);
      collision = true;
    }
    if (enemyLeftSpace <= 0) {
      isEnemyGoingLeft = false;
      clearInterval(leftTimerEnemyId);
      collision = true;
    }
    if (enemyLeftSpace >= 360) {
      isEnemyGoingRight = false;
      clearInterval(rightTimerEnemyId);
      collision = true;
    }
    if (enemyBottomSpace >= 182) {
      isEnemyGoingUp = false;
      clearInterval(upTimerEnemyId);
      collision = true;
    }

    collision = isThereCollision(playerLeftSpace, playerBottomSpace, collision);

    if (collision) {
      isEnemyGoingLeft = false;
      isEnemyGoingUp = false;
      isEnemyGoingDown = false;
      isEnemyGoingRight = false;
      clearInterval(leftTimerEnemyId);
      clearInterval(rightTimerEnemyId);
      clearInterval(upTimerEnemyId);
      clearInterval(downTimerEnemyId);
    }
    return collision;
  }

  function checkForCollision(playerBottomSpace, playerLeftSpace) {
    if (playerBottomSpace <= 0) {
      isGoingDown = false;
      clearInterval(downTimerId);
    }
    if (playerLeftSpace <= 0) {
      isGoingLeft = false;
      clearInterval(leftTimerId);
    }
    if (playerLeftSpace >= 360) {
      isGoingRight = false;
      clearInterval(rightTimerId);
    }
    if (playerBottomSpace >= 182) {
      isGoingUp = false;
      clearInterval(upTimerId);
    }
    let collision = false;

    collision = isThereCollision(playerLeftSpace, playerBottomSpace, collision);

    if (collision) {
      isGoingLeft = false;
      isGoingUp = false;
      isGoingDown = false;
      isGoingRight = false;
      clearInterval(leftTimerId);
      clearInterval(rightTimerId);
      clearInterval(upTimerId);
      clearInterval(downTimerId);
    }
    return collision;
  }

  function isThereCollision(playerLeftSpace, playerBottomSpace, collision) {
    platforms.forEach((platform) => {
      if (
        playerLeftSpace < platform.left + platform.width + 2 &&
        playerLeftSpace + 12 > platform.left &&
        playerBottomSpace < platform.bottom + platform.height + 2 &&
        playerBottomSpace + 12 > platform.bottom
      ) {
        collision = true;
      }
    });
    return collision;
  }

  function start() {
    if (!gameOver) {
      drawingHorizontalPlatfors();
      drawingVerticalPlatfors();
      createPacman();
      createEnemies(numberOfEnemeies);
      createFood();
      document.addEventListener('keyup', control);
    }
  }

  start();
});
