#!/usr/bin/env node
/**
 * Create Root Index Script
 *
 * Creates a root index.html that links to both deployed apps.
 * This is run after building both apps to create a landing page.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Disciple Ranking</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #1e3a5f 0%, #0f1f33 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container {
      max-width: 600px;
      width: 100%;
    }
    h1 {
      color: #d4a84b;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
    }
    .apps {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    a {
      display: block;
      padding: 1.5rem 2rem;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(212, 168, 75, 0.3);
      border-radius: 12px;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    a:hover {
      background: rgba(212, 168, 75, 0.2);
      border-color: #d4a84b;
      transform: translateY(-2px);
    }
    .app-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #d4a84b;
      margin-bottom: 0.5rem;
    }
    .app-desc {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Disciple Ranking</h1>
    <div class="apps">
      <a href="./embaixadores-do-rei/">
        <div class="app-name">Embaixadores do Rei</div>
        <div class="app-desc">Gincana Anual - Primeira Igreja Batista de Confins (MG)</div>
      </a>
      <a href="./family-morgan-ferreira/">
        <div class="app-name">Ranking de Tarefas</div>
        <div class="app-desc">Desafio Semanal da Familia Morgan Ferreira</div>
      </a>
    </div>
  </div>
</body>
</html>
`;

writeFileSync(join(distDir, 'index.html'), html);
console.log('Created root index.html with links to both apps');
