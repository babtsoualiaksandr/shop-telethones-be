const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const cache = {};
const CASHTIME = 1 * 1000 * 60;
const midWare = (req, res, next) => {
    const key = req.url;
    const now = new Date();
    if (cache[key] && now - cache[key].timeCache < CASHTIME) {
        console.log(cache);
        res.header('Access-Control-Allow-Origin', '*');
        res.send(`from cache ${cache[key].body}`);
    } else {
        res.sendResponse = res.send;
        res.send = (body) => {
            const datetime = new Date();
            cache[key] = { timeCache: datetime, body: body };
            res.sendResponse(body);
        };
        next();
    }
};

app.all('/*', midWare, (req, res) => {
    console.log('originalUrl', req.originalUrl);
    console.log('method', req.method);
    console.log('body', req.body);

    const recipient = req.originalUrl.split('/')[1];

    const recipientURL = process.env[recipient];
    const urlRe = req.originalUrl.split('/').splice(2, 10).join('/');
    console.log('req.originalUrl ========= ', urlRe);
    console.log('recipientURL', recipientURL);
    console.log('', `${recipientURL}${urlRe}`);

    if (recipientURL) {
        const axiosConfig = {
            method: req.method,
            url: `${recipientURL}/${urlRe}`,
            ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
        };
        console.log('axiosConfig', axiosConfig);

        axios(axiosConfig)
            .then(function (response) {
                console.log('response from ', response.data);
                res.json(response.data);
            })
            .catch((error) => {
                console.log('error', JSON.stringify(error));
                if (error.response) {
                    const { status, data } = error.response;

                    res.status(status).json(data);
                } else {
                    res.status(500).json({ error: error.message });
                }
            });
    } else {
        res.status(502).json({ error: 'Cannot  process request' });
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at localhost:${PORT}`);
});
