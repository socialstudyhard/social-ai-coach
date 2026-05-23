export default async function handler(req, res) {

  try {

    return res.status(200).json({
      hasKey: !!process.env.OPENAI_API_KEY,
      keyStart: process.env.OPENAI_API_KEY?.slice(0, 7)
    });

  }

  catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
