const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
var cors = require('cors')
var ejs = require('ejs')
const session = require('express-session')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const path = require('path');



const sequelize = require('./config/database');
const User = require('./models/User');
const Movie = require('./models/Movie');




// sequelize.sync({force:true}).then(() => console.log('db is ready'));

sequelize.sync().then(() => console.log('db is ready'));

const app = express();
app.set('view-engine', 'ejs')
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());

const router = require('./router');
app.use(router)


app.listen(3000, () => {
  console.log("app is running");
});
