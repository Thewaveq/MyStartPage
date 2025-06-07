// File: /api/pexels.js

export default async function handler(request, response) {
  // Получаем параметр 'query' из URL запроса (например, /api/pexels?query=nature)
  const { query } = request.query;

  // Проверяем, был ли передан параметр
  if (!query) {
    return response.status(400).json({ error: 'Query parameter is required' });
  }

  // Формируем URL для API Pexels
  const PEXELS_URL = `https://api.pexels.com/videos/search?query=${query}&per_page=20&orientation=landscape`;

  try {
    // Выполняем запрос к Pexels, используя API-ключ из переменных окружения Vercel
    const pexelsResponse = await fetch(PEXELS_URL, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    // Если Pexels вернул ошибку, пересылаем ее клиенту
    if (!pexelsResponse.ok) {
      const errorData = await pexelsResponse.json();
      return response.status(pexelsResponse.status).json(errorData);
    }

    // Если все успешно, получаем данные в формате JSON
    const data = await pexelsResponse.json();
    
    // Отправляем успешный ответ (данные от Pexels) обратно в браузер
    response.status(200).json(data);

  } catch (error) {
    // В случае внутренней ошибки сервера возвращаем статус 500
    response.status(500).json({ error: 'Failed to fetch data from Pexels API' });
  }
}
