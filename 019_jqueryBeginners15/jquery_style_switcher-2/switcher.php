<?php

$style = $_GET['style'];
setCookie('style', $style, time() + 604800);

if ($_GET['js']) echo $style;
else header("location: " . $_SERVER['HTTP_REFERER']);

?>