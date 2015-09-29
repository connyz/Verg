(function($) {

  //
  // Setup
  //
  window.flick = {
    settings: {
      flickrApiUrl: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c55b420ee1228a33b1df6c97e88fdbc0&jsoncallback=?'
    }
  };

  //
  // Init functions
  //
  flick.init = {

    // Submit event for form
    submitEvent: function() {
      // On submitting form, prevent page reload and call ajaxfunction
      $( "#the_form" ).submit(function( e ) {
        // Prevent pagereload
        e.preventDefault();

        // Get value from textfield tags
        var tags = $('#tags').val();

	      // Save searchstring
	      flick.fn.saveSearch(tags);

         // Promise ajaxcall
        var fetchData = flick.fn.getData(tags);

        // If successfull, send data to imageGenerate function
        fetchData.success(function(data){
          // Clear image div
          flick.fn.clearImages();

          // Send data to imagegenerating function
          flick.fn.imageGenerate(data);
        });
      });

    },

    // Setup clickevent for list items
    listItemClickEvent: function() {
	    // When clicking list item, generate new search with keyword
	    $(document).on( "click", ".searchList li", function () {
		    $("#tags").val("").val($(this).text());
		    $("#the_form").trigger("submit");
	    });

    },

	  //Generate initial list items if page is reloaded
	  generateInitialList: function(){
		  if(localStorage["savedStrings"]){
			  var savedStrings = JSON.parse(localStorage["savedStrings"]);

			  flick.fn.generateList(savedStrings);
		  }
	  }
  };

  //
  // Utility functions
  //
  flick.fn = {

    // Function for getting photos from flickr
    getData: function(tags) {
      // Fetch url from settings to call flickr.photos.search
      var flickrApi = flick["settings"]["flickrApiUrl"];

      // Ajaxcall to flickrApi
      return $.ajax({
        url: flickrApi,
        jsonpCallback: 'jsonFlickrApi',
        dataType: 'jsonp',
        data: {  tags: tags, tagmode: "any", format: "json"},
        beforeSend: function() {
          //console.log('before');
        },
        complete: function() {
          //console.log('complete');
        },
        success: function(data)
        {
          // Return generated data
          return data;
        },
        error:function (xhr, ajaxOptions, thrownError){
          alert(thrownError);
        }
      });
    },

    // Function for generating photos
    imageGenerate: function(data) {
	    // Generate images from response
      for (var i = 0; i<data.photos.photo.length; i++){
        $("#images").append("<img src='" + "https://farm" + data.photos.photo[i].farm + ".staticflickr.com/" +
          data.photos.photo[i].server + "/" + data.photos.photo[i].id + "_" + data.photos.photo[i].secret +
          ".jpg'>");
      }
    },

    // Only clears the images div
    clearImages: function(){
      // Clear images div
      $("#images").html('');
    },

	  // Saves searchstring to localstorage
	  saveSearch: function(string){
		  // Check if ls exists, else create empty array to be saved
		  if(localStorage["savedStrings"]){
		    var savedStrings = JSON.parse(localStorage["savedStrings"]);
		  }else{
			  var savedStrings = [];
		  }

		  // Add string to array if string not already exists in list
		  if($.inArray(string, savedStrings) == -1 ){
			  savedStrings.unshift(string);

			  // Keep array at size 10
			  if(savedStrings.length == 11) {
				  savedStrings.pop();
			  }

			  // Save to localstorage
			  localStorage["savedStrings"] = JSON.stringify(savedStrings);

			  // Start generating list
			  flick.fn.generateList(savedStrings);
		  }
	  },

	  // Generates list items for searches
	  generateList: function(arr){
		  // Clear current list
		  $("ul.searchList").empty();

		  // Generate list after search
		  for (var i = 0; i<arr.length; i++){
			  $(".searchList").append("<li>" + arr[i] +"</li>");
		  }
	  }

  };


  //
  // Start app when ready
  //
  jQuery(document).ready(function() {

    // Run all setup functions
    for (var fn in flick.init) {
      if (flick.init.hasOwnProperty(fn)) {
        flick.init[fn]();
      }
    }
  });


}(jQuery));