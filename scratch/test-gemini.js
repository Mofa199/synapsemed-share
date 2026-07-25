const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = "AIzaSyCdoEp3RinSWgFfayA80jvnVBR_q5i8IDY";
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    console.log("Testing fourth Gemini key with gemini-flash-latest...");
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("Explain how AI works in a few words");
    console.log("Response:", result.response.text());
    console.log("SUCCESS: Gemini is now working!");
  } catch (error) {
    console.error("FAILURE: Gemini error:", error.message);
  }
}

testGemini();
