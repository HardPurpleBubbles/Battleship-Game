let view = {
    displayMessage: function(msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');

    },

    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');

    },
};

let model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [ {locations: [0, 0, 0], hits: ['', '', '']},
             {locations: [0, 0, 0], hits: ['', '', '']},
             {locations: [0, 0, 0], hits: ['', '', '']} ],
    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');
                if (this.isSunk(ship)) {
                    view.displayMessage('You sunk my battleship!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed!');
        return false; 
    },
    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            };
        };
        return true;
    },
    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
            
        };
    },
    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        };
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push((row + i) + '' + col);
            };
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                };
            };
        };
        return false;
    }
};

let controller = {
    dataInput: [],
    guesses: 0,
    processGuess: function(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses = this.dataInput.length;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(playerName + '! You sank all my battleships, in ' + this.guesses + ' guesses');
            };
        };
    }
};

function parseGuess(guess) {
    let alhabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        alert('Oops, please enter a letter and a number on the board.');
    } else {
        let firstChar = guess[0].toUpperCase();
        let row = alhabet.indexOf(firstChar);
        let column = guess[1];
        if (isNaN(row) || isNaN(column)) {
            alert('Oops, that isn`t on the board.');
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert('Oops, that`s off the board!')
        } else if (controller.dataInput.indexOf(row + column) === -1) {
            controller.dataInput.push(row + column);
            return row + column;
        } else {
            alert('Oops, this value has already been entered')
        }
    };
    return null;
};

function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeydown = handleKeyPress;

    model.generateShipLocations();
};

function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    };
};

function handleFireButton() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = '';
    
};

window.onload = init;

let playerName = prompt('Введите ваше имя:')
