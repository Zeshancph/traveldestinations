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
