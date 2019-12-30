let canvas;
let ctx;
let gBArrayHeight = 20; //20 squares tall
let gBArrayWidth = 10;  //20 squares across
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

let rotation = 0;












class Coordinates {

    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}







document.addEventListener('DOMContentLoaded',SetupCanvas);





// When the user clicks on <div>, open the popup
function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}













/**SetupCanvas()
 * This function sets up the canvas by loading everything to begin before play
 * 
 */
function SetupCanvas(){

    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d'); //context provides all of the functions for drawing on canvas
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(1,1); //zooms in so everything is bigger in the browser

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    //use to color background different color
    // for(let i = 0; i < gBArrayWidth; i++){  
    //     for(let j = 0; j < gBArrayHeight; j++){  

    //         let baseX = coordinateArray[j][i].x; 
    //         let baseY = coordinateArray[j][i].y;

    //         console.log(baseX);
    //         console.log(baseY);

    //         ctx.fillStyle = 'black';        //fill square in CoordX, CoordY
    //         ctx.fillRect(baseX, baseY, 21, 21); //each square is 21px x 21px;
    //     }
    // }


    //gameboard rectangle
    ctx.strokeStyle = 'grey';
    // ctx.strokeRect(8, 8, 280, 462);
    ctx.strokeRect(8, 8, 258, 462);

    //load Tetris Logo
    tetrisLogo = new Image(1000,750);
    tetrisLogo.onload = DrawTetrisLogo();
    tetrisLogo.src = "Images/tetris-logo.png";


    //SIDE MENU
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


/**DrawTetrisLogo()
 * puts the Tetris logo on side menu
 */
function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 3, 161, 74); //x y of where to put, x y of dimensions
}







/**CreateTetrominos()
 * push into the tetrominos array the 7 tetrominos 
 * each tetromino has arrays to indicate which squares they occupy on the 2D array
 */
function CreateTetrominos(){
    //Push T
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);  //tetrominos[0] = [[1,0], [0,1], [1,1], [2,1]] and array of 2-element arrays
    //Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);  //tetrominos[1]
    //Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);  //tetrominos[2]
    //Push Square
    tetrominos.push([[0,0], [0,1], [1,0], [1,1]]);  //tetrominos[3]
    //Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);  //tetrominos[4]
    //Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);  //tetrominos[5]
    //Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);  //tetrominos[6]
}



/**CreateTetromino()
 * assigns currTetromino a random tetromino and its color
 */
function CreateTetromino(){
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);    //random number 0-1 * amount of tetrominos ^^ 7
    currTetromino = tetrominos[randomTetromino];                            //currTetromino is a random tetromino shape (array of 2-element arrays)
    currTetrominoColor = tetrominoColor[randomTetromino];                   //currTetrominoColor is the corresponding color
}





/**DrawTetromino()
 * Use the input from currTetromino to figure out where to create the tetrominos and what tetromino to create
 * @param {3D Array} currTetromino represents the current Tetromino
 */
function DrawTetromino() {
    for(let i = 0; i < currTetromino.length; i++){  //currTetromino.length is 4 for the amount of squares
        let x = currTetromino[i][0] + startX;       //x is the first element of each tetramino square (offset by starting position)
        let y = currTetromino[i][1] + startY;       //y is the second element of each tetramino square
                                                    //for T, this would be (1, 0, 1, 2) for x and (0, 1, 1, 1) for y
        //gameBoardArray is the 10x20 board
        gameBoardArray[x][y] = 1;                   //there is a square here

        // CreateHologram(currTetromino);

        let CoordX = coordinateArray[x][y].x; 
        let CoordY = coordinateArray[x][y].y;

        ctx.fillStyle = currTetrominoColor;        //fill square in CoordX, CoordY
        ctx.fillRect(CoordX, CoordY, 21, 21); //each square is 21px x 21px;
        //repeat 4x for whole tetromino
    }
}






















// function CreateHologram(tetrominoHolo) {

//     let startYHolo = 0;

//     for(let i = 0; i < tetrominoHolo.length; i++){  //currTetromino.length is 4 for the amount of squares

//         let x = tetrominoHolo[i][0] + startX;       //x is the first element of each tetramino hologram square (offset by starting position)
//         let y = tetrominoHolo[i][1] + startYHolo;       //y is the second element of each tetramino hologram square
        
//         while(!(typeof stoppedShapeArray[x][y] === 'string') && startYHolo < 18){  //if there is stopped block, move hologram above            
//             startYHolo++;
//         }
    
//         y = tetrominoHolo[i][1] + startYHolo;

//         console.log(y);
        
//         let CoordX = coordinateArray[x][y].x;
//         let CoordY = coordinateArray[x][y].y;

        
        


//         ctx.fillStyle = currTetrominoColor;        //fill square in CoordX, CoordY
//         ctx.fillRect(CoordX, CoordY, 21, 21); //each square is 21px x 21px;



//     }
// }






















/**HandleKeyPress()
 * 
 * @param {number} key represents the number code of the key pressed
 */
function HandleKeyPress(key) {
    if(winOrLose === "Playing"){    //only accept keyboard inputs when "playing"

        if(key.keyCode === 65) { //a key
            direction = DIRECTION.LEFT;
            if(!hittingWall() && !CheckForHorizontalCollision()){   //hitting wall is side of gameboard. Horizontal collision is for stopped tetrominos
                DeleteTetromino(currTetromino);  //delete current tetromino
                startX--;                        //move left 1
                DrawTetromino();    //draw tetromino in new location
            }
        }
        else if(key.keyCode === 68){ // d key
            direction = DIRECTION.RIGHT;
            if(!hittingWall() && !CheckForHorizontalCollision()){   //hitting wall is side of gameboard. Horizontal collision is for stopped tetrominos
                DeleteTetromino(currTetromino);  //delete current tetromino
                startX++;                       //move right 1
                DrawTetromino();    //draw tetromino in new location
            }
        }
        else if (key.keyCode === 83){ // s key
            MoveTetrominoDown();
        }
        else if (key.keyCode === 87){ // w key
            ShootTetrominoDown();
        }
        else if (key.keyCode === 69){ // e key
            RotateCW();
        }
        else if (key.keyCode === 81){ // q key
            RotateCCW();
        }
    }
    
}



/**DeleteTetromino()
 * 
 * 
 */
function DeleteTetromino(currTetromino){
    for(let i = 0; i < currTetromino.length;i++){   //go through each square of currTetromino
        let x = currTetromino[i][0] + startX;       //x value of square
        let y = currTetromino[i][1] + startY;       //y value of square

        gameBoardArray[x][y] = 0;                   //remove presences

        let coordX = coordinateArray[x][y].x;       //draw as black square
        let coordY = coordinateArray[x][y].y;
        ctx.fillStyle = 'black';
        ctx.fillRect(coordX, coordY, 21, 21);
    }
}


/**MoveTetrominoDown()
 * move the tetromino down 1 square
 */
function MoveTetrominoDown(){
    direction = DIRECTION.DOWN;         //what is the point of this line?

    if(!CheckForVerticalCollision(currTetromino)){   //if there is nothing below
        DeleteTetromino(currTetromino);              //delete tetromino
        startY++;                       //move down by one
        DrawTetromino();                //draw tetromino in new position
    }
}





/**ShootTetrominoDown()
 * move the tetromino down 1 square
 */
function ShootTetrominoDown(){
    direction = DIRECTION.UP;         //what is the point of this line?

    while(!CheckForVerticalCollision(currTetromino)){    //if there is nothing below
        DeleteTetromino(currTetromino);
        startY++;                           //move down by one
        DrawTetromino();                    //draw tetromino in new position
    }
}










//move tetromino down every 1 second
// window.setInterval(function(){
//     if(winOrLose === "Playing"){    //game must be "playing"
//         MoveTetrominoDown();
//     }
// }, 1000);
























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
        else if(newX >= 10 && direction === DIRECTION.RIGHT){
            return true;
        }
    }
    return false;
}





/**CheckForVerticalCollision()
 * Checks if next block would be in contact with a stopped block vertically or the floor
 * if not in contact then collision returns false
 * if in contact then collision returns true and tetromino is moved
 * @param {3D Array} currTetromino the Tetromino to input
 */
function CheckForVerticalCollision(currTetromino) {
    let tetrominoCopy = currTetromino;              //makes a shadow clone of the current tetromino
    let collision = false;                          //no collision has happened
    for(let i = 0; i < tetrominoCopy.length; i++){  //cycle through each square
        let square = tetrominoCopy[i];              //copy 1 square of tetromino
        let x = square[0] + startX;                 //copy x value of square location
        let y = square[1] + startY;                 //copy y value of square location
    
        //if moving down/up, move down the shadow clone to check for collision
        if(direction === DIRECTION.DOWN || direction === DIRECTION.UP) {
            y++;
        }

        //if(gameBoardArray[x][y+1] === color){ 
        if(typeof stoppedShapeArray[x][y+1] === 'string'){  //if block below shadow clone exists move down (string because SSA stores colors only)
            DeleteTetromino(currTetromino);
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){                                        //if shadow clone is at bottom there is collision
            collision = true;   
            break;
        }

    }

    //if a collision actually happens
    if(collision){
        //handle losing scenario
        if(startY <= 1){
            winOrLose = "Game Over";
            ctx.fillStyle = 'black';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'white';
            ctx.fillText(winOrLose, 310, 261);
        }
        else {
            for(let i = 0; i < tetrominoCopy.length; i++) { //if collision, add tetromino to to stoppedShapeArray
                let square = tetrominoCopy[i];              //copy square
                let x = square[0] + startX;                 //x location of square
                let y = square[1] + startY;                 //y location of square
                stoppedShapeArray[x][y] = currTetrominoColor; //assign color to location of square (not black)
            }
            CheckForCompletedRows();        //checks for completed rows when collision happened
            CreateTetromino();              //create a new tetromino only if collision happens
            direction = DIRECTION.IDLE;     //direction only becomes IDLE if collision happens
            startX = 4;                     //new location of next tetromino
            startY = 0;             
            DrawTetromino();   //draw the tetramino
        }
    }
    return collision;
}




/**CheckForHorizontalCollision()
 * Checks if next block would be in contact with a stopped block horizontally
 * THIS FUNCTION DOESN'T INVOLVE WALL COLLISION
 * if not in contact then collision returns false
 * if in contact then collision returns true
 */
function CheckForHorizontalCollision(){
    let tetrominoCopy = currTetromino;              //make copy of current tetromino
    let collision = false;                          //no collision yet


    for(let i = 0; i < tetrominoCopy.length; i++){  //go through every square of copy tetromino
        let square = tetrominoCopy[i];
        let x = square[0] + startX;                 //copy x value
        let y = square[1] + startY;                 //copy y value

        if(direction === DIRECTION.LEFT) {          //move copy left 1
            x--;
        }
        else if (direction === DIRECTION.RIGHT) {   //move copy right 1
            x++;
        }

        var stoppedShapeVal = stoppedShapeArray[x][y];  //color of the stopped shape at copy's new location
        if(typeof stoppedShapeVal === 'string') {       //if color exists
            collision = true;                           //there is collision
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
            if(startOfDeletion === 0){
                startOfDeletion = y;                    //sets startOfDeletion to row number
            } 
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
 * Moves all rows above complete row down by the amount of completed rows given
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


            if(typeof square === 'string'){             //if square exists
                nextSquare = square;                    //move square to nextSquare
                gameBoardArray[x][y2] = 1;              //new square exists
                stoppedShapeArray[x][y2] = square;      //draw color into stopped

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






/**RotateCW()
 * Rotate the Tetromino clockwise
 * press the e button
 * should rotate about the center most square
 */
function RotateCW(){

    let newRotation = new Array();              //create new array for newRotation
    let tetrominoCopy = currTetromino;          //copy current tetromino
    let currTetrominoBU;                        //create backup in case of error

 
    for(let i = 0; i < tetrominoCopy.length; i++){
        // Here to handle a error with a backup Tetromino
        // We are cloning the array otherwise it would 
        // create a reference to the array that caused the error
        currTetrominoBU = [...currTetromino];
 
        // Find the new rotation by getting the x value of the
        // last square of the Tetromino and then we orientate
        // the others squares based on it [SLIDE]
        let x = tetrominoCopy[i][0];    //get x value of first square
        let y = tetrominoCopy[i][1];    //get y value of second square
        let newX = (GetLastSquareX() - y);  //1
        let newY = x;                       //1
        newRotation.push([newX, newY]);
    }
    DeleteTetromino(currTetromino);
 
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
            DeleteTetromino(currTetromino);
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
    DeleteTetromino(currTetromino);
 
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
            DeleteTetromino(currTetromino);
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
     for(let i = 0; i < currTetromino.length; i++)  //go through each square
    {
        let square = currTetromino[i];              //get each square
        if (square[0] > lastX)                      //if the square's x position is greater then 0
            lastX = square[0];                      //set last x to be the square's x position
    }
    return lastX;
}