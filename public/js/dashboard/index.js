import { apiRequest } from "../apiRequest";
import { toggleLoader } from "../alerts";
const detailsBtns = document.querySelectorAll(".details-btn");
const tableHead = document.querySelector("thead");
const tableBody = document.querySelector("tbody");

detailsBtns.forEach((btn) =>
  btn.addEventListener("click", async function () {
    const endpoint = this.dataset.endpoint;
    const btnId = this.dataset.id;
    toggleLoader("show");
    const res = await apiRequest("GET", endpoint);
    toggleLoader("hide");
    setTable(btnId, res.data.data);
  })
);

const setTable = (id, data) => {
  let thRow = "<tr>",
    tbRows = "";
  switch (id) {
    case "category":
      thRow += `<th>#</th><th>Name</th><th>Num Of Products</th><th>Created At</th>`;
      data.forEach(
        (record) =>
          (tbRows += `<tr><td>${record._id}</td><td>${record.name}</td><td>${
            record.noOfProducts
          }</td><td>${record.createdAt.toLocaleString("en-GB")}</td></tr>`)
      );
      break;
    case "products":
      thRow += `<th>#</th><th>Name</th><th>Category</th><th>Stock</th><th>Created At</th>`;
      data.forEach(
        (record) =>
          (tbRows += `<tr><td>${record._id}</td><td>${record.name}</td><td>${
            record.category.name
          }</td><td>${record.stock}</td><td>${record.createdAt.toLocaleString(
            "en-GB"
          )}</td></tr>`)
      );
      break;
    case "rating":
      thRow += `<th>#</th><th>Name</th><th>Category</th><th>Average Rate</th>`;
      data.forEach(
        (record) =>
          (tbRows += `<tr><td>${record._id}</td><td>${record.name}</td><td>${record.category.name}</td><td>${record.ratingsAvg}</td></tr>`)
      );
      break;
    case "shortage":
      thRow += `<th>#</th><th>Name</th><th>Category</th><th>Stock</th>`;
      data.forEach(
        (record) =>
          (tbRows += `<tr><td>${record._id}</td><td>${record.name}</td><td>${record.category.name}</td><td>${record.stock}</td></tr>`)
      );
      break;
    default:
      break;
  }
  thRow += "</tr>";
  tableHead.innerHTML = thRow;
  tableBody.innerHTML = tbRows;
};
