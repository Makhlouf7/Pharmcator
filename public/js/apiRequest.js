import axios from "axios";
import { showAlert } from "./alerts";
const serverUrl = "http://127.0.0.1:8000";

export const apiRequest = async function (method, url, data = null) {
  try {
    const res = await axios({
      method,
      url: `${serverUrl}/${url}`,
      data,
    });
    return res;
  } catch (err) {
    console.log("API Request error 💥💥", err);
    showAlert("Oops something went wrong", "error");
    return "Error";
  }
};
