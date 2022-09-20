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

document.querySelectorAll(".input_date").forEach((elem) => {
  elem.addEventListener("change", function (event) {
    if (event.target.value != "") {
      elem.classList.add("input_date--has-value");
    }
  });
});
