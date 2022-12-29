const { readFile, writeFile, deleteFromFile } = require("./logic/fileHandle");

// Event listener to random data creation

let AllData = readFile();

//! Function generating random data

function randomData() {
  let name = (Math.random() + 1).toString(36).substring(2);
  let about = (Math.random() + 1).toString(36).substring(8);
  let number = Math.floor(Math.random() * 1000000);
  let number2 = Math.floor(Math.random() * 100);
  let bool1 = Boolean(Math.round(Math.random()));
  let bool2 = Boolean(Math.round(Math.random()));
  let date = new Date(+new Date() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split("T")[0];

  // Writing generated data to file
  writeToTable(name, about, number, number2, bool1, bool2, date);
}

//! function to generate multiple random records
function randomDataMultiple() {
  let amount = document.getElementById("random-amount").value;

  for (let y = 0; y < amount; y++) {
    randomData();
  }
  generateRecords();
}

//! Creating new record by manually writing data
let addContent = () => {
  // getting all written data after clicking "SUBMIT" button
  let name = document.getElementById("name-input").value;
  let about = document.getElementById("about-input").value;
  let number = document.getElementById("number-input").value;
  let number2 = document.getElementById("number2-input").value;
  let bool1 = document.getElementById("bool1-input").checked;
  let bool2 = document.getElementById("bool2-input").checked;
  let date = document.getElementById("date-input").value;

  // Running write to table button
  writeToTable(name, about, number, number2, bool1, bool2, date);

  // generating refreshed table with new data
  generateRecords();
};

//! Rendering new table by reading file data

let generateRecords = () => {
  let records = AllData.elements;
  // getting table section div from document
  var tableSection = document.getElementById("table-section");
  // clearing table section from any inner html for empty space to add new records
  tableSection.innerHTML = "";
  // if records table are longer then 1
  if (records.length > 1) {
    // sorting file records by ID
    records.sort(dynamicSort("id"));

    // running function for every element in records by by "MAP"
    records.map((element) => {
      const rowKeys = Object.keys(element);
      const rowRecords = Object.values(element);

      // checking if every column exists and adding record to table by automatically generate every field
      tableSection.innerHTML += `<div class="cell-row">
        <div class="cell cell-${rowKeys[0]}">${rowRecords[0]}</div>
        <div class="cell cell-${rowKeys[1]}">${rowRecords[1]}</div>
        <div class="cell cell-${rowKeys[2]}">${rowRecords[2]}</div>
        <div class="cell cell-${rowKeys[3]}">${rowRecords[3]}</div>
        <div class="cell cell-${rowKeys[4]}">${rowRecords[4]}</div>
        <div class="cell cell-${rowKeys[5]}">${rowRecords[5]}</div>
        <div class="cell cell-${rowKeys[6]}">${rowRecords[6]}</div>
        <div class="cell cell-${rowKeys[7]}">${rowRecords[7]}</div>
        <button class="cell delete-record" value="${rowRecords[0]}">X</button>
      </div>`;
    });
  } else {
    const rowKeys = Object.keys(records);
    const rowRecords = Object.values(records);

    // checking if every column exists and adding record to table by automatically generate every field
    tableSection.innerHTML += `<div class="cell-row">
    <div class="cell cell-${rowKeys[0]}">${rowRecords[0]}</div>
    <div class="cell cell-${rowKeys[1]}">${rowRecords[1]}</div>
    <div class="cell cell-${rowKeys[2]}">${rowRecords[2]}</div>
    <div class="cell cell-${rowKeys[3]}">${rowRecords[3]}</div>
    <div class="cell cell-${rowKeys[4]}">${rowRecords[4]}</div>
    <div class="cell cell-${rowKeys[5]}">${rowRecords[5]}</div>
    <div class="cell cell-${rowKeys[6]}">${rowRecords[6]}</div>
    <div class="cell cell-${rowKeys[7]}">${rowRecords[7]}</div>
    <button class="cell delete-record" value="${rowRecords[0]}">X</button>
  </div>`;
  }
};

let writeToTable = (name, about, number, number2, bool1, bool2, date) => {
  // reading previous file data
  const object = AllData.elements;

  // creating id for new record
  let id = 0;
  for (let j = 1; j <= object.length; j++) {
    var item = object.find((item) => item.id === j);
    if (item == undefined) id = j;
  }

  //creating object with given data

  let readyData = {
    id: id,
    name: name,
    about: about,
    number: number,
    number2: number2,
    bool1: bool1,
    bool2: bool2,
    date: date,
  };

  AllData.elements.push(readyData);
  console.log(AllData);
};

const saveToFile = () => {
  writeFile(AllData);
};

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

document.getElementById("random-data-submit").addEventListener("click", () => {
  randomData();
  generateRecords();
});

document
  .getElementById("random-data-multiple-submit")
  .addEventListener("click", randomDataMultiple);

document.getElementById("filter-submit").addEventListener("click", () => {
  filteredRecords = filter(records);
  generateRecords(filteredRecords);
});

document.getElementById("clear-filter").addEventListener("click", () => {
  const object = readFile(tableName);
  let records = object.elements;
  generateRecords(records);
});

document.getElementById("form-submit").addEventListener("click", addContent);

document.getElementById("search-submit").addEventListener("click", () => {
  searchedRecords = search(records);
  generateRecords(searchedRecords);
});

document.getElementById("save-to-file").addEventListener("click", saveToFile);

generateRecords();
