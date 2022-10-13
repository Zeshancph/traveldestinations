import { removeDestination } from "../script.js";

export function createDestinationNode(destination, userSignedIn) {
  console.log("create destination Node");
  const article = document.createElement("article");
  article.dataset.id = destination._id;
  article.className = "destination";

  const html = `<div class="image">
                    <img src="${
                      destination.picture.length > 0
                        ? destination.picture
                        : "img/placeholder-300x225.jpg"
                    }" alt="${destination.title} picture" />
                </div>
                <div class="content">
                    <div class="content_top">
                    <div class="address">
                        <span class="country">${destination.country}</span>,
                        <span class="location">${destination.location}</span>
                    </div>
                    <div class="title">${destination.title}</div>
                    </div>

                    <div class="content_bottom">
                    <div class="duration">
                        <span class="date_from">${new Date(
                          destination.date_from
                        ).toLocaleDateString("en-GB")}</span> &nbsp;-&nbsp;
                        <span class="date_to">${new Date(
                          destination.date_to
                        ).toLocaleDateString("en-GB")}</span>
                    </div>
                    <div class="description">
                        <p>${destination.description}</p>
                    </div>
                    </div>
                </div>
                <div class="buttons">
                    <a href="edit_destination.html?id=${
                      destination._id
                    }" class="edit_btn">edit</a>
                    <button data-id="${destination._id}" class="delete_btn" ${
    !userSignedIn ? "hidden" : ""
  } >delete</button>
                </div> `;

  article.insertAdjacentHTML("afterbegin", html);
  article
    .querySelector(".delete_btn")
    .addEventListener("click", removeDestination);
  return article;
}
