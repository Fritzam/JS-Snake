window.onload = function() {

    //
    const gameWindow = document.createElement("div");
    const body = document.getElementById("body");

    //
    gameWindow.style.display = "flex";
    gameWindow.style.flexDirection = "column";
    gameWindow.style.border = "1px solid red";
    gameWindow.style.backgroundColor = "forestgreen";


    //
    const small = 8;
    const medium = 10;
    const large = 12;
    let userAction = false;

    const snakeHeadColor = "saddlebrown";
    const snakeBodyColor = "chocolate";

    let size = large;

    function drawGameBoard(size) {
        for (let i = 1; i <= size; i++) {
            let row = document.createElement("div");
            row.style.display = "flex";
            for (let j = 1; j <= size; j++) {
                const field = document.createElement("div");
                field.id = `Cell-${i}row-${j}column`;
                field.style.border = "1px green solid";
                field.style.width = "50px";
                field.style.height = "50px";
                field.style.borderCollapse = "collapse";
                row.appendChild(field);
            }
            gameWindow.appendChild(row);
        }
    }

    class Snake {
        constructor() {
            this.segments = [
                {position_x: 7, position_y: 6},
                {position_x: 7, position_y: 7},
                {position_x: 7, position_y: 8},
                {position_x: 7, position_y: 9}
            ];
            this.lastSegment = this.getSegment(this.segments.length - 1)
        }

        addSegment() {
            this.segments.push({position_x: this.lastSegment.position_x, position_y: this.lastSegment.position_y});
        }

        updateLastSegment(x, y) {
            this.lastSegment.position_x = x;
            this.lastSegment.position_y = y;
        }

        getHeadPosition() {
            return this.segments[0];
        }

        getSegment(i) {
            return this.segments[i];
        }

        findSegmentID(snake_segment) {
            return `Cell-${this.segments[snake_segment].position_y}row-${this.segments[snake_segment].position_x}column`;
        }

        drawSnake() {
            document.getElementById(this.findSegmentID(0)).style.backgroundColor = snakeHeadColor;
            for (let i = 1; i < this.segments.length; i++) {
                document.getElementById(this.findSegmentID(i)).style.backgroundColor = snakeBodyColor;
            }
        }

        moveSnake(direction) {
            this.updateLastSegment(this.segments[this.segments.length - 1].position_x, this.segments[this.segments.length - 1].position_y);
            let lastSegment = this.getSegment(this.segments.length - 1);
            let initial_coordinates = {...this.segments[0]};
            switch (direction) {
                case "up":
                    this.segments[0].position_y--;
                    break;
                case "down":
                    this.segments[0].position_y++;
                    break;
                case "left":
                    this.segments[0].position_x--;
                    break;
                case "right":
                    this.segments[0].position_x++;
                    break;
            }

            for (let i = 1; i < this.segments.length; i++) {
                let current_coordinates = {...this.segments[i]};
                this.segments[i] = initial_coordinates;
                initial_coordinates = current_coordinates;
            }

            if (!gameLogic.checkFruitEaten()) {
                document.getElementById(`Cell-${lastSegment.position_y}row-${lastSegment.position_x}column`).style.backgroundColor = "initial";
            }
        }
    }

    class GameLogic {
        constructor(snake, size) {
            this.snake = snake;
            this.fruitPosition = {position_x: 7, position_y: 3};
            this.score = 0;
            this.size = size;
        }

        checkOutOfBounds() {
            let x = this.snake.getHeadPosition().position_x;
            let y = this.snake.getHeadPosition().position_y;

            return x === 0 || x > size || y === 0 || y > size;
        }

        checkTailHit() {
            for (let i = 1; i < snake.segments.length; i++) {
                if (snake.segments[0].position_x === snake.segments[i].position_x
                    && snake.segments[0].position_y === snake.segments[i].position_y) {
                    return true;
                }
            }
            return false;
        }

        snakeAlive() {
            return !(this.checkOutOfBounds() || this.checkTailHit());
        }

        checkFruitEaten() {
            return snake.getHeadPosition().position_x === this.fruitPosition.position_x && snake.getHeadPosition().position_y === this.fruitPosition.position_y;
        }

        endTheGame() {
            gameWindow.innerHTML = "";
            const gameOverScreen = document.createElement("div");
            gameOverScreen.classList.add("gameOverWindow");
            gameOverScreen.innerText = `Thank you for playing my game! :)\nYour final score was: ${gameLogic.score}`;

            gameWindow.append(gameOverScreen);
            body.appendChild(gameWindow);
        }

        targetHex(x, y) {
            return `Cell-${y}row-${x}column`;
        }

        drawFruit() {
            document.getElementById(this.targetHex(this.fruitPosition.position_x, this.fruitPosition.position_y)).style.backgroundColor = "red";
        }

        spawnFruit() {
            let positionX
            let positionY;
            let overlaps;

            do {
                positionX = Math.floor(Math.random() * size) + 1;
                positionY = Math.floor(Math.random() * size) + 1;
                overlaps = false;

                for (let i = 0; i < snake.segments.length; i++) {
                    if (positionX === snake.segments[i].position_x && positionY === snake.segments[i].position_y) {
                        overlaps = true;
                        break;
                    }
                }
            } while (overlaps);

            this.fruitPosition.position_x = positionX;
            this.fruitPosition.position_y = positionY;
            this.drawFruit(this.fruitPosition.position_x, this.fruitPosition.position_y);
        }

        gameStart() {
            document.addEventListener("keydown", (event) => {
                userAction = true;
                switch (event.key) {
                    case "ArrowUp":
                        if (lastAction === "ArrowDown") {
                            break;
                        }
                        snake.moveSnake("up");
                        lastAction = "ArrowUp";
                        break;
                    case "ArrowDown":
                        if (lastAction === "ArrowUp") {
                            break;
                        }
                        snake.moveSnake("down");
                        lastAction = "ArrowDown";
                        break;
                    case "ArrowLeft":
                        if (lastAction === "ArrowRight") {
                            break;
                        }
                        snake.moveSnake("left");
                        lastAction = "ArrowLeft"
                        break;
                    case "ArrowRight":
                        if (lastAction === "ArrowLeft") {
                            break;
                        }
                        snake.moveSnake("right");
                        lastAction = "ArrowRight";
                        break;
                    default:
                        snake.moveSnake(lastAction);
                        break;
                }
                if (!gameLogic.snakeAlive()) {
                    gameLogic.endTheGame();
                }
                if (gameLogic.checkFruitEaten()) {
                    gameLogic.score++;
                    gameLogic.spawnFruit();
                    snake.addSegment();
                }
                snake.drawSnake();
            });
        }
    }

    body.appendChild(gameWindow);
    drawGameBoard(size);

    //Initializing snake on screen.
    const snake = new Snake();
    snake.drawSnake();

    const gameLogic = new GameLogic(snake, size);
    gameLogic.drawFruit(gameLogic.fruitPosition.position_x, gameLogic.fruitPosition.position_y);
    let lastAction = "ArrowUp";
    gameLogic.gameStart();

}