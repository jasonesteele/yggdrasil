require = {
	  baseUrl: contextPath + 'js',
	  
	  shim : {
	    bootstrap : { "deps" :['jquery'] },
      backgrid: {
        deps: ['jquery', 'backbone', 'underscore'],
        exports: 'Backgrid',
      },
	  },
	  
	  paths: {
	  	// 3rd party libraries
	  	jquery: 'lib/jquery-2.1.3',
	  	bootstrap: 'lib/bootstrap',
	  	underscore: 'lib/underscore',
	  	backbone: 'lib/backbone',
	  	backgrid: 'lib/backgrid',
	  }
	};
