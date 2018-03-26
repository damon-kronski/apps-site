<?php

$apps =
[
  ['img' => 'jump-n-run.png','title' => 'Jump and Run','text' => 'A very basic text-based Jump & Run game.','link' => 'https://apps.damon.ch/jump-n-run/'],
  ['img' => 'snake.png','title' => 'Snake','text' => 'A very basic text-based Snake game.','link' => 'https://apps.damon.ch/snake/'],
  ['img' => 'sweeper.png','title' => 'Sweeper','text' => 'The oldschool classic Mine-Sweeper.','link' => 'https://apps.damon.ch/sweeper/'],
  ['img' => 'tetris.png','title' => 'Tetris','text' => 'One of the most classic arcade games ever made, now as a text-based webgame.','link' => 'https://apps.damon.ch/tetris/'],
  ['img' => 'yahtzee.png','title' => 'Yahtzee','text' => 'Everybody knows the old dice game Yahtzee! So let\'s go and play a round.','link' => 'https://apps.damon.ch/yahtzee/']
];

?>

<html>
  <head>
    <title>Apps-Overview</title>
    <link href="https://dist.damon.ch/bootstrap/bootstrap.min.css" rel="stylesheet"/>
    <style>
      .img-thmb { width: 64px;}
	.media {margin-bottom: 5px;}
    </style>
  </head>
  <body>
    <div class="container">
	<h1>Apps-Overview</h1>
      <ul class="list-unstyled">
        <?php
        foreach($apps as $app)
        {
        ?>
        <li class="media ">
          <a href="<?=$app['link'];?>"><img class="align-self-center mr-3 img-thumbnail img-thmb" src="https://apps.damon.ch/img/<?=$app['img'];?>" alt="Generic placeholder image"></a>
          <div class="media-body">
            <h5 class="mt-0 mb-1"><a href="<?=$app['link'];?>"><?=$app['title'];?></a></h5>
            <?=$app['text'];?>
          </div>
        </li>
      <?php
      }
      ?>
      </ul>
    </div>
  </body>
</html>
