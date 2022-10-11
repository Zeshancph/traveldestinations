import { signIn } from "./fetch-script.js";

window.addEventListener("load", function () {
  const form = document.querySelector(".signin-form");
  if (form) {
    form.addEventListener("submit", signUserIn);
  }
});

export function signUserOut(event) {
  event.preventDefault();
  localStorage.removeItem("utk");
  const singInBtn = document.querySelector(".sign-in-btn");
  const singOutBtn = document.querySelector(".sign-out-btn");
  if (singInBtn && singOutBtn) {
    singOutBtn.closest(".nav_link").hidden = true;
    singInBtn.closest(".nav_link").hidden = false;
  }

  const deleteButtons = document.querySelectorAll(".delete_btn");
  console.log(deleteButtons);

  if (deleteButtons.length > 0) {
    deleteButtons.forEach((btn) => {
      btn.hidden = true;
    });
  }
}

async function signUserIn(event) {
  event.preventDefault();

  const payload = {
    email: event.target.elements.email.value,
    password: event.target.elements.password.value,
  };

  try {
    const tkResponse = await signIn(payload);
    console.log(await tkResponse);
    if (tkResponse.success) {
      localStorage.setItem("utk", tkResponse.token);
      window.location.replace("index.html");
    }
  } catch (err) {
    console.log(err);
  }
}
