var board = $('#board');
var TileSize = 90;
var height;
var width;
var numberBoard=[];
var dev = false;

function initGame(h, w) {
    var n = 0;
    height = h, width = w;
    var boardHtml = "";
    $("#board").height(h * TileSize);
    $("#board").width(w * TileSize);
    for (var i = 0; i < height; i++) {
        var row=[]
        for (var j = 0; j < width; j++) {
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


initGame(5,5)