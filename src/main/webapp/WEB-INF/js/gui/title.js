/**
 * Set the page title in a consistent format.
 */
define(['settings'], function(settings) {
	return function(title) {
		document.title = settings.appName + ' - ' + title;
	}
});