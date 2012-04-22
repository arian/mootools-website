mootools.$(window).on('load', function domready(){

	mootools.$('.demo').forEach(function(demo){
		
		var tabs = mootools.$('.demo-tabs li', demo);
		var content = mootools.$('.demo-content', demo);
		
		tabs.forEach(function(tab, index){
			mootools.$(tab).on('click', function(){
				tabs.removeClass('active');
				content.removeClass('active');
				mootools.$(this).addClass('active');
				mootools.$(content[index]).addClass('active');
			});
		});
	});

});