import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

console.log('Regenerating pnpm-lock.yaml...');
try {
  // Remove old lock file if it exists
  execSync('rm -f pnpm-lock.yaml', { cwd: projectRoot });
  console.log('Removed old lock file');
  
  // Run pnpm install to create new lock file
  execSync('pnpm install', { 
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('Successfully regenerated pnpm-lock.yaml');
} catch (error) {
  console.error('Error regenerating lock file:', error.message);
  process.exit(1);
}
