const express = require('express');
const routinesRouter = express.Router();
const {
    getAllPublicRoutines,
    createRoutine,
    getRoutineById,
    updateRoutine,
    destroyRoutine,
    addActivityToRoutine,
    getRoutineActivitiesByRoutine,
    checkExistingRoutineActivity
} = require("../db");
const {
    UserDoesNotExistError,
    PasswordTooShortError,
    UserTakenError,
    UnauthorizedError,
    UnauthorizedUpdateError,
    UnauthorizedDeleteError,
    DuplicateRoutineActivityError
 } = require("../errors");
// GET /api/routines
routinesRouter.get('/', async (req, res, next) => {
    try{
        const routines = await getAllPublicRoutines();
        //console.log("routines:",routines);
        res.send(routines);
    } catch (error){
        next(error);
    }
})

// POST /api/routines
routinesRouter.post('/', async (req, res, next) => {
    //console.log("req.body:", req.body);
    //console.log("req.user:", req.user);
    if(req.user){
        try{
            const fields = {
                creatorId: req.user.id,
                isPublic: req.body.isPublic,
                name: req.body.name,
                goal: req.body.goal    
            }
            //creatorId, isPublic, name, goal
            const createdRoutine = await createRoutine(fields);
            res.send(createdRoutine);
        } catch (error) {
            next(error);
        }
        //res.send(req.user)
    } else {
        res.status(401);
        res.send({
            name:"unauthorized Error",
            message:UnauthorizedError(),
            error: UnauthorizedError()
        })
    //next();
}})

// PATCH /api/routines/:routineId
routinesRouter.patch('/:routineId', async (req, res, next) => {
    if(!req.user){
        res.status(403);
            res.send({
                name:"unauthorized Error",
                message:UnauthorizedError(),
                error: UnauthorizedError()
        })
    }
    // console.log("req.params:",req.params);
    // console.log("req.body:", req.body);
    // console.log("req.user:", req.user);
    const {routineId} = req.params;
    const {isPublic, name, goal} = req.body;
    //const {id} = req.user;
    //console.log("user:", user);

    const fields = {};
    fields.id = routineId;
    if(isPublic){
        fields.isPublic = true;
    } else {
        fields.isPublic = false;
    }
    if(name){
        fields.name = name
    }
    if(goal){
        fields.goal = goal
    }
    //console.log("fields:", fields);
    try{
        const routine = await getRoutineById(routineId);
        //console.log("routine:", routine);
        //console.log("check owner:", routine.creatorId, "===?", req.user.id);
        if(!(routine.creatorId === req.user.id)){
            res.status(403);
            res.send({
                name:"UnauthorizedUpdateError",
                message: UnauthorizedUpdateError(req.user.username, routine.name),
                error: UnauthorizedUpdateError(req.user.username, routine.name)
        })
    } else {
        //console.log("update routine called: fields:", fields);
        const updatedRoutine = await updateRoutine(fields);
        console.log("updatedRoutine:", updatedRoutine);
        res.send(updatedRoutine);
    }
    } catch (error){
        next(error);
    }  
})

// DELETE /api/routines/:routineId
routinesRouter.delete('/:routineId', async (req, res, next) => {
    //console.log("req.user, req.params:",req.user, req.params);
    if(!req.user.id){
        res.status(403);
            res.send({
                name:"unauthorized Error",
                message:UnauthorizedError(),
                error: UnauthorizedError()
        })
    }
    try{
        const routineToDelete = await getRoutineById(req.params.routineId);
        //console.log("routinetodelete:",routineToDelete);
        //console.log("req.user.id:", req.user.id, "req.params.routineId:", req.params.routineId);
        
        if(req.user.id===routineToDelete.creatorId){ 
            //console.log("CHeck userid=== creatorId", true);
            const deleteRoutine = await destroyRoutine(req.params.routineId);
            routineToDelete.success = true;
            //console.log("routineToDelete with success:",routineToDelete);
            res.send(routineToDelete);

        } else {
            res.status(403);
            res.send({
                name:"unauthorizedError",
                message: UnauthorizedDeleteError(req.user.username, routineToDelete.name),
                error: UnauthorizedDeleteError(req.user.username, routineToDelete.name)
            })
        }
        
    } catch (error) {
        next(error);
    }
}
)


// POST /api/routines/:routineId/activities

routinesRouter.post('/:routineId/activities', async (req, res, next) => {
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);
    console.log("req.user", req.user);
    // routineId
    // activityId 
    // count
    // duration 
    const fields = {};
    fields.routineId = req.params.routineId;
    fields.activityId = req.body.activityId;
    fields.count = req.body.count;
    fields.duration = req.body.duration;
    console.log("fields:", fields);
    try{
        const checkExisting = await checkExistingRoutineActivity(fields);
        console.log("CHECK EXISTS?", checkExisting);
        if(checkExisting){
            res.send({
                name:"DuplicateRoutineActivityError",
                message: DuplicateRoutineActivityError(fields.routineId, fields.activityId),
                error: DuplicateRoutineActivityError(fields.routineId, fields.activityId)
            }) 
        } else {
            //res.status();
            const actPlusRoutine = await addActivityToRoutine(fields);
            console.log("activityPlusRoutine:", actPlusRoutine); 
            res.send(actPlusRoutine);
        }
    } catch (error){
        next(error);
    }

})

module.exports = routinesRouter;
