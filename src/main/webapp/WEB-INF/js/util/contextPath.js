define(['jquery'], function ($) {
	var contextPath = window._contextPath;
	if (!contextPath) contextPath = "/";
	
	function getFullPath(path) {
		if (path) {
			if (path.indexOf('/') == 0)
				return contextPath + path.substring(1);
			else
				return contextPath + path;
		} else {
			return contextPath;
		}
	}

	return getFullPath;
})