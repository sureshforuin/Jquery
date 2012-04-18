
function SlidingMenu ( container_name, menu_slider_width, duration, easing, attr, first_anim, last_anim, extra_anim_duration )  // We get the parameters
{
	// Set defaults for the optional parameters
	if ( duration == null )
	{
		duration = 1000;
	}
	if ( easing == null )
	{
		easing = [ "swing" ];
	}
	if ( attr == null )
	{
		attr = "width";
	}
	if ( first_anim == null )
	{
		first_anim = function () {};
	}
	if ( last_anim == null )
	{
		last_anim = function () {};
	}


	// The public class variables
	this.container_name = container_name; // new parameter!
	this.effect_duration = duration; 
	this.menu_slider_width = menu_slider_width;
	this.is_animation_running = false;
	this.active_menu = $($( container_name + " .menu_slider" )[0]);
	this.easing = easing;  // new!
	this.attr = attr;  // new!

	this.first_anim = first_anim; // new!
	this.last_anim = last_anim; // new!
	this.extra_anim_duration  = extra_anim_duration;  // new!

	// We do the bindings on object creation
	var self = this;
	$( container_name + " .menu_button" ).bind( "click", self, on_click ); // Menu button click binding
	 
	// Do the slide
	this.slide ( this.active_menu, this.menu_slider_width );

}
SlidingMenu.prototype.slide = slide;
SlidingMenu.prototype.do_slide = do_slide;


function do_slide ( menu_slider )
{
	this.slide ( this.active_menu, 0 );
	this.active_menu = menu_slider;
	this.slide ( this.active_menu, this.menu_slider_width );
}

function slide ( menu_slider, amount )
{
	// Random easing from array
	rand_num = Math.floor ( Math.random() * this.easing.length );
	var easing = this.easing[rand_num];

	// Create attributes map
	var map = {};
	map[this.attr] = amount;
	
	this.is_animation_running = true;
	var self = this;

	menu_slider.animate (
	map,
	this.effect_duration,
	this.curr_easing,
	function ()
	{
		self.is_animation_running = false;
		if ( amount == self.menu_slider_width )
		{
			self.last_anim( self, menu_slider ); // The key line: play the last animation
		}
	}
	);
}

function on_click ( event )
{
	// First check if the active_menu button was clicked. If yes, we do nothing ( return )
	if ( $(this).next()[0] == event.data.active_menu[0] ) // Remember, active_menu refers to the image ( thus next() )
	{
		return;
	}
	// Check if animation is running. If it is, we interrupt
	
	if ( event.data.is_animation_running )
	{
		return;
	}
	
	// First select a random easing function from the this.easing array
	rand_num = Math.floor ( Math.random() * event.data.easing.length ); // Generate a random number between 0 and (arraylength-1)
	event.data.curr_easing = event.data.easing[rand_num]; // Choose the random value
	
	// Get the item next to the button
	var menu_slider = $(this).next();
	event.data.first_anim ( menu_slider ); // First animation
	setTimeout ( function() { event.data.do_slide( menu_slider ), event.data.extra_anim_duration }, event.data.extra_anim_duration ); // Slide panels after the first animation finishes
	
}
