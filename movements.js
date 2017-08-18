var reversableClone = null;

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function cellAddrFromCls(cls) {
    return parseInt(getPosCls(cls).replace("cell-", ''));
}

function getPosCls(cls){
    return "cell-"+ cls.match(/cell-([0-9]+)/)[1]
}

function getAbsPosFromAddr(addr){
    return {
        top: (parseInt(addr/size))*TileSize,
        left: (addr%size)*TileSize
    }
}

function getPosFromAddr(addr){
    return {
        top: parseInt(addr/size),
        left: addr%size
    }
}

function getTileFromPos(top,left){
    var addr = (top*size)+left;
    return $('.cell-'+addr).attr('id');
}

function getTileOffset(n){
    return $('#'+n).position()
}

function swapTiles(activeAddr, nextAddr) {
    if(!dev){
        $('.active').animate(getAbsPosFromAddr(nextAddr), 300, 'easeOutBack');
        $('.cell-'+nextAddr).animate(getAbsPosFromAddr(activeAddr), 300, 'easeOutBack');
    }
    else{
        $('.active').css(getAbsPosFromAddr(nextAddr));
        $('.cell-'+nextAddr).css(getAbsPosFromAddr(activeAddr));
    }

    var nextCls = getPosCls($('.cell-'+nextAddr).attr('class'));
    var activeCls = getPosCls($('.active').attr('class'));
    $('.cell-'+nextAddr).removeClass(nextCls).addClass(activeCls);
    $('.active').removeClass(activeCls).addClass(nextCls);
}

function canMove(dir) {
    var activeCellAddr = cellAddrFromCls($('.active').attr('class'));

    switch (dir) {
        case 'l':
            if(activeCellAddr % size == 0)
                return false;
            break;

        case 'r':
            if(activeCellAddr % size == size-1)
                return false;
            break;

        case 'u':
            if(parseInt(activeCellAddr/size) == 0)
                return false;
            break;

        case 'd':
            if(parseInt(activeCellAddr/size) == size-1)
                return false;
            break;
        default:
            return false;
    }
    return true
}

// basic movements
function move(dir) {

    if(!canMove(dir))
        return;
    var activeCellAddr = cellAddrFromCls($('.active').attr('class'));
    var dirVal ={ 'l': -1, 'r': 1, 'u': -size, 'd': size}
    var nextCellAddr = JSON.parse(JSON.stringify(activeCellAddr)) + dirVal[dir];

    $('.active').finish();
    swapTiles(activeCellAddr, nextCellAddr)
}

// complex movements
function moveUsingMoves(moves, delay) {
    if(!delay){
        delay = 200
    }
    if (moves.length == 0)
        return;
    move(moves[0]);
    setTimeout(() => {
        moveUsingMoves(moves.slice(1));
    }, delay)
}

function moveUsingMovesSync(moves){
    for(var x =0; x< moves.length;x++){
        move(moves[x]);
    }
    return moves;
}

function moveToEnd(dir){
    if(canMove(dir)){
        move(dir);
        setTimeout(() => {
            moveToEnd(dir)
        }, 200)
    }
}

function shuffle(){
    writeOnConsole("Shuffling...");
    i = size * size;
    moves = ['r', 'l', 'd', 'u']
    while(i!=0){
        var dir = moves[randomIntFromInterval(0,3)]
        while(canMove(dir)){
            move(dir);
            dir = moves[randomIntFromInterval(0,3)]
        }
        i--
    }
}

function genrateMovesFromDif(dif){
    var ydir = (Math.sign(dif.top) == -1)? "d" : "u"
    var xdir = (Math.sign(dif.left) == -1)? "r" : "l"

    return ydir.repeat(Math.abs(dif.top))+ xdir.repeat(Math.abs(dif.left))
}

function moveHoleLeftTo(n){
    var dif = difTileDistance(0, n)
    var moves;
    if(dif.left == -1 && dif.top == 0){
        return "";
    }
    var ydir = (Math.sign(dif.top) == -1)? "d" : "u"
    var xdir = (Math.sign(dif.left) == -1)? "r" : "l"
    var moves = ydir.repeat(Math.abs(dif.top))+ xdir.repeat(Math.abs(dif.left))
    if(dif.left ==0){
        if(getTileOffset(n).left == 0){
            moves += 'r'
            moves += (Math.sign(dif.top) == -1)? 'u': 'd'
            moves += 'l'
        }
        else{
            moves += "l"
            moves += (Math.sign(dif.top) == -1)? 'u': 'd'
        }
    }
    else if(Math.sign(dif.left) == -1){
        moves += 'l'
    }
    return moves
}

function getHolePosInCircle(startPos, crclH){
    var hPos = getTilePos(0);
    var difPos = difDistanceFromOffset(hPos, startPos);
    if(difPos.left ==0 && difPos.top < crclH){
        return ["l", difPos]
    } else if (difPos.left == crclH -1 && difPos.top < crclH){
        return ["r", difPos]
    } else if (difPos.left < crclH && difPos.top == 0){
        return ['u', difPos]
    } else if (difPos.left < crclH && difPos.top == crclH-1){
        return ['d', difPos]
    } else if (difPos.left < crclH && difPos.top < crclH){
        return ['c', difPos]
    } else {
        return ['o', difPos]
    }
}

function genrateInCircleMoves(hole, circleH, isAntiClockWise){
    circleH --;
    var dirMove = ['u','r','d','l']
    var firstRepeates ={
        'u': [circleH - hole[1].left, hole[1].left],
        'l': [hole[1].top, circleH -hole[1].top],
        'r': [circleH -hole[1].top, hole[1].top],
        'd': [hole[1].left, circleH - hole[1].left],
        // TODO: handle bottom and right
    }
    if(isAntiClockWise){
        dirMove = ['d','r','u','l']
    }
    var moves='', lastMove='', found, firstMove, n=0, firstLoop=true;
    for(var x = 0; x< 4; x++){
        if(found){
            if(firstMove){
                moves += dirMove[x].repeat(firstRepeates[hole[0]][0]);
                lastMove = dirMove[x].repeat(firstRepeates[hole[0]][1]);
                if(isAntiClockWise)
                    moves = [lastMove, lastMove = moves][0]
                firstMove = false
            }
            else
                moves += dirMove[x].repeat(circleH)
            n++;
        }
        if(hole[0] == dirMove[x] && firstLoop){
            found = true
            firstMove = true;
        }
        if(x == 3 && firstLoop){
            x = -1
            firstLoop = false;
        }
        if(n ==4){
            break;
        }
    }
    return moves + lastMove;
}

function rotateInCircle(startTile, crclH, isAntiClockWise){
    holePos = getHolePosInCircle(startTile, crclH);
    return genrateInCircleMoves(holePos, crclH, isAntiClockWise)
}

function moveTileToEnd(n, dir){
    var moves = moveHoleLeftTo(n);

    var nPos = getTilePos(n);
    var dirList = {
        'u': {top:0, left: nPos.left},
        'd': {top: size-1, left: nPos.left},
        'l': {top:nPos.top, left: 0},
        'r': {top:nPos.top, left: size-1}
    }
    var distPos = dirList[dir];

    var distDif = difDistanceFromOffset(distPos, nPos);
    if(distDif.left ==0 && distDif.top ==0 ){
        return '';
    } else if(distDif.left == -1 && distDif.top ==0){
        return 'r';
    }

    if(dir =='r'){
        var canMoveUp =canMove('u');
        moves += (canMoveUp? 'urrdl': 'drrul').repeat(distDif.left);
    }
    else if(dir == 'l'){
        moves += 'r'
        moves += 'ulldr'.repeat(Math.abs(distDif.left)-1)
    }
    else if(dir == 'u'){
        moves += 'urd';
        moves += 'luurd'.repeat(Math.abs(distDif.top)-1)
    }else if(dir == 'd'){
        moves += 'dru';
        moves += 'lddru'.repeat(distDif.top-1)
    }
    return moves;
}

function createRestorePoint(){
    var n =0;
    reversableClone =[]
    for(var y = 0;y < size; y++){
        var row=[];
        for(var x=0; x<size; x++){
            row.push($('.cell-'+n).attr('id'));
            n++;
        }
        reversableClone.push(row);
    }
}

function restore(board){
    if(!board)
        board = reversableClone;
    if(!board)
        return; // if reversableClone is also null
    var n =0;
    for(var y = 0;y < size; y++){
        for(var x=0; x<size; x++){
            var text = board[y][x];
            $('.cell-'+n).attr('id', text);
            $('.cell-'+n).text(text);
            $('.cell-'+n).removeClass('active');
            if(text =='0'){
                $('.cell-'+n).addClass('active')
            }
            n++;
        }
    }
    reversableClone = null;
}

function moveTileToPos(tile, pos){
    var moves = moveHoleLeftTo(tile), temp="";
    moveUsingMovesSync(moves);
    var tilePos = getTilePos(tile);
    var difPos = difDistanceFromOffset(tilePos, pos);
    var ydir = (Math.sign(difPos.top)==-1)? 'd': 'u';
    var xdir = (Math.sign(difPos.left)==-1)? 'r': 'l';
    for(var y = 0; y<Math.abs(difPos.top); y++){
        moves += temp = moveTileOneStep(tile, ydir)
        moveUsingMovesSync(temp); temp="";
    }
    for(var x = 0; x<Math.abs(difPos.left); x++){
        moves += temp = moveTileOneStep(tile, xdir)
        moveUsingMovesSync(temp); temp="";
    }
    reversableClone = temp;
    return moves
}

function getDirFromPos(pos){
    if(pos.top ==0)
        return (pos.left == 1)?'r': 'l';
    else if(pos.left ==0)
        return (pos.top == 1)?'d': 'u';
}

function moveTileOneStep(n,dir){
    var nPos = getTilePos(n);
    var zPos = getTilePos(0);
    var difDir = getDirFromPos(difDistanceFromOffset(nPos, zPos));
    switch (difDir) {
        case 'l':
            var movesList={
                'u': canMove('u')? 'uld': '',
                'l': canMove('u')? 'ulldr': 'dllur',
                'd': canMove('d')? 'dlu': '',
                'r': 'l'
            }
            break;

        case 'r':
            var movesList={
                'u': canMove('u')? 'urd': '',
                'l': 'r',
                'd': canMove('d')? 'dru': '',
                'r': canMove('u')? 'urrdl': 'drrul'
            }
            break;

        case 'd':
            var movesList={
                'u': 'd',
                'l': canMove('l')? 'ldr': '',
                'd': canMove('l')? 'lddru':'rddlu',
                'r': canMove('r')? 'rdl': ''
            }
            break;

        case 'u':
            var movesList={
                'u': canMove('l')? 'luurd': 'ruuld',
                'l': canMove('l')? 'lur': '',
                'd': 'u',
                'r': canMove('r')? 'rul': ''
            }
            break;
    
        default:
            break;
    }
    var moves=movesList[dir]

    //TODO: check if move is possible
    return moves;
    //moveUsingMovesSync(moves);
}



// keyboard listener
document.addEventListener("keydown", function (e) {
    var invertedKeys={'u':'d', 'd': 'u', 'l':'r', 'r': 'l'}
    var key = e.key.replace("Arrow", "").toLowerCase()[0];
    if (key == "l" || key == "r" || key == "u" || key == "d") {
        //move(key);
        move(invertedKeys[key]);
        return false;
    }
})

// Mouse listener
$('#board .cell').click(function(e){
    var tile = $(e.target)[0].id;
    var dif = difTileDistance(0, tile)
    var moves="";

    if(dif.top == 0 && dif.left == -1) //hole is on left
        moves = "r";
    else if(dif.top == 0 && dif.left == 1) //hole is on right
        moves = "l";
    else if(dif.top == -1 && dif.left == 0) //hole is on top
        moves = "d";
    else if(dif.top == 1 && dif.left == 0) //hole is on down
        moves = "u";

    if(moves)
        move(moves);
})