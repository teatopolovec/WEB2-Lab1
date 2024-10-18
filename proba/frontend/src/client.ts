import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
dotenv.config()

const app = express();

app.use(express.static('public'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

const hostname = '127.0.0.1';
app.get("/auth_config.json", (req, res) => {
  res.json({
    "domain": "dev-q01cbhnbnhsork5v.us.auth0.com",
    "clientId": process.env.CLIENT_ID,
    "audience" : 'ulaznice'
  });
});
app.get("/m2m.json", (req, res) => {
  res.json({
    "client_secret": process.env.CLIENT_SECRET,
    "client_id": process.env.CLIENT_IDM2M,
    "audience" : 'ulaznice',
    "grant" : "client_credentials"
  });
});
app.get("/render", (req, res) => {
  res.json({
    "render": process.env.RENDER_SERVER,
  });
});


app.get('/', function (req, res) {    
    res.render('index-spa');
});

app.get('/login', function (req, res) {    
  res.render('login');
});

app.get('/:id', function (req, res) {
  const uuid = req.params.id;
  res.render('ulaznica', { uuid });
});

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4072;
if (externalUrl) {
  const hostname = '0.0.0.0';
  app.listen(port, hostname, () => {
  console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
  })
} else {
  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  .listen(port, function () {
    console.log(`SPA hosted at https://${hostname}:${port}/`);
  });
}
