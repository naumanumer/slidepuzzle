var board = $('#board');
var TileSize = 90;
var size;
var numberBoard=[];
var dev = false;

function initGame(s) {
    var n = 0;
    size = s;
    var boardHtml = "";
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

}

$('#size').change(function() {
    var val = $("#size option:selected").val();
    alert(val);
});


initGame(4)