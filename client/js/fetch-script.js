const url = "http://127.0.0.1:3002/destinations";

export async function createDestination(payload) {
  console.log("payload");
  console.log(payload);

  // const myHeaders = new Headers();
  // myHeaders.append("Content-Type", 'application/json"');

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    //headers: myHeaders,
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, options);
    return response;
  } catch (err) {
    console.error(err);
  }
}
