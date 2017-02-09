#Build a starter kit for web development

##STARTING OUR STARTER :
=======================================================
=======================================================
1. Initially we use: <node buildScritps/srcServer.js>
2. But after setting up a "start" script under "scrips" inside our package.json we just need to type: <npm start>, all npm commands should follow the  syntax: <npm run mycommand>, however
when using the start command you can use it with out the run.
3. To run an npm script that displays a message in the command line we use the "prestart" script to run the file "buildScripts/startMessage.js" that displays a message right 
before npm runs the "start".
4. To run multiple scripts in the start script in parallel we can say: <"start": "npm-run-all --parallel security-check open:src"> this will run the "security-check" script
and the "open:src" script simultaneiously
5. to remove the large number of info that is displayed during start, use the command: <npm start -s>
6. To start the app and share it through local tunnel at the same time without running local tunel manually we can use the script:


##CONFIGURING BABEL (THIS ALLOWS US TO USE ES6):
=======================================================
=======================================================
1. create a .babelrc file with the following json inside:

{
  "presets": [
    "latest"
  ]
}

or enter this json object inside your package.json:

 "name": "javascript-development-environment",
  "version": "1.0.0",
  "description": "JavaScript development environment Pluralsight course by Cory House",
  "babel": {
    // my babel config here
      "presets": [
    "latest"
  ]
  },

then in the package.json file change any command that calls node by changing the command "node" to "babel-node", for example:

    "prestart": "node buildScripts/startMessage.js",
    "open:src": "node buildScripts/srcServer.js",

becomes:

    "prestart": "babel-node buildScripts/startMessage.js",
    "open:src": "babel-node buildScripts/srcServer.js",

##LOCAL TUNNEL:
=======================================================
=======================================================
To run local tunnel:
1. Install localtunnel globally: <npm install localtunnel -g>
2. Run the app.
3. open a new terminal and run: <lt --port 3000> 3000 is the port your app i running on, after running this command a new line in the command prompt will display the URL you can 
use to show your app.
4. To customise the URL run: <lt --port 3000 --subdomain myapp>, this way your URL should look like: "http://myapp.localtunnel.me"


##WEBPACK:
=======================================================
=======================================================

1. to add webpack to the project, we first create the file: webpack.config.dev.js with the following code:

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  debug: true,
  devtool: 'inline-source-map',
  noInfo: false,
  entry: [
    path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'src'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    // Create HTML file that includes reference to bundled JS.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true
    })
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.css$/, loaders: ['style','css']}
    ]
  }
}

2. see the comment in the file to learn about configuring webpack, for courses about webpack:
    1) Webpack Fundamentals - By Joe Eames (Beginner)
    2) Building Applications with React and Redux in ES6 - by Cory House (Intermediate)


##Configuring WBPACK WITH EXPRESS
=======================================================
=======================================================

1. in srcServer.js add these immports:

import webpack from 'webpack';
import config from '../webpack.config.dev';

2. then we add these lines of code right after "const app = express();"

const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

DONE! Now webpack is configured to work with express

##CREATING AN APPLICATION ENTRY POINT
=======================================================
=======================================================

1. First we have to create our main server.js or app.js or in our case srcServer.js file, which is the main file that is ran when we run our application, using:

babel-node buildScripts/srcServer.js
OR
node buildScripts/srcServer.js
OR in our case
npm start

2. to set the application entry point we tell webpack where the main file (index.js) is in the following line inside webpack.config.dev.js, like this:

  entry: [
    path.resolve(__dirname, 'src/index')
  ],

#ADDING CSS FILES:
=======================================================
=======================================================

1. in our index.js file just import the css file index.css

import './index.css';

##USING INLINE SOURCE MAPS FOR DEBUGGING:
=======================================================
=======================================================

1. this is done through this line: <devtool: 'inline-source-map',> in the webpack.config.dev.js file.
2. then, we type the word: <debugger;> at the line we want to place a break point at, the app will stop at that line, and we can
see the unminified code using the inpector, for example, you can place the debugger keyword in the index.js file
just before the console.log statement.

##LINTING:
=======================================================
=======================================================

1. first add the file .eslint.json  to the app root, the file must include the following:

{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "rules": {
    "no-console": 1
  }
} 

2. then in our package.json add this line:

"lint": "esw webpack.config.* src buildScripts",

This will allow us to run eslint via a npm script. we can run eslint directly via an npm script, but eslint lacks the ability to watch
files, so we will use es watch that does have this functionality, esw will watch all our webpack.conf.* files and all file sin the src folder and allfile in our buildScript folder
--color tells esw to display results in color.
Please make sure your aditor has no buiolt in linter active, disable it first.

3. The script above will allow us to run eslint only once, to keep it watching our files all the time we must add this script and run it:

"lint:watch": "npm run lint -- --watch",

Everytime we hit save the script will notify us of errors.

4. we can also add it in our start script to be part of our start script:

"start": "npm-run-all --parallel security-check open:src lint:watch",


##TESTING AND CONTINUOUS INTEGRATION:
=======================================================
=======================================================
1. Our selections:

Framework =             mocha
Assertion Library =     CHAI
Helper Libraries =      JSDOM
Where to run tests =    Node
Where to place tests =  Alongside
When to run tests =     Upon save

2. Create the file testSetup.js

withe the following code:

// This file isn't transpiled, so must use CommonJS and ES5

// Register babel to transpile before our tests run.
require('babel-register')();

// Disable webpack features that Mocha doesn't understand.
require.extensions['.css'] = function() {};

3. Create a test file, index.test.js under the src folder, some call this file test.spec.js

4. then add the following script in our package.json: "test": "mocha --reporter progress buildScripts/testSetup.js \"src/**/*.test.js\""

5. then inside the index.test.js file we will use the assertion libraryc"chai" by writing the following:

import {expect} from 'chai';

describe('Our first test', () => {
  it('should pass', () => {
    expect(true).to.equal(true);
  });
});

6. save the file and then run: npm test, you will see the test is passing, to fail the test change the expect line as follows:

expect(true).to.equal(false);

7. To test the DOM we will have to import the following in the index.test.js file:

import jsdom from 'jsdom';
import fs from 'fs';

8. then add the following test:

describe('index.html', () => {
  it('should have h1 that says Users', (done) => {
    const index = fs.readFileSync('./src/index.html', "utf-8");
    jsdom.env(index, function(err, window) {
      const h1 = window.document.getElementsByTagName('h1')[0];
      expect(h1.innerHTML).to.equal("Users");
      done();
      window.close();
    });
  })
})

The test above will create a DOM in memory and look for an h1 tag that says: "Hello World!", if it doesn't find it it will fail the test.

9. To setup our tests so that they will run everytime we hit save, we create the script: "test:watch": "npm run test -- --watch"


##SETTING UP TRAVIS CI: (for linux)
=======================================================
=======================================================
1. add the file .travis.yml
2. add the repo to your travis account.
3. push your repo to github, travis will automatically check the build
