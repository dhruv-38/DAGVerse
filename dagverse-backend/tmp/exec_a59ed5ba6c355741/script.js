// Current time
const time = new Date().toLocaleTimeString();

// Array of numbers
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter even numbers
const evenNumbers = numbers.filter(num => num % 2 === 0);

// Log results with timestamp
console.log(`Current time: ${time}`);
console.log(`Even numbers at ${time}:`, evenNumbers);
