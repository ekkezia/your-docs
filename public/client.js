


$(function() {

  $('#button').bind('click', function() {
      console.log("button clicked!");
    
      $.get('/background_process_test', function(data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          $('<p></p>').text(data).appendTo('#button-container');
        }
      });
    
    return false;
  });
});




$(function() {

  $('#secret').bind('click', function() {
      console.log("secret clicked!");
    
      $.get('/secret', function(data) {
        console.log(data);
        // $('<p></p>').text(data).appendTo('#button-container');
      });
    
    return false;
  });
});