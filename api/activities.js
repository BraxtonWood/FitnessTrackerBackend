const express = require('express');
const { getAllActivities,
        createActivity,
        updateActivity,
        getActivityById,
        getActivityByName,
        getPublicRoutinesByActivity
} = require('../db');
const { ActivityExistsError,
        ActivityNotFoundError
} = require('../errors')
const activitiesRouter = express.Router();

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
    const fields = {};
    fields.id = req.params.activityId;
    console.log("id:",fields.id);
    try{
        const doesActivityExist = await getActivityById(fields.id);
        console.log("doesActivityExist", doesActivityExist);
        //check to see if activity exists
        if(doesActivityExist){
            console.log("activity Exists");
            const publicRoutinesByActivity = await getPublicRoutinesByActivity(fields.id);
        console.log("routines:",publicRoutinesByActivity);
        res.send(publicRoutinesByActivity);
        } else {
            res.send({
                name:"ActivityNotFoundError",
                message:ActivityNotFoundError(req.params.activityId),
                error: ActivityExistsError(req.params.activityId)
            })
        }
        
    } catch (error){
        next(error);
    }
})

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
    try{
        const allActivities = await getAllActivities()
        res.send(allActivities);
    } catch (error){
        next(error);
    }
})

// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {
    //console.log("post new Activity:",req.body, req.user);
    //console.log(req.user);
    const fields = {};
    fields.name = req.body.name;
    fields.description = req.body.description;
    //console.log("fields:", fields);
    try{
        const newActivity = await createActivity(fields);
        //console.log("newActivity:", newActivity)
        if(newActivity === true){//createActivity will return true if name already exists
            //res.status(401);
        res.send({
            name:"ActivityExistsError",
            message:ActivityExistsError(req.body.name),
            error: ActivityExistsError(req.body.name)
        })
        }
        else {
        //console.log(newActivity);
        res.send(newActivity);// if not return the CREATED activity
        }
    } catch (error){
        next(error)
    }
})

// PATCH /api/activities/:activityId

activitiesRouter.patch("/:activityId", async (req, res, next) => {
    const fields = {};
    fields.name = req.body.name;
    fields.description = req.body.description;
    fields.id = req.params.activityId;
    //console.log("fields:",fields);
    try{

        const checkExistingId = await getActivityById(req.params.activityId);
        //console.log("checkExistingId:", checkExistingId)
        if(checkExistingId === undefined) {// activity must exist to edit
            res.send({
                name:"ActivityExistsError",
                message:ActivityNotFoundError(req.params.activityId),
                error: ActivityNotFoundError(req.params.activityId)
        })}
        const checkExistingName = await getActivityByName(req.body.name);//see if any
        //activities exist with the name to update
        //console.log("checkExistinName:", checkExistingName);
        if(checkExistingName){ // if an activity with that name exists we need to
            //make sure that the existing activity is not the one we are editing
            if(!(checkExistingName.id === req.params.activityId)){
                res.send({
                    name:"ActivityExistsError",
                    message:ActivityExistsError(req.body.name),
                    error: ActivityExistsError(req.body.name) 
                })
            }
        }
        const updatedActivity = await updateActivity(fields);
        //console.log("updatedActivity:", updatedActivity)
        








        res.send(updatedActivity);
    } catch (error){
        next(error);
    }

})

module.exports = activitiesRouter;
