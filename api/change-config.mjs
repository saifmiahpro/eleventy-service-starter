#!/usr/bin/env node

import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { parse } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Serveur API simple
const server = createServer((req, res) => {
  // Headers CORS pour permettre les requêtes depuis le navigateur
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = parse(req.url, true);
  const { pathname, query } = parsedUrl;

  if (pathname === '/change-trade' && query.trade) {
    try {
      changeTrade(query.trade);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, trade: query.trade }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  } 
  else if (pathname === '/change-variant' && query.section && query.variant) {
    try {
      changeVariant(query.section, query.variant);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, section: query.section, variant: query.variant }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  }
  else if (pathname === '/change-color' && query.color) {
    try {
      changeColor(query.color);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, color: query.color }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  }
  else if (pathname === '/change-layout' && query.layout) {
    try {
      changeServicesLayout(query.layout);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, layout: query.layout }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Not found' }));
  }
});

function changeTrade(trade) {
  if (!["depanneur", "serrurier", "electricien"].includes(trade)) {
    throw new Error(`Métier invalide: ${trade}`);
  }

  const identityPath = join(projectRoot, "src/_data/identity.json");
  const sitePath = join(projectRoot, "src/_data/site.json");

  // Mettre à jour identity.json
  const identity = JSON.parse(fs.readFileSync(identityPath, "utf8"));
  identity.TRADE = trade;
  identity.HERO_TEXT = null;
  identity.HERO_SUBTITLE = null;
  identity.ABOUT_SNIPPET = null;
  identity.ACCENT_COLOR = null;
  identity.URGENCY_TEXT = null;
  fs.writeFileSync(identityPath, JSON.stringify(identity, null, 2));

  // Mettre à jour site.json
  const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
  site.trade = trade;
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2));
}

function changeVariant(section, variant) {
  const sitePath = join(projectRoot, "src/_data/site.json");
  const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
  site.variants = site.variants || {};
  site.variants[section] = variant;
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2));
}

function changeColor(colorName) {
  // Charger les couleurs disponibles
  const colorsPath = join(projectRoot, "src/_data/colors.json");
  const COLORS = JSON.parse(fs.readFileSync(colorsPath, "utf8"));
  
  if (!COLORS[colorName]) {
    throw new Error(`Couleur invalide: ${colorName}`);
  }
  
  const colorData = COLORS[colorName];
  const identityPath = join(projectRoot, "src/_data/identity.json");
  
  // Mettre à jour identity.json
  const identity = JSON.parse(fs.readFileSync(identityPath, "utf8"));
  identity.ACCENT_COLOR = colorData.primary;
  identity.ACCENT_GRADIENT = colorData.gradient;
  fs.writeFileSync(identityPath, JSON.stringify(identity, null, 2));
}

function changeServicesLayout(layout) {
  const availableLayouts = ["grid", "carousel", "list"];
  
  if (!availableLayouts.includes(layout)) {
    throw new Error(`Layout invalide: ${layout}`);
  }
  
  const sitePath = join(projectRoot, "src/_data/site.json");
  const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
  
  // Initialiser variants si inexistant
  if (!site.variants) {
    site.variants = {};
  }
  
  // Mettre à jour le layout services
  site.variants.services = layout;
  
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2));
}

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 API Config running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   GET /change-trade?trade=depanneur`);
  console.log(`   GET /change-variant?section=services&variant=grid`);
  console.log(`   GET /change-color?color=rouge`);
  console.log(`   GET /change-layout?layout=grid`);
});
