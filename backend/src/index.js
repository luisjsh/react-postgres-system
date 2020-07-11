const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v1 } = require('uuid')
const app = express();

//settings
app.set('PORT', process.env.PORT || 4000)

//middlewares

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/img/uploads"),
    filename: (req, file, cb, filename) => {
      cb(null, v1() + path.extname(file.originalname));
    }
  });
app.use(multer({ storage: storage }).array("image", 10));

//routes

app.use('/configuration', require('./routes/configuration.routes'))
app.use('/user', require('./routes/user.routes'))
app.use('/item', require('./routes/item.routes'))
app.use('/search', require('./routes/search.routes'))

//static files
app.use(express.static(path.join(__dirname, "public")));

// deploy server 
app.listen(app.get ('PORT'), ()=>console.log(app.get('PORT')))