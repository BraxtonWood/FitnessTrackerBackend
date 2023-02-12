/* eslint-disable no-useless-catch */
require('dotenv').config();
const express = require("express");
const usersRouter = express.Router();
const {
    UserDoesNotExistError,
    PasswordTooShortError,
    UserTakenError,
    UnauthorizedError
 } = require("../errors");
const {
    createUser,
    getUserByUsername,
    getUser,
    getAllRoutinesByUser,
    getAllPublicRoutines,
    getPublicRoutinesByUser
    } = require("../db");

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

  

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    //console.log("req.body:", req.body);
    //console.log("JWT SECTREt:", JWT_SECRET)
   const { username, password } = req.body;
   //console.log("request to /register USERNAME:", username, "password:", password);
   if(!username || !password){
    next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
    })
   }
   if(password.length < 8){
    next({
        name: "PasswordTooShortError",
        message: PasswordTooShortError(),
        error: PasswordTooShortError()
    })
   }
   try{
    const _user = await getUserByUsername(username);
    //console.log("test for existing _user:",_user);
    if (_user){
        console.log("DUPLICATE USERNAME", _user);
        next({
            name: "UserTakenError",
            message: UserTakenError(username),
            error: UserTakenError(username)
        });
    };
   // console.log("creating User:", username, password);
    const user = await createUser({username: username, password: password});
    //console.log("createdUser:", user);
    const token = jwt.sign({
        id: user.id,
        username
    }, process.env.JWT_SECRET, {
        expiresIn: '1w'
    });
    //console.log("token:", token);
    
    const returnObj = {user, "message": "you're signed up!", "token": `${token}`}
    //console.log("userWithtoken:", returnObj)
    res.send(returnObj);
 

   } catch({name, message}) {
    next({ name, message});
   }
    
})

// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const{username, password} = req.body;
    //console.log("users/login:",username, password);
    try{
        const user = await getUser({username, password});
        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });
        const returnObj = {user, "message": "you're logged in!", "token": `${token}`}
        res.send(returnObj); 
    } catch({name, message}) {
        next({ name, message});
    }
}) 

// GET /api/users/me
//'/me', requireUser(), (req, res, next);
usersRouter.get('/me', async (req, res, next) => {
    //console.log("req.user", req.user);
    //const{username} = req.user;
    if(req.user){
        res.send(req.user)
    } else {
        res.status(401);
        res.send({
            name:"unauthorized Error",
            message:UnauthorizedError(),
            error: UnauthorizedError()
        })
        
        // next({'error':'anystring',
        //     'message':'You must be logged in to perform this action',
        //     'name':"any string"
        // });
    }}
   
    )



 




   // next(UserDoesNotExistError(req.body.username));


// GET /api/users/:username/routines
usersRouter.get('/:username/routines', async (req, res, next) => {
    //console.log("req.user:", req.user);
    //console.log("req.params:", req.params);
    if(req.user.username === req.params.username){
        //const user = req.user.username;
        //console.log("user:", user);
        try{
            const routines = await getAllRoutinesByUser(req.user);
            //console.log("routines:", routines);
            res.send(routines);
        } catch( error ){
            next(error);
        }
        
    } else {
        //const user = req.params.username;
        //console.log("user:",user);
        try{
            const routines = await getPublicRoutinesByUser(req.params);
            //console.log("routines:",routines);
            res.send(routines);
        } catch( error ){
            next( error)
        }
        
    }
})
 




// usersRouter.use((error, req, res, next) => {
//     res.send({
//         name: error.name,
//         message: error.message
//     });
// }); 
 
module.exports = usersRouter;
