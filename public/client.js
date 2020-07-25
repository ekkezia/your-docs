


$(function() {

  $('#button').bind('click', function() {
      console.log("button clicked!");
    
      $.get('/background_process_test', function(data) {
        $('<p></p>').text(data).appendTo('#button-container');
      });
    
    return false;
  });
});