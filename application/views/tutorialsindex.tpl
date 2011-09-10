<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>MooTools</title>
	<?php require($this->config('views_folder') . '/shared/css.tpl');?>
</head>
<body>
<?php require($this->config('views_folder') . '/shared/header.tpl');?>
<div class="content">
	<h2>TUTORIALS</h2>
	<?php echo $this->tutoriallist; ?>
</div>
<?php require($this->config('views_folder') . '/shared/footer.tpl');?>
<?php require($this->config('views_folder') . '/shared/javascript.tpl');?>
</body>
</html>