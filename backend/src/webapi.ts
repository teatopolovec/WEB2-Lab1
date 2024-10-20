import express from 'express';
import db from './database';
import QRCode from 'qrcode';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';

const app = express();
app.use(cors())
app.use(express.json());
const authServer = 'https://dev-q01cbhnbnhsork5v.us.auth0.com';

const checkJwt = auth({
  audience: 'ulaznice',
  issuerBaseURL: `${authServer}`,
});

async function generirajQR(url : string){
    try {
        const qr = await QRCode.toDataURL(url);
        return qr;
    } catch (err) {
        console.error('Greška pri generiranju QR koda:', err);
        throw err;
    }
};

app.get('/brojUlaznica', async function (req, res) {
    try {
        const broj = await db.getBrojUlaznica();
        res.json({ 'broj': broj });
    } catch (err) {
        res.status(500).json({ error: 'Greška prilikom izračuna broja ulaznica.' });
    }
});

app.get('/ulaznica/:id', checkJwt,  async function (req, res) {
    const id = req.params.id;
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!regex.test(id)){
        res.status(400).json({ error: "Greška prilikom dohvaćanja ulaznice." });
        return;
    }
    try {
        const ulaznicaInfo = await db.infoUlaznica(id);
        res.json(ulaznicaInfo);
    } catch (error) {
        if (error.message === 'Ulaznica nije pronađena.') {
            res.status(400).json({ error: "Greška prilikom dohvaćanja ulaznice." });
            return;
        }
        res.status(500).json({ error: "Greška prilikom dohvaćanja ulaznice." });
    }
});

app.post('/generirajUlaznicu', checkJwt, async function (req, res) {
    const {vatin, firstName, lastName} = req.body;
    if (!vatin || vatin.length !== 11 || !/^[0-9]+$/.test(vatin)) {
        res.status(400).json({ error: 'OIB mora imati 11 znamenki.' });
        return;
    }
    const nameRegex = /^[A-Za-zČčĆćŽžŠšĐđ]+$/;
    if (!firstName || !nameRegex.test(firstName)) {
        res.status(400).json({ error: 'Ime mora biti zadano i sadržavati samo slova.' });
        return;
    }
    if (!lastName || !nameRegex.test(lastName)) {
        res.status(400).json({ error: 'Prezime mora biti zadano i sadržavati samo slova.' });
        return;
    }
    try {
        const dozvoli = await db.oibBroj(vatin);
        if (!dozvoli)  {
            res.status(400).json({ error: 'Za ovaj oib su generirane već 3 ulaznice.' });
            return;
        }
    } catch (err) {
        res.status(500).json({ error: 'Greška prilikom izračuna broja ulaznica za oib.' });
    }

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const rez = await db.createUlaznica(vatin, firstName, lastName, client);
        const uuid = rez?.rows[0].id;
        const urlSPA = process.env.URLSPA ? `${process.env.URLSPA}/${uuid}`: `https://${hostname}:4072/${uuid}`;
        const kod = await generirajQR(urlSPA);
        await client.query('COMMIT');
        res.json({ qrcode: kod });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Greška prilikom kreiranja ulaznice.' });
    } finally {
        client.release();
    }
});

const hostname = '127.0.0.1';
const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4071;
if (externalUrl) {
  const hostname = '0.0.0.0';
  db.createTable()
  .then(() => {
      app.listen(port, hostname, () => {
          console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
      });
  })
  .catch((err) => {
      process.exit(1);
  });
} else {
    db.createTable()
    .then(() => {
        app.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    })
    .catch((err) => {
        process.exit(1);
    });
}
