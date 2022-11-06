const path = require("path");
const fs = require("fs");

const readFile = (file) => {
  let table = path.join(__dirname, `../database/${file}.json`);
  const data = JSON.parse(fs.readFileSync(table));
  return data;
};

const writeFile = (file, data) => {
  let toWrite = data;
  const fileData = JSON.parse(fs.readFileSync(`./database/${file}.json`));
  fileData.elements.push(toWrite);
  fs.writeFileSync(
    `./database/${file}.json`,
    JSON.stringify(fileData, "elements", 1)
  );
};

const deleteFromFile = (file, data) => {
  let toDelete = data;
  let fileData = JSON.parse(fs.readFileSync(`./database/${file}.json`));
  console.log(fileData.elements);
  fileData.elements = fileData.elements.filter(
    (element) => element.id != toDelete
  );
  console.log(fileData.elements);
  fs.writeFileSync(
    `./database/${file}.json`,
    JSON.stringify(fileData, "elements", 2)
  );
};

module.exports = { readFile, writeFile, deleteFromFile };
