const express = require("express");
// const mongoose = require("mongoose");
// const mainroutes = require("./routes/mainroutes");
const fs = require("fs/promises");
const createCsvWriter = require("csv-writer").createArrayCsvWriter;
// const profileroutes = require("./routes/profileroutes");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const session = require("express-session");
// const passport = require("passport");
// const flash = require("connect-flash");
// dotenv.config();

const app = express();
const hostname = "0.0.0.0";
const port = 8080;
app.set("view engine", "ejs");

app.use(express.static("public"));
// app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.set("trust proxy", 1);
// app.use(
//   session({
//     secret: "secretcode1",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       maxAge: 1000 * 60 * 60 * 24, // One Week
//     },
//   })
// );
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(mainroutes);

// app.use(profileroutes);

// ${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}
// try {
//   mongoose.connect(
//     `mongodb+srv://armaan:key2948@cluster0.giwib.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => {
//       console.log(`Connected to the DATABASE`);
//     }
//   );
// } catch (error) {
//   console.log(`Could not connect to the DB because ${error}`);
// }

const puppeteer = require("puppeteer");
const { json } = require("body-parser");

const csvWriter = createCsvWriter({
  header: ["Quests"],
  path: "file.csv",
});

const urls = [
  "https://google.qwiklabs.com/public_profiles/a13186ba-7fef-45ad-a539-cbf589475fa8",
  "https://google.qwiklabs.com/public_profiles/8b44dc79-6547-4be9-90f6-21a770e42550",
  "https://www.qwiklabs.com/public_profiles/5ff2c506-64ea-4bc8-b48f-59cfc4152736",
  "https://google.qwiklabs.com/public_profiles/1b2f781e-5edc-485f-8fe7-1f63735588d2",
];

var finalobj = {};

async function startbrowser() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let i = 0;
  pagesurfer(browser, page, i, finalobj);
}

//   await browser.close();
async function pagesurfer(browser, page, i, finalobj) {
  if (i == urls.length) {
    browser
      .close()
      .then((response) => {
        console.log("Browser Session Closed", finalobj);
      })
      .catch((response) => console.log("Error closing"));
    return;
  }
  console.log(urls[i]);
  page
    .goto(urls[i])
    .then((response) => {
      let names = [];
      page
        .$$eval(
          "body > ql-drawer-container > ql-drawer-content > main > div > h1",
          (name) => {
            wrappedname = name.map((x) => x.innerHTML.trim());
            return wrappedname[0];
          }
        )
        .then((response) => {
          //   username = JSON.stringify(response);
          username = response;
          console.log(username);
          page
            .$$eval(
              "body > ql-drawer-container > ql-drawer-content > main > div > div > div > span.ql-subhead-1.l-mts",
              (names) => {
                return names.map((x) => x.innerHTML.trim());
              }
            )
            .then((result) => {
              names = JSON.stringify(result);
              //   names = result;
              console.log(names);

              page
                .$$eval(
                  "body > ql-drawer-container > ql-drawer-content > main > div > div > div:nth-child(1) > span.ql-body-2.l-mbs",
                  (name) => {
                    wrappedname = name.map((x) => x.innerHTML.trim());
                    return wrappedname[0];
                  }
                )
                .then((result) => {
                  date = JSON.stringify(result);
                  //   names = result;
                  console.log(date);

                  finalobj[i] = { Name: username, Quests: names, Date: date };
                  pagesurfer(browser, page, i + 1, finalobj);
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log("Couldn't get name"));
    })
    .catch((err) => console.log("Couldn't open page err"));
}

// setInterval(function () {
//   startbrowser();
// }, 360000);
startbrowser();
// 6 minutes

app.get("/", (req, res, next) => {
  res.send(finalobj);
});

app.listen(port, () => {
  console.log(`App Running on port ${port || process.env.PORT}.`);
});

//   await page.screenshot({ path: "quik.png", fullPage: true });

//   const names = await page.evaluate(() => {
//     return Array.from(
//       document.querySelectorAll(
//         "body > ql-drawer-container > ql-drawer-content > main > div > div > div > span.ql-subhead-1.l-mts"
//       )
//     ).map((x) => x.textContent);
//   });

//     const forLoop = async _ => {
//     console.log('Start')

//     for (let index = 0; index < fruitsToGet.length; index++) {
//       const fruit = fruitsToGet[index]
//       const numFruit = await getNumFruit(fruit)
//       console.log(numFruit)
//     }

//     console.log('End')
//   }

//   try {
//     await page.goto(profileurl);
//   } catch {
//     console.log("ERR 1");
//   }

//ps aux | grep node
//kill -9
