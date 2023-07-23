#!/usr/bin/env node
import inquirer, { Question } from "inquirer";
import axios from "axios";
import fs from "fs";

let name: string;
let year: string;
let licenseText: string;

// Get license text from GitHub API
function getLicense(license: string) {
  axios
    .get(`https://api.github.com/licenses/${license}`)
    .then((res) => {
      licenseText = res.data.body;
    })
    .catch((err) => {
      console.log(err);
    });
}

// CLI
async function license() {
  let license: string;

  const licensePromp = await inquirer.prompt({
    type: "list",
    name: "license",
    message: "Choose a license",
    choices: [
      "MIT License",
      "GNU Lesser General Public License v3.0",
      "Mozilla Public License 2.0",
      "The Unlicense",
      "Apache License 2.0",
      "GNU General Public License v3.0",
      "None",
    ],
  });

  license = licensePromp.license;
  if (license === "None") {
    process.exit(0);
  } else {
    switch (license) {
      case "MIT License":
        getLicense("mit");
        break;
      case "LGPL-3.0GNU Lesser General Public License v3.0":
        getLicense("lgpl-3.0");
        break;
      case "Mozilla Public License 2.0":
        getLicense("mpl-2.0");
        break;
      case "The Unlicense":
        getLicense("unlicense");
        break;
      case "Apache License 2.0":
        getLicense("apache-2.0");
        break;
      case "GNU General Public License v3.0":
        getLicense("gpl-3.0");
        break;
      default:
        console.log("❌ Error");
        break;
    }
  }
}

// Get user details
async function details() {
  const fullName = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Enter your full name:",
    default() {
      return "Laith Taher";
    },
  });
  const currentYear = await inquirer.prompt({
    type: "input",
    name: "year",
    message: "Enter the year:",
    default() {
      return new Date().getFullYear();
    },
  });

  name = fullName.name;
  year = currentYear.year;
}

// Replace text in license
async function replaceText(name: string, year: string) {
  licenseText = licenseText
    .replace(/\[year\]/g, year)
    .replace(/\[yyyy\]/g, year)
    .replace(/<year>/g, year)
    .replace(/\[name of copyright owner\]/g, name)
    .replace(/\[fullname\]/g, name)
    .replace(/<name of author>/g, name);
}

// Create file
async function createFile(license: string) {
  fs.writeFile("LICENSE", license, (err) => {
    if (err) throw err;
    console.log("🎉 File created");
  });
}

// Run functions
console.clear();
await license();
await details();
await replaceText(name, year);
await createFile(licenseText);
