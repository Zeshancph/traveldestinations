import { getAllDestinations } from "./fetch-script.js";
import { deleteDestination } from "./fetch-script.js";
import { createDestinationNode } from "./components/destination.js";

window.addEventListener("load", async function () {
  const serverResponse = await getAllDestinations();
  console.log(serverResponse);

  if (serverResponse.errors) {
    console.log("handle errors");
    // todo: add errors handling from server side validation
  } else {
    populateDOM(serverResponse);
  }
});

function populateDOM(destinations) {
  console.log("populate DOM");
  const container = document.querySelector(".destinations_list");
  destinations.forEach((destination) => {
    const destinationNode = createDestinationNode(destination);
    container.appendChild(destinationNode);
  });
}

export async function removeDestination() {
  console.log("delete destination");
  console.log(this);

  const serverResponse = await deleteDestination(this.dataset.id);
  console.log(serverResponse);

  if (serverResponse.errors) {
    console.log("handle errors");
    // todo: add errors handling from server side validation
  } else {
    this.closest("article.destination").remove();
  }
}
