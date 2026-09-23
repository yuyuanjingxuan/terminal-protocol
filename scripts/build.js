// build.js - Build script to concatenate all files into a single HTML
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const OUTPUT_FILE = 'terminal-protocol.html';
const SOURCE_DIRS = [
  'core',
  'entities',
  'systems',
  'content',
  'render',
  'audio'
];

// HTML template
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terminal Protocol</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #121212;
      color: white;
      font-family: Arial, sans-serif;
    }

    #gameContainer {
      position: relative;
    }

    #gameCanvas {
      background-color: #000;
      border: 2px solid #444;
    }

    #uiPanel {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 10px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div id="gameContainer">
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <div id="uiPanel">
      <div id="resources">Resources: 100</div>
      <div id="health">Health: 10</div>
      <div id="waveInfo">Wave: 0/0</div>
    </div>
  </div>

  <script>
    // Inlined JavaScript will be inserted here
    {{JAVASCRIPT_CONTENT}}
  </script>
</body>
</html>`;

// Main build function
function build() {
  console.log('Starting build process...');

  // Read and concatenate all JavaScript files
  let javascriptContent = '';

  // Add main.js first
  const mainJsPath = path.join(PROJECT_ROOT, 'main.js');
  javascriptContent += fs.readFileSync(mainJsPath, 'utf8') + '\n\n';

  // Add files from source directories
  SOURCE_DIRS.forEach(dir => {
    const dirPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        if (file.endsWith('.js')) {
          const filePath = path.join(dirPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          javascriptContent += content + '\n\n';
        }
      });
    }
  });

  // Replace placeholder in HTML template
  const finalHtml = HTML_TEMPLATE.replace('{{JAVASCRIPT_CONTENT}}', javascriptContent);

  // Write to output file
  fs.writeFileSync(path.join(PROJECT_ROOT, OUTPUT_FILE), finalHtml, 'utf8');

  console.log(`Build complete! Output file: ${OUTPUT_FILE}`);
  console.log(`Total JavaScript size: ${javascriptContent.length} bytes`);
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = { build };