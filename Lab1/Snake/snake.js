
"use strict";

const BLOCK_SIZE = 50;                  // Number of pixels per gameboard grid block
const INITIAL_SNAKE_DIRECTION = 'R';    // One of R, L, U, or D
const DEFAULT_SNAKE_COLOR = "#721745";

// In the objects below...
// - positions are always objects of the form {x,y} representing positions on the game board grid
// - directions are always one of 'L', 'R', 'U', or 'D' (left, right, up, down)

/**
 * Returns the number of pixels represented by a given size in gameboard blocks
 * @param sizeInBlocks The size to convert in terms of number of gameboard grid squares (blocks)
 * @param includeUnits Whether or not to include the 'px' unit in the returned value
 */
function px(sizeInBlocks, includeUnits=true) {
    let px = sizeInBlocks * BLOCK_SIZE; 
    
    if ( includeUnits ) {
        px += 'px';
    }

    return px;
}

/**
 * @returns True if the two given positions are the same position on the game board
 * @param {object} p1 An object of the form {x,y} representing a grid position on the game baord
 * @param {object} p2 An object of the form {x,y} representing a grid position on the game baord
 */
function isPositionEqual(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y;
}

const board = {
    /* TODO : add a property named 'el' that is a reference to the div with id 'gameboard'
                This will be the DOM element that represents the board in the browser viewport.
    */
    el : document.getElementById('gameboard'),
    /**
     * Sizes the gameboard so that it takes up the maximum amount of space within the browser viewport
     * but has width and height dimensions that are multiples of the BLOCK_SIZE
     */
    resize : function() {

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

        /* TODO : Style the board's DOM element, 'el', with the correct width and height 
                    based on the gridWidth and gridHeight above */
        this.el.style.height = px(this.gridHeight);
        this.el.style.width = px(this.gridWidth);
        /* TODO: Style the board's DOM element, 'el', with a 1/2 BLOCK_SIZE border width */
        this.el.style.borderWidth = px(0.25);
        
    },

    /**
     * Place the given element at the correct pixel position for the given grid coordinates.
     * This function assumes that the given element has position:absolute and is positioned relative to #gameboard
     * 
     * @param el The element to position on the gameboard grid
     * @param gridPosition The position (an object of the form {x,y}) on the gameboard grid at which to place the given element
     */
    place : function(el, gridPosition) {
        /* TODO : set the given element's CSS position to the pixel position that corresponds to the given gridPosition */
        el.style.top = px(gridPosition.y);
        el.style.left = px(gridPosition.x);
    },

    /**
     * Add the given DOM element to the board's DOM element
     * @param {HTMLElement} el The element to add to the board
     */
    add : function(el) {
        /* TODO : add the given element to the board's DOM element, 'el' */
        this.el.appendChild(el);
    },

    /**
     * Remove the given DOM element from the board's DOM element
     * @param {HTMLElement} el The element to remove from the board
     */
    remove : function(el) {
        /* TODO : remove the given element from the board's DOM element, 'el' */
        this.el.removeChild(el);
    },

    /**
     * Removes all DOM elements from the game boad
     */
    clear : function() {
        /* TODO : remove all elements from the board's DOM element, 'el' */
        while(board.el.firstChild){
            board.el.removeChild(board.el.firstChild)
        }
    },

    /**
     * @returns {object} An object of the form {x,y} representing a random position on the game board
     */
    getRandomPosition : function() {
        /* TODO : return a random position inside the game board */
        return { x: Math.floor(Math.random()*board.gridWidth), y: Math.floor(Math.random()*board.gridHeight)};
    },

    /**
     * @returns {object} An object of the form {x,y} representing the grid position nearest the middle of the game board
     */
    getMidPosition : function() {
        /* TODO : return a grid-aligned position closest to the midpoint of the board */
        return { x: board.gridWidth / 2, y: board.gridHeight / 2 };
    },

    /**
     * @returns {boolean} True if the given point lies inside the game board; false otherwise
     * @param {object} point An object of the form {x,y} representing a grid position
     */
    contains : function(point) {
        /* TODO : return true only if the given point is inside the board's grid width and height */
        if(point.y >= 0 && point.y < board.gridHeight && point.x >= 0 && point.x < board.gridWidth){
            return true;
        }
        return false;
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
        /* TODO : create a new snake segment element as per lab instructions */
        const snakeSegment = document.createElement('div');
        snakeSegment.className = "snake-segment";
        snakeSegment.style.backgroundColor = DEFAULT_SNAKE_COLOR;
        snakeSegment.style.width = px(1);
        snakeSegment.style.height = px(1);

        return snakeSegment;
    }

    // Return an object with the necessary properties and methods
    return {
        // Properties:
        el : createSnakeSegmentElement(),
        gridPosition : gridPosition,
        direction : direction,

        // Methods: 

        /**
         * @returns The next position (an object of the form {x,y}) for the given snake segment, given its current direction
         */
        nextPosition : function() {
            switch( this.direction ) {
                case 'U':
                    return {x: this.gridPosition.x, y: this.gridPosition.y-1};
                case 'D':
                    return {x: this.gridPosition.x, y: this.gridPosition.y+1};
                case 'L':
                    return {x: this.gridPosition.x-1, y: this.gridPosition.y};
                case 'R':
                    return {x: this.gridPosition.x+1, y: this.gridPosition.y};
                default:
                    return this.gridPosition;
            }
        }
        
    }
}

/**
 * Resets snake properties
 * @param {object} gridPosition An object of the form {x,y} representing the position of the snake on the game board
 */
function createSnake(gridPosition) {

    // Return a JS object with the necessary properties and methods
    return {

        // Properties:
        segments : [
            createSnakeSegment(gridPosition, INITIAL_SNAKE_DIRECTION)
        ],
        score: 0,

        // Methods:

        /**
         * @returns The segment that represents the snake's head
         */
        getHead : function() {
            return this.segments[0];
        },

        /**
         * @returns The segment that represents the snake's tail
         */
        getTail : function() { 
            return this.segments[this.segments.length-1];
        },
        
        /**
         * Sets the direction of the snake's head to the given direction
         * @param {string} direction One of 'L', 'R', 'U', or 'D' (left, right, up, down)
         */
        setHeadDirection : function(direction) {
            this.getHead().direction = direction;
        },
                
        /**
         * Adds a new segment to the snake in the same position as the current tail
         */
        grow : function() {
            const newTail = createSnakeSegment(this.getTail().gridPosition, null);
            this.segments.push(newTail);
        },

        /**
         * @returns The next position of the snake's head, given its current direction
         */
        nextHeadPosition : function() {
            return this.getHead().nextPosition();
        },

        /**
         * Moves all the snake's segments in their current direction, and updates their directions
         * such that the segments follow the head
         */
        slither : function() {
            // nextDir will be the NEW direction of the segment being processed in each iteration of the loop below
            let nextDir = this.getHead().direction;
            for ( let s of this.segments ) {
                // Update the segment's position to its next position
                s.gridPosition = s.nextPosition();

                const oldDir = s.direction;  // Remember its current direction so we can use it as the next nextDir
                s.direction = nextDir;       // Update the segment's direction to the nextDir (which was the previous segments direction)
                nextDir = oldDir;            // Finally, set up nextDir for the next iteration
            }
        },

        /**
         * Adds all snake segment DOM elements to the given board
         */
        addTo(board) {
            /* TODO : use the given board's add() method add all the snake's segments to the board */
            for (const seg of this.segments){
                board.add(seg.el);
            }
            
        },

        /**
         * Places all the segments of the snake at their current position on the given board
         */
        placeOn : function(board) {
            /* TODO : use the given board's place() method position all the snake's segments correctly on the board */
            for (const seg of this.segments){
                board.place(seg.el, seg.gridPosition);
            }
        },

        /**
         * 'Kills' the snake by making each of its segments transparent
         */
        kill : function() {
            /* TODO : Set opacity of each snake segment to fully transparent */
            for (const seg of this.segments){
                seg.el.style.opacity = "0"
            }
        },

        /**
         * Increments the snake's score by the value of the given food, and causes the snake to grow
         */
        feed : function(food) {
            this.score += food.value;
            this.grow();
        },

        /**
         * @returns true if any segment of the snake is on the given position
         * @param {object} position An object of the form {x,y} representing the position to check
         */
        isOnPosition : function(position) {
            /* TODO : return true if any segment of the snake is on the given grid position */
            for (const seg of this.segments){
                if (isPositionEqual(seg.gridPosition, position)) {return true;}
            }
            return false;
        },

        /**
         * @returns true if the snake's head is at the given position
         * @param {object} position An object of the form {x,y} representing the position to check
         */
        isHeadOnPosition : function(position) {
            /* TODO: return true if the snake's head is on the given position */
                if (isPositionEqual(this.getHead().gridPosition, position)) {return true}
            return false;
        },

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
        /* TODO : create a new food element as per lab instructions */
        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.height = px(1);
        foodElement.style.width = px(1);
        foodElement.style.borderRadius = px(0.5);
        foodElement.style.backgroundColor = 'orange';

        return foodElement
    }

    // Return a JS object with the necessary properties and methods
    return {

        // Properties: 

        el : createFoodElement(),
        value : 10,
        gridPosition : gridPosition,

        // Methods:

        /**
         * Add a food's DOM element to the board
         */
        addTo : function(board) {
            /* TODO : use the given board's add() method to add this food's DOM element, 'el' to the board */
            board.add(this.el);
            
        },

        /**
         * Place a food's DOM element at the food's position on the given board
         */
        placeOn : function(board) {
            /* TODO : use the given board's place() method to position this food's DOM element, 'el' on the board */
            board.place(this.el, this.gridPosition);
        
        },

        /**
         * Removes the food DOM element from the given board
         */
        removeFrom : function(board) {
            /* TODO : use the given board's remove() method to remove this food's DOM element from the board */
            board.remove(this.el);
        }

    };
}

/**
 * Show the given element by adding the 'show' class to it
 * @param {HTMLElement} el The element to show
 */
function show(el) {
    /* TODO : add the class 'show' to the given DOM element, el */
    el.classList.add("show")
}

/**
 * Hide the given element by removing the 'show' class from it
 * @param {HTMLElement} el The element to show
 */
function hide(el) {
    /* TODO : remove the class 'show' from the given DOM element, el */
    el.classList.remove("show")
}

/**
 * Update the score element's text to reflect the current
 */
function updateScoreElement(score) {
    /* TODO : set the content of the <span> with id 'score' to the given score value */
    document.getElementById("score").innerText = score;
}

// An object that keeps track of the overall game state
const game = {

    // Properties:

    board : board,
    snake : null,
    food : null,

    // Methods:
        
    /**
     * @returns True if the game is over (the snake has hit a wall or one of its own segments)
     */
    isOver : function() {
        
        const nextHeadPosition = this.snake.nextHeadPosition();
            
        // Game is over if either the next head position is outside the board...
        return ! this.board.contains(nextHeadPosition) 
            ||
            // ... or ...
            // The next position is the same as another segment's
            this.snake.isOnPosition(nextHeadPosition);
    },

    /**
     * Starts a new game
     */
    start : function() {
        this.reset();
        /* TODO : use the hide() function above to hide the main menu div */
        hide(document.getElementById("menu"));
    },

    /**
     * Updates the game state based on the current location and direction of snake segments
     */
    update : function() {
        
        if ( this.isOver() ) {
            /* TODO : use the show() function above to show the 'game-over' div */
            this.snake.kill();
            show(document.getElementById("game-over"))
        } else {
            this.snake.slither();

            if ( this.snake.isHeadOnPosition(this.food.gridPosition) ) {
                this.snake.feed(this.food);
                this.snake.addTo(this.board);  // Required in order to get the new segment added onto the board

                this.food.removeFrom(this.board);

                // The current food has been eaten! Make a new one at a random location
                this.food = createFood(this.board.getRandomPosition());
                this.food.addTo(this.board);
                this.food.placeOn(this.board);

                updateScoreElement(this.snake.score);
            }
            
            // Finally, place the snake segments at their updated positions
            this.snake.placeOn(this.board);  
        }
    },

    /**
     * Resets all necessary objects to a state ready for a new game
     */
    reset : function() {
        hide(document.getElementById("game-over"))

        /* TODO : use the hide() function above to hide the 'game-over' element */

        this.board.clear();
        this.board.resize();

        // Needs to happen after the board has been created and sized
        this.snake = createSnake(this.board.getMidPosition());
        this.food = createFood(this.board.getRandomPosition());

        this.snake.addTo(this.board);
        this.food.addTo(this.board);

        this.snake.placeOn(this.board);
        this.food.placeOn(this.board);

        updateScoreElement(this.snake.score);
    }


}