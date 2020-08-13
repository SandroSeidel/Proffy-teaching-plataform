const Database = require('./db.js');
const createProffy = require('./createProffy.js');

Database.then( async (db) => {

  proffyValue = {
    name: "Sandro Seidel",
    avatar: "https://avatars0.githubusercontent.com/u/60406890?s=400&u=c352a6e8dbf17c8bc22ffb3b68246f81abb6ddbf&v=4",
    whatsapp: "54996057853",
    bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
  }

  classValue = {
    subject: "Física",
    cost: "20",
  }

  classScheduleValues = [
    {
      weekday: 1,
      time_from: 720,
      time_to: 1120
    },
    {
      weekday: 0,
      time_from: 520,
      time_to: 1120
    }
  ]

  // console.log('aqui chegou', proffyValue, 'pode pa',classValue, 'baguio loko', classScheduleValues);

  // await createProffy(db, {proffyValue, classValue, classScheduleValues});

  const selectedProffys = await db.all("SELECT * FROM proffys");
  // console.log(selectedProffys);

  const selectClassesAndProffys = await db.all(`
      SELECT classes.*, proffys.*
      FROM proffys
      JOIN classes ON (classes.proffy_id = proffys.id)
      WHERE classes.proffy_id = 1;
    `);

  // console.log('ohhhhh', selectClassesAndProffys);

  const selectClassesSchedules = await db.all(`
      SELECT class_schedule.*
      FROM class_schedule 
      WHERE class_schedule.class_id = 1
      AND class_schedule.weekday = "0"  
      AND class_schedule.time_from <= "420"
      AND class_schedule.time_to > "420"
  `)

  console.log(selectClassesSchedules);
})
