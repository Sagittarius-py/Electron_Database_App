const { readFile, writeFile, deleteFromFile } = require("./logic/fileHandle");

// Event listener to random data creation

document
  .getElementById("random-data-submit")
  .addEventListener("click", randomData);

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

function search(recordsData) {
  let searchColumn = document.getElementById("search-select").value;
  let searchValue = document.getElementById("search-value").value;
  let table = [];

  function binarySearch(data, searchValue) {
    data.sort(dynamicSort(searchColumn));
    var mid = Math.floor(data.length / 2);

    if (data[mid][searchColumn] == searchValue) {
      let x = data[mid];
      return x;
    } else if (
      data[mid][searchColumn] < searchValue &&
      data.length > searchValue
    ) {
      return binarySearch(data.splice(mid, data.length), searchValue);
    } else if (data[mid][searchColumn] > searchValue && data.length > 1) {
      return binarySearch(data.splice(0, mid), searchValue);
    } else {
      return -1;
    }
  }

  // //* binary search to lesser equal
  let result = binarySearch(recordsData, searchValue);

  // //* binary search to lesser lesser
  // while (searchValue >= 0) {
  //   console.log(recordsData, searchValue);
  //   let record = binarySearch(recordsData, searchValue);
  //   if (record != -1) {
  //     table.push(record);
  //   }
  //   searchValue--;
  // }
  // if (table.length > 0) {
  //   result = table;
  // }
  // console.log("bez", result);

  return result;
}

//! Function generating random data

function randomData() {
  let tableName = "frameworks";
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
  writeToTable(tableName, name, about, number, number2, bool1, bool2, date);

  // Refreshing table with new data
  generateTable(tableName);
}

//! function to generate multiple random records
function randomDataMultiple() {
  let amount = document.getElementById("random-amount").value;
  let tableName = "frameworks";

  for (let y = 0; y < amount; y++) {
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
    writeToTable(tableName, name, about, number, number2, bool1, bool2, date);
  }
  generateTable(tableName);
}

//! Function to filter data by column
function filter(records) {
  // reading chosen column
  let filterColumn = document.getElementById("filter-select").value;
  let filterColumn2 = document.getElementById("filter-select2").value;
  // reading value to sort with
  let filterValue = document.getElementById("filter-value").value;
  let filterValue2 = document.getElementById("filter-value2").value;

  if (filterColumn == "bool1" || filterColumn == "bool2") {
    if (filterValue == "true") {
      filterValue = 1;
    } else {
      filterValue = 0;
    }
  }

  if (filterColumn2 == "bool1" || filterColumn2 == "bool2") {
    if (filterValue2 == "true") {
      filterValue2 = 1;
    } else {
      filterValue2 = 0;
    }
  }

  // Creating new list with filtered records
  let filtered = [];
  records?.map((record) => {
    console.log(record[filterColumn2] == filterValue2);

    record[filterColumn2] == filterValue2;
    if (filterColumn2 == "null") {
      if (record[filterColumn] == filterValue) {
        filtered.push(record);
      }
    } else {
      if (
        record[filterColumn] == filterValue &&
        record[filterColumn2] == filterValue2
      ) {
        console.log("cok");
        filtered.push(record);
      }
    }
  });

  // Returning filtered list
  return filtered;
}

//! Rendering new table by reading file data
// Everything is made dynamically by reading
let generateTable = (tableName) => {
  // getting data from file
  const object = readFile(tableName);

  // Getting list select form file
  let filterOptions = document.getElementById("filter-select");
  let filterOptions2 = document.getElementById("filter-select2");
  let searchSelect = document.getElementById("search-select");

  // getting column list object from file
  let columnsArray = object.columns;

  // adding possible filter columns to document
  filterOptions.innerHTML = '<option value="null"></option>';
  columnsArray.forEach((element) => {
    filterOptions.innerHTML += `<option value="${element}">${element}</option>`;
  });
  filterOptions2.innerHTML = '<option value="null"></option>';
  columnsArray.forEach((element) => {
    filterOptions2.innerHTML += `<option value="${element}">${element}</option>`;
  });

  searchSelect.innerHTML = '<option value="null"></option>';
  columnsArray.forEach((element) => {
    searchSelect.innerHTML += `<option value="${element}">${element}</option>`;
  });

  // reading records from object got from file
  let records = object.elements;

  // adding event listener to filter button

  document.getElementById("search-submit").addEventListener("click", () => {
    searchedRecords = search(records);
    generateRecords(searchedRecords);
  });

  // adding event listener to button for filtration clearing

  // running function to generate fresh table
  generateRecords(records);

  // adding listeners to add delete buttons
  deleteButtonHandle();
};

let generateRecords = (records) => {
  // getting table section div from document
  var tableSection = document.getElementById("table-section");
  // clearing table section from any inner html for empty space to add new records
  tableSection.innerHTML = "";

  console.log(records);

  // if records table are longer then 1
  if (records.length > 1) {
    // sorting file records by ID
    records.sort(dynamicSort("id"));

    // running function for every element in records by by "MAP"
    records.map((element) => {
      const rowKeys = Object.keys(element);
      const rowRecords = Object.values(element);

      // checking if every column exists and adding record to table by automatically generate every field
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
  } else {
    const rowKeys = Object.keys(records);
    const rowRecords = Object.values(records);

    // checking if every column exists and adding record to table by automatically generate every field
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
  }
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
  // reading previous file data
  const object = readFile(tableName).elements;

  // creating id for new record
  let id = 0;
  for (let j = 1; j <= object.length; j++) {
    var item = object.find((item) => item.id === j);
    if (item == undefined) id = j;
  }

  // checking if name is'nt null, if not creating object with given data
  if (name != "" && number >= 0) {
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

    // Saving new record to file
    writeFile(tableName, readyData);
  }
};

//! Creating new record by manually writing data
let addContent = () => {
  // getting all written data after clicking "SUBMIT" button
  document.getElementById("form-submit").addEventListener("click", () => {
    let tableName = document.getElementById("tables").value;
    let name = document.getElementById("name-input").value;
    let about = document.getElementById("about-input").value;
    let number = document.getElementById("number-input").value;
    let number2 = document.getElementById("number2-input").value;
    let bool1 = document.getElementById("bool1-input").checked;
    let bool2 = document.getElementById("bool2-input").checked;
    let date = document.getElementById("date-input").value;

    // Running write to table button
    writeToTable(tableName, name, about, number, number2, bool1, bool2, date);

    // Clearing table section
    document.getElementById("table-section").innerHTML = "";

    // generating refreshed table with new data
    generateTable(tableName);
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
addContent();
deleteButtonHandle();
