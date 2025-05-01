import { showConfirmDialog, toggleLoader, showAlert } from "../alerts";
import { apiRequest } from "../apiRequest";
const allDeleteBtns = document.querySelectorAll(".delete-doc");
const selectCategory = document.querySelector("#select-category");
const tableBody = document.querySelector("tbody");

allDeleteBtns.forEach((btn) =>
  btn.addEventListener("click", async function () {
    const endpoint = this.dataset.endpoint;
    if (await showConfirmDialog("You are about to delete this product")) {
      toggleLoader("show");
      await apiRequest("DELETE", endpoint);
      showAlert("Deleted successfully", "success");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      location.reload();
    } else {
      return;
    }
  })
);

selectCategory.addEventListener("input", async function () {
  const id = this.value;
  toggleLoader("show");
  const res = await apiRequest("GET", `api/v1/category/${id}`);
  toggleLoader("hide");
  const products = res.data.data;
  console.log(products);
  let allRows = ``;
  products.forEach((product) => {
    const row = `<tr>
                <td>${product._id}</td>
                <td>${product.name}</td>
                <td>${product.stock}</td>
                <td>${product.ratingsAvg}</td>
                <td>${new Date(product.createdAt).toLocaleString("en-GB")}</td>
                <td class="text-center">
                  <a
                    href="/dashboard/inventory/products/edit/${product._id}"
                    class="text-warning me-3"
                    title="Edit"
                  >
                    <!-- Pencil icon -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M12.146.854a.5.5 0 0 1 .708 0L15 2.999a.5.5 0 0 1 0 .707l-9.096 9.096a.5.5 0 0 1-.168.11l-4 1.5a.5.5 0 0 1-.65-.65l1.5-4a.5.5 0 0 1 .11-.168L12.146.854ZM11.207 2L13 3.793 12.207 4.586 10.414 2.793 11.207 2ZM9.707 3.5 12.5 6.293 5.207 13.586l-2.293.857.857-2.293L9.707 3.5Z"
                      />
                    </svg>
                  </a>
                  <button
                    class="btn delete-doc text-danger"
                    data-endpoint="api/v1/product/${product._id}"
                    title="Delete"
                  >
                    <!-- Trash icon -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M5.5 5.5a.5.5 0 0 1 .5-.5H6v6h-.5a.5.5 0 0 1-.5-.5V5.5Zm2 0a.5.5 0 0 1 .5-.5H8v6h-.5a.5.5 0 0 1-.5-.5V5.5Zm2 0a.5.5 0 0 1 .5-.5H10v6h-.5a.5.5 0 0 1-.5-.5V5.5ZM3.5 1a1 1 0 0 1 1-1H6h4a1 1 0 0 1 1 1H14a1 1 0 0 1 0 2h-1v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3H2a1 1 0 0 1 0-2h1.5ZM5 3v10h6V3H5Z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>`;
    allRows += row;
  });
  tableBody.innerHTML = allRows;
});
