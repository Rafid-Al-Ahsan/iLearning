const crypto = require('crypto');
const readlineSync = require('readline-sync');

// Function to generate HMAC with SHA3-256
function generateHMAC(key, move) {
    return crypto.createHmac('sha3-256', Buffer.from(key, 'hex'))
                 .update(move, 'utf8')
                 .digest('hex');
}

// Function to generate a 256-bit random key (32 bytes)
function generateKey() {
    return crypto.randomBytes(32).toString('hex');
}

// Function to determine who wins
function determineWinner(userMove, computerMove, moves) {
    const totalMoves = moves.length;
    const userIndex = moves.indexOf(userMove);
    const computerIndex = moves.indexOf(computerMove);

    if (userIndex === computerIndex) return 'Draw';

    // Calculate the half-point in the list to determine winners and losers
    const half = Math.floor(totalMoves / 2);

    // If the computer's move index is within the next "half" moves, the user loses.
    // Else, the user wins.
    if (
        (computerIndex > userIndex && computerIndex <= userIndex + half) ||
        (computerIndex < userIndex && userIndex - computerIndex > half)
    ) {
        return 'You lose!';
    } else {
        return 'You win!';
    }
}

// Function to display help (Formatted table of winning moves)
function displayHelp(moves) {
    const totalMoves = moves.length;
    const resultsTable = [];

    // Build the table row by row
    for (let i = 0; i < totalMoves; i++) {
        const row = {};
        row['PC/User \\ Move'] = moves[i];  // First column header for row names
        for (let j = 0; j < totalMoves; j++) {
            if (i === j) {
                row[moves[j]] = 'Draw';
            } else if (determineWinner(moves[i], moves[j], moves) === 'You win!') {
                row[moves[j]] = 'Win';
            } else {
                row[moves[j]] = 'Lose';
            }
        }
        resultsTable.push(row);
    }

    console.table(resultsTable);
}

// Ensure valid parameters (odd number and no duplicates)
const moves = process.argv.slice(2);

if (moves.length % 2 === 0 || moves.length < 3) {
    console.error("Error: You must provide an odd number of unique parameters greater than or equal to 3.");
    console.error("Example: node game.js rock paper scissors");
    process.exit(1);
}

if (new Set(moves).size !== moves.length) {
    console.error("Error: Moves must be unique.");
    process.exit(1);
}

while (true) {
    // Generate new random key and computer move for each round
    const key = generateKey();
    const computerMove = moves[Math.floor(Math.random() * moves.length)];
    const hmac = generateHMAC(key, computerMove);

    // Display the HMAC to the user
    console.log("HMAC:", hmac);

    // Display the menu for user input
    console.log("\nAvailable moves:");
    moves.forEach((move, index) => console.log(`${index + 1} - ${move}`));
    console.log("0 - Exit");
    console.log("? - Help");

    // Get user input
    const userInput = readlineSync.question("Enter your move: ");

    if (userInput === '0') {
        console.log("Exiting the game...");
        break;
    } else if (userInput === '?') {
        displayHelp(moves);
        continue;
    }

    const userMoveIndex = parseInt(userInput) - 1;

    if (isNaN(userMoveIndex) || userMoveIndex < 0 || userMoveIndex >= moves.length) {
        console.log("Invalid choice, please try again.");
        continue;
    }

    const userMove = moves[userMoveIndex];
    console.log(`Your move: ${userMove}`);
    console.log(`Computer move: ${computerMove}`);

    // Determine the winner
    const result = determineWinner(userMove, computerMove, moves);
    console.log(result);

    // Display the HMAC key to verify the computer's move
    console.log("HMAC key:", key);
    console.log("\n-----------------------------------\n");
}
