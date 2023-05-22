require("dotenv").config()
const express = require('express'); 
const { Sequelize, Model, DataTypes } = require('sequelize');
const ejs = require('ejs');

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_HOST,
    process.env.DATABASE_PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql',
    });

sequelize.authenticate().then(() => {
    console.log('Connection to DB is SUCCESSFUL.');
}).catch(() => {
    console.log('ERROR! Connecting to DB.');
})

class User extends Model {}

User.init ({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: new DataTypes.STRING,
        allowNull: false
    },
    wpm: {
        type: new DataTypes.INTEGER,
    }
}, { 
    sequelize,
    modelName: 'User'
});

console.log(User === sequelize.models.User);

const app = express();
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('pages/index');
});
app.listen(4000, () => {
    console.log('Server running on port 4000.');
});