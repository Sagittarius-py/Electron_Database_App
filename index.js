const { readFile, writeFile, deleteFromFile } = require("./logic/fileHandle");

let generateTable = (tableName) => {
  const object = readFile(tableName).elements;
  var tableSection = document.getElementById("table-section");
  object.sort(dynamicSort("id"));
  object.map((element) => {
    tableSection.innerHTML += `<div class="cell-row">
      <div class="cell cell-id">${element.id}</div>
      <div class="cell cell-name">${element.name}</div>
      <button class="cell delete-record" value="${element.id}">X</button>
      </div>`;
  });
  deleteButtonHandle();
};

let writeToTable = (tableName, data) => {
  const object = readFile(tableName).elements;
  let id = 0;

  for (let j = 1; j <= object.length; j++) {
    var item = object.find((item) => item.id === j);
    if (item == undefined) id = j;
  }

  let readyData = {
    id: id,
    name: data,
  };
  writeFile(tableName, readyData);
};

let addContent = () => {
  document.getElementById("form-submit").addEventListener("click", () => {
    let tableName = document.getElementById("tables").value;
    let data = document.getElementById("name-input").value;
    writeToTable(tableName, data);

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
