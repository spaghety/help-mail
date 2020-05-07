var socket = io();

var playing = true;

function setNotePlay (toggle){
    playing = toggle;
}
function sendNote(contents) {
    var note = document.createElement("div");
    document.getElementsByClassName("notescontainer")[0].appendChild(note);
    note.innerHTML = contents;
    note.setAttribute("class", "note");
    note.setAttribute("onmouseover", "setNotePlay(false)");
    note.setAttribute("onmouseout", "setNotePlay(true)");
    note.style.zIndex = "-1";
    var pos = 10;
    var id = setInterval(frame, 2);
    function frame() {
        if (pos == screen.height){
            clearInterval(id);
            note.parentNode.removeChild(note);
        }else{
            if (playing){
                pos++;
                note.style.bottom = pos+"px";
            }
        }
    }
}
function setDivVal(divVal){
    var divVals = [
        "",
        "<textArea id='composetextarea' placeholder='whats going on?'></textArea>\
        <button id='composesendbutton'>Send</button>",
        ""
        ];
    if (divVal == 0){
        document.getElementsByClassName("mailviewercontainer")[0].innerHTML = "";
        socket.emit("extinboxreq", )
    }else if (divVal == 1){
        document.getElementsByClassName("mailviewercontainer")[0].innerHTML = divVals[1];
        socket.emit("findquery", true);
    }
}

$("textarea").keyup(function(e){
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 13){
        e.preventDefault();
        socket.emit("newNote", $(".noteinput").val());
        $(".noteinput").val("");
    }
});

socket.on("displayNote", function(contents) {
    sendNote(contents);
});
document.getElementsByClassName("composebuttondiv")[0].onclick = function(){
    setDivVal(1);
}
document.getElementsByClassName("frequests")[0].onclick = function(){
    setDivVal(1);
}