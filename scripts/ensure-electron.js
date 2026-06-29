const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

async function main() {
  if (os.platform() !== 'win32') {
    return;
  }

  const electronDir = path.dirname(require.resolve('electron/package.json'));
  const electronPkg = require(path.join(electronDir, 'package.json'));
  const { downloadArtifact } = require('@electron/get');

  const distDir = path.join(electronDir, 'dist');
  const exePath = path.join(distDir, 'electron.exe');
  const pathFile = path.join(electronDir, 'path.txt');

  if (fs.existsSync(exePath) && fs.existsSync(pathFile)) {
    return;
  }

  const zipPath = await downloadArtifact({
    version: electronPkg.version,
    artifactName: 'electron',
    platform: 'win32',
    arch: process.arch,
    checksums: require(path.join(electronDir, 'checksums.json')),
  });

  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  const extractCommand = [
    "$ErrorActionPreference = 'Stop'",
    `$zip = ${toPowerShellString(zipPath)}`,
    `$dist = ${toPowerShellString(distDir)}`,
    "Expand-Archive -LiteralPath $zip -DestinationPath $dist -Force",
  ].join('; ');

  const result = childProcess.spawnSync(
    'powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', extractCommand],
    { stdio: 'inherit' }
  );

  if (result.status !== 0) {
    throw new Error(`PowerShell extraction failed with code ${result.status}`);
  }

  fs.writeFileSync(pathFile, 'electron.exe');

  if (!fs.existsSync(exePath)) {
    throw new Error('Electron extraction completed but electron.exe is missing');
  }
}

function toPowerShellString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

main().catch((error) => {
  console.error('[ensure-electron]', error.stack || error);
  process.exit(1);
});