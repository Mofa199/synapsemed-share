async function listModels() {
  const apiKey = "AIzaSyBCq3A_ds73PB4WpDuG-o_3DZ0r4OFl81A";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("Models:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
