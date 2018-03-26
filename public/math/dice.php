<?php

$max = 10000000;
$def = 1000;
$runs = isset($_GET['r']) ? ($_GET['r'] <= $max ? $_GET['r'] : $max) :$def;

$sets = 0;
$data = [];

for($i = 0; $i < $runs; $i++)
{
  $hit = false;
  $n = [];
  for($q = 0; $q < 6;$q++)
  {
    $n[$q] = mt_rand(1,6);
    if($n[$q] == 6)
      $hit = true;

  }
  array_push($data,$n);
  $sets += $hit ? 1 : 0;
}

echo "Loops: ".$runs." - Hits: ".$sets."<br>";
echo ((1-($sets/$runs))*100)."%<br><br>";

foreach($data as $n)
{
  foreach($n as $q)
    echo $q. " ";
  echo "<br>";
}
