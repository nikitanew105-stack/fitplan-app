export default async function handler(req, res) {
  try {
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

    // Лог ошибки (если есть)
    if (!data.choices) {
      console.log("ERROR FROM OPENROUTER:", data);
      return res.status(500).json({ error: data });
    }

    const text = data.choices[0].message.content;

    return res.status(200).json({ result: text });

  } catch (e) {
    console.log("SERVER ERROR:", e);
    return res.status(500).json({ error: e.toString() });
  }
}
