const url = "http://127.0.0.1:3002/destinations";

export async function createDestination(payload) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

export async function getDestination(id) {
  const getUrl = `${url}/${id}`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "text/plain" },
  };

  try {
    const response = await fetch(getUrl, options);
    return response.json();
  } catch (err) {
    console.error(err);
  }
}

export async function updateDestination(id, payload) {
  console.log("update destination");
  const updateUrl = `${url}/${id}`;

  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(updateUrl, options);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}
