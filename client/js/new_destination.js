import { validateForm } from "./form.js";
import { readURL } from "./file.js";
import { createDestination } from "./fetch-script.js";
import { clearForm } from "./form.js";
import { collectFormData } from "./form.js";

document.querySelector("#picture").addEventListener("change", readURL);

const formCreate = document.querySelector("#create_destination");

formCreate.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formValidated = validateForm(formCreate);
  if (formValidated) {
    console.log("form validated, post changes");
    const destination = collectFormData(formCreate);
    console.log(destination);
    const serverResponse = await createDestination(destination);
    if (serverResponse.status === 200) {
      console.log(serverResponse);
      // clearForm(formCreate);
      // modifyEditLink(serverResponse.id);
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

function modifyEditLink(id) {
  document.querySelector("#edit_link").href = `edit_destination.html?id=${id}`;
}
