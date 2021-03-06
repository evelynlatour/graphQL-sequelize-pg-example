const express = require(`express`);
const path = require(`path`);
const volleyball = require(`volleyball`);
const bodyParser = require(`body-parser`);
const webpack = require(`webpack`);
const webpackDevMiddleware = require(`webpack-dev-middleware`);
const chalk = require(`chalk`);
const graphqlHTTP = require(`express-graphql`);
const { db } = require(`./db/index`);

const mySchema = require(`./schema/schema`);


const app = express();
const config = require(`../webpack.config.js`);

const compiler = webpack(config);

// logging middleware
app.use(volleyball);

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.use(`/api`, require(`./api`));

// GRAPH-I-QL
app.use(`/graphql`, graphqlHTTP({
  schema: mySchema,
  graphiql: true,
}));

app.get(`*`, (req, res) => {
  res.sendFile(path.join(__dirname, `../public/index.html`));
});

const startApp = async () => {
  try {
    await db.sync();
    app.listen(3000, () => {
      console.log(chalk.cyan(`- - - Server listening on port ${3000} - - - `));
    });
  } catch (err) {
    console.error(err);
  }
};

startApp();
