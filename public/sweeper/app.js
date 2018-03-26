var app = angular.module("msApp", []); 

app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

app.controller("msCtrl", function($scope) {
	var fields = 10;
	var mines = 14;
	$scope.dificulties = {selected:{name:'Medium',factor:1.6},options:[{name:'Hard',factor:2.5},{name:'Medium',factor:1.6},{name:'Easy',factor:1.0}]};
	$scope.sizes = {selected:{name:'Medium',factor:1.6},options:[{name:'Big',factor:2.5},{name:'Medium',factor:1.6},{name:'Small',factor:1}]};
	$scope.mineSymbol = "*";
	var emptySymbol = "-";
	$scope.stateWon = "Won!";
	$scope.stateLost = "Lost!";
	$scope.stateLoad = "Loading...";
	$scope.state = $scope.stateLoad;
	$scope.score = 0;

	var clearCells = function()
	{
		$scope.cells = new Array(fields);
		$scope.openCells = new Array(fields);
		$scope.markedCells = new Array(fields);
		for(x = 0; x < fields; x++)
		{
			$scope.cells[x]=new Array(fields);
			$scope.openCells[x]=new Array(fields);
			$scope.markedCells[x]=new Array(fields);
			for(y = 0; y < fields; y++)
			{
				$scope.cells[x][y]=emptySymbol;
				$scope.openCells[x][y]=false;
				$scope.markedCells[x][y]=false;
			}
		}
	};
	
	var setMines = function()
	{
		var x,y;
		for(i = 0; i < mines; i++)
		{
			do{
				x = rndm(0,fields - 1);
				y = rndm(0,fields - 1);
			}
			while(checkMine(x,y));
			$scope.cells[x][y] = $scope.mineSymbol;
		}
	};
	
	var checkMine = function(x,y)
	{
		return $scope.cells[x][y]==$scope.mineSymbol;
	};
	
	var rndm = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	var calcNumbers = function()
	{
		for(x = 0; x < fields; x++)
		{
			for(y = 0; y < fields; y++)
			{
				var f = calcCell(x,y);
				if(checkMine(x,y) == false)
				{$scope.cells[x][y]=f;}
			}
		}
	};
	
	var calcCell = function(x,y)
	{
		var f = 0;
		if(x > 0){f += getMCell(x-1,y);};
		if(x < fields - 1){f += getMCell(x+1,y);};
		if(y > 0){f += getMCell(x,y-1);};
		if(y < fields - 1){f += getMCell(x,y+1);};
		
		
		if(x > 0 && y > 0){f += getMCell(x-1,y-1);};
		if(x > 0 && y < fields - 1){f += getMCell(x-1,y+1);};
		if(x < fields -1 && y < fields - 1){f += getMCell(x+1,y+1);};
		if(x < fields -1 && y > 0){f += getMCell(x+1,y-1);};
		
		if(f > 0){return f;}else{return emptySymbol;};
	}
	
	var openClearCell = function(x,y)
	{
		var f = 0;
		if(x > 0){f += getOCell(x-1,y);};
		if(x < fields - 1){f += getOCell(x+1,y);};
		if(y > 0){f += getOCell(x,y-1);};
		if(y < fields - 1){f += getOCell(x,y+1);};
		
		
		return f > 0;
	}
	
	var getOCell = function(x,y)
	{
		return $scope.openCells[x][y] && $scope.cells[x][y] == emptySymbol ? 1 : 0;
	}
	
	
	var getMCell = function(x,y)
	{
		return checkMine(x,y) ? 1 : 0;
	}
	
	$scope.btnClick = function(x,y)
	{
		$scope.state = $scope.stateLoad;
		$scope.openCells[x][y]=true;
		if($scope.cells[x][y] == $scope.mineSymbol)
		{
			$scope.state = $scope.stateLost;
		}
		else
		{
			if($scope.cells[x][y] == emptySymbol)
			{
				openUp(x,y);
			}
			$scope.score += countOpen() * 10;
			$scope.state = "";
			
			if(countOpen() + mines >= fields * fields)
			{
				$scope.state = $scope.stateWon;
			}
		}
	};
	
	var openUp = function()
	{
		do
		{
			var did = false;
			for(x = 0; x < fields; x++)
			{
				for(y = 0; y < fields; y++)
				{
					if($scope.cells[x][y]==emptySymbol && $scope.openCells[x][y] == false)
					{
						if(openClearCell(x,y))
						{
							$scope.openCells[x][y] = true;
							did=true;
						}
					}
				}
			}
		}
		while(did);
	};
	
	var countOpen = function()
	{
		var o = 0;
		for(x = 0; x < fields; x++)
		{
			for(y = 0; y < fields; y++)
			{
				if($scope.openCells[x][y]){o++;}
			}
		}
		return o;
	}
	
	$scope.markBtn = function(x,y)
	{
		$scope.markedCells[x][y] = !$scope.markedCells[x][y];
	};
	
	$scope.reset = function()
	{
		fields = Math.floor(10 * $scope.sizes.selected.factor);
		mines = Math.floor(fields * $scope.dificulties.selected.factor);
		$scope.state=$scope.stateLoad;
		clearCells();
		setMines();
		calcNumbers();
		$scope.score = 0;
		$scope.state="";
	};
	$scope.reset();
});
