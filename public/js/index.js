import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const page = document.querySelector("html").dataset.page;
console.log(page);
(async () => {
  switch (page) {
    case "main":
      await import("./main.js");
      break;
    case "register":
      await import("./register.js");
      break;
    case "login":
      await import("./login.js");
      break;
    case "form":
      await import("./collectFormSendRequest.js");
      break;
    case "dashboard/categories":
      await import("./dashboard/categories.js");
      break;
    case "dashboard/products":
      console.log("Entered Products");
      await import("./dashboard/products.js");
      break;
  }
})();
