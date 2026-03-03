const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
    console.log("Error loading .env file:", result.error);
} else {
    console.log(".env file loaded successfully.");
}
console.log("MONGODB_URI present:", !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
    console.log("URI starts with:", process.env.MONGODB_URI.substring(0, 20));
}
process.exit(0);
