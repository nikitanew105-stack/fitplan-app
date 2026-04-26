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
        model: "openchat/openchat-7b",
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

    // 🔥 ВРЕМЕННО — просто возвращаем весь ответ
    res.status(200).json({
      debug: data
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
