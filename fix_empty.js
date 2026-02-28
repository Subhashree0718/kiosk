const fs = require('fs');
const path = require('path');

function fixEmptyFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixEmptyFiles(fullPath);
        } else if (file.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.trim() === '') {
                const name = path.basename(file, '.jsx');
                const defaultContent = `import React from 'react';\n\nexport default function ${name}() {\n  return (\n    <div className='p-6'>\n      <h1 className='text-3xl font-bold mb-6'>${name}</h1>\n      <p>This service is currently under development.</p>\n    </div>\n  );\n}\n`;
                fs.writeFileSync(fullPath, defaultContent);
                console.log('Fixed:', fullPath);
            }
        }
    }
}

fixEmptyFiles(path.join(__dirname, 'apps/kiosk/src/pages/electricity'));
