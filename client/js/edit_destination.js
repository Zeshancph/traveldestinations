import { validateForm } from "./form.js";
import { readURL } from "./file.js";
import { getDestination } from "./fetch-script.js";
import { setFormValues } from "./form.js";
import { updateDestination } from "./fetch-script.js";
import { collectFormData } from "./form.js";
import { clearForm } from "./form.js";
import { handleErrors } from "./form.js";

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
  //const formValidated = validateForm(formUpdate);
  const errors = validateForm(formUpdate);
  const keys = Object.keys(errors);
  if (!keys.length > 0) {
    console.log(
      "form validated on client-side, send post request to server-side"
    );

    const destination = collectFormData(formUpdate);

    const serverResponse = await updateDestination(id, destination);
    if (serverResponse.errors) {
      console.log("handle server-side errors");
      console.log(serverResponse.errors);
      // todo: add error handling for failed server-side validation
      handleErrors(serverResponse.errors, formUpdate);
    } else {
      //clearForm(formUpdate);
      //redirectToIndex();
      console.log(serverResponse);
    }
  } else {
    console.log("form not validated, handle client-side errors");
    handleErrors(errors, formUpdate);
  }
});

function redirectToIndex() {
  window.location.replace("index.html");
}
