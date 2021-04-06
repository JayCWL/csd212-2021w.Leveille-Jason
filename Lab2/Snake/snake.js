
"use strict";

const BLOCK_SIZE = 70;                  // Number of pixels per gameboard grid block
const INITIAL_SNAKE_DIRECTION = 'R';    // One of R, L, U, or D
const INITIAL_SNAKE_SPEED = 5;    // One of R, L, U, or D
const DEFAULT_SNAKE_COLOR = "#721745";

// In the objects below...
// - positions are always objects of the form {x,y} representing positions on the game board grid
// - directions are always one of 'L', 'R', 'U', or 'D' (left, right, up, down)

/**
 * Returns the number of pixels represented by a given size in gameboard blocks
 * @param sizeInBlocks The size to convert in terms of number of gameboard grid squares (blocks)
 * @param includeUnits Whether or not to include the 'px' unit in the returned value
 */
function px(sizeInBlocks, includeUnits = true) {
    let px = sizeInBlocks * BLOCK_SIZE;

    if (includeUnits) {
        px += 'px';
    }

    return px;
}

/**
 * @returns True if the two given positions are the same position on the game board
 * @param {object} p1 An object of the form {x,y} representing a position on the game baord
 * @param {object} p2 An object of the form {x,y} representing a position on the game baord
 */
function isPositionEqual(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y;
}

const board = {
    el: document.getElementById('gameboard'),     // The gameboard element

    /**
     * Sizes the gameboard so that it takes up the maximum amount of space within the browser viewport
     * but has width and height dimensions that are multiples of the BLOCK_SIZE
     */
    resize: function () {

        const w = window.innerWidth;
        const h = window.innerHeight;

        // Size the board so there is a left/right margin by subtracting 2 grid block sizes from the window width
        const maxPxWidth = w - px(2, false);
        // Size the board so there is a bottom margin by subtracting 1 grid block size from the window height
        // Also make room for the header element by removing its height (board.el.offsetTop) from the window height
        const maxPxHeight = h - this.el.offsetTop - px(1, false);

        // At this point boardPxW and boardPxH are the pixel maximum width and height dimensions of the board.
        // If we now divide these dimensions by BLOCK_SIZE and round down we have the grid size of the board.
        this.gridWidth = Math.floor(maxPxWidth / BLOCK_SIZE);
        this.gridHeight = Math.floor(maxPxHeight / BLOCK_SIZE);

        this.el.style.width = px(this.gridWidth);
        this.el.style.height = px(this.gridHeight);

        this.el.style.borderWidth = px(0.5);  // Give the gameboard a 1/2 BLOCK_SIZE border
    },

    /**
     * Place the given element at the correct pixel position for the given grid coordinates.
     * This function assumes that the given element has position:absolute and is positioned relative to #gameboard
     * 
     * @param el The element to position on the gameboard grid
     * @param gridPosition The position (an object of the form {x,y}) on the gameboard grid at which to place the given element
     */
    place: function (el, gridPosition) {
        el.style.top = px(gridPosition.y);
        el.style.left = px(gridPosition.x);
    },

    /**
     * Add the given DOM element to the board's DOM element
     * @param {HTMLElement} el The element to add to the board
     */
    add: function (el) {
        this.el.appendChild(el);
    },

    /**
     * Remove the given DOM element from the board's DOM element
     * @param {HTMLElement} el The element to remove from the board
     */
    remove: function (el) {
        this.el.removeChild(el);
    },

    /**
     * Removes all DOM elements from the game boad
     */
    clear: function () {

        while (board.el.lastChild) {
            board.el.removeChild(board.el.lastChild);
        }

    },

    /**
     * @returns {object} An object of the form {x,y} representing a random position on the game board
     */
    getRandomPosition: function () {
        return {
            x: Math.floor(Math.random() * board.gridWidth),
            y: Math.floor(Math.random() * board.gridHeight)
        };
    },

    /**
     * @returns {object} An object of the form {x,y} representing the grid position nearest the middle of the game board
     */
    getMidPosition: function () {
        return {
            x: Math.floor(board.gridWidth / 2),
            y: Math.floor(board.gridHeight / 2)
        };
    },

    /**
     * @returns {boolean} True if the given point lies inside the game board; false otherwise
     * @param {object} point An object of the form {x,y} representing a grid position
     */
    contains: function (point) {
        return point.x >= 0 && point.x < board.gridWidth && point.y >= 0 && point.y < board.gridHeight
    }
}

/**
 * @returns {object} An object representing one segment of the snake
 * @param {object} gridPosition An object of the form {x,y} representing the position of the segment on the game board
 * @param {string} direction One of 'L', 'R', 'U', or 'D' (left, right, up, down)
 */
function createSnakeSegment(gridPosition, direction) {

    /**
     * @returns {HTMLElement} The DOM element representing one snake element
     */
    function createSnakeSegmentElement() {
        const segmentEl = document.createElement('div');

        segmentEl.className = 'snake-segment';

        segmentEl.style.backgroundColor = DEFAULT_SNAKE_COLOR;
        segmentEl.style.width = segmentEl.style.height = px(1);

        /* TODO: set the 'data-direction' attribute on the segment to the given direction */

        segmentEl.setAttribute("data-direction", direction);

        /* TODO: try using a click handler to prevent clicks on the snake from causing a game to restart */
        segmentEl.onclick = e => e.preventDefault();


        return segmentEl;
    }

    // Return an object with the necessary properties and methods
    return {
        // Properties:
        el: createSnakeSegmentElement(),
        gridPosition: gridPosition,
        _direction: direction,

        // Methods: 

        /**
         * @returns The next position (an object of the form {x,y}) for the given snake segment, given its current direction
         */
        nextPosition: function () {
            switch (this._direction) {
                case 'U':
                    return { x: this.gridPosition.x, y: this.gridPosition.y - 1 };
                case 'D':
                    return { x: this.gridPosition.x, y: this.gridPosition.y + 1 };
                case 'L':
                    return { x: this.gridPosition.x - 1, y: this.gridPosition.y };
                case 'R':
                    return { x: this.gridPosition.x + 1, y: this.gridPosition.y };
                default:
                    return this.gridPosition;
            }
        },

        /**
         * Sets the direction of the segment
         * @param {string} direction One of 'L', 'R', 'U', 'D' (left, right, up, down)
         */
        setDirection: function (direction) {
            this._direction = direction;
            this.el.setAttribute("data-direction", direction);
            /* TODO: update the 'data-direction' attribute of the segment's DOM element to the given direction */
        },

        /**
         * @return The segment's direction
         */
        getDirection: function () {
            return this._direction;
        },

    }
}

/**
 * Resets snake properties
 * @param {object} gridPosition An object of the form {x,y} representing the position of the snake on the game board
 */
function createSnake(gridPosition) {

    const firstSegment = createSnakeSegment(gridPosition, INITIAL_SNAKE_DIRECTION);
    /* TODO: add the class 'head' and 'tail' to the first segment's DOM element (the 'el' property) */

    firstSegment.el.classList.add("head");
    firstSegment.el.classList.add("tail");

    // Return a JS object with the necessary properties and methods
    return {

        // Properties:
        segments: [firstSegment],
        score: 0,
        speed: INITIAL_SNAKE_SPEED,

        // Methods:

        /**
         * @returns The segment that represents the snake's head
         */
        getHead: function () {
            return this.segments[0];
        },

        /**
         * @returns The segment that represents the snake's tail
         */
        getTail: function () {
            return this.segments[this.segments.length - 1];
        },

        /**
         * Sets the direction of the snake's head to the given direction
         * @param {string} direction One of 'L', 'R', 'U', or 'D' (left, right, up, down)
         */
        setHeadDirection: function (direction) {
            this.getHead().setDirection(direction);
        },

        /**
         * Adds a new segment to the snake in the same position as the current tail
         */
        grow: function () {
            const tail = this.segments[this.segments.length - 1];
            const newTail = createSnakeSegment(this.getTail().gridPosition, null);

            /* TODO: remove the class 'tail' from the old tail's DOM element and add it to the new tail's DOM element */

            tail.el.classList.remove("tail");
            newTail.el.classList.add("tail");

            this.segments.push(newTail);
        },

        /**
         * @returns The next position of the snake's head, given its current direction
         */
        nextHeadPosition: function () {
            return this.getHead().nextPosition();
        },

        /**
         * Moves all the snake's segments in their current direction, and updates their directions
         * such that the segments follow the head
         */
        slither: function () {
            // nextDir will be the NEW direction of the segment being processed in each iteration of the loop below
            let nextDir = this.getHead().getDirection();
            for (let s of this.segments) {
                // Update the segment's position to its next position
                s.gridPosition = s.nextPosition();

                const oldDir = s.getDirection();  // Remember its current direction so we can use it as the next nextDir
                s.setDirection(nextDir);       // Update the segment's direction to the nextDir (which was the previous segments direction)
                nextDir = oldDir;            // Finally, set up nextDir for the next iteration
            }
        },

        /**
         * Adds all snake segment DOM elements to the given board
         */
        addTo(board) {
            for (const seg of this.segments) {
                board.add(seg.el);
            }
        },

        /**
         * Places all the segments of the snake at their current position on the given board
         */
        placeOn: function (board) {
            for (const seg of this.segments) {
                board.place(seg.el, seg.gridPosition);
            }
        },

        /**
         * 'Kills' the snake by making each of its segments transparent
         */
        kill: function () {
            for (const seg of this.segments) {
                seg.el.style.opacity = '0.5';
            }
        },

        /**
         * Increments the snake's score by the value of the given food, and causes the snake to grow
         */
        feed: function (food) {
            this.score += food.value;
            this.grow();
            this.speed *= 1.05;
        },

        /**
         * @returns true if any segment of the snake is on the given position
         * @param {object} position An object of the form {x,y} representing the position to check
         */
        isOnPosition: function (position) {
            for (const seg of this.segments) {
                if (isPositionEqual(seg.gridPosition, position)) { return true; }
            }
            return false;
        },

        /**
         * @returns true if the snake's head is at the given position
         * @param {object} position An object of the form {x,y} representing the position to check
         */
        isHeadOnPosition: function (position) {
            return isPositionEqual(this.getHead().gridPosition, position);
        },

        /**
         * @return The size of the snake
         */
        getSize: function () {
            return this.segments.length;
        }

    }
}


/**
 * @returns a new food object at a random game board position
 */
function createFood(gridPosition) {

    /**
     * @returns {HTMLelement} The DOM element representing food on the game board
     */
    function createFoodElement() {
        let f = document.createElement('div');
        f.className = 'food';
        f.style.width = f.style.height = px(1);
        f.style.borderRadius = '50%';
        f.style.backgroundColor = 'green';

        return f;
    }

    // Return a JS object with the necessary properties and methods
    return {

        // Properties: 

        el: createFoodElement(),
        value: 10,
        gridPosition: gridPosition,

        // Methods:

        /**
         * Add a food's DOM element to the board
         */
        addTo: function (board) {
            board.add(this.el);
        },

        /**
         * Place a food's DOM element at the food's position on the given board
         */
        placeOn: function (board) {
            board.place(this.el, this.gridPosition);
        },

        /**
         * Removes the food DOM element from the given board
         */
        removeFrom: function (board) {
            board.remove(this.el);
        }

    };
}

/**
 * Show the given element by adding the 'show' class to it
 * @param {HTMLElement} el The element to show
 */
function show(el) {
    el.classList.add('show');
}

/**
 * Hide the given element by removing the 'show' class from it
 * @param {HTMLElement} el The element to show
 */
function hide(el) {
    el.classList.remove('show');
}

/**
 * Update the score element's text to reflect the current
 */
function updateGameStats(score, size, speed) {
    document.getElementById('score').innerText = score;

    /* TODO: update the 'size' and 'speed' elements with the given size and speed */

    document.getElementById("size").innerText = size;
    document.getElementById("speed").innerText = speed.toFixed(2) + " Blocks per second";
}

// An object that keeps track of the overall game state
const game = {

    // Properties:

    board: board,
    snake: null,
    food: null,
    isPaused: false,
    manualUpdate: location.search.includes("manual"),
    timerId: null,

    // Methods:

    /**
     * @returns True if the game is over (the snake has hit a wall or one of its own segments)
     */
    isOver: function () {

        if (this.snake === null) { return false; }

        const nextHeadPosition = this.snake.nextHeadPosition();

        // Game is over if either the next head position is outside the board...
        return !this.board.contains(nextHeadPosition)
            || // ... or ...
            // The next position is the same as another segment's
            this.snake.isOnPosition(nextHeadPosition);
    },

    /**
     * Starts a new game
     */
    start: function () {
        this.reset();
        hide(document.getElementById('menu'));
        this.restartTimer();
    },

    /**
     * Pause/unpause the game
     */
    togglePause: function () {
        /* TODO: pause/unpause the game when this function is called */
        if ( this.isPaused ) {
            this.isPaused = false;
            hide(document.getElementById('paused'));
            this.restartTimer();
        } else {
            this.isPaused = true;
            show(document.getElementById('paused'));
            this.stopTimer();
        }
    },

    restartTimer: function () {
        /* TODO: restart the game's interval timer */
        if ( location.search.includes('manual') ) { return; }

        this.stopTimer();

        const interval = 2000 / this.snake.speed;
        this.timerId = setInterval(() => {
            this.update();
        }, interval);
    },

    stopTimer: function () {
        /* TODO: cancel the game's interval timer */
        clearInterval(this.timerId);
    },

    /**
     * Change the snake direction AND update the game state
     * @param {string} direction One of 'L', 'R', 'U', 'D' (left, right, up, down)
     */
    updateDirection: function (direction) {
        this.snake.setHeadDirection(direction);
        this.update();
        this.restartTimer();
    },

    /**
     * Updates the game state based on the current location and direction of snake segments
     */
    update: function () {

        if (this.isOver()) {
            show(document.getElementById('game-over'));
            this.snake.kill();

            /* TODO: remove the keydown listener from the window object */
            window.removeEventListener('keydown', handleKeyDown);
            /* TODO: stop the interval timer */
            this.stopTimer();

        } else {
            this.snake.slither();

            if (this.snake.isHeadOnPosition(this.food.gridPosition)) {
                this.snake.feed(this.food);
                this.restartTimer();
                this.snake.addTo(this.board);  // Required in order to get the new segment added onto the board

                this.food.removeFrom(this.board);

                // The current food has been eaten! Make a new one at a random location
                this.food = createFood(this.board.getRandomPosition());
                this.food.addTo(this.board);
                this.food.placeOn(this.board);

                updateGameStats(this.snake.score, this.snake.getSize(), this.snake.speed);
            }

            // Finally, place the snake segments at their updated positions
            this.snake.placeOn(this.board);
        }
    },

    /**
     * Resets all necessary objects to a state ready for a new game
     */
    reset: function () {

        this.board.clear();
        this.board.resize();

        // Needs to happen after the board has been created and sized
        this.snake = createSnake(this.board.getMidPosition());
        this.food = createFood(this.board.getRandomPosition());

        this.snake.addTo(this.board);
        this.food.addTo(this.board);

        this.snake.placeOn(this.board);
        this.food.placeOn(this.board);

        hide(document.getElementById('game-over'));

        updateGameStats(this.snake.score, this.snake.getSize(), this.snake.speed);

        /* TODO: add a keydown listener to the window object */

        window.addEventListener('keydown', handleKeyDown);

    },

    /**
     * Respond to a pressed key
     */
    keyDown: function (key) {
        /* TODO : respond when game-related keys are pushed down */
        if (this.isPaused) {
            if (key === " ") {
                this.togglePause();
            }
        } else {
            switch (key) {
                case "ArrowDown":
                    this.updateDirection("D");
                    break;
                case "ArrowUp":
                    this.updateDirection("U");
                    break;
                case "ArrowLeft":
                    this.updateDirection("L");
                    break;
                case "ArrowRight":
                    this.updateDirection("R");
                    break;
                case " ":
                    this.togglePause();
            }
        }
    }
}

function handleKeyDown(event) {
    /* TODO: call game.keydown only if the event's key is one of the game-related keys */
    const keys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", " "]
    if (keys.includes(event.key)) {
        game.keyDown(event.key);
    }
}

/* TODO: prevent the user from accidentally closing the window/tab if they are in the middle of a game */
window.addEventListener('beforeunload', function(event) {

    if ( ! game.isOver() && ! document.getElementById('menu').classList.contains('show') ) {
        event.preventDefault();
        event.returnValue = "You are in the middle of a game!  Are you sure you want to leave?";
    }
    
});

/* TODO: show the main menu if the user clicks anywhere on the game after the game is over */
    document.body.addEventListener("click", function (event) {
        if (game.isOver() && !event.target.classList.contains("snake-segment")) {
            show(document.getElementById("menu"));
        }
    });
