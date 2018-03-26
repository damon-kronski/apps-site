var App = angular.module('SnakeApp', []);


App.controller('GameController', function ($scope,$interval) {

  /*
    Cord = line,pos
  */

  /* SETTINGS */
  var borderChar = "@";
  var blockChar = "#";
  var groundChar = "X";
  var blockForms =
  [
    [[1,1],[2,1],[3,1],[4,1]], // I
    [[1,1],[2,1],[3,1],[3,2]], // L
    [[1,2],[2,2],[3,2],[3,1]], // J
    [[1,1],[2,1],[2,2],[3,2]], // S
    [[1,2],[2,2],[2,1],[3,1]], // Z
    [[1,1],[1,2],[2,1],[2,2]], // O
    [[1,1],[1,2],[1,3],[2,2]], // T
  ];
  //var blockForms =[[[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10]]];

  /* VARIABLES */

  var borderX = 30;
  var borderY = 30;
  var pCounter = 0;

  var stepJump = 0;

  var moveX = 0;
  var moveY = 0;

  var currentBlock = [];
  var currentBlockPos = [0,12];
  var groundedBlocks = [];

  $scope.output = "";
  $scope.gameOver = false;

  sortedGround = [];
  view = [];

  $scope.resetGame = function()
  {
    $scope.gameOver = false;
    stepJump = 0;
    moveX = 0;
    moveY = 0;
    groundedBlocks = [];
    pCounter = 0;
    makeBlock();
    var ticker = $interval(gTick,100);
  };

  var rotateRight = function()
  {
    var tPos = [];

    for(var i = 0; i < currentBlock.length; i++)
    {
      var q = tPos.length;
      tPos[q] = [];
      tPos[q][0] = currentBlock[i][1];
      tPos[q][1] = currentBlock[i][0];
    }
    currentBlock = mirrorBlockH(tPos);
  };

  var rotateLeft = function()
  {
    var tPos = [];

    for(var i = 0; i < currentBlock.length; i++)
    {
      var q = tPos.length;
      tPos[q] = [];
      tPos[q][0] = currentBlock[i][1];
      tPos[q][1] = currentBlock[i][0];
    }
    currentBlock = mirrorBlockV(tPos);
  };

  var mirrorBlockV = function(bl)
  {
    var tPos = [];
    var maxL = 0;

    for(var i = 0; i < bl.length; i++)
    {
      if(bl[i][0] > maxL)
        maxL = bl[i][0];
    }

    for(var i = 0; i < bl.length; i++)
    {
      var q = tPos.length;
      tPos[q] = [];
      tPos[q][0] = maxL - bl[i][0];
      tPos[q][1] = bl[i][1];
    }
    return tPos;
  };


  var mirrorBlockH = function(bl)
  {
    var tPos = [];
    var maxL = 0;

    for(var i = 0; i < bl.length; i++)
    {
      if(bl[i][1] > maxL)
        maxL = bl[i][1];
    }

    for(var i = 0; i < bl.length; i++)
    {
      var q = tPos.length;
      tPos[q] = [];
      tPos[q][0] = bl[i][0];
      tPos[q][1] = maxL - bl[i][1];
    }
    return tPos;
  };

  var gTick = function()
  {
    clearView();
    renderBlock();
    renderGround();
    checkEnd();
    checkPoints();
    renderView();
    moveX = 0;
    moveY = 0;
  };

  var clearSortedGround = function()
  {
    for(var y = -1; y <= borderY; y++)
    {
      sortedGround[y] = [];
      for(var x = -1; x <= borderX; x++)
      {
        sortedGround[y][x] = "";
      }
    }
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

  var renderView = function()
  {
    var tOutput = "";

    tOutput = "Points: " + pCounter + "\n";
    for(var y = -1; y < borderY +1; y++)
    {
      tOutput += borderChar;
      for(var x = 0; x < borderX; x++)
      {
        if(y == -1 || y == borderY)
        {
          tOutput += borderChar;
        }
        else
        {
          tOutput += view[y][x];
        }
      }
      tOutput += borderChar +"\n";
    }
	
	tOutput += "\nKeys:\nA=Left D=Right S=Down\nQ=Turn Left E=Turn Right";

    $scope.output = tOutput;
  };

  $scope.keyDown = function(ev)
  {
    // A
    if(ev.keyCode == 65 && checkSide(-1))
      moveX = -1;
    // D
    if(ev.keyCode == 68 && checkSide(1))
      moveX = 1;
    // S
    if(ev.keyCode == 83)
      moveY = 1;
    // E
    if(ev.keyCode == 69)
      rotateRight();
    // Q
    if(ev.keyCode == 81)
      rotateLeft();
  };

  var makeBlock = function()
  {
    for(var i = 0; i < currentBlock.length; i++)
    {
      var q = groundedBlocks.length;
      groundedBlocks[q] = [];
      groundedBlocks[q][0] = currentBlockPos[0] + currentBlock[i][0];
      groundedBlocks[q][1] = currentBlockPos[1] + currentBlock[i][1];
    }

    currentBlockPos = [0,12];
    var bId = Math.floor((Math.random() * blockForms.length) + 1) -1;
    currentBlock = blockForms[bId];
  };

  var renderGround = function()
  {
    clearSortedGround();
    for(var i = 0; i < groundedBlocks.length; i++)
    {
      sortedGround[groundedBlocks[i][0]][groundedBlocks[i][1]] = groundChar;
      view[groundedBlocks[i][0]][groundedBlocks[i][1]] = groundChar;
    }

  };

  var checkPoints = function()
  {
    var cLine = 0;
    groundedBlocks = [];

    for(var y = borderY - 1; y >= 0; y--)
    {
      var pLine = 0;
      var tempLine = [];

      for(var x = 0; x < borderX; x++)
      {
        if(sortedGround[y][x] == groundChar)
        {
          pLine++;
          var q = tempLine.length;
          tempLine[q] = [];
          tempLine[q][0] = y + cLine;
          tempLine[q][1] = x;
        }
      }

      if(pLine >= borderY)
      {
        pCounter += 100;
        cLine++;
      }
      else
      {
        for(var i = 0; i < tempLine.length; i++)
        {
          var q = groundedBlocks.length;
          groundedBlocks[q] = [];
          groundedBlocks[q][0] = tempLine[i][0];
          groundedBlocks[q][1] = tempLine[i][1];
        }
      }
    }

  };

  var renderBlock = function()
  {
    if(checkHit())
      makeBlock();

    stepJump++;
    if(stepJump == 3 || moveY >= 1)
    {
      stepJump = 0;
      currentBlockPos[0]++;
    }

    currentBlockPos[1] += moveX;

    for(var i = 0; i < currentBlock.length; i++)
    {
      view[currentBlockPos[0] + currentBlock[i][0]][currentBlockPos[1] + currentBlock[i][1]] = blockChar;
    }

  };

  var checkHit = function()
  {
    var res = false;
    for(var i = 0; i < currentBlock.length; i++)
    {
      var nextY = currentBlockPos[0] + currentBlock[i][0] + 1;
      var nextX = currentBlockPos[1] + currentBlock[i][1];
      // Check Ground
      if(nextY >= borderY)
        res = true;

      for(var q = 0; q < groundedBlocks.length; q++)
      {
        if(nextY == groundedBlocks[q][0] && nextX == groundedBlocks[q][1])
          res = true;
      }
    }
    return res;
  }

  var checkEnd = function()
  {
    for(var q = 0; q < groundedBlocks.length; q++)
    {
      if(groundedBlocks[q][0] <= 1)
      {
        $scope.gameOver = true;
        $interval.cancel(ticker);
      }
    }
  }

  var checkSide = function(t)
  {
    res = true;
    for(var i = 0; i < currentBlock.length; i++)
    {
      var nextY = currentBlockPos[0] + currentBlock[i][0];
      var nextX = currentBlockPos[1] + currentBlock[i][1] + t;

      if(nextX >= borderX || nextX < 0)
        res = false;

      for(var q = 0; q < groundedBlocks.length; q++)
      {
        if(nextY == groundedBlocks[q][0] && nextX == groundedBlocks[q][1])
          res = false;
      }
    }
    return res;
  }

  makeBlock();

  var ticker = $interval(gTick,100);
});
