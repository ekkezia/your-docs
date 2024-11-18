const socket = io();

let text = '';

// Regenerate the paragraph when a new client connects
socket.on('random_indexes', function (data) {
  generateDOM(text, data);
});

function generateDOM(data, randomIndex) {
  const lines = data.split('\n');

  $('#content').empty();

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      console.log('lines', lines[i][j]);
      const span = $('<span></span>').text(lines[i][j]);

      if (randomIndex.includes(j)) {
        span.addClass('hidden');
      } else {
        span.addClass('visible');
      }

      span.appendTo('#content');
    }

    if (i < lines.length - 1) {
      $('#content').append('<br>');
    }
  }
}

// SOCKETS
// Update UI to show the number of client online
socket.on('active_client', function (data) {
  // console.log('active client change', data);
  // data indexes
  // cid: 0
  // client_num: 1
  // random_emoji: 2

  $('#active-clients').empty();

  data.forEach((client) => {
    $('#active-clients').append(`<span>${client[2]}</span>`);
  });
});

// Update socket when someone changest title
socket.on('update_title', function (data) {
  $('#title-input').placeholder = data.title;
  $('#title>div').text(data.title);
});

// Update socket when someone types
socket.on('update_text', function (data) {
  if (data !== '') {
    $('#content').html(data.text);
    $('#text-container').val(data.text);
  }
  console.log('new text!!!!! 💌', data.text);
  text = data.text;
});

// Update socket when someone clicks bold
socket.on('update_bold', function (data) {
  if (data) {
    $('#content').css('font-weight', '700');
    $('#bold').addClass('selected');
  } else {
    $('#content').css('font-weight', '400');
    $('#bold').removeClass('selected');
  }

  text = data.text;
});

// Update socket when someone clicks italic
socket.on('update_italic', function (data) {
  if (data) {
    $('#content').css('font-style', 'italic');
    $('#italic').addClass('selected');
  } else {
    $('#content').css('font-style', '');
    $('#italic').removeClass('selected');
  }
  text = data.text;
});

$('#text-container').on('input', function (event) {
  // console.log('input now', event.target.value);
  let text = event.target.value;
  socket.emit('text_change', text);
});

// Menu Bar UI Stuff

$('#title').click(function () {
  var currentVisibility = $('#title-input').css('visibility');
  if (currentVisibility === 'hidden') {
    $('#title-input').css('visibility', 'visible');
    $('#title-input').focus();
    $('#title>div').css('visibility', 'hidden');
  }
});

$('#title-input').blur(function () {
  var currentVisibility = $('#title-input').css('visibility');
  if (currentVisibility === 'visible') {
    $('#title-input').css('visibility', 'hidden');
    $('#title>div').css('visibility', 'visible');
  }
});

$('#title-input').blur(function () {
  var newText = $('#title-input').val();
  if (newText !== '') {
    $('#title-input').placeholder = $('#title-input').val();
    $('#title>div').text(newText);

    socket.emit('title_change', newText);
  } else {
    $('#title-input').placeholder = 'Your Docs';
    $('#title>div').text('A Blank Letter');
  }

  var currentVisibility = $('#title-input').css('visibility');
  if (currentVisibility === 'visible') {
    $('#title-input').css('visibility', 'hidden');
    $('#title>div').css('visibility', 'visible');
  }
});

$('#content').click(function () {
  $('#text-container').focus();
});

$('#bold').click(function () {
  if ($('#content').css('font-weight') === '700')
    socket.emit('bold_change', false);
  else socket.emit('bold_change', true);
});

$('#italic').click(function () {
  if ($('#content').css('font-style') === 'italic')
    socket.emit('italic_change', false);
  else socket.emit('italic_change', true);
});

// textarea css
$(document).ready(function () {
  $('#text-container').on('input', function () {
    $(this).height('auto');
    $(this).height(this.scrollHeight);
  });
});
