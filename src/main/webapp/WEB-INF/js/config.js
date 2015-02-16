/*
 * require.js configuration 
 */
require = {
	// TODO - set this up for dev/prod cache busting
//	urlArgs: "v=" +  (new Date()).getTime(),
	baseUrl : _contextPath + 'js',

  shim : {
    bootstrap : {
	    deps : [ 'jquery' ]
    },
    backgrid : {
      deps : [ 'jquery', 'backbone', 'underscore' ],
      exports : 'Backgrid',
    },
    notify : {
	    deps : [ 'jquery' ]
    },
  },

  paths : {
    // 3rd party libraries
    jquery : 'lib/jquery-2.1.3',
    bootstrap : 'lib/bootstrap',
    underscore : 'lib/underscore',
    backbone : 'lib/backbone',
    backgrid : 'lib/backgrid',
    notify : 'lib/notify',
    hbs : 'lib/require-handlebars-plugin/hbs',
    css : 'lib/require-css/css',
  },
  
  hbs: { // optional
    helpers: true,            // default: true
    i18n: false,              // default: false
    templateExtension: 'hbs', // default: 'hbs'
    partialsUrl: ''           // default: ''
  }
};
