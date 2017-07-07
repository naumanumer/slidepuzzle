function getLargestTile(){
    return size*size-1
}

function getTilePos(n){
    return getPosFromAddr(parseInt(getPosCls($('#'+n).attr("class")).replace("cell-", "")));
}

function difTileDistance(n,k){
    var nPos = getTilePos(n),
        kPos = getTilePos(k);
    return difDistanceFromOffset(nPos,kPos)
}

function difDistanceFromOffset(t, p){
    return {
        top: t.top -p.top,
        left: t.left - p.left
    }
}

function isTileCloseTo(n, k){
    var nDistanceDif = difTileDistance(k,n);
    closeDis =[0,1,-1]
    if(closeDis.indexOf(nDistanceDif.top)> -1 && closeDis.indexOf(nDistanceDif.left)> -1){
        return true
    }
    return false
}

function isHoleCloseTo(n){
    isTileCloseTo(n,0);
}

function solveEdgeTile(edge) {
    var tile = numberBoard[edge.top][edge.left];
    var dir = (edge.top == 0)? 't': 'l';
    var circleH = (dir=='t')? edge.left: edge.top;
    var closePos = (dir == 't')? {top: 0, left: edge.left-1} : {top: edge.top-1, left: 0}
    var moves ="";
    moves += moveTileToPos(tile, closePos)
    moves += moveUsingMovesSync(moveTileOneStep(tile, (dir == 'l')? 'r': 'd'))
    moves += moveUsingMovesSync(rotateInCircle({top:0, left:0}, circleH+1, dir == 'l'))
    moves += moveUsingMovesSync(moveTileOneStep(tile, (dir == 't')? 'u': 'l'))
    moves += moveUsingMovesSync((dir == 't'? 'l': 'u').repeat(circleH-1))
    moves += moveUsingMovesSync((dir=='t')? 'u': 'l')
    moves += moveUsingMovesSync(rotateInCircle({top:0, left:0}, circleH+1, dir == 't'))
    return moves
}

function isTileSolved(n){
    nPos = getTilePos(n);
    return numberBoard[nPos.top][nPos.left] == n;
}

function isCordSolved(x,y){
    return numberBoard[y][x].toString() == getTileFromPos(y,x);
}

function solve2x2(){
    var tile = numberBoard[1][1];
    var moves =""
    moves += moveTileToPos(tile, {top:1,left:1})
    move('ul');
    return moves + "l";
}

function solveBottomLine(size){
    if(size ==2) return solve2x2()
    var moves = ""
    var y =size-1;
    for(var x =size-1; x> 0; x--){
        var tile = numberBoard[y][x]
        //TODO: optimize method to reduce number of moves
        moves += moveTileToPos(tile,{top:0,left:0})
        moves += moveTileToPos(tile,{top:y,left:x})
    }
    if(!isCordSolved(0,size-1)){
        moves += solveEdgeTile({top:size-1, left:0})
    }
    return moves
}

function solveRightLine(size){
    if(size ==2) return solve2x2()
    var x =size-1;
    var moves =""
    for(var y =size-2; y> 0; y--){
        var tile = numberBoard[y][x];
        //TODO: optimize method to reduce number of moves
        moves += moveTileToPos(tile,{top:0,left:0})
        moves += moveTileToPos(tile,{top:y,left:x})
    }
    if(!isCordSolved(size-1,0)){
        moves += solveEdgeTile({top:0, left:size-1})
    }
    return moves
}

function isSolved(n) {
    n--;
    for(var x = size-1; x > -1; x--){ // checking row
        if(numberBoard[x][n].toString() != getTileFromPos(x,n))
            return false;
    }
    for(var y = size-1; y > -1; y--){ // checking col
        if(numberBoard[n][y].toString() != getTileFromPos(n,y))
            return false;
    }
    return true
}

function cloneBoard(){
    var board=[];
    for(var y = 0;y <size; y++){
        var row=[]
        for(var x = 0;x <size; x++){
            var tile = getTileFromPos(y,x)
            row.push(tile)
        }
        board.push(row);
    }
    return board;
}

function optimizeMoves(moves){
    var cancelableMoves =[
        "rl", 'lr',
        'du','ud'
    ]
    for(var move of cancelableMoves){
        moves = moves.replace(move, '');
    }
    return moves;
}

function solve(){
    dev = true;
    var board = cloneBoard();
    var tries = 0;
    var moves ="";
    for(var n = size; n > 1; n--){
        if(n ==2){
            moves += solve2x2();
        }else{
            moves +=  solveBottomLine(n);
            moves +=  solveRightLine(n);
        }
    }
    restore(board);
    dev = false
    optimizeMoves(moves);
    return moves;
}

function test2x2Algo() {
    var clone = cloneBoard();
    solve2x2();
    return clone;
}

// Optimization History (5x5)
// +---+-----------+---------------------+----------------+----------------+
// | # | avg moves | moves if algo fails |    faliure %   | Optimization % |
// +---+-----------+---------------------+----------------+----------------+
// | 1 |    764    |       950-1150      | 0.6(0.3H,0.3S) |       0%       |
// | 2 |    756    |       940-1140      | 0.6(0.3H,0.3S) |     0.01 %     |
// | 3 |    753    |     Never Fails     |       0%       |     0.014 %    |