import { Request, Response } from 'express';

const symptomLabels: Record<string, string> = {
  cough_dry: 'сухий кашель',
  cough_wet: 'вологий кашель',
  runny_nose: 'нежить',
  sore_throat: 'біль у горлі',
  shortness_of_breath: 'задишка',
  nausea: 'нудота',
  diarrhea: 'діарея',
  sweating: 'підвищена пітливість',
  chills: 'озноб',
  body_aches: 'ломота в тілі',
  // Серцево-судинні
  chest_pain: 'біль у грудях',
  heart_palpitations: 'прискорене серцебиття',
  blood_pressure_high: 'підвищений артеріальний тиск',
  // Ниркові
  kidney_pain: 'біль у ділянці нирок (попереку)',
  painful_urination: 'болісне або часте сечовипускання',
  // Неврологічні
  headache: 'сильний головний біль',
  dizziness: 'запаморочення та втрата рівноваги',
  insomnia: 'порушення сну (безсоння)',
};

const ageLabels: Record<string, string> = {
  child: 'дитина',
  teenager: 'підліток',
  adult: 'дорослий',
  elderly: 'людина похилого віку',
};

const tempLabels: Record<string, string> = {
  no_fever: 'немає гарячки',
  subfebrile: 'субфебрильна (37-38°C)',
  high: 'висока гарячка (38-39°C)',
  critical: 'критична температура (понад 39°C)',
};

const durationLabels: Record<string, string> = {
  less_24h: 'менше 24 годин',
  '1_3_days': '1-3 дні',
  week_plus: 'тиждень або більше',
};

export const analyzeSymptomsMvp = async (req: Request, res: Response): Promise<void> => {
  const { age, temperature, duration, symptoms = [], description = '' } = req.body;

  try {
    const readableAge = ageLabels[age] || age || 'не вказано';
    const readableTemp = tempLabels[temperature] || temperature || 'не вказано';
    const readableDuration = durationLabels[duration] || duration || 'не вказано';
    const mappedSymptoms = symptoms.map((code: string) => symptomLabels[code] || code).join(', ') || 'немає специфічних симптомів';

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      res.status(500).json({ message: 'Groq API Key is not configured on the server' });
      return;
    }

    const promptText = `Ти — медичний ШІ-асистент. Проаналізуй симптоми:
Вік: ${readableAge}, Температура: ${readableTemp}, Тривалість: ${readableDuration}, Маркери: ${mappedSymptoms}, Опис: ${description}.

Поверни JSON із наступними полями:
'disclaimer' (попередження українською мовою про те, що це лише інформаційна оцінка і не замінює консультацію лікаря),
'analysis' (короткий висновок українською мовою про можливу причину та поради),
'textRecommendations' (масив строк українською мовою із загальними назвами ліків, які можуть допомогти, наприклад: ['Парацетамол або Ібупрофен (при температурі)', 'Спрей для носа з морською водою', 'Льодяники від болю в горлі']),
'isCritical' (boolean: true, якщо стан критичний, температура понад 39°C або є задишка, інакше false).

Не прив'язуйся до жодних ID, пиши просто зрозумілі людям назви ліків. Поверни суворо JSON без форматування markdown чи обгорток block.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: promptText
          }
        ],
        response_format: {
          type: 'json_object'
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error:', errText);
      res.status(502).json({ message: 'Помилка звернення до сервісу ШІ Groq' });
      return;
    }

    const result = (await response.json()) as any;
    const rawText = result.choices?.[0]?.message?.content;
    if (!rawText) {
      res.status(500).json({ message: 'ШІ Groq повернув порожню відповідь' });
      return;
    }

    const parsedData = JSON.parse(rawText.trim());
    res.status(200).json(parsedData);
  } catch (error: any) {
    console.error('Symptom analyze error:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера при аналізі симптомів' });
  }
};
