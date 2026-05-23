export default async function handler(req, res) {
  const { systemPrompt, studentInput } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: studentInput
        }
      ],
      max_tokens: 300
    })
  });

  const data = await response.json();

  res.status(200).json({
    answer: data.choices[0].message.content
  });
}
