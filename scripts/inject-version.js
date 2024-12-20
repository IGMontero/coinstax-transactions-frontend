const fs = require('fs');
const packageJson = require('../package.json'); // Adjust the path if necessary

const version = packageJson.version;

const envPath = './.env.local'; // Specify where to write the environment variable
const envContent = `REACT_APP_VERSION=${version}\n`;

fs.writeFileSync(envPath, envContent, { flag: 'w' });
console.log(`Environment file generated with REACT_APP_VERSION=${version}`);