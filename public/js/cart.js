import { toggleLoader } from "./alerts";
import { apiRequest } from "./apiRequest";

const quantityField = document.getElementById("quantity");
const deleteBtn = document.getElementById("delete");
const checkoutForm = document.getElementById("form-checkout");
quantityField?.addEventListener("input", async function () {
  const quantity = this.value;
  const productId = this.dataset.id;
  // console.log(quantity, productId);
  toggleLoader("show");
  await apiRequest("PATCH", `api/v1/cart/${productId}`, { quantity });
  location.reload();
});

deleteBtn?.addEventListener("click", async function () {
  const productId = this.dataset.id;
  toggleLoader("show");
  await apiRequest("DELETE", `api/v1/cart/${productId}`);
  location.reload();
});

checkoutForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const isLoggedIn = document.querySelector("html").dataset.user;
  if (isLoggedIn == "false") {
    const redirect = location.pathname;
    window.location = `/sign?redirect=${redirect}`;
  }
  // Collect form data
  const data = new FormData(checkoutForm);
  // Collect cart items
  const res = await apiRequest("GET", "api/v1/cart");
  const resData = res.data.data;
  const cart = [];
  resData.forEach((item) => {
    const obj = {
      quantity: item.quantity,
      price: item.product.price,
      productName: item.product.name,
    };
    cart.push(obj);
  });
  data.append("cartItems", JSON.stringify(cart));
  console.log(...data);
  toggleLoader("show");
  await apiRequest("POST", "api/v1/orders", data);
  location.reload();
});
