require("dotenv").config()
//const PORT = process.env.PORT || 3000;
 
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
//const server = require('./server');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');

app.use(cors());


app.use((req, res, next) => {
    //console.log();
    console.log("<____Body Logger START____>", req.body,
    "<_____Body Logger END_____>" );
    //console.log();
  
    next();
  });
//const { client } = require('./db');

const apiRouter = require('./api');
app.use('/api', apiRouter);


app.use('*', (req, res, next) => {
    res.status(404);
    res.send({error: 'route not found'})
    // const error = new Error('Not found');
    // error.status(404);
    // next(error);
});

app.use((error, req, res, next) => {
    //console.log("error",error);
    //console.error(error.body);
    res.status(500);
    res.json(
        error
    )
     
}); 
 
  
// app.listen(PORT, () => {
    
//     console.log("Listening on port:", PORT);
//     client.connect();
// })


module.exports = app;
