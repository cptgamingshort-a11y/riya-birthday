const fs = require('fs');
fs.mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'style.css', 'script.js']) fs.copyFileSync(file, 'dist/' + file);
fs.cpSync('assets', 'dist/assets', { recursive: true });
