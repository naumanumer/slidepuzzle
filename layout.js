var board = $('#board');
var TileSize = 90;
var size;
var numberBoard=[];
var dev = false;

function initGame(s) {
    var n = 0;
    size = s;
    var boardHtml = "";
    numberBoard=[];
    $("#board").height(s * TileSize);
    $("#board").width(s * TileSize);
    for (var i = 0; i < size; i++) {
        var row=[]
        for (var j = 0; j < size; j++) {
            row.push(n);
            var temp = (i == 0 && j == 0) ? 'active' : '';
            boardHtml += '<div class="cell ' + temp + ' cell-' + n + '" style="left:' + j * TileSize + 'px;top:' + i * TileSize + 'px;height:' + (TileSize - 3) + 'px;width:' + (TileSize - 3) + 'px" id="'+n+'">';
            boardHtml += n + "</div>";
            n++;
        }
        numberBoard.push(row)
    }
    $(board).html(boardHtml);

    writeOnConsole(`Initialized ${size}x${size} board`);
}

$('#size').change(function() {
    var val = $("#size option:selected").val();
    $(board).html("");
    initGame(val);
    size = parseInt(val);
});


writeOnConsole("Slide Puzzle (c) Nauman Umer");
writeOnConsole("Info: Use Arrow keys to move tiles.", "rgb(97, 175, 255)");
writeOnConsole("Warn: As game board and solver are", "rgb(245, 189, 0)");
writeOnConsole(" working async so assigning two tasks", "rgb(245, 189, 0)");
writeOnConsole(" at the same time can result any", "rgb(245, 189, 0)");
writeOnConsole(" unexpected result.", "rgb(245, 189, 0)");
writeOnConsole(" ");

initGame(4)


function writeOnConsole(text, color) {
    (!color) && (color = "#ccc");
    var d = $('#console');
    d.html(d.html()+`<pre style="color: ${color}">${text}</pre>`);
    d.scrollTop(d.prop("scrollHeight"));
}