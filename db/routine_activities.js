const client = require("./client");
const { getRoutinesWithoutActivities } = require("./routines");
const { getUserByUsername } = require("./users");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  console.log("addActivityToRoutine Fields:", 
  routineId,
  activityId,
  count,
  duration)

}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};

//JOIN
// SELECT * FROM  getRoutinesWithoutActivities
// JOIN users ON getRoutinesWithoutActivities."creatorId" = users.id;
// //

// SELECT getUserByUsername.username AS "CreatorName", routines.*
// FROM routines
// JOIN users ON routines."creatorId" = users.id;
