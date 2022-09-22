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
    if ((await serverResponse.status) === "success") {
      console.log(serverResponse);
      clearForm(formUpdate);
      //redirectToIndex();
    } else {
      console.error(serverResponse);
    }
  } else {
    console.log("form not validated, do nothing");
  }
});

function redirectToIndex() {
  window.location.replace("index.html");
}
