const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const express = require('express');

const apiRouter = express.Router();

const {
  getUserById
  } = require("../db");


//apiRouter.use(cors())

// GET /api/health
apiRouter.get('/health', async (req, res, next) => {
    console.log("HEALTH CHECK");
    res.send({
        "name":"Server healthy",
        "message":"Server is up and running"
    })
    next();
});
 
// attach user and token to request
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    if (!auth) {
      // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
        if (id) {
          req.user = await getUserById(id);
          next();
        } else {
          //res.status(401).json({message:UnauthorizedError()})
        next({
            name: "UnauthorizedError",
            message: UnauthorizedError(),
            error: UnauthorizedError()
          });
        }
  
      } catch ({ name, message, error }) {
        next({ name, message, error });
      }
    } else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${prefix}`,
      });
  
    }
});

// ROUTER: /api/users
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
const { UnauthorizedError } = require('../errors');
apiRouter.use('/routine_activities', routineActivitiesRouter);




// apiRouter.use((error, req, res, next) => {
//     console.log( `error ${error.message}`);

//     res.send({
//         name: error.name,
//         message: error.message
//     });
// });

module.exports = apiRouter;
