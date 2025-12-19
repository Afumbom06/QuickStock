const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function isDigit(ch) {
  return /[0-9]/.test(ch);
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.ts', '.tsx', '.js', '.jsx'].includes(ext)) return;
  let src = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace module specifiers inside quotes
  src = src.replace(/(['"])([^'"\\]+?)\1/g, (m, q, name) => {
    // Ignore URLs and paths with protocol (figma:, http:, data:)
    if (/^[a-zA-Z0-9_+\.\-]+:/.test(name)) return m;
    // If there's an '@' followed by a digit (version) at the end or later,
    // remove the last @version suffix but keep scoped package names.
    const lastAt = name.lastIndexOf('@');
    if (lastAt <= 0) return m; // no @ or starts with @ (could still have version later)
    if (lastAt === name.length - 1) return m;
    const next = name.charAt(lastAt + 1);
    if (isDigit(next)) {
      const newName = name.slice(0, lastAt);
      if (newName !== name) {
        changed = true;
        return q + newName + q;
      }
    }
    return m;
  });

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8');
    console.log('Fixed imports in', path.relative(root, filePath));
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', 'build'].includes(entry.name)) continue;
      walk(full);
    } else {
      processFile(full);
    }
  }
}

walk(path.join(root, 'src'));
console.log('Done.');
