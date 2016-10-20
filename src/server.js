import bodyParser       from 'body-parser';
import cors             from 'cors';
import express          from 'express';
import expressValidator from 'express-validator';
import logger           from 'morgan-body';
import path             from 'path';

import auth             from './middlewares/auth'

import config           from './config';

import base             from './routes/base';
import clients          from './routes/clients';
import users            from './routes/users';

import sensorthings     from './routes/sensorthings';

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(bodyParser.json());

if (config.get('env') !== 'test') {
  logger(app);
}

app.use(cors());

const endpointPrefix = '/api/v' + config.get('version');

app.use(endpointPrefix + '/', sensorthings);

app.use(endpointPrefix + '/clients', auth(['admin']), clients);
app.use(endpointPrefix + '/users', users);

// SensorThings API endpoints.
app.use(endpointPrefix + '/', base);

const port = config.get('port');
app.listen(port, () => console.log(`Running on localhost:${port}`));

exports = module.exports = app;
