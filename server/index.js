import express from 'express';
import http from 'http';
import https from 'https';

//import main from '../src/iot.js';

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || null;

const app = express();
app.use(express.static('./build'));
app.use(express.static('./public'));

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`provide.services is listening on HTTP port ${PORT}`);
});

if (HTTPS_PORT) {
  const certificate = fs.readFileSync('./.certificate.crt', 'utf8');
  const privateKey  = fs.readFileSync('./.private.key', 'utf8');
  const httpsServer = https.createServer({ cert: certificate, key: privateKey }, app);
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`provide.services is listening on HTTPS port ${HTTPS_PORT}`);
  });
}
