var App = angular.module('SnakeApp', []);


App.controller('GameController', function ($scope,$interval) {

  borderX = 100;
  borderY = 20;

  snakePos = [[5,4,0,1],[5,5,0,1],[5,6,0,1],[5,7,0,1],[5,8,0,1]];
  snakeTale = [5,3,0,1];
  snakeTurns = [];
  snakeHead = [5,9];
  snakeMoveX = 1;
  snakeMoveY = 0;
  pressedX = 0;
  pressedY = 0;
  fruitX = 20;
  fruitY = 5;
  tickspeed = 100;

  pCounter = 0;

  $scope.output = "";
  $scope.gameOver = false;

  view = [];

  var gRnd = function(min,max)
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  };

  var generateFruit = function()
  {
    fruitX = gRnd(2, borderX - 2);//Math.floor(Math.random() * borderX) + 1 ;
    fruitY = gRnd(2, borderY - 2);//Math.floor(Math.random() * borderY) + 1 ;
  };
  generateFruit();

  $scope.resetGame = function()
  {
    snakePos = [[5,4,0,1],[5,5,0,1],[5,6,0,1],[5,7,0,1],[5,8,0,1]];
    snakeTale = [5,3,0,1];
    snakeTurns = [];
    snakeHead = [5,9];
    snakeMoveX = 1;
    snakeMoveY = 0;
    pressedX = 0;
    pressedY = 0;
    fruitX = 20;
    fruitY = 5;
    generateFruit();

    pCounter = 0;

    $scope.gameOver = false;
    var ticker = $interval(gTick,tickspeed);
  };

  var gTick = function()
  {
    clearView();
    calcSnake();
    hitTest();
    calcView();
  };

  var hitTest = function()
  {
    if(snakeHead[0] < 0 || snakeHead[0] >= borderY || snakeHead[1] < 0 || snakeHead[1] >= borderX)
    {
      $scope.gameOver = true;
      $interval.cancel(ticker);
    }

    for(var i = 0; i < snakePos.length; i++)
    {
      if(snakePos[i][0] == snakeHead[0] && snakePos[i][1] == snakeHead[1])
      {
        $scope.gameOver = true;
        $interval.cancel(ticker);
      }
      for(var b = 0; b < snakePos.length; b++)
      {
        if(b !== i && (snakePos[i][0] == snakePos[b][0] && snakePos[i][1] == snakePos[b][1]))
        {
          $scope.gameOver = true;
          $interval.cancel(ticker);
        }
      }
    }

    if(snakeHead[0] == fruitY && snakeHead[1] == fruitX)
    {
      calcEaten();
    }
  };

  var calcSnake = function()
  {
    if(pressedY !== 0 || pressedX !== 0)
    {
      snakeMoveY = pressedY;
      snakeMoveX = pressedX;
      snakeTurns.push([snakeHead[0],snakeHead[1],pressedY,pressedX]);
    }

    for(var i = 0; i < snakePos.length; i++)
    {
      snakePos[i][0] += snakePos[i][2];
      snakePos[i][1] += snakePos[i][3];
      view[snakePos[i][0]][snakePos[i][1]] = "#";

      for(var b = 0; b < snakeTurns.length; b++)
      {
        if(snakePos[i][0] == snakeTurns[b][0] && snakePos[i][1] == snakeTurns[b][1])
        {
          snakePos[i][2] = snakeTurns[b][2];
          snakePos[i][3] = snakeTurns[b][3];
        }
      }
    }

    snakeTale[0] = snakeTale[0] + snakeTale[2];
    snakeTale[1] = snakeTale[1] + snakeTale[3];
    for(var b = 0; b < snakeTurns.length; b++)
    {
      if(snakeTale[0] == snakeTurns[b][0] && snakeTale[1] == snakeTurns[b][1])
      {
        snakeTale[2] = snakeTurns[b][2];
        snakeTale[3] = snakeTurns[b][3];
        snakeTurns.splice(b,1)
      }
    }

    view[snakeTale[0]][snakeTale[1]] = "+";

    snakeHead[0] += snakeMoveY;
    snakeHead[1] += snakeMoveX;
    view[snakeHead[0]][snakeHead[1]] = "S";

    pressedX = 0;
    pressedY = 0;
  };

  var calcEaten = function()
  {
    snakePos.push([snakeTale[0],snakeTale[1],snakeTale[2],snakeTale[3]]);
    snakeTale[0] = snakeTale[0] - snakeTale[2];
    snakeTale[1] = snakeTale[1] - snakeTale[3];

    generateFruit();
    pCounter++;
  };

  var clearView = function()
  {
    for(var y = -1; y <= borderY; y++)
    {
      view[y] = [];
      for(var x = -1; x <= borderX; x++)
      {
        view[y][x] = " ";
      }
    }
  }

  var calcView = function()
  {
    var tOutput = "";

    view[fruitY][fruitX] = "*";
    tOutput = "Eaten: " + pCounter + "\n";
    for(var y = -1; y < borderY +1; y++)
    {
      tOutput += "X";
      for(var x = 0; x < borderX; x++)
      {
        if(y == -1 || y == borderY)
        {
          tOutput += "X";
        }
        else
        {
          tOutput += view[y][x];
        }
      }
      tOutput += "X\n";
    }

    $scope.output = tOutput;
  };

  $scope.keyDown = function(ev)
  {
    if(ev.keyCode == 37 && snakeMoveX == 0)
      pressedX = -1;
    if(ev.keyCode == 38 && snakeMoveY == 0)
      pressedY = -1;
    if(ev.keyCode == 39 && snakeMoveX == 0)
      pressedX = 1;
    if(ev.keyCode == 40 && snakeMoveY == 0)
      pressedY = 1;
  }


  var ticker = $interval(gTick,tickspeed);
});
