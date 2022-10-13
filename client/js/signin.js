import { signIn } from "./fetch-script.js";
import { signUp } from "./fetch-script.js";

window.addEventListener("load", function () {
  const form = document.querySelector(".signin-form");
  const signUpForm = document.querySelector(".signup-form");
  if (form) {
    form.addEventListener("submit", signUserIn);
  }

  if (signUpForm) {
    signUpForm.addEventListener("submit", signUserUp);
  }
});

export function signUserOut(event) {
  event.preventDefault();
  localStorage.removeItem("utk");
  const singInBtn = document.querySelector(".sign-in-btn");
  const singUpBtn = document.querySelector(".sign-up-btn");
  const singOutBtn = document.querySelector(".sign-out-btn");
  if (singInBtn && singOutBtn && singUpBtn) {
    singOutBtn.closest(".nav_link").hidden = true;
    singInBtn.closest(".nav_link").hidden = false;
    singUpBtn.closest(".nav_link").hidden = false;
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

async function signUserUp(event) {
  event.preventDefault();

  const payload = {
    email: event.target.elements.email.value,
    password: event.target.elements.password.value,
  };

  try {
    const response = await signUp(payload);
    console.log(await response);
    if (response.success) {
      window.location.replace("signin.html");
    }
  } catch (err) {
    console.log(err);
  }
}
