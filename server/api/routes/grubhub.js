const puppeteer = require("puppeteer");
const { performance } = require("perf_hooks");
const cluster = require("cluster");
const parsePhoneNumber = require("libphonenumber-js");

const AccountRouter = require("express").Router();

// async function getMultipleCodes() {
//   let startTimer = performance.now();
//   const browser = await puppeteer.launch({
//     headless: true
//   });
//
//   for (var i = 0; i < 10; i++) {
//     const page = await browser.newPage();
//
//     await page.goto(
//       "https://www.grubhub.com/referral/c930ff85-0fde-11eb-9173-0f21de63aff6?utm_source=grubhub.com&utm_medium=content_owned&utm_campaign=growth_refer-a-friend_share-link&utm_content=promo_"
//     );
//
//     await page.on("response", async response => {
//       const url = response.url();
//       if (url.includes("code") && response.status() === 201) {
//         let rawData = await response.json();
//         const code = rawData.code_text;
//         if (code) {
//           console.log(code);
//           page.close();
//         }
//       }
//     });
//   }
//
//   if (cluster.worker.id === 4) {
//     let endTimer = performance.now();
//     setTimeout(() => {
//       console.log(
//         `\nTotal Time: ${Math.round(((endTimer - startTimer) / 1000) * 100) /
//           100} seconds`
//       );
//     }, 2000);
//   }
// }

async function getCode(profile, res) {
  const browser = await puppeteer.launch({
    headless: true
    // args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  let code;

  await page.goto(
    "https://www.grubhub.com/referral/c930ff85-0fde-11eb-9173-0f21de63aff6?utm_source=grubhub.com&utm_medium=content_owned&utm_campaign=growth_refer-a-friend_share-link&utm_content=promo_"
  );

  page.on("response", async response => {
    const url = response.url();
    if (url.includes("code") && response.status() === 201) {
      let rawData = await response.json();
      code = await rawData.code_text;
      if (code) {
        let account = await createAccount(page, profile);
        account["promoCode"] = code;
        console.log(account);
        res.status(200).send(account);
      }
    }
  });
}

async function createAccount(page, profile) {
  await page.goto("https://www.grubhub.com/create-account");
  const keyboard = await page.keyboard;
  const { firstName, lastName } = profile;

  const email = generateEmail(firstName, lastName);
  const password = generatePassword();

  await page.waitFor(1000);

  await page.click("#firstName");
  await keyboard.type(firstName);

  await page.click("#lastName");
  await keyboard.type(lastName);

  await page.click("#email");
  await keyboard.type(email);

  await page.click("#password");
  await keyboard.type(password);

  await page.evaluate(() => {
    const button = document.querySelectorAll(".s-btn-primary")[0];
    button.click();
  });

  await page.waitFor(1500);

  const { street, state, city, zipcode } = profile;

  const phoneNumber = generatePhoneNumber();

  await page.goto("https://www.grubhub.com/account/address");

  await page.waitFor(1500);

  await page.waitForSelector(".s-btn-tertiary");

  await page.evaluate(() => {
    const button = document.querySelector(".s-btn-tertiary");
    button.click();
  });

  await page.waitForSelector("#streetAddress");

  await page.click("#streetAddress");
  await keyboard.type(street);

  await page.click("#city");
  await keyboard.type(city);

  await page.click("#zipCode");
  await keyboard.type(zipcode);

  await keyboard.press("Tab");
  await keyboard.type(phoneNumber);

  await page.select("#address-state", state);

  await page.click("#addressName");
  await keyboard.type("Default");

  await keyboard.press("Tab");
  await keyboard.press("Enter");

  const user = {
    firstName,
    lastName,
    email,
    password,
    street,
    city,
    state,
    zipcode,
    phoneNumber
  };

  return user;
}

function generatePhoneNumber() {
  let areaCodes = ["457", "347", "973", "857", "862", "617", "201"];

  let number = `${
    areaCodes[Math.floor(Math.random() * areaCodes.length)]
  }${Math.floor(Math.random() * 9111111) + 1235137}`;

  let phoneNumber = parsePhoneNumber(`Phone: 1 ${number}`, "US");
  let isValidNumber = false;

  while (!isValidNumber) {
    if (phoneNumber.isValid()) {
      isValidNumber = true;
    } else {
      number = `${
        areaCodes[Math.floor(Math.random() * areaCodes.length)]
      }${Math.floor(Math.random() * 9111111) + 1235137}`;
      phoneNumber = parsePhoneNumber(`Phone: 1 ${number}`, "US");
    }
  }

  return number;
}

function generateEmail(firstName, lastName) {
  const providers = [
    "gmail",
    "hotmail",
    "yahoo",
    "grubhub",
    "msn",
    "github",
    "aol",
    "supreme",
    "world",
    "server",
    "bc"
  ];

  const extensions = ["com", "net", "io", "gov"];

  const randomProvider =
    providers[Math.floor(Math.random() * providers.length)];

  const randomExtension =
    extensions[Math.floor(Math.random() * extensions.length)];

  const randomNumber = Math.floor(Math.random() * 90000) + 10000;

  return `${firstName}${lastName}${randomNumber}@${randomProvider}.${randomExtension}`.toLowerCase();
}

function generatePassword() {
  return Math.random()
    .toString(36)
    .slice(-8);
}

AccountRouter.get("", async (req, res) => {
  const profile = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    street: req.query.street,
    city: req.query.city,
    zipcode: req.query.zipcode,
    state: req.query.state
  };

  await getCode(profile, res);
});

async function main() {
  console.log("Fetching Account");
  const profile = {
    firstName: "Subraiz",
    lastName: "Ahmed",
    street: "Voute Hall",
    city: "Newton",
    zipcode: "02467",
    state: "MA"
  };

  await getCode(profile);
}

main();

module.exports = AccountRouter;
