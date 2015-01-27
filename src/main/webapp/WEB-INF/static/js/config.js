require = {
	  baseUrl: contextPath + 'js',
	  shim : {
	    "bootstrap" : { "deps" :['jquery'] },
	  },
	  paths: {
		// 3rd party libraries
	  jquery: 'lib/jquery-2.1.3',
		bootstrap: 'lib/bootstrap',
		underscore: 'lib/underscore',
		backbone: 'lib/backbone-min',
		'datatables': 'lib/jquery.dataTables',
		'datatables.bootstrap': 'lib/dataTables.bootstrap',
	  }
	};
