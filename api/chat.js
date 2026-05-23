export default async function handler(req, res) {
  try {

    const { systemPrompt, studentInput } = req.body || {};

    return res.status(200).json({
      message: "서버 연결 성공",
      hasKey: !!process.env.OPENAI_API_KEY
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }
}
