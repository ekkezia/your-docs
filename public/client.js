


$(function() {

  $('#button').bind('click', function() {
      console.log("button clicked!");
    
      $.get('/background_process_test', function(data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          $('<span></span>').text(data[i]).appendTo('#content');
          
        }
      });
    
    return false;
  });
});