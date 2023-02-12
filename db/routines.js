const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  //console.log("createRoutine Fields:", creatorId, isPublic, name, goal);
  try {
    const {rows:[routine]} = await client.query(`
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);
    //console.log("new routine:", routine);
    return routine;
  } catch (error){
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {rows:[routine]} = await client.query(`
    SELECT * FROM routines
    WHERE id=$1;
    `, [id]);
    return routine;
  } catch (error){
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  //console.log("")
  try {
    const {rows:routines} = await client.query(`
    SELECT * FROM routines;
    `);
    return routines;
  } catch (error){
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const {rows:routines} = await client.query(`
    SELECT users.username AS "creatorName", routines.* FROM routines
    JOIN users ON routines."creatorId" = users.id;
    `);
    //console.log("allRoutinesWITHOUTActivities:", routines);
    const allRoutinesWithActivities = await attachActivitiesToRoutines(routines);
    console.log("allRoutinesWithActivities:", allRoutinesWithActivities)
    console.log("activities:", allRoutinesWithActivities[0].activities)

    return allRoutinesWithActivities;
  } catch (error){
    throw error
  }
  //const routines = getRoutinesWithoutActivities();
  //const routinesWithActivities = {}
  //console.log("getAllroutines routines:",routines);
//Go through routine_activities apply them to routines
  
}

async function getAllPublicRoutines() {
  try {
    const {rows: routines} = await client.query(`
    SELECT users.username AS "creatorName", routines.*
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE routines."isPublic"=($1);
    `,[true]);
    //console.log("public routines:", routines);
    const publicRoutinesWithActivities = await attachActivitiesToRoutines(routines);
    //console.log("PublicRoutinesWithActivities:",publicRoutinesWithActivities);
    return routines;
  } catch (error){
    throw error
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const {rows: routines} = await client.query(`
    SELECT users.username AS "creatorName", routines.*
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE users.username = ($1);
    `,[username]);
    const routineWithActivities = await attachActivitiesToRoutines(routines);
    return routineWithActivities;
  } catch (error){
    throw error
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const {rows: routines} = await client.query(`
    SELECT users.username AS "creatorName", routines.*
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE users.username = ($1) AND routines."isPublic"=($2);
    `,[username, true]);
    const routineWithActivities = await attachActivitiesToRoutines(routines);
    return routineWithActivities;
  } catch (error){
    throw error
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const routines = await getAllPublicRoutines();
    const routinesWActivities = await attachActivitiesToRoutines(routines);
    //for each routine
    //const sortByActivity = await sortByActivityFunc(routinesWActivities, id);
    const sortByActivity = (routinesWActivities.filter(routine => {
                var containsActivity = false;
                for (let i = 0; i < routine.activities.length; i++) {
                  if (routine.activities[i].id === id){
                    containsActivity = true;
                  }
                }
                return containsActivity;
              }))  
    //console.log("sortByActivity1:", sortByActivity);
    //console.log("get all routines:", await getAllPublicRoutines());
    // if(!sortByActivity === []){
    console.log("sortByActivity getPublicRoutinesByACtivity:",sortByActivity);
    
    return  sortByActivity;
  } catch (error){
    throw error
  }
}

async function updateRoutine({ id, ...fields }) {
  console.log("update id:",id,"update fields:",fields);
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1}`
  ).join(', ');
  
  if (setString.length === 0) {
    return;
  }
  try {
    const {rows:[routine]} = await client.query(`
    UPDATE routines
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
    `, Object.values(fields));
    console.log("updatedRoutine:", routine);
    return routine;

  
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try{
  const {rows:[routine_activities]} = await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId"=${ id };
    `);
  const {rows:[routine]} = await client.query(`
    DELETE FROM routines
    WHERE id=${ id };
    `);
  } catch (error){
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
