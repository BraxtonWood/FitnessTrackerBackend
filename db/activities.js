const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  //console.log("createActivity name:",name, "description:", description);
  // return the new activity



  //HANDLE POSSIBLE  REDUNDANCY: Cycling vs cycling





  try {
    const {rows:[newActivity]} = await client.query(`
      INSERT INTO activities (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `, [name, description]);
    return newActivity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try{ 
    const {rows:allActivities} = await client.query(`
      SELECT * FROM activities;
      `);
    return allActivities;
  } catch (error){
    throw error;
  }
}

async function getActivityById(id) {
  try{ 
    const {rows:[activity]} = await client.query(`
      SELECT * FROM activities
      WHERE id=${id}
      `);
      return activity;
  } catch (error){
    throw error;
  }
}

async function getActivityByName(name) {
  try{
    const {rows:[activity]} = await client.query(`
      SELECT * FROM activities
      WHERE name=($1)
      `,[name]);
      return activity;
  } catch (error){
    throw error;
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
  const routinesWithActivities = [...routines];
  const routineIds = routines.map(routine => routine.id);
  const binds = routines.map((routine, index) => `$${index+1}`).join(", ");
  //console.log("binds",binds);
  //get activities related to any of the routines passed in
  const {rows: activities } = await client.query(`
    SELECT activities.*,
      routine_activities.duration,
      routine_activities.count,
      routine_activities."routineId",
      routine_activities.id AS "routineActivityId"
    FROM activities
    JOIN routine_activities ON activities.id = routine_activities."activityId"
    WHERE routine_activities."routineId" IN (${binds})
  `, routineIds);
  
  //loop over the routines, add a key called activities with an
  //array of related activities
  //console.log("activies array:",activities);
  for (let i =0; i < routinesWithActivities.length; i++) {
    const routine = routinesWithActivities[i];

    routine.activities = activities.filter(activity => activity.routineId === routine.id);
    
  }
  //console.log("routinesWithActivities[0].activies:", routinesWithActivities[0].activities);
  return routinesWithActivities;
}

async function updateActivity({ id, ...fields }) {
  console.log("updateActivity id:", id, "fields", fields);
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  console.log("setString:", setString);
  console.log("Obj.value(fiels):", Object.values(fields));
  if (setString.length === 0) {
    throw {
      name: "UpdateFieldsError",
      message: "Fields to be updated not specified"
    }
  }
  try {
    const {rows: [activity]} = await client.query(`
      UPDATE activities
      SET ${setString }
      WHERE id=${id}
      RETURNING *;
      `, Object.values(fields));
      //console.log("rows:",rows);
      return activity;
  } catch (error){
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
