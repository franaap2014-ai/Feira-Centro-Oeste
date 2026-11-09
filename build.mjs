import { mkdir, copyFile, rm, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('./dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const publish = [
  'index.html', 'style.css', 'app.js', 'backend.js', 'config.js',
  'music.js', 'auth-ui.js', 'admin-music.js', 'questions.js', 'favicon.svg',
];
for (const name of publish) {
  await copyFile(new URL(`./${name}`, import.meta.url), new URL(name, dist));
}
const srcAssets = new URL('./assets/', import.meta.url);
const dstAssets = new URL('assets/', dist);
await mkdir(dstAssets, { recursive: true });
for (const name of await readdir(srcAssets)) {
  if (name.endsWith('.svg')) await copyFile(new URL(name, srcAssets), new URL(name, dstAssets));
}
console.log('Publicação estática pronta em dist/ (sem arquivos de banco, testes ou documentação).');
