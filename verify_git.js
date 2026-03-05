const { execSync } = require('child_process');
const fs = require('fs');

try {
    const status = execSync('git status', { encoding: 'utf8' });
    const log = execSync('git log -n 5 --oneline', { encoding: 'utf8' });
    const remote = execSync('git remote -v', { encoding: 'utf8' });

    const results = `STATUS:\n${status}\n\nLOG:\n${log}\n\nREMOTE:\n${remote}`;
    console.log(results);
    fs.writeFileSync('git_status_verification.txt', results);
} catch (e) {
    console.error('Error:', e.message);
    if (e.stdout) console.error('Stdout:', e.stdout);
    if (e.stderr) console.error('Stderr:', e.stderr);
}
