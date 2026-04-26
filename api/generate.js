export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { weight, height, goal } = JSON.parse(req.body);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: `
Составь план питания на 1 день.

Вес: ${weight}
Рост: ${height}
Цель: ${goal}

Выведи:
- Калории
- Белки / Жиры / Углеводы
- Меню (завтрак, обед, ужин)

Без сложных блюд.
`
          }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENROUTER:", data);

    if (!data.choices) {
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({
      result: data.choices[0].message.content
    });

  } catch (e) {
    console.log("ERROR:", e);
    return res.status(500).json({ error: e.toString() });
  }
}
