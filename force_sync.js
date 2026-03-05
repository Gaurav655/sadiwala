const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
    console.log(`\nExecuting: ${cmd}`);
    try {
        const out = execSync(cmd, { encoding: 'utf8', stdio: 'inherit' });
        console.log('Success.');
    } catch (e) {
        console.error(`Error with command: ${cmd}`);
        console.error(e.message);
    }
}

// 1. Ensure config
run('git config user.email "gauravkesh.tech@gmail.com"');
run('git config user.name "Gaurav Kesh"');

// 2. Add ALL changes (including deletions)
run('git add -A');

// 3. Commit
run('git commit -m "Final Clean: Removed all unwanted debug scripts and logs"');

// 4. Verification Check
console.log('\n--- VERIFICATION ---');
try {
    const log = execSync('git log -n 1 --oneline', { encoding: 'utf8' });
    console.log(`Last commit: ${log}`);
} catch (e) {
    console.log('No commits found or error reading log.');
}

// 5. Push
run('git push origin main -f');
