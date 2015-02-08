/**
 * Application javascript error page.  This module is loaded when
 * an unrecoverable error occurs in loading javascript for a page
 * and is responsible for reporting the error to the user.
 * 
 * Unlike other pages, the error page may be loaded after some
 * elements of the DOM have already been initialized.  Any existing
 * elements in the body are removed prior to rendering.
 */
define(['jquery', 
        'gui/body',
        'hbs!template/jserror'], 
function($, body, jserror) {
	var initialize = function(err) {
		body.clear();
		body.initialize({title: 'Javascript Error'});
		body.contents(jserror(err));
	}

	return {
		initialize: initialize
	} 
});
