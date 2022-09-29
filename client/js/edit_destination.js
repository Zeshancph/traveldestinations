import { validateForm } from "./form.js";
import { readURL } from "./file.js";
import { getDestination } from "./fetch-script.js";
import { setFormValues } from "./form.js";
import { updateDestination } from "./fetch-script.js";
import { collectFormData } from "./form.js";
import { clearForm } from "./form.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

const formUpdate = document.querySelector("#update_destination");

window.addEventListener("load", async function () {
  const destination = await getDestination(id);
  setFormValues(formUpdate, destination);
});

document.querySelector("#picture").addEventListener("change", readURL);

formUpdate.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formValidated = validateForm(formUpdate);
  if (formValidated) {
    console.log("form validated, post changes");

    const destination = collectFormData(formUpdate);

    const serverResponse = await updateDestination(id, destination);
    if (serverResponse.errors) {
      console.log("handle errors");
      console.log(serverResponse.errors);
      // todo: add error handling for failed server-side validation
    } else {
      clearForm(formUpdate);
      redirectToIndex();
      console.log(serverResponse);
    }
  } else {
    console.log("form not validated, do nothing");
  }
});

function redirectToIndex() {
  window.location.replace("index.html");
}
