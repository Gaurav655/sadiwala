const fs = require('fs');
const path = require('path');

const gitPath = path.join(process.cwd(), '.git');
console.log('Checking path:', gitPath);

if (fs.existsSync(gitPath)) {
    console.log('.git exists!');
    console.log('Contents:', fs.readdirSync(gitPath));
} else {
    console.log('.git DOES NOT exist.');
}
