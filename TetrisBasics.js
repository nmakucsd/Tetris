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


  


/**DrawTetrisLogo()
 * 
 */
function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 3, 161, 74);
}




/**DrawTetromino()
 * 
 */
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





/**HandleKeyPress()
 * 
 * @param {*} key 
 */
function HandleKeyPress(key) {
    if(winOrLose != "Game Over"){

        if(key.keyCode === 65) { //a key
            direction = DIRECTION.LEFT;
            if(!hittingWall() && !CheckForHorizontalCollision()){
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        }
        else if(key.keyCode === 68){ // d key
            direction = DIRECTION.RIGHT;
            if(!hittingWall() && !CheckForHorizontalCollision()){
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        }
        else if (key.keyCode === 83){ // s key
           MoveTetrominoDown();
        }
        else if (key.keyCode === 69){
            RotateCW();
        }
        else if (key.keyCode === 81){
            RotateCW();
        }
    }
    
}



function MoveTetrominoDown(){
    direction = DIRECTION.DOWN;

    if(!CheckForVerticalCollision()){
        DeleteTetromino();
        startY++;
        DrawTetromino(); 
    }
}

window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetrominoDown();
    }
}, 1000);



/**DeleteTetromino()
 * 
 */
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







/**CreateTetrominos()
 * 
 */
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







/**CreateTetromino()
 * 
 */
function CreateTetromino(){
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    currTetromino = tetrominos[randomTetromino];
    currTetrominoColor = tetrominoColor[randomTetromino];
}




/**hittingWall()
 * prevents Tetrominos from going too far left/right
 * if newX is beyond the gameboard, return true
 */
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





/**
 * CheckForVerticalCollision()
 * 
 */
function CheckForVerticalCollision() {
    let tetrominoCopy = currTetromino;
    let collision = false;
    for(let i = 0; i < tetrominoCopy.length; i++){
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
    
        //if moving down, increment y to check for collision
        if(direction === DIRECTION.DOWN) {
            y++;
        }
        //if(gameBoardArray[x][y+1] === 1){
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            DeleteTetromino();
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }

    if(collision){
        if(startY <= 2){
            winOrLose = "Game Over";
            ctx.fillStyle = 'black';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'white';
            ctx.fillText(winOrLose, 310, 261);
        }
        else {
            for(let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[x][y] = currTetrominoColor;
            }
            CheckForCompletedRows();
            CreateTetromino();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }
}





function CheckForHorizontalCollision(){
    let tetrominoCopy = currTetromino;
    let collision = false;


    for(let i = 0; i < tetrominoCopy.length; i++){
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        if(direction === DIRECTION.LEFT) {
            x--;
        }
        else if (direction === DIRECTION.RIGHT) {
            x++;
        }

        var stoppedShapeVal = stoppedShapeArray[x][y];
        if(typeof stoppedShapeVal === 'string') {
            collision = true;
            break;
        }
    }

    return collision;
}


/**CheckForCompletedRows()
 * 
 * Search each row for completed rows
 * Saves the 1st completed row
 * Save the number of completed rows
 * Copies the row above the 1st completed row
 * Delete the completed row
 * Redraw in the row that was saved
 * copy the results to all arrays involved
 */
function CheckForCompletedRows(){
    let rowsToDelete = 0;       // number of rows to delete
    let startOfDeletion = 0;    // starting place of where to delete rows


    for(let y = 0; y < gBArrayHeight; y++){     //checks every row to see if completed.Checks starting from top
        let completed = true;  

        //if square at stoppedShapeArray is 0/undefined, row is not completed                 
        for(let x = 0; x < gBArrayWidth; x++){
            let square = stoppedShapeArray[x][y];
            if(square === 0 || (typeof square === 'undefined')){
                completed = false;
                break;
            }
        }

        //skip if row isn't completed
        if(completed){              
            if(startOfDeletion === 0) startofDeletion = y; //sets startOfDeletion to row number
            rowsToDelete++;
            for(let i = 0; i < gBArrayWidth; i++){      //for loop to delete row of squares. 
                stoppedShapeArray[i][y] = 0;            //remove from stoppedShapeArray
                gameBoardArray[i][y] = 0;               //remove from gameBoardArray
                let coordX = coordinateArray[i][y].x;   //get x,y value of square in CoordinateArray table
                let coordY = coordinateArray[i][y].y;
                ctx.fillStyle = 'black';                //remove by drawing as black
                ctx.fillRect(coordX, coordY, 21, 21);   //remove the square with x,y values in CoordinateArray
            }
        }
    }
    if(rowsToDelete > 0){ //increase score by 10 with each row cleared
        score += 10;
        ctx.fillStyle = 'black';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'white';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }



}

/**MoveAllRowsDown
 * 
 * @param {number} rowsToDelete the number of rows to delete
 * @param {number} startOfDeletion the row number being deleted
 */
function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for(var i = startOfDeletion-1; i >= 0; i--){ //start from row above completed(removed) row

        //this code might be able to be used for hologram
        for(var x = 0; x < gBArrayWidth; x++){          //loop start from square left to right
            var y2 = i + rowsToDelete;                  //y2 is rowsToDelete + row above row being removed
            var square = stoppedShapeArray[x][i];       //square to be moved down
            var nextSquare = stoppedShapeArray[x][y2];  //projected placement of square


            if(typeof square === 'string'){         //if square exists
                nextSquare = square;                //move square to nextSquare
                gameBoardArray[x][y2] = 1;          //new square exists
                stoppedShapeArray[x][y2] = square;  //draw color into stopped

                let coordX = coordinateArray[x][y2].x;  //get coord of new square
                let coordY = coordinateArray[x][y2].y;  
                ctx.fillStyle = nextSquare;             //copy fillStyle of previous square
                ctx.fillRect(coordX, coordY, 21, 21);   //put into new square

                square = 0;                             //wipe old place
                gameBoardArray[x][i] = 0;               //clear in GBA
                stoppedShapeArray[x][i] = 0;            //clear in SSA
                coordX = coordinateArray[x][i].x;       //get coordinate of old place
                coordY = coordinateArray[x][i].y;
                ctx.fillStyle = 'black';                //draw as black
                ctx.fillRect(coordX, coordY, 21, 21);
            }
        }
    }
}





// 9. Rotate the Tetromino CW
// ***** SLIDE *****
function RotateCW()
{
    let newRotation = new Array();
    let tetrominoCopy = currTetromino;
    let currTetrominoBU;
 
    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Here to handle a error with a backup Tetromino
        // We are cloning the array otherwise it would 
        // create a reference to the array that caused the error
        currTetrominoBU = [...currTetromino];
 
        // Find the new rotation by getting the x value of the
        // last square of the Tetromino and then we orientate
        // the others squares based on it [SLIDE]
        let x = tetrominoCopy[i][0];    //1
        let y = tetrominoCopy[i][1];    //0
        let newX = (GetLastSquareX() - y);  //1
        let newY = x;                       //1
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();
 
    // Try to draw the new Tetromino rotation
    try{
        currTetromino = newRotation;
        DrawTetromino();
    }  
    // If there is an error get the backup Tetromino and
    // draw it instead
    catch (e){ 
        if(e instanceof TypeError) {
            currTetromino = currTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}





// 9. Rotate the Tetromino CCW
// ***** SLIDE *****
function RotateCCW()
{
    let newRotation = new Array();
    let tetrominoCopy = currTetromino;
    let currTetrominoBU;
 
    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Here to handle a error with a backup Tetromino
        // We are cloning the array otherwise it would 
        // create a reference to the array that caused the error
        currTetrominoBU = [...currTetromino];
 
        // Find the new rotation by getting the x value of the
        // last square of the Tetromino and then we orientate
        // the others squares based on it [SLIDE]
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() + y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();
 
    // Try to draw the new Tetromino rotation
    try{
        currTetromino = newRotation;
        DrawTetromino();
    }  
    // If there is an error get the backup Tetromino and
    // draw it instead
    catch (e){ 
        if(e instanceof TypeError) {
            currTetromino = currTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}



// Gets the x value for the last square in the Tetromino
// so we can orientate all other squares using that as
// a boundary. This simulates rotating the Tetromino
function GetLastSquareX()
{
    let lastX = 0;
     for(let i = 0; i < currTetromino.length; i++)
    {
        let square = currTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}