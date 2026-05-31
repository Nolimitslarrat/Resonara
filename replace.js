const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "Resonara Publishers Pvt. Ltd."
    content = content.replace(/Resonara Publishers Pvt\. Ltd\./g, 'RESONARA PUBLISHERS PVT LTD ');
    // Replace "Resonara Publishers"
    content = content.replace(/Resonara Publishers/g, 'RESONARA PUBLISHERS PVT LTD ');
    // Replace "Resonara"
    content = content.replace(/Resonara/g, 'RESONARA PUBLISHERS PVT LTD ');

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Replacement complete.');
