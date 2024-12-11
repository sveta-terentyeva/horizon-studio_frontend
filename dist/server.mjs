import express from 'express';
import serveStatic from 'serve-static';
import compression from 'compression';
import exhibitions from './public/data/exhibitions.json' assert { type: 'json' };
import googleMapSettings from './public/data/googleMapSettings.json' assert { type: 'json' };
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;
const domain = process.env.DOMAIN;

function ensureDomain(req, res, next) {
  if (!domain || req.hostname === domain) {
    return next();
  }
  res.redirect(`http://${domain}${req.url}`);
}

app.use(compression());

app.all('*', ensureDomain);

app.use(serveStatic(path.join(__dirname, 'public'), { 'extensions': ['html'] }));

app.get('/api/exhibitions', (req, res) => {
  res.json(exhibitions);
});

app.get('/api/googleMapSettings', (req, res) => {
  res.json(googleMapSettings);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
