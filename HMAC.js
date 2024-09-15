// Program to verify HMAC using HMAC key and Computer move
const crypto = require('crypto');

// Retrieve arguments from the command line
const args = process.argv.slice(2); // Skip the first two args (node and script name)

if (args.length !== 2) {
    console.error('Error: You must provide exactly two arguments: <HMAC key> <move>');
    console.error('Example: node verifyHMAC.js BD9BE48334BB9C5EC263953DA54727F707E95544739FCE7359C267E734E380A2 rock');
    process.exit(1);
}

const key = args[0];  // First argument is the HMAC key (hex format)
const move = args[1]; // Second argument is the move (utf8)

// Generate HMAC using the provided key and move
const hmac = crypto.createHmac('sha3-256', Buffer.from(key, 'hex'))
                   .update(move, 'utf8') // Ensure encoding consistency (utf8)
                   .digest('hex');

console.log(`Move: ${move}`);
console.log(`HMAC Key: ${key}`);
console.log('Generated HMAC:', hmac);
