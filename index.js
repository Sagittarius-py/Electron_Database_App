const { readFile, writeFile, deleteFromFile } = require("./logic/fileHandle");

document
  .getElementById("random-data-submit")
  .addEventListener("click", randomData);

function randomData() {
  let tableName = document.getElementById("tables").value;
  let name = (Math.random() + 1).toString(36).substring(2);
  let about = (Math.random() + 1).toString(36).substring(8);
  let number = Math.floor(Math.random() * 1000000);
  let number2 = Math.floor(Math.random() * 100);
  let bool1 = Boolean(Math.round(Math.random()));
  let bool2 = Boolean(Math.round(Math.random()));
  let date = new Date(+new Date() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split("T")[0];

  console.log(name, about, number, number2, bool1, bool2, date);

  writeToTable(tableName, name, about, number, number2, bool1, bool2, date);
  generateTable(tableName);
}

function filter(records) {
  let filterColumn = document.getElementById("filter-select").value;
  let filterValue = document.getElementById("filter-value").value;
  console.log(filterColumn);
  if (filterColumn == "bool1" || filterColumn == "bool2") {
    if (filterValue == "true") {
      filterValue = 1;
    } else {
      filterValue = 0;
    }
  }

  console.log(records);
  let filtered = [];
  records?.map((record) => {
    if (record[filterColumn] == filterValue) {
      console.log(record[filterColumn] == filterValue);
      filtered.push(record);
    }
  });

  return filtered;
}

let generateTable = (tableName) => {
  const object = readFile(tableName);

  let filterOptions = document.getElementById("filter-select");

  let columnsArray = object.columns;
  filterOptions.innerHTML = '<option value="null"></option>';
  columnsArray.forEach((element) => {
    filterOptions.innerHTML += `<option value="${element}">${element}</option>`;
  });

  let records = object.elements;
  document.getElementById("filter-submit").addEventListener("click", () => {
    filteredRecords = filter(records);
    generateRecords(filteredRecords);
  });
  generateRecords(records);
  deleteButtonHandle();
};

let generateRecords = (records) => {
  var tableSection = document.getElementById("table-section");
  tableSection.innerHTML = "";

  records.sort(dynamicSort("id"));
  records.map((element) => {
    const rowKeys = Object.keys(element);
    const rowRecords = Object.values(element);

    tableSection.innerHTML +=
      `<div class="cell-row">` +
      (rowKeys[0]
        ? `
      <div class="cell cell-${rowKeys[0]}">${rowRecords[0]}</div>`
        : "") +
      (rowKeys[1]
        ? `
        <div class="cell cell-${rowKeys[1]}">${rowRecords[1]}</div>`
        : "") +
      (rowKeys[2]
        ? `
        <div class="cell cell-${rowKeys[2]}">${rowRecords[2]}</div>`
        : "") +
      (rowKeys[3]
        ? `
        <div class="cell cell-${rowKeys[3]}">${rowRecords[3]}</div>`
        : "") +
      (rowKeys[4]
        ? `
        <div class="cell cell-${rowKeys[4]}">${rowRecords[4]}</div>`
        : "") +
      (rowKeys[5]
        ? `
          <div class="cell cell-${rowKeys[5]}">${rowRecords[5]}</div>`
        : "") +
      (rowKeys[6]
        ? `
            <div class="cell cell-${rowKeys[6]}">${rowRecords[6]}</div>`
        : "") +
      (rowKeys[7]
        ? `
              <div class="cell cell-${rowKeys[7]}">${rowRecords[7]}</div>`
        : "") +
      `<button class="cell delete-record" value="${rowRecords[0]}">X</button>
      </div>`;
  });
};

let writeToTable = (
  tableName,
  name,
  about,
  number,
  number2,
  bool1,
  bool2,
  date
) => {
  const object = readFile(tableName).elements;

  let id = 0;
  for (let j = 1; j <= object.length; j++) {
    var item = object.find((item) => item.id === j);
    if (item == undefined) id = j;
  }
  console.log("cokolwiek");
  // if (number < 0 || number2 < 0) {
  //   return;
  // }

  if (name != "") {
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
    writeFile(tableName, readyData);
  }
};

let addContent = () => {
  document.getElementById("form-submit").addEventListener("click", () => {
    let tableName = document.getElementById("tables").value;
    let name = document.getElementById("name-input").value;
    let about = document.getElementById("about-input").value;
    let number = document.getElementById("number-input").value;
    let number2 = document.getElementById("number2-input").value;
    let bool1 = document.getElementById("bool1-input").checked;
    let bool2 = document.getElementById("bool2-input").checked;
    let date = document.getElementById("date-input").value;

    writeToTable(tableName, name, about, number, number2, bool1, bool2, date);

    document.getElementById("table-section").innerHTML = "";
    generateTable(tableName);
  });
};

let changeTableListener = () => {
  document.getElementById("tables").addEventListener("change", function () {
    document.getElementById("table-section").innerHTML = "";
    generateTable(this.value);
  });
};

let deleteButtonHandle = () => {
  let tableName = document.getElementById("tables").value;

  let buttons = document.querySelectorAll(".delete-record");

  buttons.forEach((button) =>
    button.addEventListener("click", (event) => {
      deleteFromFile(tableName, event.target.value);
      document.getElementById("table-section").innerHTML = "";
      generateTable(tableName);
    })
  );
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

generateTable("frameworks");
changeTableListener();
addContent();
deleteButtonHandle();
