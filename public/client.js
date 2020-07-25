


$(function() {
  
  console.log("hey!!!!!!!!!!")
  $('#test').bind('click', function() {
    console.log(this)
    
    $.getJSON('/background_process_test',
        function(data) {
        console.log(data);
      //do nothing
    });
    return false;
  });
});