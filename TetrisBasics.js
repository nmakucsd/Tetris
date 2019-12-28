let canvas;
let ctx;
let gBArrayHeight = 20; //20 squares tall
let gBArrayWidth = 12;  //20 squares across
let startX = 4;         //draw shapes on 4th block
let startY = 0;         //draw shapes 0 blocks from top

let score = 0;
let level = 1;

let winOrLose = "Playing";

let tetrisLogo;





let coordinateArray = [...Array(gBArrayHeight)].map (e => Array(gBArrayWidth).fill(0));

let currTetromino = [[1,0], [0,1], [1,1], [2,1]];

let tetrominos = [];
let tetrominoColor = ['purple', 'cyan',  'blue', 'yellow', 'orange', 'green', 'red'];
let currTetrominoColor;

let gameBoardArray = [...Array(gBArrayHeight)].map (e => Array(gBArrayWidth).fill(0));

let stoppedShapeArray = [...Array(gBArrayHeight)].map (e => Array(gBArrayWidth).fill(0));


let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    UP: 4
};

let direction;












class Coordinates {

    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}







document.addEventListener('DOMContentLoaded',SetupCanvas);









//coordinates coorespond to number of pixels inside gameboard
//shifts the coordinates left 11 and down 9 relative to x and y
function CreateCoordArray(){
    let i = 0;
    let j = 0;

    for(let y = 9; y <= 446; y += 23){ //goes down the array
        for(let x = 11; x<=264; x += 23){   //goes left to right
            coordinateArray[i][j] = new Coordinates(x,y); //create coordinate Array
            i++;
        }
        j++;
        i=0;
    }
}








function SetupCanvas(){

    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d'); //context provides all of the functions for drawing on canvas
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(2,2); //zooms in so everything is bigger in the browser

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //gameboard rectangle
    ctx.strokeStyle = 'grey';
    ctx.strokeRect(8, 8, 280, 462);

    //load Tetris Logo
    tetrisLogo = new Image(1000,750);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "Images/tetris-logo.png";


    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98); //300px from left, 98 down

    ctx.strokeRect(300, 107, 161, 24);

    ctx.fillText(score.toString(), 310, 127);

    ctx.fillText("LEVEL", 300, 157);
    ctx.strokeRect(300, 171, 161, 24);
    ctx.fillText(level.toString(), 310, 190);
    
    ctx.fillText("WIN / LOSE", 300, 221);
    ctx.fillText(winOrLose, 310, 261);
    ctx.strokeRect(300, 232, 161, 95);
    ctx.fillText("CONTROLS", 300, 354);
    ctx.strokeRect(300, 366, 161, 104);
    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate Right", 310, 463); 


    //user inputs
    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();



    CreateCoordArray();
    DrawTetromino();
    
}


  



function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 3, 161, 74);
}





function DrawTetromino() {
    for(let i = 0; i < currTetromino.length; i++){
        let x = currTetromino[i][0] + startX;
        let y = currTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1; //there is a square here

        let CoordX = coordinateArray[x][y].x;
        let CoordY = coordinateArray[x][y].y;

        ctx.fillStyle = currTetrominoColor;
        ctx.fillRect(CoordX, CoordY, 21, 21); //each square is 21px x 21px;


    }
}



function HandleKeyPress(key) {
    if(key.keyCode === 65) { //a key
        direction = DIRECTION.LEFT;
        if(!hittingWall()){
            DeleteTetromino();
            startX--;
            DrawTetromino();
        }
    }
    else if(key.keyCode === 68){ // d key
        direction = DIRECTION.RIGHT;
        if(!hittingWall()){
            DeleteTetromino();
            startX++;
            DrawTetromino();
        }
    }
    else if (key.keyCode === 83){ // s key
        direction = DIRECTION.DOWN;
        DeleteTetromino();
        startY++;
        DrawTetromino(); 
    }
}





function DeleteTetromino(){
    for(let i = 0; i < currTetromino.length;i++){
        let x = currTetromino[i][0] + startX;
        let y = currTetromino[i][1] + startY;

        gameBoardArray[x][y] = 0; //1 means something's there - 0 means nothing
        let coordX = coordinateArray[x][y].x;
        let coordY = coordinateArray[x][y].y;
        ctx.fillStyle = 'black';
        ctx.fillRect(coordX, coordY, 21, 21);
    }
}








function CreateTetrominos(){
    //Push T
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    //Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    //Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    //Push Square
    tetrominos.push([[0,0], [0,1], [1,0], [1,1]]);
    //Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    //Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    //Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}








function CreateTetromino(){
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    currTetromino = tetrominos[randomTetromino];
    currTetrominoColor = tetrominoColor[randomTetromino];
}





//if newX is beyond the gameboard, return true
function hittingWall() {
    for(let i = 0; i < currTetromino.length; i++){
        let newX = currTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        }
        else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }
    }
    return false;
}