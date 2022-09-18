var socket = io()
$(() => {
    $("#send").click(() => {
        var message = { name: $("#name").val(), message: $("#message").val(), dateAdded: $("#dateToday").val(), motType: $("input[name='rdbtn']:checked").val()  }
        postMessages(message)
        $("#name").val('')
        $("#name").prop('disabled', true)
        $("#message").val('')
        $("#message").prop('disabled', true)
        $("input[name='rdbtn']").prop('checked', false)
        $('#alert').empty().show().html("Message Sent!").delay(3000).fadeOut(300);
    })
    getMessages()
})

socket.on('message', addMessages)

function changePlaceholder() {
    $("#name").prop('disabled', false)
    $("#name").prop('required', true)
    $("#message").prop('disabled', false)
    if ($("input[name='rdbtn']:checked").val() == 'Song') {
        $("#message").attr('placeholder', 'Paste a Link or Type the Title of the Song')
    }
    else if ($("input[name='rdbtn']:checked").val() == 'Message') {
        $("#message").attr('placeholder', 'Type your message here')
    }
    else {
        $("#message").attr('placeholder', 'What do you want to do?')
    }
}

function addMessages(message) {
    var date = new Date(message.dateAdded),
        month = date.toLocaleString('default',{month: 'long'}),
        day = '' + date.getDate(),
        year = date.getFullYear();

    //if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    date = month + ' ' + day + ', ' + year

    var motivType = message.motType
    var src = ""
    if(motivType == "Message"){
        src = "./icons/letter.png"
    }
    else if (motivType == "Task"){
        src = "./icons/task.png"
    }
    else if (motivType == "Song"){
        src = "./icons/music.png"
    }

    $("#messages").append(`
        <div class="container">
            <div class="column">
                <div class="card h-100">
                    <div class="card-body">
                        <img src="${src}" style="width:40px">
                        <p class="card-text">
                            From: ${message.name} <br>
                            ${message.message} <br>
                        </p>
                    </div>   
                </div>
                <br>
            </div>
        </div> 
    `);
}//appends messages to messages div

function getMessages() {
    $.get('/messages', (data) => {
        data.forEach(addMessages);
    })
}

function postMessages(message) {
    console.log(message)
    $.post('/messages', message)
    
}
