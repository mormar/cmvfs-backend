import express from 'express';
import path from 'path';
import { getJSONfromRpository } from './cvmfs/cvmfs';
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

const bodyParser = require('body-parser');

// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Controle");
    next();
});

const port = process.env.OPENSHIFT_NODEJS_PORT
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP
app.listen(port, () => `Server running on port ${port}`);

app.listen(port, server_ip_address, function() {
    console.log("Listening on " + server_ip_address + ", port " + port);
})

app.get(process.env.OPENSHIFT_NODEJS_API, async (req, res) => {
    let repositoryName = req.query.name;
    let repositoryWebsite = req.query.website

    try {
        console.log(`Fetching repository ${repositoryName} from ${repositoryWebsite}`);
        const reposonseJSON = await getJSONfromRpository(repositoryWebsite, repositoryName);
        // console.log("reposonseJSON",reposonseJSON)
        res.json(reposonseJSON);
    } catch (error) {
        console.log(error)
        res.status(404).send(error.message);
    }
});