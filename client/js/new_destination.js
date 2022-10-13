import { validateForm } from "./form.js";
import { readURL } from "./file.js";
import { createDestination } from "./fetch-script.js";
import { clearForm } from "./form.js";
import { collectFormData } from "./form.js";
import { redirectToIndex } from "./edit_destination.js";

window.addEventListener("load", function () {
  document.querySelector("#picture").addEventListener("change", readURL);
  const formCreate = document.querySelector("#create_destination");

  formCreate.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("create destination form submitted");
    const formValidated = validateForm(formCreate);
    if (formValidated) {
      console.log("form validated, post changes");
      const destination = collectFormData(formCreate);
      const serverResponse = await createDestination(destination);
      console.log(serverResponse);
      if (serverResponse.errors) {
        console.log("handle errors");
        // todo: add errors handling from server side validation
      } else {
        clearForm(formCreate);
        redirectToIndex();
      }
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
});
