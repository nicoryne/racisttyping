require("dotenv").config();
const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const app = express();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_HOST,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to DB is SUCCESSFUL.');
  })
  .catch(() => {
    console.log('ERROR! Connecting to DB.');
  });

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: new DataTypes.STRING(),
      allowNull: false
    },
    wpm: {
      type: new DataTypes.INTEGER()
    }
  },
  {
    sequelize,
    modelName: 'User'
  }
);

console.log(User === sequelize.models.User);

app.use('/public', express.static('public'));
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.render('pages/login');
});

app.post('/submit', (req, res) => {
  const username = req.body.name;
  req.session.username = username;
  User.create({ username })
    .then(() => {
      console.log('Data saved successfully!');
      res.redirect('/index');
    })
    .catch(err => {
      console.error('Error saving data:', err);
      res.send('Error saving data.');
    });
});

app.get('/index', (req, res) => {
    User.findAll()
      .then((users) => {
        const username = req.session.username;
        res.render('pages/index', { users, username });
      })
      .catch((err) => {
        console.error('Error retrieving data:', err);
        res.send('Error retrieving data.');
      });
  });

  app.post('/updateWPM', (req, res) => {
    const { username, wpm } = req.body;
  
    User.update({ wpm: wpm }, { where: { username: username } })
      .then(() => {
        console.log('WPM updated successfully!');
        console.log(wpm);
        console.log(username);
        res.redirect('/ranking');
      })
      .catch((err) => {
        console.error('Error updating WPM:', err);
        res.send('Error updating WPM.');
      });
  });

  app.get('/ranking', (req, res) => {
    User.findAll({
      limit: 5, // Fetch only the top 5 users
      order: [['wpm', 'DESC']] // Order by WPM in descending order
    })
      .then((users) => {
        res.render('pages/ranking', { users });
      })
      .catch((err) => {
        console.error('Error retrieving data:', err);
        res.send('Error retrieving data.');
      });
  });

  

app.listen(4000, () => {
  console.log('Server running on port 4000.');
});