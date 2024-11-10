


$(function() {

  $('#button').bind('click', function() {
      console.log("button clicked!🫵");
    
      $.get('/background_process_test', function(data) {
        for (let i = 0; i < data.length; i++) {
          const span = $('<span></span>').text(data[i]);
          if (i % 2 === 0) {
          span.addClass('hidden'); 
        } else {
          span.addClass('visible');
        }
                console.log('data', data[i]);

        span.appendTo('#content');
        }
      });
    
    return false;
  });
});