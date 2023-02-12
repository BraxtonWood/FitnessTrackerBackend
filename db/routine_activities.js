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
  try {
  const {rows: [routine_activity]} = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [routineId, activityId, count, duration])
  //console.log("routine_activity",routine_activity);
  return routine_activity;
  } catch (error){
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try{
  const {rows: [routine_activity]} = await client.query(`
  SELECT * 
  FROM routine_activities
  WHERE id=($1);
  `,[id]);
  console.log("routine_activity by Id:", routine_activity);
  return routine_activity;
  } catch (error){
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try{
  const {rows: routine_activity} = await client.query(`
  SELECT *
  FROM routine_activities
  WHERE "routineId"=($1);
  `, [id]);
  console.log("routine_activity by routineID:", routine_activity);
  return routine_activity;
  } catch (error){
    throw error;
  }
}
async function checkExistingRoutineActivity({routineId, activityId}) {
  console.log("checkexistingroutineActivity: routineId, activityId:", routineId, activityId);
  try{
  const {rows:[exists]} = await client.query(`
    SELECT EXISTS(SELECT * FROM routine_activities
      WHERE "routineId"=($1)
      AND "activityId"=($2));
  `, [routineId, activityId]);
  console.log("CheckExistingRoutineActivity AT DB", exists);
  //console.log("routine_Activity.id", routine_activity.id);
  const doesExist = exists.exists;
  if(doesExist){
    console.log("returning true");
    return true;
  }else {
    console.log("returning false");
  return false;
  }
  } catch (error){
    throw error;
  }
}
// SELECT *
//   FROM routine_activities
//   WHERE "routineId"=($1)
//   AND "activityId"=($2);


async function updateRoutineActivity({ id, ...fields }) {
  //console.log("update id:",id,"update fields:",fields);
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1}`
  ).join(', ');
  
  if (setString.length === 0) {
    return;
  }
  try {
    const {rows:[routineActivity]} = await client.query(`
    UPDATE routine_activities
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
    `, Object.values(fields));
    //console.log("updatedRoutine_activities:", routineActivity);
    return routineActivity;

  
  } catch (error) {
    throw error;
  }
}
 
async function destroyRoutineActivity(id) {
  try{
  const {rows:[routine_activity]} = await client.query(`
    DELETE FROM routine_activities
    WHERE id=($1)
    RETURNING *;
    `,[id]);
    //console.log("destroy routACT id:",routine_activity);

    return routine_activity;
  } catch (error){
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try{
  const {rows:[routine_activity]} = await client.query(`
  SELECT * 
  FROM routine_activities
  JOIN routines ON routine_activities."routineId" = routines.id
  WHERE routine_activities.id=($1) 
  `, [routineActivityId]);
  console.log("routACT can edit?:",routine_activity);
  if(routine_activity.creatorId === userId){
    return true;
  } else {
    return false;
  }
} catch (error){
  throw error;
}
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
  checkExistingRoutineActivity
};

//JOIN
// SELECT * FROM  getRoutinesWithoutActivities
// JOIN users ON getRoutinesWithoutActivities."creatorId" = users.id;
// //

// SELECT getUserByUsername.username AS "CreatorName", routines.*
// FROM routines
// JOIN users ON routines."creatorId" = users.id;
