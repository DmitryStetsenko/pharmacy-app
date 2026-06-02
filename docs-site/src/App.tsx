import { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Cpu,
  Database,
  Terminal,
  Lock,
  Shield,
  Activity,
  ChevronRight,
  FileCode,
  CheckCircle2
} from 'lucide-react';

type Tab = 'overview' | 'frontend' | 'backend' | 'database' | 'deployment';

interface FsdLayer {
  name: string;
  purpose: string;
  contents: string[];
  examples: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedFsdLayer, setSelectedFsdLayer] = useState<string>('pages-flat');

  const fsdLayers: Record<string, FsdLayer> = {
    'app': {
      name: 'App (Шар ініціалізації)',
      purpose: 'Тут налаштовуються глобальні провайдери стану, авторизації, теми та стилі. Це вхідна точка додатку.',
      contents: ['Провайдер Redux (`storeProvider.tsx`)', 'Реєстр стилів Ant Design для Next.js', 'Провайдер сесій NextAuth (`sessionProvider.tsx`)', 'Глобальні файли стилів (`globals.css`)'],
      examples: ['src/app/layout.tsx', 'src/app/providers.tsx']
    },
    'pages-flat': {
      name: 'Pages Flat (Шар сторінок за FSD)',
      purpose: 'Компоненти сторінок, які містять основну логіку та збирають докупи віджети і фічі. Next.js App Router роути лише імпортують ці компоненти, що усуває зайве дублювання логіки.',
      contents: ['`HomePage` — Головна сторінка з промо-блоками', '`CatalogPage` — Каталог медикаментів з пошуком та фільтрами', '`CartPage` — Кошик товарів', '`CheckoutPage` — Форма оформлення замовлення'],
      examples: ['src/pages-flat/catalog/ui/CatalogPage.tsx', 'src/pages-flat/home/ui/HomePage.tsx']
    },
    'widgets': {
      name: 'Widgets (Шар віджетів)',
      purpose: 'Великі самостійні композиційні блоки інтерфейсу, які поєднують фічі та сутності в єдині структури.',
      contents: ['`Header` — Шапка сайту з пошуком, навігацією, кошиком та статусом входу', '`Footer` — Футер з додатковими посиланнями', '`ProductGrid` — Сітка для виведення карток ліків у каталозі'],
      examples: ['src/widgets/header/ui/Header.tsx', 'src/widgets/footer/ui/Footer.tsx']
    },
    'features': {
      name: 'Features (Шар фіч/дії користувача)',
      purpose: 'Інтерактивна логіка користувача, яка приносить бізнес-цінність та змінює стан додатку.',
      contents: ['`auth` — форми входу (Login) та реєстрації (Register)', '`theme` — перемикач кольорової теми (Dark/Light mode)', '`search-input` — рядок пошуку з debounce-ефектом'],
      examples: ['src/features/auth/ui/LoginForm.tsx', 'src/entities/theme/model/themeSlice.ts']
    },
    'entities': {
      name: 'Entities (Шар бізнес-сутностей)',
      purpose: 'Бізнес-сутності проєкту (картка товару, замовлення, користувач). Містять логіку та прості UI-картки.',
      contents: ['`medicine` — UI-картка товару, детальний опис препарату, інтерфейс Medicine', '`cart` — логіка Redux Slice для кошика (`cartSlice.ts`)', '`order` — UI-картка замовлення, інтерфейс Order'],
      examples: ['src/entities/medicine/ui/MedicineCard.tsx', 'src/entities/cart/model/cartSlice.ts']
    },
    'shared': {
      name: 'Shared (Шар спільних компонентів)',
      purpose: 'Базові перевикористовувані модулі, утиліти, конфігурації API, які не залежать від інших шарів.',
      contents: ['`baseApi` — налаштування RTK Query клієнта з автоматичним JWT-заголовком', '`ui` — базові кнопки, інпути, іконки', '`utils` — форматування цін, робота з датами'],
      examples: ['src/shared/api/baseApi.ts', 'src/shared/config/index.ts']
    }
  };

  const dbSchemas = [
    {
      title: 'Користувач (User)',
      fields: [
        { name: 'id', type: 'string', desc: 'Унікальний UUID користувача' },
        { name: 'email', type: 'string', desc: 'Електронна пошта (унікальна)' },
        { name: 'passwordHash', type: 'string', desc: 'Хешований пароль через bcrypt' },
        { name: 'role', type: "'user' | 'admin'", desc: 'Роль користувача для розмежування прав' }
      ]
    },
    {
      title: 'Препарат (Medicine)',
      fields: [
        { name: 'id', type: 'string', desc: 'Унікальний ідентифікатор' },
        { name: 'name', type: 'string', desc: 'Назва препарату' },
        { name: 'description', type: 'string', desc: 'Детальний опис та спосіб застосування' },
        { name: 'price', type: 'number', desc: 'Ціна препарату в гривнях' },
        { name: 'inStock', type: 'number', desc: 'Залишок одиниць препарату на складі' },
        { name: 'category', type: 'string', desc: 'Категорія медикаментів (напр. Знеболювальні)' },
        { name: 'manufacturer', type: 'string', desc: 'Виробник ліків' },
        { name: 'image', type: 'string (optional)', desc: 'URL зображення або base64 дані' }
      ]
    },
    {
      title: 'Замовлення (Order)',
      fields: [
        { name: 'id', type: 'string', desc: 'Унікальний код замовлення' },
        { name: 'userId', type: 'string | null', desc: 'ID користувача (null для гостей)' },
        { name: 'customerName', type: 'string', desc: 'Ім\'я покупця' },
        { name: 'phone', type: 'string', desc: 'Контактний телефон' },
        { name: 'email', type: 'string', desc: 'Email замовника' },
        { name: 'items', type: 'OrderItem[]', desc: 'Список товарів із ціною та кількістю' },
        { name: 'totalAmount', type: 'number', desc: 'Загальна сума до сплати' },
        { name: 'status', type: "'pending'|'completed'|'cancelled'", desc: 'Статус замовлення' },
        { name: 'createdAt', type: 'string', desc: 'Час створення замовлення' }
      ]
    }
  ];

  const apiEndpoints = [
    { method: 'POST', path: '/api/auth/register', desc: 'Реєстрація нового акаунту користувача', auth: 'public' },
    { method: 'POST', path: '/api/auth/login', desc: 'Автентифікація користувача, повернення JWT-токену', auth: 'public' },
    { method: 'GET', path: '/api/medicines', desc: 'Отримання списку ліків (з фільтрацією, пошуком та сортуванням)', auth: 'public' },
    { method: 'GET', path: '/api/medicines/:id', desc: 'Детальна інформація про конкретний препарат', auth: 'public' },
    { method: 'POST', path: '/api/medicines', desc: 'Додавання нових ліків до каталогу', auth: 'admin' },
    { method: 'PUT', path: '/api/medicines/:id', desc: 'Оновлення параметрів і залишків ліків за ID', auth: 'admin' },
    { method: 'DELETE', path: '/api/medicines/:id', desc: 'Видалення препарату з бази даних', auth: 'admin' },
    { method: 'POST', path: '/api/orders', desc: 'Створення замовлення (список товарів, перевірка складського залишку)', auth: 'user' },
    { method: 'GET', path: '/api/orders', desc: 'Перегляд замовлень: користувачі бачать свої, адміни — усі', auth: 'user' }
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <Layers className="logo-icon" />
          <span className="logo-text">Pharmacy Docs</span>
        </div>

        <nav>
          <ul className="nav-links">
            <li className="nav-item">
              <button
                className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <LayoutDashboard size={18} />
                Огляд проєкту
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-button ${activeTab === 'frontend' ? 'active' : ''}`}
                onClick={() => setActiveTab('frontend')}
              >
                <Layers size={18} />
                Фронтенд (FSD)
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-button ${activeTab === 'backend' ? 'active' : ''}`}
                onClick={() => setActiveTab('backend')}
              >
                <Cpu size={18} />
                Бекенд (Express)
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-button ${activeTab === 'database' ? 'active' : ''}`}
                onClick={() => setActiveTab('database')}
              >
                <Database size={18} />
                База даних
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-button ${activeTab === 'deployment' ? 'active' : ''}`}
                onClick={() => setActiveTab('deployment')}
              >
                <Terminal size={18} />
                Розгортання
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <p>© 2026 Pharmacy App</p>
          <p>Клієнт-серверна система</p>
          <a
            href="https://github.com/DmitryStetsenko/pharmacy-app"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--primary)',
              textDecoration: 'none',
              marginTop: '0.75rem',
              fontWeight: 600
            }}
          >
            <svg
              height="14"
              width="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {" "}GitHub Repo
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <section>
            <div className="header-section">
              <span className="header-tag">Overview</span>
              <h1 className="header-title">Клієнт-серверний застосунок Аптека</h1>
              <p className="header-subtitle">
                Сучасне SPA-рішення для замовлення медикаментів, розроблене на Next.js та Express. Проєкт об'єднує надійний бекенд на TypeScript та масштабовану архітектуру FSD на фронтенді.
              </p>
            </div>

            {/* Stats Summary */}
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-val">2</div>
                <div className="stat-lbl">Сервіси (Docker)</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">6</div>
                <div className="stat-lbl">Архітектурних шарів</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">9</div>
                <div className="stat-lbl">API Ендпоінтів</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">100%</div>
                <div className="stat-lbl">У пам'яті (In-Memory)</div>
              </div>
            </div>

            {/* Tech Stack Breakdown */}
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Технологічний радар</h2>
            <div className="grid-cols-2">
              <div className="card">
                <div className="card-icon-container emerald">
                  <Layers size={24} />
                </div>
                <h3 className="card-title">Frontend Клієнт</h3>
                <p className="card-text" style={{ marginBottom: '1rem' }}>
                  Сучасний інтерфейс користувача на базі компонентного підходу та строгої типізації.
                </p>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <li><strong>Next.js 16 (App Router)</strong> — серверна та клієнтська оптимізація.</li>
                  <li><strong>React 19 & TypeScript</strong> — останні стандарти розробки інтерфейсів.</li>
                  <li><strong>Ant Design v5</strong> — бібліотека преміальних готових компонентів.</li>
                  <li><strong>Redux Toolkit (RTK)</strong> — централізований стан кошика та тем.</li>
                  <li><strong>NextAuth.js</strong> — інтеграція сесій та безпечної авторизації.</li>
                </ul>
              </div>

              <div className="card">
                <div className="card-icon-container blue">
                  <Cpu size={24} />
                </div>
                <h3 className="card-title">Backend API</h3>
                <p className="card-text" style={{ marginBottom: '1rem' }}>
                  Швидкий та безпечний REST сервер на Node.js для обробки бізнес-логіки аптеки.
                </p>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <li><strong>Express & TypeScript</strong> — модульна архітектура контролерів і роутів.</li>
                  <li><strong>Swagger UI</strong> — інтерактивна JSDoc-документація на `/api-docs`.</li>
                  <li><strong>JWT & Bcrypt</strong> — безпечний вхід та шифрування паролів користувачів.</li>
                  <li><strong>Middlewares безпеки</strong> — Helmet, CORS та Express Rate Limit.</li>
                  <li><strong>Express Validator</strong> — валідація тіла запитів перед записом.</li>
                </ul>
              </div>
            </div>

            {/* Quick Links / Guide */}
            <div className="card" style={{ marginTop: '2.5rem', background: 'var(--primary-light)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <CheckCircle2 /> Швидкий старт
              </h3>
              <p className="card-text" style={{ color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                Проєкт повністю контейнеризовано. Для миттєвого запуску всього стеку достатньо мати встановлений Docker Desktop та виконати в корені:
              </p>
              <pre style={{ background: 'var(--bg-secondary)', marginBottom: 0 }}>
                docker compose up --build
              </pre>
            </div>
          </section>
        )}

        {activeTab === 'frontend' && (
          <section>
            <div className="header-section">
              <span className="header-tag">Frontend Architecture</span>
              <h1 className="header-title">Клієнтська архітектура Feature-Slice Design</h1>
              <p className="header-subtitle">
                FSD розбиває фронтенд на 6 чітких шарів. Це робить код читабельним, спрощує навігацію та запобігає появі "спагетті-коду".
              </p>
            </div>

            {/* Interactive FSD Selector */}
            <h2 style={{ marginBottom: '1rem' }}>Схема шарів FSD</h2>
            <div className="fsd-layout">
              <div className="fsd-layers-list">
                {Object.keys(fsdLayers).map((key) => (
                  <div
                    key={key}
                    className={`fsd-layer-card ${selectedFsdLayer === key ? 'active' : ''}`}
                    onClick={() => setSelectedFsdLayer(key)}
                  >
                    <span className="fsd-layer-name">{key}</span>
                    <ChevronRight size={16} style={{ color: selectedFsdLayer === key ? 'var(--primary)' : 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>

              <div className="fsd-layer-details">
                <h3 className="fsd-details-title">{fsdLayers[selectedFsdLayer].name}</h3>
                <p className="fsd-details-desc">{fsdLayers[selectedFsdLayer].purpose}</p>
                
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Що містить шар:</h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {fsdLayers[selectedFsdLayer].contents.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Приклади шляхів у проєкті:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {fsdLayers[selectedFsdLayer].examples.map((ex, idx) => (
                    <code key={idx} style={{ display: 'block', fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}>{ex}</code>
                  ))}
                </div>
              </div>
            </div>

            {/* Screenshots Gallery */}
            <h2 style={{ marginTop: '3.5rem', marginBottom: '1rem' }}>Скріншоти інтерфейсу</h2>
            <p className="card-text">
              Візуальна демонстрація роботи сторінок нашого додатку Next.js:
            </p>

            <div className="screenshot-grid">
              <div className="screenshot-card">
                <div className="screenshot-img-wrapper">
                  <img src="screenshots/home.png" alt="Головна сторінка" className="screenshot-img" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                </div>
                <div className="screenshot-info">
                  <h4 className="screenshot-title">Головна сторінка</h4>
                  <p className="screenshot-desc">Вступний екран аптеки з банерами та швидкими навігаційними категоріями ліків.</p>
                </div>
              </div>

              <div className="screenshot-card">
                <div className="screenshot-img-wrapper">
                  <img src="screenshots/catalog.png" alt="Каталог ліків" className="screenshot-img" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                </div>
                <div className="screenshot-info">
                  <h4 className="screenshot-title">Каталог та Фільтри</h4>
                  <p className="screenshot-desc">Сітка ліків, фільтрація за ціною, пошук з debounce-ефектом та перемикач темної/світлої теми.</p>
                </div>
              </div>

              <div className="screenshot-card">
                <div className="screenshot-img-wrapper">
                  <img src="screenshots/cart.png" alt="Кошик покупця" className="screenshot-img" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                </div>
                <div className="screenshot-info">
                  <h4 className="screenshot-title">Кошик та керування замовленням</h4>
                  <p className="screenshot-desc">Синхронізація з localStorage, зміна кількості ліків, автоматичний підрахунок вартості.</p>
                </div>
              </div>

              <div className="screenshot-card">
                <div className="screenshot-img-wrapper">
                  <img src="screenshots/login.png" alt="Форма авторизації" className="screenshot-img" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                </div>
                <div className="screenshot-info">
                  <h4 className="screenshot-title">Форма входу</h4>
                  <p className="screenshot-desc">Форма входу користувачів на базі Ant Design з валідацією полів та інтеграцією NextAuth.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'backend' && (
          <section>
            <div className="header-section">
              <span className="header-tag">Backend API</span>
              <h1 className="header-title">Серверна частина та REST API</h1>
              <p className="header-subtitle">
                Express сервер на базі TypeScript надає API для керування даними, забезпечує перевірку токенів JWT та керує залишками на складі.
              </p>
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Схема безпеки та проміжних обробників</h2>
            <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
              <div className="card">
                <div className="card-icon-container purple">
                  <Lock size={20} />
                </div>
                <h4 className="card-title">JWT Авторизація</h4>
                <p className="card-text" style={{ fontSize: '0.85rem' }}>
                  При реєстрації та вході паролі хешуються через `bcrypt`. Після входу сервер повертає JWT-токен, яким клієнт підписує наступні запити.
                </p>
              </div>

              <div className="card">
                <div className="card-icon-container red">
                  <Shield size={20} />
                </div>
                <h4 className="card-title">Захист сервера</h4>
                <p className="card-text" style={{ fontSize: '0.85rem' }}>
                  Бібліотека `helmet` налаштовує безпечні заголовки, `cors` дозволяє запити тільки з фронтенду, а `express-rate-limit` захищає від DDOS та Bruteforce.
                </p>
              </div>

              <div className="card">
                <div className="card-icon-container emerald">
                  <Activity size={20} />
                </div>
                <h4 className="card-title">Валідація запитів</h4>
                <p className="card-text" style={{ fontSize: '0.85rem' }}>
                  Всі POST та PUT запити проходять крізь `express-validator` перед обробкою в контролерах. Це гарантує цілісність даних у пам'яті.
                </p>
              </div>
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Доступні REST API Ендпоінти</h2>
            <p className="card-text" style={{ marginBottom: '1.5rem' }}>
              Ендпоінти розбито на три групи: авторизація, управління каталогом ліків та обробка замовлень.
            </p>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Метод</th>
                    <th>Ендпоінт</th>
                    <th>Опис дії</th>
                    <th>Права доступу</th>
                  </tr>
                </thead>
                <tbody>
                  {apiEndpoints.map((endpoint, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className={`badge ${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.85rem' }}>{endpoint.path}</code>
                      </td>
                      <td>{endpoint.desc}</td>
                      <td>
                        <span className={`badge ${endpoint.auth}`}>
                          {endpoint.auth === 'admin' ? 'Адміністратор' : endpoint.auth === 'user' ? 'Користувач' : 'Публічний'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Swagger screenshot */}
            <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Інтерактивна документація Swagger</h2>
            <div className="screenshot-card" style={{ maxWidth: '800px' }}>
              <div className="screenshot-img-wrapper">
                <img src="screenshots/swagger.png" alt="Swagger UI" className="screenshot-img" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div className="screenshot-info">
                <h4 className="screenshot-title">Панель Swagger UI</h4>
                <p className="screenshot-desc">Доступна за адресою `http://localhost:5000/api-docs` під час локальної розробки. Дозволяє тестувати запити у реальному часі.</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'database' && (
          <section>
            <div className="header-section">
              <span className="header-tag">Data Schemas</span>
              <h1 className="header-title">Моделі даних та In-Memory DB</h1>
              <p className="header-subtitle">
                Дані зберігаються в оперативній пам'яті сервера Express (`backend/src/db.ts`). Це ідеально для демонстрації, оскільки застосунок не потребує встановлення сторонніх СУБД.
              </p>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>Схеми сутностей в коді</h2>
            
            <div className="grid-cols-2" style={{ gap: '2rem' }}>
              {dbSchemas.map((schema, idx) => (
                <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <FileCode size={20} className="logo-icon" />
                    <h3 className="card-title" style={{ margin: 0 }}>{schema.title}</h3>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <table style={{ fontSize: '0.85rem' }}>
                      <thead>
                        <tr>
                          <th>Поле</th>
                          <th>Тип</th>
                          <th>Опис</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schema.fields.map((field, fIdx) => (
                          <tr key={fIdx}>
                            <td><strong>{field.name}</strong></td>
                            <td><code style={{ fontSize: '0.75rem' }}>{field.type}</code></td>
                            <td style={{ fontSize: '0.8rem' }}>{field.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginTop: '2.5rem' }}>
              <h3 className="card-title">Автоматичне заповнення бази (Seed)</h3>
              <p className="card-text" style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>
                При кожному перезапуску сервера база очищається та автоматично наповнюється 15 препаратами (Аспірин, Ібупрофен, Амоксицилін тощо) із випадковою кількістю одиниць на складі, а також створюється тестовий користувач-адміністратор для швидкої перевірки функціоналу адмін-панелі.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'deployment' && (
          <section>
            <div className="header-section">
              <span className="header-tag">Deployment</span>
              <h1 className="header-title">Керівництво з запуску та розгортання</h1>
              <p className="header-subtitle">
                Дізнайтеся, як запустити проєкт за допомогою Docker Compose або локально в терміналі для активної розробки.
              </p>
            </div>

            <div className="tabs-container">
              <h2 style={{ marginBottom: '1.5rem' }}>Виберіть спосіб розгортання</h2>
              
              <div className="card">
                <h3 className="card-title">🐳 Варіант 1: Запуск через Docker Compose (Рекомендовано)</h3>
                <p className="card-text" style={{ marginTop: '0.5rem' }}>
                  Це дозволяє запустити і фронтенд, і бекенд у ізольованих контейнерах однією командою. Переконайтеся, що запущено Docker Desktop.
                </p>
                
                <pre>
{`# 1. Схилюйте проєкт та перейдіть в корінь
cd pharmacy-app

# 2. Запустіть контейнери
docker compose up --build

# 3. Сервіси будуть доступні за адресами:
# - Клієнт: http://localhost:3000
# - API Swagger: http://localhost:5000/api-docs`}
                </pre>
              </div>

              <div className="card" style={{ marginTop: '2rem' }}>
                <h3 className="card-title">💻 Варіант 2: Локальний запуск для розробки (Hot Reload)</h3>
                <p className="card-text" style={{ marginTop: '0.5rem' }}>
                  Підходить для внесення змін до коду, оскільки система миттєво перезапускає сервіси при змінах.
                </p>

                <h4 style={{ marginTop: '1.25rem', fontSize: '1rem', fontWeight: 600 }}>Крок 1: Запуск сервера Бекенду</h4>
                <pre>
{`cd backend
npm install
npm run dev
# Сервер стартує на порту 5000`}
                </pre>

                <h4 style={{ marginTop: '1.25rem', fontSize: '1rem', fontWeight: 600 }}>Крок 2: Запуск клієнта Фронтенду</h4>
                <pre>
{`cd frontend
npm install
npm run dev
# Сайт стартує на порту 3000 (або 3001)`}
                </pre>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
