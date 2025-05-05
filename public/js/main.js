// Importing required modules =====
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-providers";
import "swiper/swiper-bundle.min.css";
import Swiper from "swiper";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { apiRequest } from "./apiRequest";
// Defining Elements =====
const logoutBtn = document.getElementById("logout");
// Global Variables =====
// Map
const coords = [27.2708163, 31.2632389];
const map = L.map("map", {
  center: coords,
  zoom: 14,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  touchZoom: false,
  zoomControl: false,
  boxZoom: false,
});

const icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.tileLayer.provider("CartoDB.Positron").addTo(map);

L.marker(coords, {
  icon,
})
  .addTo(map)
  .bindPopup("<p>Pharmcator</p>");

// Slider
const swiper = new Swiper(".swiper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 10,
  centeredSlides: true, // Added to center the slides
  breakpoints: {
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
  autoplay: {
    delay: 1000,
    disableOnInteraction: false,
  },
});

// Event Handlers =====
if (logoutBtn)
  logoutBtn.addEventListener("click", async function () {
    try {
      const res = await apiRequest("POST", "api/v1/users/logout");
      if (res.data.status == "success") {
        console.log("Logged out successfully");
        location.reload();
      }
    } catch (err) {
      console.log("Error from logout");
    }
  });
