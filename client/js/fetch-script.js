const url = "http://127.0.0.1:3002/destinations";

export async function createDestination(payload) {
  console.log(payload);
  const options = {
    method: "POST",
    body: payload,
  };

  try {
    const response = await fetch(url, options);
    console.log(response.status);
    return await response.json();
  } catch (err) {
    console.error(err);
    return await response.json();
  }
}

export async function getDestination(id) {
  const getUrl = `${url}/${id}`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(getUrl, options);
    console.log(response.status);
    return response.json();
  } catch (err) {
    console.error(err);
  }
}

export async function updateDestination(id, payload) {
  console.log("update destination");
  console.log(payload);
  const updateUrl = `${url}/${id}`;

  const options = {
    method: "PUT",
    body: payload,
  };

  try {
    const response = await fetch(updateUrl, options);
    console.log(response.status);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

export async function getAllDestinations() {
  console.log("get all destinations");
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    console.log("try");
    const response = await fetch(url, options);
    console.log(response.status);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

export async function deleteDestination(id) {
  console.log("delete destination");
  const deleteUrl = `${url}/${id}`;
  const tk = localStorage.getItem("utk");
  console.log(tk);

  if (tk) {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tk}`,
      },
    };

    try {
      const response = await fetch(deleteUrl, options);
      console.log(response.status);
      return response.json();
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log("User are not signed in");
    return {
      errors: "User are not signed in",
    };
  }
}

export async function signIn(payload) {
  console.log(payload);
  const signInUrl = "http://127.0.0.1:3002/auth/signin";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(signInUrl, options);
    console.log(response.status);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

export async function signUp(payload) {
  console.log(payload);
  const signUpUrl = "http://127.0.0.1:3002/auth/signup";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(signUpUrl, options);
    console.log(response.status);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}
