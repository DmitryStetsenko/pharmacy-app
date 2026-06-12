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

    const promptText = `You are an expert AI Medical Assistant integrated into a pharmacy website. Your task is to analyze patient symptoms and return a structured assessment. 

Analyze the following patient data:
- Age Category: ${readableAge} (e.g., child, teenager, adult, elderly)
- Body Temperature: ${readableTemp}
- Duration of symptoms: ${readableDuration}
- Selected Symptom Markers: [${mappedSymptoms}]
- Patient's Additional Description: "${description}"

You MUST respond STRICTLY in JSON format with the following keys. Do not include any markdown formatting wrappers (like \`\`\`json) outside the JSON object if using raw response, or ensure responseMimeType is active.

The JSON object structure must be EXACTLY as follows:
{
  "isCritical": true/false,
  "disclaimer": "A warning string in Ukrainian. If 'isCritical' is true, make it urgent, telling them to call an ambulance (103) immediately. If false, remind them that this is an AI pre-assessment and they must consult a doctor.",
  "analysis": "A brief, professional overview in Ukrainian explaining what these symptoms might indicate, taking into account the patient's age and duration of illness. Do not state a 100% definitive diagnosis, use terms like 'Схоже на...', 'Може свідчити про...'.",
  "textRecommendations": [
    "Array of 2-4 strings in Ukrainian listing general over-the-counter medicine types or actions that could help, WITHOUT naming specific commercial brands. Examples: 'Жарознижувальні засоби (Парацетамол або Ібупрофен) при температурі вище 38.5°C', 'Льодяники або спреї для полегшення болю в горлі', 'Рясне тепле пиття та відпочинок'."
  ]
}

CRITICAL SAFETY RULES:
1. If the temperature is 'critical' (39°C+), or if symptom markers contain 'shortness_of_breath', set "isCritical" to true, write an urgent disclaimer, and keep "textRecommendations" empty or focused only on immediate emergency actions.
2. All text values ("disclaimer", "analysis", "textRecommendations") MUST be written in fluent Ukrainian.
3. NEVER mention brand names of specific pharmacy products. Only specify general drug classes or home care tips.
4. Do NOT include any emojis in the response text fields.`;

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
