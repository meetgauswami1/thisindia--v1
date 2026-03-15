import axios from 'axios'

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY

export async function sendAIChat({ destination, history, message }) {
  if (!groqApiKey) {
    throw new Error('Groq API key is missing')
  }

  const { data } = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are ThisIndia AI assistant. Current destination context: ${destination || 'not selected'}. Give concise travel suggestions.`,
        },
        ...history,
        {
          role: 'user',
          content: message,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
      },
    },
  )

  return data.choices?.[0]?.message?.content || 'I could not generate a response right now.'
}
