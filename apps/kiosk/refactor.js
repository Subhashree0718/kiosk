import fs from 'fs';
import path from 'path';

// Helper: bulk replace in a file
function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    for (const { from, to } of replacements) {
        content = content.replace(from, to);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${path.basename(filePath)}`);
    } else {
        console.log(`No changes made to: ${path.basename(filePath)}`);
    }
}

// Map themes to keywords
const getThemeAndIcon = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    let icon = 'assignment';
    let theme = 'blue';

    const iconMatch = content.match(/<span className="material-icons"[^>]*>([^<]+)<\/span>/);
    if (iconMatch) icon = iconMatch[1];

    if (content.includes('from-[#1a5276]') || content.includes('from-blue-') || filePath.includes('ServiceConnection')) theme = 'blue';
    else if (content.includes('from-[#f39c12]') || content.includes('from-[#d35400]') || content.includes('from-orange-')) theme = 'saffron';
    else if (content.includes('from-[#27ae60]') || content.includes('from-green-') || filePath.includes('Agriculture')) theme = 'green';
    else if (content.includes('from-[#e74c3c]') || content.includes('from-red-') || filePath.includes('OneDay')) theme = 'red';
    else if (content.includes('from-[#8e44ad]') || content.includes('from-purple-') || filePath.includes('Group')) theme = 'purple';
    else if (content.includes('from-teal-') || filePath.includes('Solar')) theme = 'teal';
    else if (content.includes('from-indigo-') || filePath.includes('Shifting')) theme = 'navy';

    return { theme, icon };
};

const pagesDir = path.join(process.cwd(), 'src', 'pages', 'electricity', 'apps');
const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('App_') && f.endsWith('.jsx'));

for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Skip if already refactored
    if (content.includes('KioskFormCard')) continue;

    // Need to add KioskFormCard import
    let importAdded = false;

    // Add import right after GovLayout
    let newContent = content.replace(
        /import GovLayout from '([^']+GovLayout\.jsx)';/,
        `import GovLayout from '$1';\nimport KioskFormCard from '../../../components/KioskFormCard.jsx';`
    );

    // If no GovLayout, add at top
    if (newContent === content) {
        newContent = newContent.replace(
            /import React([^;]+);/,
            `import React$1;\nimport KioskFormCard from '../../../components/KioskFormCard.jsx';`
        );
    }

    // Find the Title and Subtitle
    const titleMatch = newContent.match(/<h2[^>]*>([^<]+)<\/h2>/);
    const subtitleMatch = newContent.match(/<p[^>]*>([^<]+)<\/p>/);

    const title = titleMatch ? titleMatch[1] : file.replace('App_', '').replace('.jsx', '');
    const subtitle = subtitleMatch ? subtitleMatch[1] : 'Please fill out the form below.';

    const { theme, icon } = getThemeAndIcon(filePath);

    // The big wrapper regex: replace everything from <div className="max-w-... "> to the start of <form>
    const wrapperRegex = /<div className="max-w-[^>]+>\s*<div className="bg-white rounded-2xl[^>]+>\s*<div className="bg-gradient-to-r[^>]+>[\s\S]*?<\/div>([\s\S]*?)<form/m;

    if (wrapperRegex.test(newContent)) {
        newContent = newContent.replace(wrapperRegex, `
    <KioskFormCard 
        title="${title}" 
        subtitle="${subtitle}"
        icon="${icon}"
        theme="${theme}"
    >
        <form className="kiosk-form"`);

        // Remove the closing tags
        newContent = newContent.replace(/<\/form>\s*<\/div>\s*<\/div>/, '</form>\n    </KioskFormCard>');
    }

    // Forms without the big gradient wrapper (generic ones)
    else if (newContent.includes('<div className="max-w-')) {
        const genericWrapper = /<div className="max-w-[^>]+>([\s\S]*?)<\/div>\s*<\/GovLayout>/m;

        // We can't automatically parse perfectly, but we can do a targeted replace.
        // Basically just replacing styling
    }

    // --- Regex replace form elements --- //

    // Sections
    newContent = newContent.replace(/<h3 className="[^"]+flex items-center gap-2">\s*<span className="material-icons[^>]*>([^<]+)<\/span>\s*([^<]+)\s*<\/h3>/g,
        '<h3 className="form-section-head"><span className="material-icons">$1</span> $2</h3>');

    // Labels
    newContent = newContent.replace(/<label className="text-sm font-semibold text-gray-700">/g, '<label className="form-label">');
    newContent = newContent.replace(/<span className="text-red-500">\*<\/span>/g, '<span className="req-star">*</span>');

    // Inputs & Selects
    newContent = newContent.replace(/className="p-3\.5 bg-gray-50 border border-gray-200[^"]*"/g, 'className="form-input"');
    newContent = newContent.replace(/className="p-2\.5 bg-gray-50 border border-gray-200[^"]*file:[^"]*"/g, 'className="form-input"');

    // Grids
    newContent = newContent.replace(/className="grid grid-cols-1 md:grid-cols-2 gap-8"/g, 'className="form-grid"');
    newContent = newContent.replace(/className="col-span-1 md:col-span-2"/g, 'className="col-span-2"');
    newContent = newContent.replace(/className="flex flex-col gap-2 col-span-1 md:col-span-2 relative group"/g, 'className="col-span-2"');

    // Buttons wrapper
    newContent = newContent.replace(/<div className="mt-10 flex justify-end gap-4 border-t border-gray-100 pt-6">/g, '<div className="form-actions">');

    // Cancel btn
    newContent = newContent.replace(/className="px-8 py-3\.5 border-2 border-slate-200[^"]*">Cancel<\/button>/g, 'className="btn-cancel">Cancel</button>');

    // Submit btn
    newContent = newContent.replace(/className="px-8 py-3\.5 bg-gradient-to-r[^"]*">\s*([^<]+)\s*<span/g, 'className="btn-submit">$1 <span');

    // Radio button wrappers
    newContent = newContent.replace(/<div className="flex gap-8 mt-2">/g, '<div className="radio-group">');
    newContent = newContent.replace(/<label className="flex items-center gap-3 cursor-pointer group">/g, '<label className="radio-label">');
    newContent = newContent.replace(/className="w-5 h-5 text-\[^\]]+ border-gray-300[^"]*"/g, '');
    newContent = newContent.replace(/<span className="text-gray-700 font-medium group-hover:[^"]+">([^<]+)<\/span>/g, '$1');

    // Remove wrapper divs for inputs if any leftover classes
    newContent = newContent.replace(/<div className="flex flex-col gap-2 relative group">/g, '<div>');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Successfully refactored: ${file}`);
    }
}
