const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/templates/**/*.jsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('<img ') && !content.includes('loading="lazy"')) {
    content = content.replace(/<img (?![^>]*loading="lazy")/g, '<img loading="lazy" ');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
