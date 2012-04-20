<?php $style = !empty($_COOKIE['style']) ? $_COOKIE['style'] : 'day'; ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
 
<html>
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"></script>
	<script type="text/javascript" src="jquery.styleSwitcher.js"></script>
	<link rel="stylesheet" id="ss" href="css/<?php echo $style ?>.css" />
	<link rel="stylesheet" href="css/default.css" />
			
	<script type="text/javascript">
	$(function() {
		$('#container a').styleSwitcher();
	});
	</script>

  </head>
  <body>
    <div id="container">
		<a href="switcher.php?style=day">Day</a><br />
		<a href="switcher.php?style=night">Night</a>
    </div>

  </body>
</html>
