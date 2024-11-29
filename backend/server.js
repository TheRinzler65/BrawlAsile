const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const port = 3000;
const apiKey = process.env.API_KEY;

app.use(cors());

// Recherche par joueur
app.get('/:playerTag', (req, res) => {
    const playerTag = req.params.playerTag;

    axios({
        method: 'get',
        url: `https://api.brawlstars.com/v1/players/%23${playerTag}`,
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => res.send(response.data))
    .catch(error => {
        console.error(error);
        res.status(404).send("Le joueur n'existe pas");
    });
});

// Recherche des logs de bataille par joueur
app.get('/battlelog/:playerTag', (req, res) => {
    const playerTag = req.params.playerTag;

    axios({
        method: 'get',
        url: `https://api.brawlstars.com/v1/players/%23${playerTag}/battlelog`,
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => res.send(response.data))
    .catch(error => {
        console.error(error);
        res.status(404).send("Logs de bataille introuvables");
    });
});

// Recherche par club
app.get('/club/:clubTag', (req, res) => {
    const clubTag = req.params.clubTag;

    axios({
        method: 'get',
        url: `https://api.brawlstars.com/v1/clubs/%23${clubTag}`,
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => res.send(response.data))
    .catch(error => {
        console.error(error);
        res.status(404).send("Le club n'existe pas");
    });
});

// Route par défaut
app.get('/', (req, res) => {
    res.send("Mettez le tag du joueur ou du club dans l'URL");
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
