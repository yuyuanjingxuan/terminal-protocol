// build.js - Build script to concatenate all files into a single HTML
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const OUTPUT_FILE = 'terminal-protocol.html';

// The build uses index.html as the template and inlines the concatenated
// JavaScript in place of the individual <script src="..."> tags.

// Main build function
function build() {
  console.log('Starting build process...');

  // Read index.html as the template
  const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8');

  // Inline each <script src="..."> in page order
  let totalSize = 0;
  const finalHtml = indexHtml.replace(/<script src="([^"]+)"><\/script>/g, (match, src) => {
    const filePath = path.join(PROJECT_ROOT, src);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Build failed: missing source file ${src}`);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    totalSize += content.length;
    return `<script>\n${content}\n</script>`;
  });

  // Write to output file
  fs.writeFileSync(path.join(PROJECT_ROOT, OUTPUT_FILE), finalHtml, 'utf8');

  console.log(`Build complete! Output file: ${OUTPUT_FILE}`);
  console.log(`Total JavaScript size: ${totalSize} bytes`);
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = { build };