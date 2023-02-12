const express = require('express');
const { updateRoutineActivity,
        canEditRoutineActivity,
        getRoutineActivityById,
        getRoutineById,
        destroyRoutineActivity
     } = require('../db');
const { UnauthorizedUpdateError,
        UnauthorizedDeleteError } = require('../errors');
const routineActivitiesRouter = express.Router();

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch("/:routineActivityId", async (req, res, next) => {
    const {routineActivityId} = req.params;
    const {count, duration} = req.body;
    console.log("req.user", req.user);

    const fields = {};
    fields.id = routineActivityId;
    if(count){
        fields.count = count;
    }
    if(duration){
        fields.duration = duration
    }
    try{
    const canEdit = await canEditRoutineActivity(routineActivityId, req.user.id);
    if(canEdit){
        const updatedRoutine_activity = await updateRoutineActivity(fields);
    console.log("updated R_A:", updatedRoutine_activity)
    res.send( updatedRoutine_activity );
    } else {
        const routine_Activity = await getRoutineActivityById(routineActivityId);
        console.log("routine_Activity:", routine_Activity);
        console.log("routine_Activity.routineId:", routine_Activity.routineId)
        const routine = await getRoutineById(routine_Activity.routineId);
        console.log("routine:", routine);
        res.send({
            name:"UnauthorizedUpdateError",
            message: UnauthorizedUpdateError(req.user.username, routine.name ),
            error: UnauthorizedUpdateError(req.user.username, routine.name )

    })}
    //console.log("fields:", fields)
} catch(error) {
    next(error);
}
})

// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', async (req, res, next) => {
    const {routineActivityId} = req.params;
    console.log("req.user", req.user);
    try{
        const canEdit = await canEditRoutineActivity(routineActivityId, req.user.id);
        if(canEdit){
            const routineActivity = await destroyRoutineActivity(routineActivityId);
            res.send(routineActivity);
        } else {
            const routine_Activity = await getRoutineActivityById(routineActivityId);
            console.log("routine_Activity:", routine_Activity);
            console.log("routine_Activity.routineId:", routine_Activity.routineId)
            const routine = await getRoutineById(routine_Activity.routineId);
            console.log("routine:", routine);
            res.status(403);
            res.send({
                name:"UnauthorizedDeleteError",
                message: UnauthorizedDeleteError(req.user.username, routine.name ),
                error: UnauthorizedDeleteError(req.user.username, routine.name )
    
        })} 
        

    } catch (error) {
        next(error);
    }
})

module.exports = routineActivitiesRouter;
