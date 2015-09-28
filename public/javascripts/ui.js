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

    // Setup function #2
    setuptwo: function() {
      // do other things
    }
  };

  //
  // Utility functions
  //
  flick.fn = {

    // Function for getting photos from flickr // test
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

          //flick.fn.imageGenerate(data);
          //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
        },
        error:function (xhr, ajaxOptions, thrownError){
          alert(thrownError);
        }
      });
    },

    // Function for generating photos
    imageGenerate: function(data) {
	    console.log(data);
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