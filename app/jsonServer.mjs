import express from 'express';
import exhibitions from './data/exhibitions.json' assert { type: 'json' };
import googleMapSettings from './data/googleMapSettings.json' assert { type: 'json' };

const app = express();
const PORT = 9999;

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.get('/api/exhibitions', (req, res) => {
  res.json(exhibitions);
});

app.get('/api/googleMapSettings', (req, res) => {
  res.json(googleMapSettings);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});