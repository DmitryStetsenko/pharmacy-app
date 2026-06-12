'use client';

import React, { useState } from 'react';
import { Form, Select, Checkbox, Input, Button, Row, Col, Alert, Spin, Typography, Card, Divider } from 'antd';
import { 
  WarningOutlined, 
  MedicineBoxOutlined, 
  HeartFilled, 
  AlertFilled, 
  RedoOutlined,
  HeartOutlined,
  ExperimentOutlined,
  FrownOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const ageLabels: Record<string, string> = {
  child: 'Дитина (до 12 років)',
  teenager: 'Підліток (12-18 років)',
  adult: 'Дорослий (18-60 років)',
  elderly: 'Людина похилого віку (60+)'
};

const tempLabels: Record<string, string> = {
  no_fever: 'Нормальна (до 37°C)',
  subfebrile: 'Субфебрильна (37-38°C)',
  high: 'Висока (38-39°C)',
  critical: 'Критична (понад 39°C)'
};

const durationLabels: Record<string, string> = {
  less_24h: 'Менше 24 годин',
  '1_3_days': '1-3 дні',
  week_plus: 'Тиждень або довше'
};

const symptomLabels: Record<string, string> = {
  sweating: 'Пітливість',
  chills: 'Озноб',
  body_aches: 'Ломота в тілі',
  cough_dry: 'Сухий кашель',
  cough_wet: 'Вологий кашель',
  runny_nose: 'Нежить',
  sore_throat: 'Біль у горлі',
  shortness_of_breath: 'Задишка',
  chest_pain: 'Біль у грудях',
  palpitations: 'Прискорене серцебиття',
  fatigue: 'Втома / слабкість',
  muscle_pain: 'Біль у м’язах',
  joint_pain: 'Біль у суглобах',
  nausea: 'Нудота',
  diarrhea: 'Діарея',
  headache: 'Сильний головний біль',
  dizziness: 'Запаморочення',
  insomnia: 'Безсоння (порушення сну)'
};

interface AnalysisResponse {
  isCritical: boolean;
  disclaimer: string;
  analysis: string;
  textRecommendations: string[];
}

export const SymptomsPage = () => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [submittedSymptoms, setSubmittedSymptoms] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const textColor = isDark ? '#f5f5f5' : '#2d3436';
  const secondaryTextColor = isDark ? '#b2bec3' : '#636e72';
  const cardBorderColor = isDark ? '#303030' : '#f0f0f0';
  const cardBgColor = isDark ? '#1f1f1f' : '#ffffff';

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSubmittedSymptoms(values);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/symptoms/analyze-mvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Не вдалося зв’язатися із сервером. Перевірте підключення або спробуйте пізніше.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Сталася непередбачена помилка під час аналізу.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setResult(null);
    setError(null);
    setSubmittedSymptoms(null);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', color: textColor }}>
      
      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <MedicineBoxOutlined style={{ fontSize: '48px', color: '#00b894', marginBottom: '12px' }} />
        <Title level={1} style={{ color: textColor, margin: 0, fontWeight: 800 }}>
          Аналізатор <span style={{ color: '#00b894' }}>симптомів</span>
        </Title>
        <Paragraph style={{ color: secondaryTextColor, fontSize: '16px', marginTop: '8px' }}>
          Опишіть ваше самопочуття для отримання швидкої попередньої оцінки на базі штучного інтелекту
        </Paragraph>
      </div>

      {/* Головне медичне попередження (Disclaimer) - ОБОВ'ЯЗКОВО СПОЧАТКУ */}
      <Alert
        title="Важливе медичне застереження!"
        description="Зверніть увагу: цей сервіс надає виключно попередню інформаційну оцінку симптомів за допомогою штучного інтелекту. Отримані результати є орієнтовними і не можуть вважатися офіційним медичним діагнозом чи планом лікування. Лише кваліфікований лікар може проводити професійний медичний огляд, встановлювати діагноз та призначати ліки. Якщо ви почуваєте себе погано, негайно зверніться до лікаря або зателефонуйте у швидку допомогу за номером 103."
        type="warning"
        showIcon
        icon={<WarningOutlined style={{ fontSize: '24px', color: '#faad14' }} />}
        style={{
          borderRadius: '12px',
          border: '1px solid #ffe58f',
          backgroundColor: isDark ? '#1d1b13' : '#fffbe6',
          marginBottom: '32px',
          padding: '16px',
        }}
      />

      <Card 
        variant="outlined"
        style={{ 
          borderRadius: '16px', 
          backgroundColor: cardBgColor, 
          borderColor: cardBorderColor,
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.05)'
        }}
      >
        <Form 
          form={form}
          layout="vertical" 
          onFinish={onFinish} 
          requiredMark={false}
          initialValues={{
            symptoms: []
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label={<span style={{ color: textColor }}>Ваш вік</span>} name="age" rules={[{ required: true, message: 'Оберіть вікову групу' }]}>
                <Select placeholder="Оберіть вік" size="large">
                  <Option value="child">Дитина (до 12 років)</Option>
                  <Option value="teenager">Підліток (12-18 років)</Option>
                  <Option value="adult">Дорослий (18-60 років)</Option>
                  <Option value="elderly">Людина похилого віку (60+)</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item label={<span style={{ color: textColor }}>Температура тіла</span>} name="temperature" rules={[{ required: true, message: 'Вкажіть рівень температури' }]}>
                <Select placeholder="Вкажіть температуру" size="large">
                  <Option value="no_fever">Нормальна (до 37°C)</Option>
                  <Option value="subfebrile">Субфебрильна (37-38°C)</Option>
                  <Option value="high">Висока (38-39°C)</Option>
                  <Option value="critical">Критична (понад 39°C)</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item label={<span style={{ color: textColor }}>Тривалість симптомів</span>} name="duration" rules={[{ required: true, message: 'Вкажіть тривалість' }]}>
                <Select placeholder="Як довго більше?" size="large">
                  <Option value="less_24h">Менше 24 годин</Option>
                  <Option value="1_3_days">1-3 дні</Option>
                  <Option value="week_plus">Тиждень або довше</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ borderColor: cardBorderColor, margin: '12px 0 24px 0' }} />

          <Form.Item label={<span style={{ color: textColor, fontWeight: 700, fontSize: '16px' }}>Виберіть наявні симптоми (можна декілька)</span>} name="symptoms">
            <Checkbox.Group style={{ display: 'block', width: '100%' }}>
              
              {/* Категорія 1: Загальні */}
              <div style={{ 
                padding: '16px 20px', 
                borderRadius: '12px', 
                border: `1px solid ${cardBorderColor}`, 
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                marginBottom: '20px'
              }}>
                <Text style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#faad14', fontWeight: 700, fontSize: '15px' }}>
                  <FrownOutlined style={{ marginRight: '8px', fontSize: '18px' }} />
                  Загальні нездужання:
                </Text>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="sweating" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Пітливість</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="chills" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Озноб</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="body_aches" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Ломота в тілі</span>
                    </Checkbox>
                  </Col>
                </Row>
              </div>

              {/* Категорія 2: Респіраторні */}
              <div style={{ 
                padding: '16px 20px', 
                borderRadius: '12px', 
                border: `1px solid ${cardBorderColor}`, 
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                marginBottom: '20px'
              }}>
                <Text style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#00b894', fontWeight: 700, fontSize: '15px' }}>
                  <MedicineBoxOutlined style={{ marginRight: '8px', fontSize: '18px' }} />
                  Застудні та респіраторні:
                </Text>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="cough_dry" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Сухий кашель</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="cough_wet" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Вологий кашель</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="runny_nose" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Нежить</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="sore_throat" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Біль у горлі</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="shortness_of_breath" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Задишка</span>
                    </Checkbox>
                  </Col>
                </Row>
              </div>

              {/* Категорія 3: Серцево-судинні */}
              <div style={{ 
                padding: '16px 20px', 
                borderRadius: '12px', 
                border: `1px solid ${cardBorderColor}`, 
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                marginBottom: '20px'
              }}>
                <Text style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#ff4d4f', fontWeight: 700, fontSize: '15px' }}>
                  <HeartOutlined style={{ marginRight: '8px', fontSize: '18px' }} />
                  Серцево-судинні:
                </Text>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="chest_pain" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Біль у грудях</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="heart_palpitations" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Прискорене серцебиття</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="blood_pressure_high" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Підвищений тиск</span>
                    </Checkbox>
                  </Col>
                </Row>
              </div>

              {/* Категорія 4: Ниркові */}
              <div style={{ 
                padding: '16px 20px', 
                borderRadius: '12px', 
                border: `1px solid ${cardBorderColor}`, 
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                marginBottom: '20px'
              }}>
                <Text style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#1890ff', fontWeight: 700, fontSize: '15px' }}>
                  <SafetyCertificateOutlined style={{ marginRight: '8px', fontSize: '18px' }} />
                  Ниркові та сечовидільні:
                </Text>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="kidney_pain" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Біль у ділянці попереку / нирок</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="painful_urination" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Болісне сечовипускання</span>
                    </Checkbox>
                  </Col>
                </Row>
              </div>

              {/* Категорія 5: Шлунково-кишкові */}
              <div style={{ 
                padding: '16px 20px', 
                borderRadius: '12px', 
                border: `1px solid ${cardBorderColor}`, 
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                marginBottom: '20px'
              }}>
                <Text style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#fa8c16', fontWeight: 700, fontSize: '15px' }}>
                  <ExperimentOutlined style={{ marginRight: '8px', fontSize: '18px' }} />
                  Шлунково-кишкові:
                </Text>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="nausea" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Нудота</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="diarrhea" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Діарея</span>
                    </Checkbox>
                  </Col>
                </Row>
              </div>

              {/* Категорія 6: Неврологічні */}
              <div style={{ 
                padding: '16px 20px', 
                borderRadius: '12px', 
                border: `1px solid ${cardBorderColor}`, 
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                marginBottom: '8px'
              }}>
                <Text style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#722ed1', fontWeight: 700, fontSize: '15px' }}>
                  <ThunderboltOutlined style={{ marginRight: '8px', fontSize: '18px' }} />
                  Неврологічні:
                </Text>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="headache" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Сильний головний біль</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="dizziness" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Запаморочення</span>
                    </Checkbox>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Checkbox value="insomnia" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span style={{ color: textColor }}>Безсоння (порушення сну)</span>
                    </Checkbox>
                  </Col>
                </Row>
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Divider style={{ borderColor: cardBorderColor, margin: '24px 0' }} />

          <Form.Item label={<span style={{ color: textColor }}>Опишіть ваш стан своїми словами (додаткові деталі)</span>} name="description">
            <Input.TextArea 
              rows={4} 
              placeholder="Наприклад: сильний головний біль, слабкість, першіння у горлі, ломота..." 
              size="large"
              style={{ backgroundColor: isDark ? '#141414' : '#ffffff', color: textColor, borderColor: cardBorderColor }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={16}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                loading={loading}
                style={{ 
                  height: '48px', 
                  backgroundColor: '#00b894', 
                  borderColor: '#00b894', 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  borderRadius: '8px' 
                }}
              >
                Проаналізувати симптоми
              </Button>
            </Col>
            <Col xs={24} sm={8}>
              <Button 
                type="default" 
                size="large" 
                block 
                onClick={handleReset}
                icon={<RedoOutlined />}
                style={{ 
                  height: '48px', 
                  borderRadius: '8px',
                  fontWeight: 500,
                  color: textColor,
                  backgroundColor: isDark ? '#262626' : '#ffffff',
                  borderColor: cardBorderColor
                }}
              >
                Очистити
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Спінер завантаження */}
      {loading && (
        <div style={{ textAlign: 'center', margin: '48px 0' }}>
          <Spin size="large" description="Штучний інтелект аналізує симптоми..." style={{ color: '#00b894' }} />
        </div>
      )}

      {/* Помилка */}
      {error && (
        <Alert 
          title="Сталася помилка" 
          description={error} 
          type="error" 
          showIcon 
          style={{ marginTop: '24px', borderRadius: '8px' }} 
        />
      )}

      {/* Результати аналізу ШІ */}
      {result && (
        <div style={{ marginTop: '32px' }}>
          
          {/* Попередження про критичний стан (дисклеймер від ШІ) */}
          <Alert
            title={result.isCritical ? "⚠️ КРИТИЧНИЙ СТАН! ЗВЕРНІТЬСЯ ДО ЛІКАРЯ" : "Попередження щодо результатів"}
            description={result.disclaimer}
            type={result.isCritical ? "error" : "warning"}
            showIcon
            icon={<AlertFilled style={{ color: result.isCritical ? '#ff4d4f' : '#faad14' }} />}
            style={{ 
              borderRadius: '12px', 
              border: result.isCritical ? '2px solid #ff4d4f' : '1px solid #ffe58f',
              backgroundColor: result.isCritical ? (isDark ? '#2a1215' : '#fff2f0') : (isDark ? '#1d1b13' : '#fffbe6'),
              marginBottom: '24px',
              padding: '16px'
            }}
          />

          {/* Вказані пацієнтом дані */}
          <Card 
            title={
              <span style={{ color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MedicineBoxOutlined style={{ color: '#00b894' }} />
                <span>Вказані вами дані</span>
              </span>
            }
            style={{ 
              borderRadius: '16px', 
              backgroundColor: cardBgColor, 
              borderColor: cardBorderColor,
              marginBottom: '24px',
              boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.05)'
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Text type="secondary">Вік: </Text>
                <Text strong style={{ color: textColor }}>
                  {ageLabels[submittedSymptoms?.age] || submittedSymptoms?.age || 'не вказано'}
                </Text>
              </Col>
              <Col xs={24} sm={8}>
                <Text type="secondary">Температура тіла: </Text>
                <Text strong style={{ color: textColor }}>
                  {tempLabels[submittedSymptoms?.temperature] || submittedSymptoms?.temperature || 'не вказано'}
                </Text>
              </Col>
              <Col xs={24} sm={8}>
                <Text type="secondary">Тривалість симптомів: </Text>
                <Text strong style={{ color: textColor }}>
                  {durationLabels[submittedSymptoms?.duration] || submittedSymptoms?.duration || 'не вказано'}
                </Text>
              </Col>

              {submittedSymptoms?.symptoms && submittedSymptoms.symptoms.length > 0 && (
                <Col span={24} style={{ marginTop: '8px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Обрані симптоми:</Text>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {submittedSymptoms.symptoms.map((code: string) => (
                      <span 
                        key={code} 
                        style={{ 
                          padding: '4px 12px', 
                          borderRadius: '16px', 
                          backgroundColor: isDark ? '#262626' : '#e6f7ff', 
                          border: isDark ? '1px solid #303030' : '1px solid #91d5ff',
                          color: isDark ? '#f5f5f5' : '#0050b3',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        {symptomLabels[code] || code}
                      </span>
                    ))}
                  </div>
                </Col>
              )}

              {submittedSymptoms?.description && (
                <Col span={24} style={{ marginTop: '8px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>Додатковий опис стану:</Text>
                  <Paragraph style={{ 
                    fontStyle: 'italic', 
                    color: textColor, 
                    paddingLeft: '12px', 
                    borderLeft: '3px solid #00b894',
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    "{submittedSymptoms.description}"
                  </Paragraph>
                </Col>
              )}
            </Row>
          </Card>

          <Card 
            title={
              <span style={{ color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartFilled style={{ color: '#00b894' }} />
                <span>Результати медичного аналізу</span>
              </span>
            } 
            style={{ 
              borderRadius: '16px', 
              backgroundColor: cardBgColor, 
              borderColor: cardBorderColor,
              boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.05)'
            }}
          >
            <Title level={4} style={{ color: '#00b894', margin: '0 0 12px 0' }}>Аналітичний висновок:</Title>
            <Paragraph style={{ fontSize: '15px', lineHeight: '1.7', color: textColor }}>
              {result.analysis}
            </Paragraph>

            <Divider style={{ borderColor: cardBorderColor }} />

            <Title level={4} style={{ color: '#00b894', margin: '16px 0 12px 0' }}>💊 Можливі допоміжні засоби (рекомендація ШІ):</Title>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {result.textRecommendations && result.textRecommendations.map((rec, idx) => (
                <li key={idx} style={{ fontSize: '15px', margin: '8px 0', color: textColor }}>
                  {rec}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};
export default SymptomsPage;
