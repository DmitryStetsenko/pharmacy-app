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
  ChevronDown,
  FileCode,
  Folder,
  FolderOpen,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

type Tab = 'overview' | 'user-guide' | 'frontend' | 'backend' | 'database' | 'deployment';

interface FsdLayer {
  name: string;
  purpose: string;
  contents: string[];
  examples: string[];
  screenshots?: { src: string; title: string; desc: string }[];
}

interface FileTreeNode {
  name: string;
  type: 'folder' | 'file';
  fsdLayer?: string;
  children?: FileTreeNode[];
}

const projectTree: FileTreeNode = {
  name: 'src',
  type: 'folder',
  children: [
    {
      name: 'app',
      type: 'folder',
      fsdLayer: 'app',
      children: [
        {
          name: 'api',
          type: 'folder',
          children: [
            {
              name: 'auth',
              type: 'folder',
              children: [
                {
                  name: '[...nextauth]',
                  type: 'folder',
                  children: [
                    { name: 'route.ts', type: 'file' }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'providers',
          type: 'folder',
          children: [
            { name: 'AuthProvider.tsx', type: 'file' },
            { name: 'ThemeProvider.tsx', type: 'file' },
            { name: 'StoreProvider.tsx', type: 'file' },
            { name: 'AntdRegistry.tsx', type: 'file' }
          ]
        },
        { name: 'globals.css', type: 'file' },
        { name: 'layout.tsx', type: 'file' },
        { name: 'page.tsx', type: 'file' },
        { name: 'store.ts', type: 'file' }
      ]
    },
    {
      name: 'pages-flat',
      type: 'folder',
      fsdLayer: 'pages-flat',
      children: [
        {
          name: 'home',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'HomePage.tsx', type: 'file' }] }]
        },
        {
          name: 'catalog',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'CatalogPage.tsx', type: 'file' }] }]
        },
        {
          name: 'medicine-details',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'MedicineDetailsPage.tsx', type: 'file' }] }]
        },
        {
          name: 'cart',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'CartPage.tsx', type: 'file' }] }]
        },
        {
          name: 'checkout',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'CheckoutPage.tsx', type: 'file' }] }]
        },
        {
          name: 'login',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'LoginPage.tsx', type: 'file' }] }]
        },
        {
          name: 'register',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'RegisterPage.tsx', type: 'file' }] }]
        }
      ]
    },
    {
      name: 'widgets',
      type: 'folder',
      fsdLayer: 'widgets',
      children: [
        {
          name: 'header',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'Header.tsx', type: 'file' }] }]
        },
        {
          name: 'footer',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'Footer.tsx', type: 'file' }] }]
        }
      ]
    },
    {
      name: 'features',
      type: 'folder',
      fsdLayer: 'features',
      children: [
        {
          name: 'auth',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'LoginForm.tsx', type: 'file' }] }]
        }
      ]
    },
    {
      name: 'entities',
      type: 'folder',
      fsdLayer: 'entities',
      children: [
        {
          name: 'medicine',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'MedicineCard.tsx', type: 'file' }] }]
        },
        {
          name: 'cart',
          type: 'folder',
          children: [{ name: 'model', type: 'folder', children: [{ name: 'cartSlice.ts', type: 'file' }] }]
        },
        {
          name: 'order',
          type: 'folder',
          children: [{ name: 'ui', type: 'folder', children: [{ name: 'OrderCard.tsx', type: 'file' }] }]
        },
        {
          name: 'theme',
          type: 'folder',
          children: [{ name: 'model', type: 'folder', children: [{ name: 'themeSlice.ts', type: 'file' }] }]
        }
      ]
    },
    {
      name: 'shared',
      type: 'folder',
      fsdLayer: 'shared',
      children: [
        {
          name: 'api',
          type: 'folder',
          children: [{ name: 'baseApi.ts', type: 'file' }]
        },
        {
          name: 'types',
          type: 'folder',
          children: [{ name: 'index.ts', type: 'file' }]
        }
      ]
    }
  ]
};

const getAllFolderPaths = (node: FileTreeNode, currentPath: string = 'src'): string[] => {
  let paths: string[] = [];
  if (node.type === 'folder') {
    paths.push(currentPath);
    if (node.children) {
      node.children.forEach(child => {
        paths = [...paths, ...getAllFolderPaths(child, `${currentPath}/${child.name}`)];
      });
    }
  }
  return paths;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedFsdLayer, setSelectedFsdLayer] = useState<string>('pages-flat');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true
  });

  const folderPaths = getAllFolderPaths(projectTree);
  const hasAnyExpanded = folderPaths.some(p => p !== 'src' && expandedFolders[p]);

  const handleToggleAll = () => {
    if (hasAnyExpanded) {
      setExpandedFolders({ 'src': true });
    } else {
      const nextExpanded: Record<string, boolean> = {};
      folderPaths.forEach(p => {
        nextExpanded[p] = true;
      });
      setExpandedFolders(nextExpanded);
    }
  };

  const renderTree = (node: FileTreeNode, path: string = 'src'): React.ReactNode => {
    const isFolder = node.type === 'folder';
    const isOpen = !!expandedFolders[path];
    const isFsdLayer = !!node.fsdLayer;
    const isSelected = selectedFsdLayer === node.fsdLayer;

    const layerColors = {
      app: { bg: 'rgba(139, 92, 246, 0.15)', border: '#8b5cf6', badge: 'L6' },
      'pages-flat': { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', badge: 'L5' },
      widgets: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', badge: 'L4' },
      features: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', badge: 'L3' },
      entities: { bg: 'rgba(236, 72, 153, 0.15)', border: '#ec4899', badge: 'L2' },
      shared: { bg: 'rgba(107, 114, 128, 0.15)', border: '#6b7280', badge: 'L1' }
    };

    const layerStyle = isFsdLayer ? layerColors[node.fsdLayer as keyof typeof layerColors] : null;

    return (
      <div key={path} style={{ marginLeft: path === 'src' ? 0 : '16px' }}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (isFolder) {
              setExpandedFolders(prev => ({ ...prev, [path]: !isOpen }));
            }
            if (isFsdLayer) {
              setSelectedFsdLayer(node.fsdLayer!);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 8px',
            borderRadius: '6px',
            cursor: 'pointer',
            background: isSelected && layerStyle ? layerStyle.bg : 'transparent',
            border: isSelected && layerStyle ? `1px solid ${layerStyle.border}` : '1px solid transparent',
            marginBottom: '2px',
            transition: 'all 0.15s ease-in-out',
            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
          className="tree-node"
        >
          {isFolder ? (
            isOpen ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <span style={{ width: '14px' }} />
          )}

          {isFolder ? (
            isOpen ? (
              <FolderOpen size={16} style={{ color: isSelected && layerStyle ? layerStyle.border : 'var(--primary)' }} />
            ) : (
              <Folder size={16} style={{ color: isSelected && layerStyle ? layerStyle.border : 'var(--primary)' }} />
            )
          ) : (
            <FileCode size={16} style={{ color: 'var(--text-muted)' }} />
          )}

          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isFsdLayer ? '0.95rem' : '0.85rem',
            fontWeight: isFsdLayer ? 700 : 500,
            textDecoration: isFsdLayer ? 'underline decoration-dotted' : 'none'
          }}>
            {node.name}
          </span>

          {isFsdLayer && isSelected && fsdLayers[node.fsdLayer!]?.screenshots && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const el = document.getElementById('fsd-details-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{
                marginLeft: '8px',
                fontSize: '0.65rem',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--primary)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '4px',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              title="Детальніше про цей шар"
            >
              🔍 Детальніше
            </button>
          )}

          {isFsdLayer && layerStyle && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="badge" style={{
                background: layerStyle.bg,
                color: layerStyle.border,
                border: `1px solid ${layerStyle.border}`,
                padding: '1px 4px',
                fontSize: '0.65rem'
              }}>
                {layerStyle.badge}
              </span>
            </div>
          )}
        </div>

        {isFolder && isOpen && node.children && (
          <div style={{
            borderLeft: '1px dashed var(--border-color)',
            marginLeft: '14px',
            paddingLeft: '4px'
          }}>
            {node.children.map(child => renderTree(child, `${path}/${child.name}`))}
          </div>
        )}
      </div>
    );
  };

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
      examples: ['src/pages-flat/catalog/ui/CatalogPage.tsx', 'src/pages-flat/home/ui/HomePage.tsx'],
      screenshots: [
        { src: 'screenshots/home.png', title: 'Головна сторінка (HomePage)', desc: 'Основна сторінка аптеки з промо-банерами та категоріями ліків.' },
        { src: 'screenshots/catalog.png', title: 'Сторінка каталогу (CatalogPage)', desc: 'Список товарів, пошук з debounce та бічні фільтри за ціною.' }
      ]
    },
    'widgets': {
      name: 'Widgets (Шар віджетів)',
      purpose: 'Великі самостійні композиційні блоки інтерфейсу, які поєднують фічі та сутності в єдині структури.',
      contents: ['`Header` — Шапка сайту з пошуком, навігацією, кошиком та статусом входу', '`Footer` — Футер з додатковими посиланнями', '`ProductGrid` — Сітка для виведення карток ліків у каталозі'],
      examples: ['src/widgets/header/ui/Header.tsx', 'src/widgets/footer/ui/Footer.tsx'],
      screenshots: [
        { src: 'screenshots/home.png', title: 'Віджет Header (Шапка)', desc: 'Поєднує вхід користувача, пошук та індикатор кошика.' }
      ]
    },
    'features': {
      name: 'Features (Шар фіч/дії користувача)',
      purpose: 'Інтерактивна логіка користувача, яка приносить бізнес-цінність та змінює стан додатку.',
      contents: ['`auth` — форми входу (Login) та реєстрації (Register)', '`theme` — перемикак кольорової теми (Dark/Light mode)', '`search-input` — рядок пошуку з debounce-ефектом'],
      examples: ['src/features/auth/ui/LoginForm.tsx', 'src/entities/theme/model/themeSlice.ts'],
      screenshots: [
        { src: 'screenshots/login.png', title: 'Фіча авторизації (LoginForm)', desc: 'Інтерактивна форма входу, інтегрована з NextAuth.' }
      ]
    },
    'entities': {
      name: 'Entities (Шар бізнес-сутностей)',
      purpose: 'Бізнес-сутності проєкту (картка товару, замовлення, користувач). Містять логіку та прості UI-картки.',
      contents: ['`medicine` — UI-картка товару, детальний опис препарату, інтерфейс Medicine', '`cart` — логіка Redux Slice для кошика (`cartSlice.ts`)', '`order` — UI-картка замовлення, інтерфейс Order'],
      examples: ['src/entities/medicine/ui/MedicineCard.tsx', 'src/entities/cart/model/cartSlice.ts'],
      screenshots: [
        { src: 'screenshots/catalog.png', title: 'Сутність ліків (MedicineCard)', desc: 'Відображає назву, ціну, наявність та кнопку швидкого додавання до кошика.' }
      ]
    },
    'shared': {
      name: 'Shared (Шар спільних компонентів)',
      purpose: 'Базові перевикористовувані модулі, утиліти, конфігурації API, які не залежать від інших шарів.',
      contents: ['`baseApi` — налаштування RTK Query клієнта з автоматичним JWT-заголовком', '`ui` — базові кнопки, інпути, іконки', '`utils` — форматування цін, робота з датами'],
      examples: ['src/shared/api/baseApi.ts', 'src/shared/config/index.ts'],
      screenshots: [
        { src: 'screenshots/cart.png', title: 'Спільні UI компоненти', desc: 'Утиліти підрахунку цін, кошик з RTK Query та базові кнопки.' }
      ]
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
                className={`nav-button ${activeTab === 'user-guide' ? 'active' : ''}`}
                onClick={() => setActiveTab('user-guide')}
              >
                <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
                Запуск (для новачків)
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

            {/* Quick Links / Guide */}
            <div className="card" style={{ marginBottom: '2.5rem', background: 'var(--primary-light)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <CheckCircle2 /> Швидкий старт
              </h3>
              <p className="card-text" style={{ color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
                Проєкт повністю контейнеризовано. Для миттєвого запуску всього стеку достатньо мати встановлений Docker Desktop та виконати в корені:
              </p>
              <pre style={{ background: 'var(--bg-secondary)', marginBottom: '1.25rem' }}>
                docker compose up --build
              </pre>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.25rem', borderTop: '1px solid rgba(16, 185, 129, 0.15)', paddingTop: '1.25rem' }}>
                <a
                  href="https://github.com/DmitryStetsenko/pharmacy-app"
                  target="_blank"
                  rel="noreferrer"
                  className="nav-button active"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.2rem',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius)',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <svg
                    height="18"
                    width="18"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  Перейти до GitHub Репозиторію
                </a>

                <button
                  onClick={() => setActiveTab('user-guide')}
                  className="nav-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.2rem',
                    borderRadius: 'var(--radius)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
                  Покрокова інструкція для новачків
                </button>
              </div>
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
          </section>
        )}

        {activeTab === 'frontend' && (
          <section>
            <div className="header-section">
              <span className="header-tag">Frontend Architecture</span>
              <h1 className="header-title">Клієнтська архітектура Feature-Sliced Design</h1>
              <p className="header-subtitle">
                FSD розбиває фронтенд на 6 чітких шарів. Це робить код читабельним, спрощує навігацію та запобігає появі "спагетті-коду".
              </p>
            </div>

            {/* Interactive FSD Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Схема архітектурних шарів</h2>
              <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>
                🎯 Відповідність стандарту FSD: 100%
              </span>
            </div>

            <div className="fsd-layout" style={{ marginBottom: '3rem' }}>
              {/* Interactive Hierarchical VS-Code like File Tree */}
              <div className="card" style={{ padding: '1.5rem', maxHeight: '650px', overflowY: 'auto', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    📁 Файлова ієрархія (src)
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={handleToggleAll}
                      style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-normal)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      {hasAnyExpanded ? 'Згорнути все' : 'Розгорнути все'}
                    </button>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Клікніть шар для опису</span>
                  </div>
                </div>
                <div style={{ userSelect: 'none' }}>
                  {renderTree(projectTree)}
                </div>
              </div>


              <div id="fsd-details-section" className="fsd-layer-details" style={{ scrollMarginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {fsdLayers[selectedFsdLayer].name}
                  </h3>
                  <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    Рівень {7 - Object.keys(fsdLayers).indexOf(selectedFsdLayer)}
                  </span>
                </div>
                
                <p className="fsd-details-desc">{fsdLayers[selectedFsdLayer].purpose}</p>
                
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Що містить шар:</h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {fsdLayers[selectedFsdLayer].contents.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Приклади шляхів у проєкті:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {fsdLayers[selectedFsdLayer].examples.map((ex, idx) => (
                    <code key={idx} style={{ display: 'block', fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}>{ex}</code>
                  ))}
                </div>

                 {fsdLayers[selectedFsdLayer].screenshots && (
                  <div id="fsd-layer-screenshots" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', scrollMarginTop: '2.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Скріншоти та реалізація цього шару:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                      {fsdLayers[selectedFsdLayer].screenshots?.map((shot, idx) => (
                        <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
                          <div style={{ overflow: 'hidden' }}>
                            <img src={shot.src} alt={shot.title} style={{ width: '100%', height: 'auto', display: 'block' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                          </div>
                          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-color)' }}>
                            <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>{shot.title}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{shot.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

        {activeTab === 'user-guide' && (
          <section>
            <div className="header-section">
              <span className="header-tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>Покрокова інструкція</span>
              <h1 className="header-title">Інструкція з запуску для новачків</h1>
              <p className="header-subtitle">
                Детальний покроковий посібник, орієнтований на користувачів без досвіду в розробці. Тут описано, як підготувати комп'ютер, завантажити файли та успішно запустити застосунок.
              </p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', borderColor: 'rgba(59, 130, 246, 0.2)', background: 'rgba(59, 130, 246, 0.02)' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                <HelpCircle /> Що це за проєкт і що ми запускаємо?
              </h3>
              <p className="card-text" style={{ marginTop: '0.5rem' }}>
                Цей проєкт є повноцінним інтернет-магазином ліків (Аптека). Він складається з двох основних частин:
              </p>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                <li><strong>Фронтенд (інтерфейс)</strong> — сайт, який користувач бачить у браузері, де можна шукати товари, додавати їх до кошика тощо.</li>
                <li><strong>Бекенд (сервер та база даних)</strong> — невидима частина, яка обробляє замовлення, зберігає списки ліків у пам'яті та керує логікою.</li>
              </ul>
            </div>

            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🛠️ Крок 1. Підготовка комп'ютера (Що встановити)
            </h2>
            <p className="card-text" style={{ marginBottom: '1.5rem' }}>
              Вам знадобиться всього <strong>одна програма</strong>, яка автоматично налаштує та запустить весь проєкт у контейнерах:
            </p>

            <div className="card" style={{ marginBottom: '2.5rem' }}>
              <h3 className="card-title">1. Docker Desktop (Рекомендований та найпростіший шлях)</h3>
              <p className="card-text" style={{ marginTop: '0.5rem' }}>
                Він створює віртуальні "контейнери", які самостійно встановлюють всі потрібні бібліотеки та налаштовують мережу. Вам не доведеться нічого налаштовувати вручну.
              </p>
              <ol style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                <li>Перейдіть на офіційний сайт <a href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Docker Desktop</a>.</li>
                <li>Завантажте версію для вашої операційної системи (Windows, Mac або Linux).</li>
                <li>Встановіть програму, слідуючи інструкціям на екрані (якщо встановлюєте на Windows, погодьтеся на встановлення WSL 2, якщо програма запропонує це).</li>
                <li>Запустіть встановлений <strong>Docker Desktop</strong>. Переконайтеся, що в лівому нижньому кутку програми світиться зелений значок (це означає, що Docker запущений та готовий до роботи).</li>
              </ol>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>📥 Крок 2. Як завантажити проєкт з GitHub</h2>
            <div className="card" style={{ marginBottom: '2.5rem' }}>
              <h3 className="card-title">Отримання файлів проєкту (ZIP-архів)</h3>
              <p className="card-text" style={{ marginTop: '0.5rem' }}>
                Якщо ви не вмієте користуватися Git через термінал, виконайте ці прості кроки:
              </p>
              <ol style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                <li>Відкрийте сторінку репозиторію: <a href="https://github.com/DmitryStetsenko/pharmacy-app" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>https://github.com/DmitryStetsenko/pharmacy-app</a>.</li>
                <li>Знайдіть зелену кнопку <strong>"Code"</strong> у правій частині сторінки та натисніть її.</li>
                <li>У меню, що з'явилося, виберіть пункт <strong>"Download ZIP"</strong> (Завантажити ZIP-архів).</li>
                <li>Збережіть архів на комп'ютер (наприклад, у папку "Завантаження").</li>
                <li>Розархівуйте завантажений файл. Натисніть правою кнопкою миші на архів та виберіть <em>"Видобути все..."</em> (Extract All). Бажано видобути його в просту директорію, наприклад, <code>C:\Projects\pharmacy-app</code> або <code>D:\pharmacy-app</code>.</li>
              </ol>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>🚀 Крок 3. Запуск проєкту за 3 кроки (Через Docker)</h2>
            <div className="card" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
              <p className="card-text" style={{ fontSize: '1rem', fontWeight: 500 }}>
                Переконайтеся, що програма <strong>Docker Desktop</strong> відкрита й працює.
              </p>
              <ol style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: '1.6' }}>
                <li><strong>Відкрийте папку з проєктом</strong>, яку ви щойно розархівували.</li>
                <li>
                  <strong>Запустіть термінал (командний рядок) у цій папці:</strong>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', listStyleType: 'circle' }}>
                    <li><em>На Windows:</em> Клікніть у адресний рядок зверху провідника (де вказано шлях до папки), зітріть текст, введіть <code>cmd</code> та натисніть <strong>Enter</strong>. Відкриється чорне вікно консолі.</li>
                    <li><em>На Mac:</em> Натисніть правою кнопкою миші на папку з проєктом, виберіть "Служби" (Services) -&gt; "Новий термінал у папці" (New Terminal at Folder).</li>
                  </ul>
                </li>
                <li>
                  У вікні консолі, яке відкрилося, введіть наступну команду та натисніть <strong>Enter</strong>:
                  <pre style={{ margin: '0.5rem 0', background: 'var(--bg-secondary)', padding: '0.5rem' }}>docker compose up --build</pre>
                </li>
                <li>
                  <strong>Зачекайте 1-2 хвилини</strong>. Docker автоматично скачає потрібні версії Node.js, збере фронтенд, запустить бекенд-сервер та зв'яже їх разом.
                </li>
                <li>
                  Коли збірка завершиться, у консолі почнуть з'являтися логи запуску. Тепер ваш сайт працює!
                </li>
              </ol>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>🔗 Крок 4. Перевірка роботи сайту в браузері</h2>
            <div className="card" style={{ marginBottom: '2.5rem' }}>
              <p className="card-text">
                Після запуску відкрийте браузер та перейдіть за цими посиланнями:
              </p>
              <table style={{ marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th>Адреса</th>
                    <th>Що там знаходиться</th>
                    <th>Як користуватися</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="http://localhost:3000" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>http://localhost:3000</a></td>
                    <td><strong>Сайт Аптеки (Фронтенд)</strong></td>
                    <td>Головна сторінка з пошуком ліків. Можна купувати ліки, додавати у кошик та оформлювати замовлення.</td>
                  </tr>
                  <tr>
                    <td><a href="http://localhost:5000/api-docs" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>http://localhost:5000/api-docs</a></td>
                    <td><strong>Swagger Документація (Бекенд)</strong></td>
                    <td>Технічна сторінка, де можна переглянути та протестувати всі запити до серверної бази даних.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>🔐 Корисні дані для перевірки (Тестовий акаунт)</h2>
            <div className="card" style={{ marginBottom: '2.5rem' }}>
              <p className="card-text">
                Для перевірки функцій входу та замовлення, на сайті вже заздалегідь створений демонстраційний обліковий запис адміністратора:
              </p>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                <li><strong>Логін (Email):</strong> <code>admin@admin.com</code></li>
                <li><strong>Пароль:</strong> <code>admin123</code></li>
              </ul>
              <p className="card-text" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Ви можете увійти під цим акаунтом у правому верхньому кутку сайту Аптеки.
              </p>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>🛑 Як вимкнути проєкт?</h2>
            <div className="card">
              <p className="card-text">
                Щоб зупинити роботу серверів:
              </p>
              <ol style={{ paddingLeft: '1.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                <li>Перейдіть у вікно консолі, де працює запуск, і натисніть клавіші <strong>Ctrl + C</strong> на клавіатурі.</li>
                <li>Або відкрийте програму <strong>Docker Desktop</strong>, перейдіть у вкладку <strong>Containers</strong> та натисніть на іконку контейнера з назвою <code>pharmacy-app</code> кнопкою Stop (або видаліть контейнер).</li>
              </ol>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
