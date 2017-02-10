import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import config from '../webpack.config.dev';

/* eslint-disable no-console */

const port = 3002;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/users', function(req, res) {
  res.json([
    {'id': 1, 'firstname': "Tao1", 'lastname': "Feng1", 'email': "taofeng1@gmail.com"},
    {'id': 2, 'firstname': "Tao2", 'lastname': "Feng2", 'email': "taofeng2@gmail.com"},
    {'id': 3, 'firstname': "Tao3", 'lastname': "Feng3", 'email': "taofeng3@gmail.com"},
  ]);
});

app.listen(port, function(err) {
  if (err) {
    console.log(err)
  } else {
    open("http://0.0.0.0:" + port);
  }
});
