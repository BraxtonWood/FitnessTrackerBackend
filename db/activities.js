const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  console.log("createActivity name:",name, "description:", description);
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
    const {rows:[allActivities]} = await client.query(`
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
      WHERE name=${name}
      `);
      return activity;
  } catch (error){
    throw error;
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities

}

async function updateActivity({ id, ...fields }) {
  console.log("updateActivity id:", id, "fields", fields);
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  if (setString.length === 0) {
    throw {
      name: "UpdateFieldsError",
      message: "Fields to be updated not specified"
    }
  }
  try {
    const { rows: [activity]} = await client.query(`
      UPDATE activity
      SET ${setString }
      WHERE id=${id}
      RETURNING *;
      `, Object.values(fields));
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
