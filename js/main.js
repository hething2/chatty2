jQuery(function ($) {
    var socket = io.connect();
    var $nickForm = $('#setNick');
    var $nickError = $('#nickError');
    var $nickBox = $('#nickname');
    var $users = $('#users');
    var $messageForm = $('#send-message');
    var $messageBox = $('#message');
    var $chat = $('#chat');

// Nickname submission
    $nickForm.submit(function (event) {
        event.preventDefault();
        socket.emit('new user', $nickBox.val(), function (data) { // send new user through socket
            if (data) { // if there is data, hide the nickWrap and show the contentwrap
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html('Username is already taken'); // if the username is taken display error
            }
        });
        $nickBox.val(''); // default nickname
    });

// Get list of usernames
    socket.on('usernames', function (data) {
        var html = ''; // default username
        for (var i = 0; i < data.length; i++) {
            html += data[i] + '<br/>'; //loop through array of usernames
        }
        $users.html(html); // return list of usernames to #users
    });

// Submit data to socket.io
    $messageForm.submit(function(event) {
        event.preventDefault();
        socket.emit('send message', $messageBox.val(), function(data){
            $chat.append('<span class="error">' + data + "</span><br/>");
        }); // send message through socket
        $messageBox.val(''); // Default message
    });

    socket.on('load old msgs', function(docs){
        for(var i=docs.length-1; i >= 0; i--){
            displayMsg(docs[i]);
        }
    });

// Receive message and send to view
    socket.on('new message', function (data) {
        displayMsg(data);
    });

    function displayMsg(data){
        $chat.append('<span class="msg"><span id="name">' + data.nick + ': </span>' + data.msg + "</span><br/>"); //append nickname and message to #chat
    }

    socket.on('whisper', function(data){
        $chat.append('<span class="whisper"><span id="name">' + data.nick + ': </span>' + data.msg + "</span><br/>");
    });
});