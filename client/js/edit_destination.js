import { validateForm } from "./form.js";
import { readURL } from "./file.js";

document.querySelector("#picture").addEventListener("change", readURL);

const formUpdate = document.querySelector("#update_destination");

formUpdate.addEventListener("submit", function (event) {
  event.preventDefault();
  const formValidated = validateForm(formUpdate);
  if (formValidated) {
    console.log("form validated, post changes");
  } else {
    console.log("form not validated, do nothing");
  }
});
