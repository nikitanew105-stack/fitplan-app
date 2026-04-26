export default async function handler(req, res) {
  const { weight, height, goal } = JSON.parse(req.body);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENAI_KEY,
      "Content-Type": "application/json",
    },
body: JSON.stringify({
  model: "gpt-4.1-mini",
  input: `Составь план питания на 1 день.

Вес: ${weight}
Рост: ${height}
Цель: ${goal}

Выведи:
- Калории
- Белки / Жиры / Углеводы
- Меню (завтрак, обед, ужин)

Без сложных блюд.`
}),
    }),
  });

  const data = await response.json();

// добавим проверку
let text = "Ошибка генерации";

try {
  text = data.output[0].content[0].text;
} catch (e) {
  text = JSON.stringify(data);
}

res.status(200).json({ text });
