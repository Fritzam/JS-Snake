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
        }

        addSegment(position_x, position_y) {
            this.segments.push({position_x, position_y});
        }

        getHeadPosition() {
            return this.segments[0];
        }

        getSegments() {
            return this.segments;
        }

        findSegmentID(snake_segment) {
            return `Cell-${this.segments[snake_segment].position_y}row-${this.segments[snake_segment].position_x}column`;
        }

        drawSnake() {
            document.getElementById(this.findSegmentID(0)).style.backgroundColor = "red";
            for (let i = 1; i < this.segments.length; i++) {
                document.getElementById(this.findSegmentID(i)).style.backgroundColor = "green";
            }
        }

        moveSnake(direction) {
            document.getElementById(this.findSegmentID(this.segments.length - 1)).style.backgroundColor = "initial";
            let initial_coordinates = {...this.segments[0]};

            switch(direction) {
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
        }
    }

    body.appendChild(gameWindow);
    drawGameBoard(size);

    //Initializing snake on screen.
    const snake = new Snake();
    snake.drawSnake();

    class GameLogic {
        constructor(snake) {
            this.snake = snake;
        }

        checkOutOfBounds() {
            let x = this.snake.getHeadPosition().position_x;
            let y = this.snake.getHeadPosition().position_y;

            return x === 0 || x > size || y === 0 || y > size;
        }

        endTheGame() {
            const gameOverScreen = document.createElement("div");
            gameOverScreen.textContent = "Thank you for playing the game! :)";
            gameOverScreen.id = "gameOver";
            gameWindow.innerHTML = "";
            gameWindow.appendChild(gameOverScreen);
        }
    }
    const gameLogic = new GameLogic(snake);

    document.addEventListener("keydown", function(event) {
        switch (event.key) {
            case "ArrowUp":
                snake.moveSnake("up");
                break;
            case "ArrowDown":
                snake.moveSnake("down");
                break;
            case "ArrowLeft":
                snake.moveSnake("left");
                break;
            case "ArrowRight":
                snake.moveSnake("right");
                break;
        }
        if (gameLogic.checkOutOfBounds()) {
            gameLogic.endTheGame()
        } else {
            snake.drawSnake()
        }
    });
}