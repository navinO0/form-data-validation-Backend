const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const databasePath = path.join(__dirname, "formData.db");

const app = express();
app.use(cors());
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3004, () =>
      console.log("Server Running at http://localhost:3004/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/person/", async (request, response) => {
  const getAllPersons = `
    SELECT
      id,name,age,gender,MobileNumber, address,state, city, country, pincode, guardianType, guardianName, nationality,govtID,panNumber,aadhaarNumber
    FROM
      person;`;
  const getAllPersonsArray = await database.all(getAllPersons);
  response.send(getAllPersonsArray);
});

app.post("/person/", async (request, response) => {
  const data = request.body;
  const {
    name,
    age,
    gender,
    mobileNumber,
    govtId,
    aadhaarNumber,
    guardianType,
    guardian,
    email,
    emergencyNumber,
    address,
    state,
    city,
    country,
    pincode,
    occupation,
    religion,
    maritalStatus,
    bloodGroup,
    nationality,
    panNumber,
  } = data;
  const queryPost = `
    insert into person(name,age,gender,mobileNumber,govtId,aadhaarNumber,guardianType,guardianName,email, emergencyNumber,address,state,city,country,pincode,occupation,religion,maritalStatus,bloodGroup,nationality,panNumber)
    values('${name}','${age}','${gender}','${mobileNumber}','${govtId}', '${aadhaarNumber}','${guardianType}','${guardian}','${email}','${emergencyNumber}','${address}','${state}','${city}','${country}','${pincode}','${occupation}','${religion}','${maritalStatus}','${bloodGroup}','${nationality}','${panNumber}');
    `;

  const dbResponse = await database.run(queryPost);
  const personId = dbResponse.lastID;
  response.status(200);
  response.send("User created successfully");
});

module.exports = app;
