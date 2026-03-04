const { execSync } = require('child_process');
const fs = require('fs');

const logPath = 'git_manual_log.txt';
fs.writeFileSync(logPath, 'Starting Git Debug Log\n\n');

function run(cmd) {
    fs.appendFileSync(logPath, `\n> ${cmd}\n`);
    try {
        const out = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
        fs.appendFileSync(logPath, out || '(no output)\n');
    } catch (e) {
        fs.appendFileSync(logPath, `Error: ${e.message}\n`);
        fs.appendFileSync(logPath, `Stderr: ${e.stderr}\n`);
        fs.appendFileSync(logPath, `Stdout: ${e.stdout}\n`);
    }
}

run('git init');
run('git config --local user.email "gauravkesh.tech@gmail.com"');
run('git config --local user.name "Gaurav Kesh"');
run('git add .');
run('git commit -m "Initial commit for Sadiwala Project"');
run('git branch -M main');
run('git log -n 1 --oneline');
run('git remote add origin https://github.com/Gaurav655/sadiwala.git');
run('git remote -v');
run('git status');
