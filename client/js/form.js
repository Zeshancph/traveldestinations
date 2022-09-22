export function validateForm(form) {
  const errors = {
    title: false,
    date: false,
    country: false,
    location: false,
    description: false,
    picture: false,
  };

  if (form.elements.title.value.trim() == "") {
    form.querySelector(".label_title").classList.add("error");
    errors.title = true;
  } else {
    form.querySelector(".label_title").classList.remove("error");
    errors.title = false;
  }

  const from = new Date(form.elements.date_from.value);
  const to = new Date(form.elements.date_to.value);
  if (from.getTime() > to.getTime()) {
    form.querySelector(".label_date").classList.add("error");
    errors.date = true;
  } else {
    form.querySelector(".label_date").classList.remove("error");
    errors.date = false;
  }

  if (form.elements.country.value.trim() == "") {
    form.querySelector(".label_country").classList.add("error");
    errors.country = true;
  } else {
    form.querySelector(".label_country").classList.remove("error");
    errors.country = false;
  }

  if (form.elements.location.value.trim() == "") {
    form.querySelector(".label_location").classList.add("error");
    errors.location = true;
  } else {
    form.querySelector(".label_location").classList.remove("error");
    errors.location = false;
  }

  if (form.elements.description.value.trim() == "") {
    form.querySelector(".label_description").classList.add("error");
    errors.description = true;
  } else {
    form.querySelector(".label_description").classList.remove("error");
    errors.description = false;
  }

  if (
    form.querySelector(".input_picture").files &&
    form.querySelector(".input_picture").files[0]
  ) {
    const width = form.querySelector(".picture_preview").clientWidth;
    const height = form.querySelector(".picture_preview").clientHeight;

    if (
      width / height != 4 / 3 ||
      (form.querySelector(".input_picture").files[0].type == "image/jpeg" &&
        form.querySelector(".input_picture").files[0].type == "image/png")
    ) {
      form.querySelector(".label_picture").classList.add("error");
      errors.picture = true;
    } else {
      form.querySelector(".label_picture").classList.remove("error");
      errors.picture = false;
    }
  }

  scrollToError(form);

  return (
    !errors.title &&
    !errors.country &&
    !errors.location &&
    !errors.description &&
    !errors.picture &&
    !errors.date
  );
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
  return {
    title: form.elements.title.value.trim(),
    date_from: new Date(form.elements.date_from.value),
    date_to: new Date(form.elements.date_to.value),
    country: form.elements.country.value.trim(),
    location: form.elements.location.value.trim(),
    description: form.elements.description.value.trim(),
    // picture: form.elements.picture.files[0],
  };
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
