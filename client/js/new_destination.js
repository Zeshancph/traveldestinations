import { validateForm } from "./form.js";
import { readURL } from "./file.js";

document.querySelector("#picture").addEventListener("change", readURL);

const formCreate = document.querySelector("#create_destination");

formCreate.addEventListener("submit", function (event) {
  event.preventDefault();
  const formValidated = validateForm(formCreate);
  if (formValidated) {
    console.log("form validated, post changes");
  } else {
    console.log("form not validated, do nothing");
  }
});
