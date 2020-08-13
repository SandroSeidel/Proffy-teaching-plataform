// const proffys = [
//     // {
// 	  //   name: "Diego Fernandes",
// 	  //   avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4",
// 	  //   whatsapp: "2345678",
// 	  //   bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
//     //   subject: "Química",
//     //   cost: "20",
//     //   weekday: [0],
//     //   time_from: [720],
//     //   time_to: [1120]
//     // },
//     {
//     name: "Sandro Seidel",
//     avatar: "https://avatars0.githubusercontent.com/u/60406890?s=400&u=c352a6e8dbf17c8bc22ffb3b68246f81abb6ddbf&v=4",
//     whatsapp: "54996057853",
//     bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
//     subject: 1,
//     cost: "20",
//     weekday: [0],
//     time_from: [720],
//     time_to: [1120]
//   }
// ]//objects proffy array

const Database = require('./database/db')
const { subjects, weekdays, getSubjects, convertHoursToMinutes } = require("./utils/format");

function pageLanding(req, res) {
    // return res.sendFile(__dirname + "/views/index.html");//without nunjucks
    return res.render("index.html");
};

async function pageStudy(req, res) {
  const filters = req.query;

  if (!filters.subject || !filters.weekday || !filters.time) {
      return res.render("study.html", { filters, subjects, weekdays })
  }

  const timeToMinutes = convertHoursToMinutes(filters.time);
 
  const query = `
      SELECT classes.*, proffys.*
      FROM proffys
      JOIN classes ON (classes.proffy_id = proffys.id)
      WHERE EXISTS (
          SELECT class_schedule.*
          FROM class_schedule
          WHERE class_schedule.class_id = classes.id
          AND class_schedule.weekday = ${filters.weekday}
          AND class_schedule.time_from <= ${timeToMinutes}
          AND class_schedule.time_to > ${timeToMinutes}
      )
      AND classes.subject = '${filters.subject}'
  `;

  try {
      const db = await Database;
      const proffys = await db.all(query);

      proffys.map((proffy) => {
        proffy.subject = getSubjects(proffy.subject);
      })

      return res.render('study.html', { proffys, subjects, filters, weekdays });

  } catch (error) {
      console.log(error);
  };

};

function pageGiveClasses(req, res) {
    return res.render("give-classes.html", { subjects, weekdays });
};

async function saveClasses(req, res) {
    const data = req.body;
    const createProffy = require('./database/createProffy');

    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar, 
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    };

    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    };

    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: convertHoursToMinutes(req.body.time_from[index]),
            time_to: convertHoursToMinutes(req.body.time_to[index])
        }
    })

    try {
        const db = await Database
        await createProffy(db, { proffyValue, classValue, classScheduleValues })

        let queryString = "?subject=" + req.body.subject
        queryString += "&weekday=" + req.body.weekday[0]
        queryString += "&time=" + req.body.time_from[0]

        return res.redirect("/study" + queryString)
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    pageLanding,
    pageStudy, 
    pageGiveClasses,
    saveClasses
};
