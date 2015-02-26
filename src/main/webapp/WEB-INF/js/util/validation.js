define(['jquery',
        'jquery.validate'], 
function($) {
	$.validator.addMethod(
      "regex",
      function(value, element, regexp) {
          var re = new RegExp(regexp);
          return this.optional(element) || re.test(value);
      },
      "Invalid format"
	);
})