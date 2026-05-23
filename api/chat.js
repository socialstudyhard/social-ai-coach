export default async function handler(req, res) {

  // CORS 허용
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS 요청 처리
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // POST 요청만 허용
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "POST 요청만 가능합니다."
    });
  }

  try {

    const { systemPrompt, studentInput } = req.body;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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

      }
    );

    const data = await response.json();

    // OpenAI 오류 처리
    if (!response.ok) {

      return res.status(response.status).json({
        error: data.error?.message || "OpenAI 오류"
      });

    }

    // 정상 응답
    return res.status(200).json({
      answer: data.choices[0].message.content
    });

  }

  catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
