const { readFile, writeFile } = require("./logic/fileHandle");

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
  generateRecords(AllData.elements);
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
  generateRecords(AllData.elements);
};

//! Rendering new table by reading file data

let generateRecords = (records) => {
  // getting table section div from document
  var tableSection = document.getElementById("table-section");
  // clearing table section from any inner html for empty space to add new records
  tableSection.innerHTML = "";
  // if records table are longer then 1
  if (records.length > 1) {
    // sorting file records by ID
    records.sort(dynamicSort("id"));

    // running function for every element in records by by "MAP"
    records.slice(0, 500).map((element) => {
      // checking if every column exists and adding record to table by automatically generate every field
      tableSection.innerHTML += `<div class="cell-row">
      <div class="cell cell-id">${element.id}</div>
      <div class="cell cell-name">${element.name}</div>
      <div class="cell cell-about">${element.about}</div>
      <div class="cell cell-number">${element.number}</div>
      <div class="cell cell-number2">${element.number2}</div>
      <div class="cell cell-bool1">${element.bool1}</div>
      <div class="cell cell-bool2">${element.bool2}</div>
      <div class="cell cell-date">${element.date}</div>
    </div>`;
    });
  } else if (records.length == 1) {
    tableSection.innerHTML += `<div class="cell-row">
    <div class="cell cell-id">${records[0].id}</div>
    <div class="cell cell-name">${records[0].name}</div>
    <div class="cell cell-about">${records[0].about}</div>
    <div class="cell cell-number">${records[0].number}</div>
    <div class="cell cell-number2">${records[0].number2}</div>
    <div class="cell cell-bool1">${records[0].bool1}</div>
    <div class="cell cell-bool2">${records[0].bool2}</div>
    <div class="cell cell-date">${records[0].date}</div>
  </div>`;
  }
};

//! Add new created element to record list

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
};

//! Saving record list to file

const saveToFile = () => {
  writeFile(AllData);
};

//* Search algorithms

//! linear search
let linearSearch = () => {
  let searchSelect = document.getElementById("search-select").value;
  let searchValue = document.getElementById("search-value").value;

  let resultList = [];

  for (let i = 0; i < AllData.elements.length; i++) {
    if (AllData.elements[i][searchSelect] == searchValue) {
      resultList.push(AllData.elements[i]);
    }
  }

  return resultList;
};

function binarySearch(array, key, value) {
  let start = 0;
  let end = array.length - 1;
  const objects = [];

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    const currentValue = array[middle][key];

    console.log(currentValue, start, end);

    if (currentValue == value) {
      objects.push(array[middle]);
    }

    const left = binarySearch(array.slice(start, middle), key, value);
    if (left.length > 0) {
      return objects.push(...left);
    }
    const right = binarySearch(array.slice(middle + 1), key, value);
    if (right.length > 0) {
      return objects.push(...right);
    }

    if (currentValue > value) {
      end = middle - 1;
    } else {
      start = middle + 1;
    }
  }

  return objects;
}

let chainSearch = () => {
  let key = document.getElementById("search-select").value;
  let value = document.getElementById("search-value").value;
  let list = AllData.elements;
  let keyList = {};
  let chains = {
    id: [],
    name: [],
    about: [],
    number: [],
    number2: [],
    bool1: [],
    bool2: [],
    date: [],
  };

  for (let i = 0; i < list.length; i++) {}

  let current = list.head;
  while (current) {
    if (current.data[key] === value) {
      result.push(current);
      current = current.next;
    }
    current = current.next;
  }
  console.log(result);
  return result;
};

let inversionSearch = () => {};

//* Search algorithms

//! Dynamically sort array by given property

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
  generateRecords(AllData.elements);
});

document
  .getElementById("random-data-multiple-submit")
  .addEventListener("click", randomDataMultiple);

document.getElementById("form-submit").addEventListener("click", addContent);

document.getElementById("save-to-file").addEventListener("click", saveToFile);

document
  .getElementById("linear-search-submit")
  .addEventListener("click", () => {
    let records = linearSearch();
    generateRecords(records);
  });

// document
//   .getElementById("binary-search-submit")
//   .addEventListener("click", () => {
//     let key = document.getElementById("search-select").value;
//     let value = document.getElementById("search-value").value;
//     let array = AllData.elements;
//     let records = binarySearch(array, key, value);
//     console.log(records);
//     generateRecords(records);
//   });

// document
//   .getElementById("chain-search-submit")
//   .addEventListener("click", chainSearch);

// document
//   .getElementById("inversion-search-submit")
//   .addEventListener("click", inversionSearch);

document
  .getElementById("clear-search")
  .addEventListener("click", () => generateRecords(AllData.elements));

generateRecords(AllData.elements);
