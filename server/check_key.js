import dotenv from 'dotenv';
dotenv.config();

async function checkKey() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Current Key in memory:", key.substring(0, 10) + "...");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    if (data.error) {
      console.error("API Error:", data.error.message);
    } else {
      console.log("Success! Found", data.models.length, "models.");
      console.log("First model:", data.models[0].name);
    }
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}
checkKey();
