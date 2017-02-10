#Build a starter kit for web development

##STARTING OUR STARTER :

* Initially we use: <node buildScritps/srcServer.js>
* But after setting up a "start" script under "scrips" inside our package.json we just need to type: <npm start>, all npm commands should follow the  syntax: <npm run mycommand>, however
when using the start command you can use it with out the run.
* To run an npm script that displays a message in the command line we use the "prestart" script to run the file "buildScripts/startMessage.js" that displays a message right 
before npm runs the "start".
* To run multiple scripts in the start script in parallel we can say: <"start": "npm-run-all --parallel security-check open:src"> this will run the "security-check" script
and the "open:src" script simultaneiously
* to remove the large number of info that is displayed during start, use the command: <npm start -s>
* To start the app and share it through local tunnel at the same time without running local tunel manually we can use the script:


##CONFIGURING BABEL (THIS ALLOWS US TO USE ES6):

* create a .babelrc file with the following json inside:

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

To run local tunnel:
* Install localtunnel globally: <npm install localtunnel -g>
* Run the app.
* open a new terminal and run: <lt --port 3000> 3000 is the port your app i running on, after running this command a new line in the command prompt will display the URL you can 
use to show your app.
* To customise the URL run: <lt --port 3000 --subdomain myapp>, this way your URL should look like: "http://myapp.localtunnel.me"


##WEBPACK:


* to add webpack to the project, we first create the file: webpack.config.dev.js with the following code:

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

* see the comment in the file to learn about configuring webpack, for courses about webpack:
    1) Webpack Fundamentals - By Joe Eames (Beginner)
    2) Building Applications with React and Redux in ES6 - by Cory House (Intermediate)


##Configuring WBPACK WITH EXPRESS

* in srcServer.js add these immports:

import webpack from 'webpack';
import config from '../webpack.config.dev';

* then we add these lines of code right after "const app = express();"

const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

DONE! Now webpack is configured to work with express

##CREATING AN APPLICATION ENTRY POINT

* First we have to create our main server.js or app.js or in our case srcServer.js file, which is the main file that is ran when we run our application, using:

babel-node buildScripts/srcServer.js
OR
node buildScripts/srcServer.js
OR in our case
npm start

* to set the application entry point we tell webpack where the main file (index.js) is in the following line inside webpack.config.dev.js, like this:

  entry: [
    path.resolve(__dirname, 'src/index')
  ],

#ADDING CSS FILES:

* in our index.js file just import the css file index.css

import './index.css';

##USING INLINE SOURCE MAPS FOR DEBUGGING:

* this is done through this line: <devtool: 'inline-source-map',> in the webpack.config.dev.js file.
* then, we type the word: <debugger;> at the line we want to place a break point at, the app will stop at that line, and we can
see the unminified code using the inpector, for example, you can place the debugger keyword in the index.js file
just before the console.log statement.

##LINTING:

* first add the file .eslint.json  to the app root, the file must include the following:

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

* then in our package.json add this line:

"lint": "esw webpack.config.* src buildScripts",

This will allow us to run eslint via a npm script. we can run eslint directly via an npm script, but eslint lacks the ability to watch
files, so we will use es watch that does have this functionality, esw will watch all our webpack.conf.* files and all file sin the src folder and allfile in our buildScript folder
--color tells esw to display results in color.
Please make sure your aditor has no buiolt in linter active, disable it first.

* The script above will allow us to run eslint only once, to keep it watching our files all the time we must add this script and run it:

"lint:watch": "npm run lint -- --watch",

Everytime we hit save the script will notify us of errors.

* we can also add it in our start script to be part of our start script:

"start": "npm-run-all --parallel security-check open:src lint:watch",


##TESTING AND CONTINUOUS INTEGRATION:

* Our selections:

Framework =             mocha
Assertion Library =     CHAI
Helper Libraries =      JSDOM
Where to run tests =    Node
Where to place tests =  Alongside
When to run tests =     Upon save

* Create the file testSetup.js

withe the following code:

// This file isn't transpiled, so must use CommonJS and ES5

// Register babel to transpile before our tests run.
require('babel-register')();

// Disable webpack features that Mocha doesn't understand.
require.extensions['.css'] = function() {};

* Create a test file, index.test.js under the src folder, some call this file test.spec.js

* then add the following script in our package.json: "test": "mocha --reporter progress buildScripts/testSetup.js \"src/**/*.test.js\""

* then inside the index.test.js file we will use the assertion libraryc"chai" by writing the following:

import {expect} from 'chai';

describe('Our first test', () => {
  it('should pass', () => {
    expect(true).to.equal(true);
  });
});

* save the file and then run: npm test, you will see the test is passing, to fail the test change the expect line as follows:

expect(true).to.equal(false);

* To test the DOM we will have to import the following in the index.test.js file:

import jsdom from 'jsdom';
import fs from 'fs';

* then add the following test:

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

* To setup our tests so that they will run everytime we hit save, we create the script: "test:watch": "npm run test -- --watch"


##SETTING UP TRAVIS CI: (for linux)

* add the file .travis.yml
* add the repo to your travis account.
* push your repo to github, travis will automatically check the build

##SETTING UP APPVEYOR CI: (for Windows)

* add the file appveyor.yml
* add the repo to your appveyor account.
* push your repo to github, appveyor will automatically check the build

##CENTRALIZING API CALLS AND SETTING UP OUR API TO USE FETCH:

All apis should be centralized, and created from the api folder

* For simplicity we will serve the api using the same express instance that is serving our app during development, we do this by adding this code to srcServer.js to add a new route:

//mocking a real api or database (simple option, later we will use a mock api)
app.get('/users', function(req, res) {
  res.json([
    {"id": 1, "fisrtName": "Bob", "lastName": "Smith", "email": "bob@gmail.com"},
    {"id": 2, "fisrtName": "Tammy", "lastName": "Norton", "email": "tnorton@gmail.com"},
    {"id": 3, "fisrtName": "Tina", "lastName": "Lee", "email": "lee.tina@gmail.com"}
  ]);
});

This is a simple end point that returns user data.

* Now we will use fetch to get the same user data, first we will create a folder called api, then inside the folder 
we will create a file called userApi.js with the following code:

import 'whatwg-fetch';

export function getUsers() {
  return get('users');
}


function get(url) {
  return fetch(url).then(onSuccess, onError);
}

//here we can place preloaders if we have any calls in progress.
function onSuccess(response) {
  return response.json();
}

function onError(error) {
  console.log(error); // eslint-disable-line no-console
}

here we are only exporting one function, the getusers() function, all the other functions are private.

fetch along with promise resolution (onSuccess() function) and error handling (onError()) are abstracted away behind the get function, adding other get, put , delete, post 
requests will be easy as we only need to provide the url


##WHY WE ARE SENDING FETCH POLYFILL TO ALL BROWSERS EVEN THOUGH SOME BROWSERS ALREADY SUPPORT IT:

Because it is easier, but if we want to send a polyfill to only the browsers that need it we can do so by:

* go to polyfill.io 
* and copy this tag on the top of your page:

```<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>```

To place in your html pages, this will poly full all features, to poly fill only the fetch feature:

```<script src="https://cdn.polyfill.io/v2/polyfill.js?feature=fetch"></script>```


##CREATING MOCK CALLS:

Why we use a mock api:

- Unit TESTING
- In case our production api is unavailable, too expensive to call, slow or we can't use it for TESTING
- If we need to work off line 

Creating the mock api:

* create the file mockDataSchema.js with this info:

export const schema = {
  "type": "object",
  "properties": {
    "users": {
      "type": "array",
      "minItems": 3,
      "maxItems": 5,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "unique": true,
            "minimum": 1
          },
          "firstName": {
            "type": "string",
            "faker": "name.firstName"
          },
          "lastName": {
            "type": "string",
            "faker": "name.lastName",
          },
          "email": {
            "type": "string",
            "faker": "internet.email",
          }
        },
        required: ['id', 'firstName', 'lastName', 'email']
      }
    }
  },
  required: ['users']
};

This json describes the shape of our mock data, on the top of the file we fisrt declare that this data structure is of type "Object", and this object has a set of properties, the
first property is users, and the user property has a type of array, then we specify that the array has between 3 to 5 items, and then we define the shape of the items that sit
inside the users's array, these items are objectes, each object has 4 properties, id, first name, last name and email, then each property's data type and faker data type, 
for the id property we defined it as being unique and has a minimum value of 1, we don't want 0 or negative numbers, finally we set the properties as 
required and the users array as required to insure they are displayed.

* now that we defined the schema, we can now have faker generate the data for us by creating the file generateMockData.js with the following code:

import jsf from 'json-schema-faker';
import {schema} from './mockDataSchema';
import fs from 'fs';
import chalk from 'chalk';

const json = JSON.stringify(jsf(schema));

fs.writeFile("./src/api/db.json", json, function (err) {
  if (err) {
    return console.log(chalk.red(err));
  } else {
    console.log(chalk.green("Mock data generated."));
  }
});

This file will generate the data and write is to a file called db.json.

* then we will create an npm script that makes this easy to call, by adding the script:

"generate-mock-data": "babel-node buildScripts/generateMockData",

* Now we can start json server and tell it to use our mock data, the json server will create a mock api with an end point (url) for each top level object it finds, 
we can start the server using the following npm script:

"start-mockapi": "json-server --watch src/api/db.json --port 3001",

Notice we are running the json server on a separate port than the one we are using for our server.

* then we will create an npm script that will make sure we get a different set of data everytime we generate mock data:

"prestart-mockapi": "npm run generate-mock-data",

* now we need to update the application to use these mock apis instead of the hard coded express api call we wrote earlier, so we will assume that the 
express api call is the real production data and the mock api is the one we will use during production. so we will need to tell the application to point to
 the correct api for each environement, to do that we will create a file called baseUrl.js in the api folder and add this code:

 
