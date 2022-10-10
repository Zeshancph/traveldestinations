export function validateForm(form) {
  const errors = {};

  if (form.elements.title.value.trim() == "") {
    errors.title = {};
    errors.title.message = "Title cannot be empty";
  } else {
    delete errors.title;
  }

  const from = new Date(form.elements.date_from.value);
  const to = new Date(form.elements.date_to.value);
  if (from.getTime() > to.getTime()) {
    errors.date_to = {};
    errors.date_to.message = "Start date cannot be later than end date";
  } else {
    delete errors.date_to;
  }

  if (form.elements.country.value.trim() == "") {
    errors.country = {};
    errors.country.message = "Country cannot be empty";
  } else {
    delete errors.country;
  }

  if (form.elements.location.value.trim() == "") {
    errors.location = {};
    errors.location.message = "Location cannot be empty";
  } else {
    delete errors.location;
  }

  if (form.elements.description.value.trim() == "") {
    errors.description = {};
    errors.description.message = "Description cannot be empty";
  } else {
    delete errors.description;
  }

  // if (
  //   form.querySelector(".input_picture").files &&
  //   form.querySelector(".input_picture").files[0]
  // ) {
  //   const width = form.querySelector(".picture_preview").clientWidth;
  //   const height = form.querySelector(".picture_preview").clientHeight;

  //   if (width / height != 4 / 3) {
  //     form.querySelector(".label_picture").classList.add("error");
  //     errors.picture = true;
  //   } else {
  //     form.querySelector(".label_picture").classList.remove("error");
  //     errors.picture = false;
  //   }
  // }

  scrollToError(form);

  return errors;
}

function scrollToError(form) {
  const topError = form.querySelector("label.error");
  if (topError) {
    topError.scrollIntoView({
      behavior: "smooth",
    });
  }
}

export function collectFormData(form) {
  console.log("collect form data");

  const payload = new FormData();
  payload.append("title", form.elements.title.value.trim());
  payload.append(
    "date_from",
    form.elements.date_from.value.length > 0
      ? new Date(form.elements.date_from.value)
      : ""
  );
  payload.append(
    "date_to",
    form.elements.date_to.value.length > 0
      ? new Date(form.elements.date_to.value)
      : ""
  );
  payload.append(
    "date_from",
    form.elements.date_from.value.length > 0
      ? new Date(form.elements.date_from.value)
      : ""
  );
  payload.append(
    "date_to",
    form.elements.date_to.value.length > 0
      ? new Date(form.elements.date_to.value)
      : ""
  );
  payload.append("country", form.elements.country.value.trim());
  payload.append("location", form.elements.location.value.trim());
  payload.append("description", form.elements.description.value.trim());
  payload.append("picture", form.elements.picture.files[0]);
  console.log(payload);
  return payload;
  // return {
  //   title: form.elements.title.value.trim(),
  //   date_from:
  //     form.elements.date_from.value.length > 0
  //       ? new Date(form.elements.date_from.value)
  //       : "",
  //   date_to: new Date(form.elements.date_to.value),
  //   country: form.elements.country.value.trim(),
  //   location: form.elements.location.value.trim(),
  //   description: form.elements.description.value.trim(),
  //   picture: form.elements.picture.files[0],
  // };
}

export function clearForm(form) {
  form.elements.title.value = "";
  form.elements.date_from.value = "";
  form.elements.date_from.classList.remove("input_date--has-value");
  form.elements.date_to.value = "";
  form.elements.date_to.classList.remove("input_date--has-value");
  form.elements.country.value = "";
  form.elements.location.value = "";
  form.elements.description.value = "";
  form.elements.picture.value = "";
  form.querySelector("#picture_preview").src = "img/placeholder-300x225.jpg";
}

export function setFormValues(form, destination) {
  form.elements.title.value = destination.title;
  form.elements.date_from.value = destination.date_from.split("T")[0];
  form.elements.date_from.classList.add("input_date--has-value");
  form.elements.date_to.value = destination.date_to.split("T")[0];
  form.elements.date_to.classList.add("input_date--has-value");
  form.elements.country.value = destination.country;
  form.elements.location.value = destination.location;
  form.elements.description.value = destination.description;
}

export function handleErrors(errors, form) {
  const formFields = form.querySelectorAll(".form_field");

  formFields.forEach((field) => {
    if (errors[`${field.getAttribute("name")}`]) {
      field.closest("label").querySelector(".help").textContent =
        errors[`${field.getAttribute("name")}`].message;
      field.closest("label").classList.add("error");
    } else {
      field.closest("label").classList.remove("error");
    }
  });
}
