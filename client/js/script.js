import { getAllDestinations } from "./fetch-script.js";
import { deleteDestination } from "./fetch-script.js";
import { createDestinationNode } from "./components/destination.js";
import { signUserOut } from "./signin.js";

const userSignedIn = localStorage.getItem("utk");

window.addEventListener("load", async function () {
  // sign in - out
  const singInBtn = document.querySelector(".sign-in-btn");
  const signUpBtn = document.querySelector(".sign-up-btn");
  const singOutBtn = document.querySelector(".sign-out-btn");

  if (userSignedIn) {
    singInBtn.closest(".nav_link").hidden = true;
    signUpBtn.closest(".nav_link").hidden = true;
    singOutBtn.closest(".nav_link").hidden = false;
  } else {
    singInBtn.closest(".nav_link").hidden = false;
    signUpBtn.closest(".nav_link").hidden = false;
    singOutBtn.closest(".nav_link").hidden = true;
  }
  singOutBtn.addEventListener("click", signUserOut);

  // show destinations
  const serverResponse = await getAllDestinations();
  console.log(serverResponse);

  if (serverResponse.errors) {
    console.log(serverResponse.errors);
  } else {
    populateDOM(serverResponse, userSignedIn);
  }
});

function populateDOM(destinations, userSignedIn) {
  console.log("populate DOM");
  const container = document.querySelector(".destinations_list");
  console.log(destinations);
  destinations.forEach((destination) => {
    const destinationNode = createDestinationNode(destination, userSignedIn);
    container.appendChild(destinationNode);
  });
}

export async function removeDestination() {
  console.log("delete destination");
  console.log(this);

  const response = await deleteDestination(this.dataset.id);
  console.log(response);

  if (response.errors) {
    console.log("handle errors");
    // todo: add errors handling from server side validation
  } else {
    this.closest("article.destination").remove();
  }
}
