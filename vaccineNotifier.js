require("dotenv").config();
const moment = require("moment");
const csv = require("csv-parser");
const fs = require("fs");
const cron = require("node-cron");
const axios = require("axios");
const notifier = require("./notifier");
const smsNotifier = require("./smsNotifier");

async function main() {
  try {
    cron.schedule("* * * * *", async () => {
      checkAvailability();
    });
  } catch (e) {
    console.log("an error occured: " + JSON.stringify(e, null, 2));
    throw e;
  }
}

function checkAvailability() {
  let datesArray = fetchNext7Days();
  fs.createReadStream("data.csv")
    .pipe(csv())
    .on("data", (row) => {
      const { pincode, email, phone, age } = row;
      if (!!pincode && !!email && !!phone && !!age) {
        datesArray.forEach((date) => {
          getSlotsForDate(date, pincode, email, phone, age);
        });
      }
    })
    .on("end", () => {
      console.log("All records processed");
    });
}

function getSlotsForDate(DATE, PINCODE, EMAIL, PHONE, AGE) {
  let config = {
    method: "get",
    url:
      "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" +
      PINCODE +
      "&date=" +
      DATE,
    headers: {
      accept: "application/json",
      "Accept-Language": "hi_IN",
    },
  };

  axios(config)
    .then(function (slots) {
      let sessions = slots.data.sessions;
      let validSlots = sessions.filter(
        (slot) => slot.min_age_limit <= AGE && slot.available_capacity > 10
      );
      console.log({ date: DATE, validSlots: validSlots.length });
      if (validSlots.length > 0) {
        notifyMe(validSlots, PINCODE, EMAIL, PHONE);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function notifyMe(validSlots, PINCODE, EMAIL, PHONE) {
  const sendEmail =
    process.env.ENABLE_EMAIL === 1 || process.env.ENABLE_EMAIL === "1";
  const sendSMS =
    process.env.ENABLE_MSG91_SMS === 1 || process.env.ENABLE_MSG91_SMS === "1";
  if (sendEmail) {
    let slotDetails = JSON.stringify(validSlots, null, "\t");
    notifier.sendEmail(EMAIL, `VACCINE SLOT AVAILABLE FOR ${PINCODE}`, slotDetails, (err) => {
      if (err) {
        console.error({ err });
      }
    });
  }
  if (sendSMS) {
    smsNotifier.sendSMS(PHONE, PINCODE, validSlots, (err) => {
      if (err) {
        console.error({ err });
      }
    });
  }
}

function fetchNext7Days() {
  let dates = [];
  let today = moment();
  for (let i = 0; i < 7; i++) {
    let dateString = today.format("DD-MM-YYYY");
    dates.push(dateString);
    today.add(1, "day");
  }
  return dates;
}

main().then(() => {
  console.log("Vaccine availability checker started.");
});
