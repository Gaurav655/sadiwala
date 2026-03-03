const { execSync } = require('child_process');

function run(cmd) {
    console.log(`\n> ${cmd}`);
    try {
        const out = execSync(cmd, { encoding: 'utf8' });
        console.log(out || '(no output)');
    } catch (e) {
        console.error(`Error: ${e.message}`);
        console.error(`Stderr: ${e.stderr}`);
        console.error(`Stdout: ${e.stdout}`);
    }
}

run('git config --local user.email "gauravkesh.tech@gmail.com"');
run('git config --local user.name "Gaurav Kesh"');
run('git status');
run('git add .');
run('git commit -m "Initial commit for Sadiwala Project"');
run('git branch -M main');
run('git branch');
run('git log -n 1 --oneline');
run('git remote -v');
