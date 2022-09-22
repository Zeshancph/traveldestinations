const url = "http://127.0.0.1:3002/destinations";

export async function createDestination(payload) {
  console.log("payload");
  console.log(payload);

  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");

  const options = {
    mode: "cors",
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, options);
    return response;
  } catch (err) {
    console.error(err);
  }
}
