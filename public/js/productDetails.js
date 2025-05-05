import { apiRequest } from "./apiRequest";
import { showAlert, toggleLoader } from "./alerts";
const starButtons = document.querySelectorAll(".star-btn");
const selectRate = document.getElementById("select-rate");
const submitRateBtn = document.getElementById("submit-rate");
const reviewContent = document.getElementById("review-text");
const addToCartBtn = document.getElementById("add-to-cart");
const html = document.querySelector("html");
let rate = null;

starButtons.forEach((btn, index) => {
  const removeStyle = () =>
    starButtons.forEach((btn) => btn.classList.remove("clicked"));

  btn.addEventListener("click", () => {
    removeStyle();
    selectRate.classList.add("hidden");
    for (let i = 0; i <= index; i++) starButtons[i].classList.add("clicked");

    rate = index + 1;
    console.log(rate);
  });
});

submitRateBtn.addEventListener("click", async function () {
  if (!rate) {
    selectRate.classList.remove("hidden");
    return;
  }
  // console.log(html.dataset.user);
  if (html.dataset.user == "false") {
    console.log("entered");
    const redirect = `${window.location.pathname}`;
    window.location = `/sign?redirect=${redirect}`;
    return;
  }
  const review = reviewContent.value;
  console.log(review);
  //   if(!review)
  toggleLoader("show");
  await apiRequest("POST", "api/v1/review", {
    product: html.dataset.product,
    rating: rate,
    review,
  });
  toggleLoader("hide");
  location.reload();
});

addToCartBtn.addEventListener("click", async function () {
  const productId = this.dataset.id;
  toggleLoader("show");
  const res = await apiRequest("POST", `api/v1/cart/${productId}`, {
    quantity: 1,
  });
  toggleLoader("hide");
  console.log(res.data);
  await showAlert(res.data.message, "success", 3000);
});
