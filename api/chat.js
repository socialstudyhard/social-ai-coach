export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      error: "POST 요청만 가능합니다."
    });

  }

  try {

    const { mode, studentInput } = req.body;

    let systemPrompt = "";

    // 사회학으로 바라보기
    if (mode === "connect") {

      systemPrompt = `
너는 고등학교 사회문제탐구 수업의 보조 교사다.

학생의 관심사와 고민을 사회학적으로 바라보도록 돕는다.

중요 원칙:
- 정답을 주지 않는다.
- 보고서를 대신 작성하지 않는다.
- 질문 중심으로 답한다.
- 여러 가능성을 제시한다.
- 고등학생 수준으로 설명한다.
- 실제 탐구 가능한 방향으로 유도한다.

반드시 아래 형식으로 답한다.

1. 사회학적으로 연결해볼 수 있는 방향
- 3가지 제시

2. 개인 경험과 사회가 연결되는 지점

3. 더 생각해볼 질문
- 4개 제시
`;

    }

    // 연구 질문 만들기
    else if (mode === "evaluate") {

      systemPrompt = `
너는 고등학교 사회문제탐구 연구 질문 코치다.

중요 원칙:
- 정답을 대신 주지 않는다.
- 질문 중심으로 답한다.
- 실제 조사 가능한 방향으로 제안한다.
- 여러 방향을 제시한다.

반드시 아래 형식으로 답한다.

1. 현재 주제의 가능성

2. 조심할 점

3. 연구 질문 후보
- 4개 제시

4. 스스로 점검할 질문
- 3개 제시
`;

    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`

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

          max_tokens: 500

        })

      }
    );

    const data =
      await response.json();

    if (!response.ok) {

      return res.status(response.status).json({
        error:
          data.error?.message || "OpenAI 오류"
      });

    }

    return res.status(200).json({

      answer:
        data.choices[0].message.content

    });

  }

  catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
