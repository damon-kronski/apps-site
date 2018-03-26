var App = angular.module('YahtzeeApp', ['ngCookies']);


App.controller('YahtzeeController', function ($scope,$http,$cookies) {
	$scope.dices = [[1,true],[1,true],[1,true],[1,true],[1,true]];
	$scope.rounds = 0;
	$scope.fieldsTop = {top: true};
	$scope.historyGames = [];
	$scope.fields =
		[
			{id:0, top: true, name: "Ones", calcValue: function(){return calcFieldFaces(1)},check: function(){return true;},set: false, value: 0},
			{id:1, top: true, name: "Fours", calcValue: function(){return calcFieldFaces(4)},check: function(){return true;},set: false, value: 0},
			{id:2, top: true, name: "Twos", calcValue: function(){return calcFieldFaces(2)},check: function(){return true;},set: false, value: 0},
			{id:3, top: true, name: "Fives", calcValue: function(){return calcFieldFaces(5)},check: function(){return true;},set: false, value: 0},
			{id:4, top: true, name: "Threes", calcValue: function(){return calcFieldFaces(3)},check: function(){return true;},set: false, value: 0},
			{id:5, top: true, name: "Sixes", calcValue: function(){return calcFieldFaces(6)},check: function(){return true;},set: false, value: 0},
			{id:6, top: false, name: "Three of a kind", calcValue: function(){return calcFieldAll();},check: function(){return checkFieldSame(3);},set: false, value: 0},
			{id:7, top: false, name: "Small Street", calcValue: function(){return 30;},check: function(){return checkFieldStreet(4);},set: false, value: 0},
			{id:8, top: false, name: "Four of a kind", calcValue: function(){return calcFieldAll();},check: function(){return checkFieldSame(4);},set: false, value: 0},
			{id:9, top: false, name: "Big Street", calcValue: function(){return 40;},check: function(){return checkFieldStreet(5);},set: false, value: 0},
			{id:10, top: false, name: "Full House", calcValue: function(){return 25;},check: function(){return checkFieldFullHouse();},set: false, value: 0},
			{id:11, top: false, name: "Yahtzee", calcValue: function(){return 50;},check: function(){return checkFieldSame(5);},set: false, value: 0},
			{id:12, top: false, name: "Chance", calcValue: function(){return calcFieldAll();},check: function(){return true;},set: false, value: 0}
		];

	var calcFieldFaces = function(f)
	{
		var val = 0;
		for(var i = 0; i < 5; i++)
		{
			if($scope.dices[i][0] == f)
				val += f;
		}
		return val;
	}

	var calcFieldAll = function()
	{
		var val = 0;
		for(var i = 0; i < 5; i++)
		{
			val += $scope.dices[i][0];
		}
		return val;
	};

	var checkFieldSame = function(n)
	{
		var q = [0,0,0,0,0,0,0];
		var val = false;
		for(var i = 0; i < 5; i++)
		{
			q[$scope.dices[i][0]]++;
			if(q[$scope.dices[i][0]] >= n)
				val = true;
		}
		return val;
	};

	var checkFieldFullHouse = function()
	{
		var q = [0,0,0,0,0,0,0];
		var val2 = -1;
		var val3 = -1;
		for(var i = 0; i < 5; i++)
		{
			q[$scope.dices[i][0]]++;
		}

		for(var i = 0; i < q.length; i++)
		{
			if(q[i] >= 3 && i != val2)
				val3 = i;
			if(q[i] >= 2 && i != val3)
				val2 = i;
		}

		return val2 > -1 && val3 > -1;
	};

	var checkFieldStreet = function(n)
	{
		var q = [];
		$scope.debug = "";
		for(var i = 0; i < 5; i++)
		{
			if(q.indexOf($scope.dices[i][0]) == -1)
				q.push($scope.dices[i][0]);
		}
		q = q.sort();
		var m = 0;
		var c = 0;
		for(var i = 0; i < q.length; i++)
		{

			if(q[i] + 1 == q[i+1])
			{
				c++;
			}
			else
			{
				if(c > m)
				{
					m = c;
				}
				c = 0;
			}
		}
		if(c > m)
		{
			m = c;
		}
		return m >= n - 1;
	};



	$scope.bonusTop = function()
	{
		return $scope.totalUpper() >= 63 ? 35 : 0;
	};

	$scope.grandTotal = function()
	{
		return $scope.totalUpper() + $scope.totalLower() + $scope.bonusTop();
	};

	$scope.totalUpper = function()
	{
		var val = 0;
		for(var i = 0; i < $scope.fields.length; i++)
		{
			if($scope.fields[i].top)
				val += $scope.fields[i].value;
		}
		return val;
	};

	$scope.totalLower = function()
	{
		var val = 0;
		for(var i = 0; i < $scope.fields.length; i++)
		{
			if(!$scope.fields[i].top)
				val += $scope.fields[i].value;
		}
		return val;
	};

	$scope.needEmpty = function()
	{
		var val = 0;
		for(var i = 0; i < $scope.fields.length; i++)
		{
			if(!$scope.fields[i].set && $scope.fields[i].check())
				val++;
		}
		return val > 0;
	};

	$scope.setField = function(i)
	{
		$scope.fields[i].set = true;
		if($scope.fields[i].check())
			$scope.fields[i].value = $scope.fields[i].calcValue();
		else
			$scope.fields[i].value = 0;
		$scope.clearDices();
		$scope.rounds = 0;
		$scope.calcDices();

		if($scope.checkEnd())
		{
			var newGame = {date: getCurrentTimeDate(), upper: $scope.totalUpper(),bonus: $scope.bonusTop(),lower: $scope.totalLower(), total: $scope.grandTotal()};
			$scope.historyGames.push(newGame);
			$cookies.putObject('YahtzeeGames',$scope.historyGames);
			$scope.getCookieGames();
		}
	}

	var getRnd = function(min, max)
	{
	  return Math.round(Math.random() * (max - min) + min);
	};

	$scope.calcDices = function()
	{
		for(var i = 0; i < 5; i ++)
		{
			if($scope.dices[i][1] == true)
			{
				$scope.dices[i][0] = getRnd(1,6);
			}
		}
		$scope.rounds++;
	};

	$scope.clearDices = function()
	{
		for(var i = 0; i < 5; i ++)
		{
			$scope.dices[i][1] = true;
		}
	}

	$scope.lockDice = function(i)
	{
		$scope.dices[i][1] = !$scope.dices[i][1];
	};

	$scope.checkEnd = function()
	{
		var val = 0;
		for(var i = 0; i < $scope.fields.length; i++)
		{
			if($scope.fields[i].set)
				val++;
		}
		return val >= $scope.fields.length;
	}

	var getCurrentTimeDate = function()
	{
		var today = new Date();
		var d = today.getDay();
		var m = today.getMonth()+1; //January is 0!
		var y = today.getFullYear();
		var h = today.getHours();
		var i = today.getMinutes();
		if(d<10){
		    d='0'+d;
		}
		if(m<10){
		    m='0'+m;
		}
		if(h<10){
		    h='0'+h;
		}
		if(i<10){
		    i='0'+i;
		}
		return d+"."+m+"."+y+" "+h+":"+i;
	};

	$scope.restartGame = function()
	{
		$scope.getCookieGames();

		for(var i = 0; i < $scope.fields.length; i++)
		{
			$scope.fields[i].set = false;
			$scope.fields[i].value = 0;
		}

		$scope.rounds = 0;
		$scope.clearDices();
		$scope.calcDices();
	};

	var cleanArray = function(ar)
	{
		ar = ar.sort(function(a,b){
		  return new Date(b.date) - new Date(a.date);
		});
		ar.length = ar.length > 5 ? 5 : ar.length;
		return ar;
	};

	$scope.getCookieGames = function()
	{
		if($cookies.get('YahtzeeGames') == undefined)
		{
			$scope.historyGames = [];
		}
		else
		{
			$scope.historyGames = cleanArray($cookies.getObject('YahtzeeGames'));
		}

	};

	// StartUp
	$scope.restartGame();
});
