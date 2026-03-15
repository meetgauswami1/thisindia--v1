import axios from "axios";

const groqApiKey =
  import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY;

export async function generateAIItinerary(payload) {
  if (!groqApiKey) {
    throw new Error("Groq API key is missing");
  }

  const prompt = `
Create a day-by-day travel itinerary in JSON.

Destination: ${payload.destination}
Days: ${payload.days}
Interests: ${payload.interests.join(", ")}
Budget: ${payload.budget || "not specified"}

Return ONLY valid JSON in this format:

{
  "summary": "short trip summary",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["activity 1", "activity 2"]
    }
  ]
}
`;

  const { data } = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: "You are a travel planner API that returns strict JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  const content = data?.choices?.[0]?.message?.content || "{}";

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("AI JSON parse failed:", content);
    return {
      summary: "Could not generate itinerary",
      days: [],
    };
  }
}