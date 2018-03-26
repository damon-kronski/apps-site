var App = angular.module('NHApp', ['ngCookies']);


App.controller('GameController', function ($scope,$interval) {

  $scope.cHeight = 11;
  $scope.cLand = 6;
  $scope.cWidth = 120;
  $scope.hitTime = 8;
  // 2622 -> Atom; 2744 -> Snow; 00A1 -> Upside !; 2588 -> Block; 262F -> Yin Yang;
  // 203D -> ?!; 2591 - 93 -> shades; 2584 -> half block; 25B2 -> triangles
  // 2623 -> BIOHAZARD; 2690 -> White Flag; 2691 -> black flag; 26F3 -> Flag in Hole
  // 2039 -> Left; 203A Right
  // 290E -> Left; 290F Right
  $scope.cPlayerS = "@";
  $scope.cPlayerSHit = "#";
  $scope.cLandS = "\u2588";
  $scope.cEndS = "\u203D";
  $scope.cEnemySL = "\u2039";
  $scope.cEnemySR = "\u203A";
  $scope.lifeS = "\u2665";

  $scope.rounds = 0;
  $scope.lives = 3;
  $scope.lastHit = 0;
  $scope.posMoved = false;
  $scope.playerPosX = 0;
  $scope.playerPosY = 3;
  $scope.posJumped = false;
  $scope.enemies = new Array();
  $scope.lifePowerups = new Array();

  $scope.finished = false;
  $scope.lost = false;

  var kR = false;
  var kU = false;
  var kL = false;

  $scope.consoleOut = function()
  {
    return $scope.generateLand();
  };

  $scope.land = new Array($scope.cWidth);

  $scope.calcOut = function()
  {
    $scope.calcEnemies();
    $scope.posMoved = false;

    if($scope.lastHit > 0)
    {
      $scope.lastHit--;
    }

    if(!$scope.checkGround())
    {
      $scope.playerPosX++;
    }

    $scope.calcMove();

    if($scope.checkGround())
    {
      $scope.posJumped = false;
    }

    if($scope.checkEnd())
    {
      $interval.cancel(inter);
      $scope.rounds += 1;
      $scope.restartGame();
    }

    if($scope.checkLife())
    {
      $scope.lifePowerups = new Array();
      $scope.lives++;
    }

    if($scope.checkDead())
    {
      if($scope.lastHit == 0)
      {
        $scope.lives--;
        $scope.lastHit = $scope.hitTime;
      }

      if($scope.lives == 0)
      {
        $scope.lives = 3;
        $scope.rounds = 0;
        $interval.cancel(inter);
        $scope.lost = true;
      }
    }

    var res = "";


    res = res + "Rounds: " + $scope.rounds + " Lives: ";

    for(var l = 0; l < $scope.lives; l++)
      res = res + $scope.lifeS;

    res = res + "\n";

    for(x = 0; x < ($scope.cHeight + 1); x++)
    {
      res = res + $scope.cLandS;
      for(y = 0; y < $scope.cWidth; y++)
      {

          if(x == $scope.playerPosX && y == $scope.playerPosY)
          {
            if($scope.lastHit == 0)
              res = res + $scope.cPlayerS;
            else
              res = res + $scope.cPlayerSHit;
          }
          else
          {
            if(x == $scope.cHeight)
            {
              res = res + $scope.cLandS;
            }
            else
            {
              var vEnT = false;
              for(var i = 0; i < $scope.enemies.length; i++)
              {
                var vEn = $scope.enemies[i];

                if(x == vEn[1] && y == vEn[2])
                {
                  res = res + vEn[0];
                  vEnT = true;
                  break;
                }
              }

              for(var i = 0; i < $scope.lifePowerups.length; i++)
              {
                var vEn = $scope.lifePowerups[i];

                if(x == vEn[1] && y == vEn[2] && !vEnT)
                {
                  res = res + vEn[0];
                  vEnT = true;
                  break;
                }
              }

              if(!vEnT)
              {
                if($scope.land[y][x] == null)
                  res = res + " ";
                else
                  res = res + $scope.land[y][x];
              }
            }

        }
      }

      res = res + $scope.cLandS +"\n";
    }

    res = res + "\nGet the " + $scope.cPlayerS + " to the " + $scope.cEndS + " but be carefull around the " + $scope.cEnemySL;
    $scope.consoleOut = res;

  };

  $scope.calcEnemies = function()
  {
    for(var i = 0; i < $scope.enemies.length; i++)
    {
      var vEn = $scope.enemies[i];
      if(vEn[3] == true)
      {
        $scope.enemies[i][0] = $scope.cEnemySR;
        if(vEn[2]+1 < $scope.cWidth && vEn[2] >= 0)
        {
         if($scope.land[vEn[2]+1][vEn[1]+1] == $scope.cLandS && $scope.land[vEn[2]+1][vEn[1]] != $scope.cLandS)
          {
            $scope.enemies[i][2] += 1;
          }
          else
          {
            $scope.enemies[i][3] = false;
          }
        }
        else
        {
          $scope.enemies[i][3] = false;
        }
      }
      else
      {
        $scope.enemies[i][0] = $scope.cEnemySL;
        if(vEn[2]+1 < $scope.cWidth && vEn[2] > 0)
        {
          if($scope.land[vEn[2]-1][vEn[1]+1] == $scope.cLandS && $scope.land[vEn[2]-1][vEn[1]] != $scope.cLandS)
          {
            $scope.enemies[i][2] -= 1;
          }
          else
          {
            $scope.enemies[i][3] = true;
          }
        }
        else
        {
          $scope.enemies[i][3] = true;
        }
      }
    }
  }

  $scope.checkLife = function()
  {
    for(var i = 0; i < $scope.lifePowerups.length; i++)
    {
      var vEn = $scope.lifePowerups[i];
      if(vEn[1] == $scope.playerPosX && vEn[2] == $scope.playerPosY)
        return true;
    }
    return false;
  }

  $scope.checkDead = function()
  {
    for(var i = 0; i < $scope.enemies.length; i++)
    {
      var vEn = $scope.enemies[i];
      if(vEn[1] == $scope.playerPosX && vEn[2] == $scope.playerPosY)
        return true;
    }
    return false;
  }

  $scope.calcMove = function()
  {
    if(!$scope.posJumped)
    {
      if(kU)
      {
        //jump
        $scope.playerPosX -= 3;
        $scope.posJumped = true;
      }
    }
    if(!$scope.posMoved || !$scope.checkGround())
    {
      if(kR)
      {
        //right
        if(!$scope.checkRight())
        {
          $scope.playerPosY += 1;
          $scope.posMoved = true;
        }
      }
      if(kL)
      {
        //left
        if(!$scope.checkLeft())
        {
          $scope.playerPosY -= 1;
          $scope.posMoved = true;
        }
      }
    }
  }

  $scope.keyDown = function(ev)
  {
    if(ev.keyCode == 37)
      kL = true;
    if(ev.keyCode == 38)
      kU = true;
    if(ev.keyCode == 39)
      kR = true;
  }

  $scope.keyUp = function(ev)
  {
    if(ev.keyCode == 37)
      kL = false;
    if(ev.keyCode == 38)
      kU = false;
    if(ev.keyCode == 39)
      kR = false;

    if($scope.lost || $scope.finished)
    {
      $scope.restartGame();
    }
  }

  $scope.checkEnd = function()
  {
    if($scope.land[$scope.playerPosY][$scope.playerPosX] == $scope.cEndS)
      return true;
    else
      return false;
  }

  $scope.checkGround = function()
  {
    if($scope.land[$scope.playerPosY][$scope.playerPosX + 1] == $scope.cLandS)
      return true;
    else
      return false;
  }

  $scope.checkRight = function()
  {
    if($scope.land[$scope.playerPosY+1][$scope.playerPosX] == $scope.cLandS)
      return true;
    else
      return false;
  }

  $scope.checkLeft = function()
  {
    if($scope.land[$scope.playerPosY-1][$scope.playerPosX] == $scope.cLandS)
      return true;
    else
      return false;
  }

  $scope.generateLand = function()
  {
    var startPnt = $scope.cHeight - $scope.getRandom(1,$scope.cLand);
    $scope.land[0,startPnt] = "X";
    var lastPnt = startPnt;

    for(var i = 0; i < $scope.cWidth; i++)
    {
      $scope.land[i] = new Array($scope.cHeight);
      var m = $scope.getRandom(1,5);
      if(m > 4)
      {
        if(lastPnt < $scope.cHeight)
        {
          lastPnt += 1;
        }
      }
      else if(m < 2)
      {
        if(lastPnt >= $scope.cHeight - $scope.cLand)
        {
          lastPnt -= 1;
        }
      }

      $scope.land[i][lastPnt] = $scope.cLandS;
      $scope.fillLand(i,lastPnt);

      if(i + 2 == $scope.cWidth)
      {
        $scope.land[i][lastPnt-1] = $scope.cEndS;
      }
    }


    $scope.generateEnemies();
    $scope.generateLifePower();

  };

  $scope.generateLifePower = function()
  {
    if($scope.getRandom(0,10) < 9)
      $scope.lifePowerups = new Array(0);
    else
      $scope.lifePowerups = new Array(1);
    for(var c = 0; c < $scope.lifePowerups.length; c++)
    {
      $scope.lifePowerups[c] = new Array(3);
      $scope.lifePowerups[c][0] = $scope.lifeS;
      $scope.lifePowerups[c][2] = $scope.getRandom(5,$scope.cWidth - 5);
      var vEH = 0;
      for(var i = 0; i < $scope.cHeight; i++)
        if($scope.land[$scope.lifePowerups[c][2]][i] != $scope.cLandS)
          vEH = i
      $scope.lifePowerups[c][1] = vEH;
    }
  }

  $scope.generateEnemies = function()
  {
    $scope.enemies = new Array($scope.getRandom(1,7));
    for(var c = 0; c < $scope.enemies.length; c++)
    {
      $scope.enemies[c] = new Array(4);
      $scope.enemies[c][0] = $scope.cEnemySL;
      $scope.enemies[c][2] = $scope.getRandom(5,$scope.cWidth - 5);
      var vEH = 0;
      for(var i = 0; i < $scope.cHeight; i++)
        if($scope.land[$scope.enemies[c][2]][i] != $scope.cLandS)
          vEH = i
      $scope.enemies[c][1] = vEH;
      $scope.enemies[c][3] = false;
    }
  }

  $scope.fillLand = function(vLine, vFrom)
  {
    for(var i = vFrom;i<$scope.cHeight; i++)
    {
      $scope.land[vLine][i] = $scope.cLandS;
    }
  }

  $scope.getRandom = function(vMin,vMax){
    return Math.floor((Math.random()*vMax)+vMin);
  }

  $scope.restartGame = function()
  {
    $scope.lastHit = 0;
    $scope.posMoved = false;
    $scope.playerPosX = 0;
    $scope.playerPosY = 3;
    $scope.posJumped = false;
    $scope.enemies = new Array();

    $scope.finished = false;
    $scope.lost = false;

    $scope.generateLand();
    inter = $interval($scope.calcOut,100);
  }

  $scope.generateLand();
  inter = $interval($scope.calcOut,100);
});
