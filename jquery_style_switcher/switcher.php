<?php

$style = $_GET['style'];
setCookie('style', $style, time() + 604800);
header("location: " . $_SERVER['HTTP_REFERER']);

?>