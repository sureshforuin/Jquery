	(function($) {
		$.fn.styleSwitcher = function() {
			$(this).click(function() {
			$('body').css('height', '100%'); // IE6 Hack
			$('<div id="overlay" />').appendTo('body').fadeIn(300);
						
				$.ajax({
					type: 'get',
					url: $(this).attr('href'),
					data: 'js=1',
					
					success: function(r) {
						 $('#ss').attr('href', 'css/' + r + '.css');
						 Verify_Loaded_Css.check(function() {
							 $('#overlay').fadeOut(300, function() {
								$(this).remove();
							 });	
						 });
					}
				}); // end ajax
				
				return false;
			}); // end click
			
				var Verify_Loaded_Css = {
					init: function() {
						$('<div id="test" style="display: none;" />').appendTo('body');
					},
					check: function(runCallback) {
						if ($('#test').width() == 2) runCallback();
						else setTimeout(function() {Verify_Loaded_Css.check(runCallback)}, 300);
					}
				}			
			
			Verify_Loaded_Css.init();
		};
	})(jQuery);
		