
console.log("hey!!")

$(function() {
  $('a#test').bind('click', function() {
    $.getJSON('/background_process_test',
        function(data) {
      //do nothing
    });
    return false;
  });
});