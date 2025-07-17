import Docker from 'dockerode';
import fs from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import tar from 'tar-fs';

const docker = new Docker();
const TMP_DIR = path.resolve('./tmp'); // Use absolute path

const LANGUAGE_CONFIG = {
  javascript: {
    image: 'node:18',
    filename: 'script.js',
    cmd: ['node', '/code/script.js'],
    ext: '.js',
  },
  python: {
    image: 'python:3.11',
    filename: 'script.py',
    cmd: ['python', '/code/script.py'],
    ext: '.py',
  },
  solidity: {
    image: 'ethereum/solc:stable',
    filename: 'contract.sol',
    cmd: ['solc', '/code/contract.sol'],
    ext: '.sol',
  },
};

// Add this function to clean Docker output
function cleanDockerOutput(rawOutput) {
  // Remove non-printable/control characters
  let cleaned = rawOutput.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Remove leading punctuation (like stray '!' or others) at the start of lines
  cleaned = cleaned.replace(/^[!]+/gm, '');
  return cleaned.trim();
}

export async function executeCodeInDocker(code, language, container, filename) {
  // Create a temp dir for this execution
  const execId = randomBytes(8).toString('hex');
  const execDir = path.join(TMP_DIR, `exec_${execId}`);
  await fs.mkdir(execDir, { recursive: true });
  const filePath = path.join(execDir, filename);
  await fs.writeFile(filePath, code);

  // Copy the file into the running container
  const tarStream = tar.pack(execDir, { entries: [filename] });
  await new Promise((resolve, reject) => {
    container.putArchive(tarStream, { path: '/code' }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Determine the command to run
  let cmd;
  if (language === 'javascript') {
    cmd = ['node', `/code/${filename}`];
  } else if (language === 'python') {
    cmd = ['python', `/code/${filename}`];
  } else if (language === 'solidity') {
    cmd = ['solc', `/code/${filename}`];
  } else {
    throw new Error('Unsupported language');
  }

  // Exec the code in the running container
  const exec = await container.exec({
    Cmd: cmd,
    AttachStdout: true,
    AttachStderr: true,
  });
  const stream = await exec.start({ hijack: true, stdin: false });
  let output = '';
  await new Promise((resolve, reject) => {
    stream.on('data', (chunk) => {
      output += chunk.toString();
    });
    stream.on('end', resolve);
    stream.on('error', reject);
  });
  // Clean up temp files
  await fs.rm(execDir, { recursive: true, force: true });
  return { output: cleanDockerOutput(output) };
} 