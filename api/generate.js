export default async function handler(req, res) {
  try {
    // проверка метода
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // парсим body безопасно
    let body;
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const { weight, height, goal } = body;

    if (!weight || !height || !goal) {
      return res.status(400).json({ error: "Missing data" });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "No API key" });
    }

    const prompt = `
Составь план питания на 1 день.

Вес: ${weight}
Рост: ${height}
Цель: ${goal}

Выведи:
- Калории
- Белки / Жиры / Углеводы
- Меню (завтрак, обед, ужин)

Без сложных блюд.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    // лог в Vercel (очень важно)
    console.log("OPENROUTER RESPONSE:", JSON.stringify(data));

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: data });
    }

    const text = data.choices[0].message.content;

    return res.status(200).json({ result: text });

  } catch (error) {
    console.log("SERVER ERROR:", error);
    return res.status(500).json({ error: error.toString() });
  }
}
