const { getActivityById, attachActivitiesToRoutines } = require("./activities");
const client = require("./client");
const { getRoutinesWithoutActivities, getRoutineById } = require("./routines");
const { getUserByUsername } = require("./users");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration
}) {
  const {rows: routine_activity} = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [routineId, activityId, count, duration])
  //console.log("routine_activity",routine_activity);
  return routine_activity;

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
