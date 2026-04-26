export default async function handler(req, res) {
  const { weight, height, goal } = JSON.parse(req.body);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openchat/openchat-7b",
      messages: [
        {
          role: "user",
          content: `Составь план питания на 1 день.

Вес: ${weight}
Рост: ${height}
Цель: ${goal}

Выведи:
- Калории
- Белки / Жиры / Углеводы
- Меню (завтрак, обед, ужин)

Без сложных блюд.`,
        },
      ],
    }),
  });

  const textResponse = await response.text();

  let data;
  try {
    data = JSON.parse(textResponse);
  } catch (e) {
    return res.status(500).json({
      error: "Ответ не JSON",
      raw: textResponse,
    });
  }

  if (!data.choices) {
    return res.status(500).json({
      error: data,
    });
  }

  res.status(200).json({
    text: data.choices[0].message.content,
  });
}
