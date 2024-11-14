const socket = io();

let text = '';

// Regenerate the paragraph when a new client connects
socket.on('random_indexes', function (data) {
  generateDOM(text, data);
});

// Populate DOM on index.html
function generateDOM(data, randomIndex) {
  // console.log('data', randomIndex);
  $('#content').empty(); // Clear previous content
  for (let i = 0; i < data.length; i++) {
    const span = $('<span></span>').text(data[i]);

    if (randomIndex.includes(i)) {
      span.addClass('hidden');
    } else {
      span.addClass('visible');
    }

    span.appendTo('#content');
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
    $('#active-clients').append(client[2]);
  });
});

// Update socket when someone changest title
socket.on('update_title', function (data) {
  $('#title-input').placeholder = data.title;
  $('#title>div').text(data.title);
});

// Update socket when someone types
socket.on('update_text', function (data) {
  $('#content').text(data);
  text = data.text;
});

// Update socket when someone clicks bold
socket.on('update_bold', function (data) {
  if (data) $('#content').css('font-weight', '700');
  else $('#content').css('font-weight', '400');

  text = data.text;
});

// Update socket when someone clicks italic
socket.on('update_italic', function (data) {
  if (data) $('#content').css('font-style', 'italic');
  else $('#content').css('font-style', 'normal');

  text = data.text;
});

$('#text-container').on('input', function (event) {
  let text = event.target.value;
  socket.emit('text_change', text);
});

// Menu Bar UI Stuff

$('#title').click(function () {
  var currentVisibility = $('#title-input').css('visibility');
  if (currentVisibility === 'hidden') {
    $('#title-input').css('visibility', 'visible');
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
    $('#title-input').placeholder = 'Your Letter';
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
