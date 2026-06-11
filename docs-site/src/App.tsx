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
  HelpCircle,
  Container
} from 'lucide-react';

type Tab = 'overview' | 'user-guide' | 'frontend' | 'backend' | 'database' | 'deployment' | 'labs';

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
        },
        {
          name: 'ui',
          type: 'folder',
          children: [
            {
              name: 'modal',
              type: 'folder',
              children: [
                { name: 'Modal.tsx', type: 'file' },
                { name: 'Modal.css', type: 'file' }
              ]
            },
            {
              name: 'toast',
              type: 'folder',
              children: [
                { name: 'ToastContext.tsx', type: 'file' },
                { name: 'Toast.css', type: 'file' }
              ]
            }
          ]
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
  const [activeLabTab, setActiveLabTab] = useState<string>('lab6');
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
            <li className="nav-item">
              <button
                className={`nav-button ${activeTab === 'labs' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('labs');
                  setActiveLabTab('lab1');
                }}
              >
                <FileCode size={18} />
                Лабораторні роботи
              </button>
              {activeTab === 'labs' && (
                <ul className="submenu-links" style={{
                  listStyle: 'none',
                  paddingLeft: '1.75rem',
                  marginTop: '0.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  width: '100%'
                }}>
                  <li>
                    <button
                      className={`nav-button ${activeLabTab === 'lab1' ? 'active' : ''}`}
                      onClick={() => setActiveLabTab('lab1')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%'
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: activeLabTab === 'lab1' ? 'var(--primary)' : 'var(--text-muted)'
                      }} />
                      Лаб 1
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-button ${activeLabTab === 'lab2' ? 'active' : ''}`}
                      onClick={() => setActiveLabTab('lab2')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%'
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: activeLabTab === 'lab2' ? 'var(--primary)' : 'var(--text-muted)'
                      }} />
                      Лаб 2
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-button ${activeLabTab === 'lab3' ? 'active' : ''}`}
                      onClick={() => setActiveLabTab('lab3')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%'
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: activeLabTab === 'lab3' ? 'var(--primary)' : 'var(--text-muted)'
                      }} />
                      Лаб 3
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-button ${activeLabTab === 'lab4' ? 'active' : ''}`}
                      onClick={() => setActiveLabTab('lab4')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%'
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: activeLabTab === 'lab4' ? 'var(--primary)' : 'var(--text-muted)'
                      }} />
                      Лаб 4
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-button ${activeLabTab === 'lab5' ? 'active' : ''}`}
                      onClick={() => setActiveLabTab('lab5')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%'
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: activeLabTab === 'lab5' ? 'var(--primary)' : 'var(--text-muted)'
                      }} />
                      Лаб 5
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-button ${activeLabTab === 'lab6' ? 'active' : ''}`}
                      onClick={() => setActiveLabTab('lab6')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%'
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: activeLabTab === 'lab6' ? 'var(--primary)' : 'var(--text-muted)'
                      }} />
                      Лаб 6
                    </button>
                  </li>
                </ul>
              )}
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
            <div className="grid-cols-3">
              <div className="card">
                <div className="card-icon-container emerald">
                  <Layers size={24} />
                </div>
                <h3 className="card-title">Frontend Клієнт</h3>
                <p className="card-text" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  <strong>Обґрунтування вибору:</strong> Next.js обрано для поєднання швидкості SSR (початкове рендерення для SEO та швидкості завантаження) з гнучкістю SPA на React. TypeScript забезпечує строгу типізацію та зменшує кількість помилок на етапі написання коду. Ant Design v5 обрано як провідну UI-бібліотеку з готовими доступними компонентами та гнучкою системою тем.
                </p>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                <p className="card-text" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  <strong>Обґрунтування вибору:</strong> Node.js та Express є де-факто стандартом для легковагових високопродуктивних мікросервісів та API завдяки неблокуючому вводу-виводу. Використання TypeScript на бекенді дозволяє мати спільні типи з фронтендом, спрощуючи обмін даними. База даних у пам'яті (In-Memory) обрана для швидкого старту проєкту без потреби розгортання та конфігурації громіздких СУБД.
                </p>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li><strong>Express & TypeScript</strong> — модульна архітектура контролерів і роутів.</li>
                  <li><strong>Swagger UI</strong> — інтерактивна JSDoc-документація на `/api-docs`.</li>
                  <li><strong>JWT & Bcrypt</strong> — безпечний вхід та шифрування паролів користувачів.</li>
                  <li><strong>Middlewares безпеки</strong> — Helmet, CORS та Express Rate Limit.</li>
                  <li><strong>Express Validator</strong> — валідація тіла запитів перед записом.</li>
                </ul>
              </div>

              <div className="card">
                <div className="card-icon-container purple" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                  <Container size={24} />
                </div>
                <h3 className="card-title">Docker та Стек</h3>
                <p className="card-text" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  <strong>Обґрунтування вибору:</strong> Docker обрано для створення ізольованих контейнерів клієнта та сервера, що повністю усуває проблему "працює на моїй машині". Завдяки Docker Compose весь стек запускається однією командою з автоматичним налаштуванням зв'язків. Оптимізація multi-stage збірки дозволяє отримати мінімальний розмір продакшн-образів.
                </p>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li><strong>Docker & Compose</strong> — оркестрація та контейнеризація всього стеку.</li>
                  <li><strong>Multi-stage Build</strong> — легковагові, безпечні продакшн-образи.</li>
                  <li><strong>Ізольовані мережі</strong> — внутрішній зв'язок між клієнтом та API.</li>
                  <li><strong>Hot-Reload Volumes</strong> — миттєве оновлення коду під час розробки.</li>
                  <li><strong>Nginx (опціонально)</strong> — проксіювання та роздача статики.</li>
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
              Візуальна демонстрація роботи сторінок додатку Next.js:
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
                <HelpCircle /> Що це за проєкт і що саме запускається?
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

        {activeTab === 'labs' && (
          <section>
            <div className="header-section">
              <span className="header-tag" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>Звіти з навчання</span>
              <h1 className="header-title">Лабораторні роботи</h1>
              <p className="header-subtitle">
                Аналіз виконання лабораторних робіт та демонстрація реалізованого функціоналу в проєкті Аптека.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <button 
                onClick={() => setActiveLabTab('lab1')} 
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: activeLabTab === 'lab1' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: activeLabTab === 'lab1' ? 'var(--primary-light)' : 'transparent',
                  color: activeLabTab === 'lab1' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Лабораторна робота №1
              </button>
              <button 
                onClick={() => setActiveLabTab('lab2')} 
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: activeLabTab === 'lab2' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: activeLabTab === 'lab2' ? 'var(--primary-light)' : 'transparent',
                  color: activeLabTab === 'lab2' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Лабораторна робота №2
              </button>
              <button 
                onClick={() => setActiveLabTab('lab3')} 
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: activeLabTab === 'lab3' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: activeLabTab === 'lab3' ? 'var(--primary-light)' : 'transparent',
                  color: activeLabTab === 'lab3' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Лабораторна робота №3
              </button>
              <button 
                onClick={() => setActiveLabTab('lab4')} 
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: activeLabTab === 'lab4' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: activeLabTab === 'lab4' ? 'var(--primary-light)' : 'transparent',
                  color: activeLabTab === 'lab4' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Лабораторна робота №4
              </button>
              <button 
                onClick={() => setActiveLabTab('lab5')} 
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: activeLabTab === 'lab5' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: activeLabTab === 'lab5' ? 'var(--primary-light)' : 'transparent',
                  color: activeLabTab === 'lab5' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Лабораторна робота №5
              </button>
              <button 
                onClick={() => setActiveLabTab('lab6')} 
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: activeLabTab === 'lab6' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: activeLabTab === 'lab6' ? 'var(--primary-light)' : 'transparent',
                  color: activeLabTab === 'lab6' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Лабораторна робота №6
              </button>
            </div>

            {activeLabTab === 'lab1' && (
              <div>
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary)', borderLeft: '4px solid var(--primary)' }}>
                  <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Лабораторна робота №1. Основи React. Створення веб-додатку для замовлення ліків</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <strong>Мета роботи:</strong> формування навичок розробки односторінкового веб-додатку (SPA) на React: компоненти та пропси, стан і контекст, маршрутизація, робота з формами та валідацією, взаємодія з API, управління «кошиком» і збереження стану.
                  </p>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📋 Статус та файли реалізації завдань</h3>
                <div className="table-container" style={{ marginBottom: '3rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Завдання (Лабораторна 1)</th>
                        <th style={{ width: '15%' }}>Статус</th>
                        <th style={{ width: '45%' }}>Де реалізовано в проєкті</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Ініціалізація та структура</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vite/CRA, структура /src, FSD архітектура</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          <ul>
                            <li>Використано <strong>Next.js (App Router)</strong> та TypeScript.</li>
                            <li>Структура розбита по шарах **Feature-Sliced Design (FSD)**: `app`, `pages-flat`, `widgets`, `features`, `entities`, `shared`.</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Базові сторінки та маршрутизація</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Home, Catalog, Cart, Checkout, About + роутинг</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          <ul>
                            <li>Головна сторінка: <code>frontend/src/pages-flat/home/ui/HomePage.tsx</code></li>
                            <li>Каталог: <code>frontend/src/pages-flat/catalog/ui/CatalogPage.tsx</code></li>
                            <li>Кошик: <code>frontend/src/pages-flat/cart/ui/CartPage.tsx</code></li>
                            <li>Оформлення: <code>frontend/src/pages-flat/checkout/ui/CheckoutPage.tsx</code></li>
                            <li>Про нас: <code>frontend/src/pages-flat/about/ui/AboutPage.tsx</code></li>
                            <li>Роутинг: Next.js App Router в <code>frontend/src/app/</code></li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Компонент MedicineCard</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Картка ліків: назва, ціна, наявність, кнопка додавання</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Компонент <code>frontend/src/entities/medicine/ui/MedicineCard.tsx</code> відображає назву, виробника, ціну, залишок на складі та кнопку додавання.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Пошук та фільтрація ліків</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Пошук, фільтр за категорією, Debounce 300мс</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          У <code>frontend/src/pages-flat/catalog/ui/CatalogPage.tsx</code> реалізовано фільтрацію за формами випуску (Radio) та пошуковий рядок з debounce ефектом в 300мс через <code>useEffect</code>.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Глобальний стан кошика та localStorage</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Context+useReducer або альтернатива, збереження стану</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Замість простішого Context+Reducer використано професійний **Redux Toolkit** у <code>frontend/src/entities/cart/model/cartSlice.ts</code>. Здійснюється автоматичне збереження стану кошика в <code>localStorage</code> та відновлення стану на стороні клієнта.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Форма Checkout та валідація</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Збір даних, маска телефону, email валідація</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Форма в <code>frontend/src/pages-flat/checkout/ui/CheckoutPage.tsx</code>. Валідація полів ПІБ, email (вбудована валідація AntD) та перевірка регулярним виразом для українських мобільних номерів: <code>^\+?3?8?(0\d{9})$</code>.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Взаємодія з API та індикатори станів</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Запити GET/POST, loading, error, success індикатори</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Реалізовано через **RTK Query** (`useGetMedicinesQuery`, `useCreateOrderMutation`).
                          - Спінер завантаження `Spin` при завантаженні.
                          - `Result status="success"` при успішному замовленні із виводом номера замовлення.
                          - Спливаючі сповіщення `message.error` при помилці.
                          - Списання товару зі складу при замовленні на бекенді в <code>backend/src/controllers/order.controller.ts</code>.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Доступність (Accessibility)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ARIA-атрибути, керування фокусом</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Компоненти Ant Design генерують повністю доступну розмітку з підтримкою ARIA-атрибутів та коректним фокусуванням елементів форм при навігації клавіатурою.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="card" style={{ marginBottom: '2.5rem', background: 'rgba(0, 184, 148, 0.05)', borderColor: 'rgba(0, 184, 148, 0.2)' }}>
                  <h3 style={{ color: '#00b894', marginTop: 0 }}>🎁 Індивідуальний варіант (закінчується на 8-9)</h3>
                  <p>
                    <strong>Завдання:</strong> Реалізувати режим «тільки перегляд» при відсутності на складі (disabled кнопка, бейдж «Немає»).
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <strong>Реалізація:</strong>
                  </p>
                  <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <li>У файлі <code>frontend/src/entities/medicine/ui/MedicineCard.tsx:27</code> визначається прапорець <code>isOutOfStock = medicine.inStock &lt;= 0</code>.</li>
                    <li>Якщо товару немає в наявності, картка огортається в <code>Badge.Ribbon</code> з текстом <strong>"Немає в наявності"</strong> та червоним кольором (<code>red</code>).</li>
                    <li>Кнопка додавання до кошика отримує властивість <code>{"disabled={isOutOfStock}"}</code> (<code>frontend/src/entities/medicine/ui/MedicineCard.tsx:159</code>) та змінює свій текст на <strong>"Немає в наявності"</strong>.</li>
                    <li>Додатково підтримується перевірка <code>isMaxStockReached</code>, яка блокує кнопку та виводить помаранчевий бейдж <strong>"Макс. у кошику"</strong>, якщо користувач намагається додати більше одиниць товару, ніж є в наявності на складі.</li>
                  </ol>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📚 Відповіді на самостійну роботу</h3>
                
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>1. Патерни керування станом у React: Context/Reducer vs. Zustand/Redux</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Для невеликого інтернет-магазину ліків було обрано **Redux Toolkit**. Хоча **Context + useReducer** є вбудованим механізмом, він страждає від проблеми *непотрібного рендерингу (unnecessary re-renders)*: при зміні будь-какого поля в кошику, всі компоненти, що використовують Context, перемальовуються, якщо не розбивати контексти на частини.
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    **Redux Toolkit** вирішує це завдяки селекторам (`useSelector`), які автоматично оновлення UI. Окрім того, Redux Toolkit надає потужні засоби розробника (Redux DevTools), що робить процес відлагодження значно простішим, та інтегрується з RTK Query для кешування мережевих запитів, що зменшує навантаження на API.
                  </p>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>2. Вимоги до доступності форми замовлення (WCAG 2.1 AA)</h4>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                    <li><strong>Контрастність (Contrast):</strong> Коефіцієнт контрасту між текстом та фоном у полях вводу становить більше 4.5:1.</li>
                    <li><strong>Мітки полів (Labels):</strong> Кожне текстове поле має чітку мітку (<code>&lt;label&gt;</code>), пов'язану з <code>input</code> через ID. Це дозволяє екранним зчитувачам (Screen Readers) правильно оголошувати призначення полів.</li>
                    <li><strong>Повідомлення про помилки (Error messages):</strong> Помилки валідації виникають динамічно, підсвічуються червоним та мають асоційовані ARIA-повідомлення, що попереджають користувача про невірний формат введення.</li>
                    <li><strong>Навігація з клавіатури (Keyboard Navigation):</strong> Всі поля форми та кнопки доступні для фокусування за допомогою клавіші `Tab`, а підтвердження форми можливе натисканням клавіші `Enter`.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeLabTab === 'lab2' && (
              <div>
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--accent-purple)', borderLeft: '4px solid var(--accent-purple)' }}>
                  <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Лабораторна робота №2. Робота з HTTP-запитами та формами у вебдодатку</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <strong>Мета роботи:</strong> формування практичних навичок роботи з HTTP-запитами (GET, POST, PUT, DELETE) у React-застосунку, а також створення та обробки форм із клієнтською валідацією і передачею даних на сервер.
                  </p>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📋 Статус та файли реалізації завдань</h3>
                <div className="table-container" style={{ marginBottom: '3rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Завдання (Лабораторна 2)</th>
                        <th style={{ width: '15%' }}>Статус</th>
                        <th style={{ width: '45%' }}>Де реалізовано в проєкті</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Вибір інструменту запитів</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Axios або Fetch API</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Для запитів до API було обрано **Redux Toolkit Query (RTK Query)**, який використовує вбудований <code>fetch API</code> під капотом.
                          Конфігурація знаходиться в <code>frontend/src/shared/api/baseApi.ts</code>.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Отримання каталогу ліків (GET /medicines)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Отримання списку ліків з API</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Метод <code>getMedicines</code> визначений у <code>frontend/src/entities/medicine/api/medicineApi.ts</code> та використовується через хук <code>useGetMedicinesQuery</code> в <code>frontend/src/pages-flat/catalog/ui/CatalogPage.tsx</code>.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Відображення у вигляді карток</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Картки або таблиця з даними</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Картки ліків рендерить компонент <code>frontend/src/entities/medicine/ui/MedicineCard.tsx</code>. Вони виводяться у вигляді адаптивної сітки (Grid) у каталозі.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Індикатори станів (loading, error, success)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Стан завантаження, помилки, успіху</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          У <code>frontend/src/pages-flat/catalog/ui/CatalogPage.tsx</code> реалізовано відображення спінера <code>&lt;Spin&gt;</code> при завантаженні та вивід сповіщень про помилку при збої запиту.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Детальна інформація (GET /medicines/:id)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Перегляд конкретного товару за ID</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Метод <code>getMedicineById</code> у <code>frontend/src/entities/medicine/api/medicineApi.ts</code>. Саму сторінку деталей реалізовано в <code>frontend/src/pages-flat/medicine-details/ui/MedicineDetailsPage.tsx</code>.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Форма додавання товару та POST /medicines</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Створення нового товару через POST</span></td>
                        <td><span className="badge info">Частково (Бекенд)</span></td>
                        <td>
                          Маршрут та обробник запиту POST <code>/api/medicines</code> повністю реалізовано на бекенді в <code>backend/src/routes/medicine.routes.ts</code> та <code>backend/src/controllers/medicine.controller.ts</code>. Інтерфейс додавання для адміністратора на фронтенді заплановано до реалізації.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Редагування (PUT) та Видалення (DELETE)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Редагування та видалення за ID</span></td>
                        <td><span className="badge info">Частково (Бекенд)</span></td>
                        <td>
                          Обробники PUT <code>/api/medicines/:id</code> та DELETE <code>/api/medicines/:id</code> реалізовано на бекенді в <code>backend/src/controllers/medicine.controller.ts</code>. Клієнтська адмін-панель для редагування запланована в майбутніх релізах.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📚 Відповіді на самостійну роботу</h3>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>1. Порівняння методів HTTP (GET, POST, PUT, PATCH, DELETE)</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                    У вебдодатках було використано такі HTTP-методи для взаємодії з API:
                  </p>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                    <li><strong>GET:</strong> Запит на отримання ресурсів. Безпечний та ідемпотентний. Наприклад, <code>GET /api/medicines</code> повертає каталог ліків.</li>
                    <li><strong>POST:</strong> Створення нового ресурсу. Небезпечний та неідемпотентний. Наприклад, <code>POST /api/orders</code> створює нове замовлення.</li>
                    <li><strong>PUT:</strong> Оновлення ресурсу або створення нового з повним заміщенням тіла. Ідемпотентний. Використовується для повного перезапису ліків.</li>
                    <li><strong>PATCH:</strong> Часткове оновлення ресурсу. Не обов'язково ідемпотентний. Використовується для точкової зміни полів (наприклад, зміна залишку на складі).</li>
                    <li><strong>DELETE:</strong> Видалення ресурсу. Ідемпотентний. Видаляє товар за ідентифікатором.</li>
                  </ul>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>2. Вимоги безпеки при роботі з формами та HTTP-запитами</h4>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                    <li><strong>XSS (Cross-Site Scripting):</strong> Захист від впровадження шкідливого HTML/JS. React автоматично екранує всі вирази в JSX. Додатково на бекенді впроваджено очищення вхідних текстових даних.</li>
                    <li><strong>CSRF (Cross-Site Request Forgery):</strong> Для захисту сесійних запитів авторизація побудована на базі HTTP-заголовків (Bearer JWT-токени), що робить запити захищеними від автоматичного надсилання браузером міжсайтових cookie.</li>
                    <li><strong>Валідація на клієнті та сервері:</strong> Клієнтська валідація побудована на базі правил <code>antd Form</code> для покращення користувацького досвіду, проте серверна валідація в <code>backend/src/controllers/medicine.controller.ts</code> є основним рубежем безпеки та перевіряє цілісність типів та обов'язковість полів.</li>
                  </ul>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>3. Пошук товарів за ключовим словом (GET /medicines?search=...)</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Реалізовано надсилання параметра <code>search</code> при GET-запиті. При зміні значення у полі пошуку оновлюється URL, що викликає повторний запит через RTK Query з параметром фільтрації на сервері в файлі <code>frontend/src/pages-flat/catalog/ui/CatalogPage.tsx</code>.
                  </p>
                </div>
              </div>
            )}

            {activeLabTab === 'lab3' && (
              <div>
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--accent-purple)', borderLeft: '4px solid var(--accent-purple)' }}>
                  <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Лабораторна робота №3. Стан і контекст у React (useState, useEffect, Context API; управління кошиком у додатку)</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <strong>Мета роботи:</strong> формування практичних навичок використання стану й контексту в React-застосунках; оволодіння методами управління локальним та глобальним станом; реалізація функціоналу кошика у вебдодатку.
                  </p>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📋 Статус та файли реалізації завдань</h3>
                <div className="table-container" style={{ marginBottom: '3rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Завдання (Лабораторна 3)</th>
                        <th style={{ width: '15%' }}>Статус</th>
                        <th style={{ width: '45%' }}>Де реалізовано в проєкті</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Каталог товарів та локальний стан</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Картка ліків, useState для кількості</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          <ul>
                            <li>Відображення каталогу: <code>frontend/src/pages-flat/catalog/ui/CatalogPage.tsx</code></li>
                            <li>Картка ліків: <code>frontend/src/entities/medicine/ui/MedicineCard.tsx</code></li>
                            <li>Локальний стан кількості в картці деталей: <code>frontend/src/pages-flat/medicine-details/ui/MedicineDetailsPage.tsx</code></li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Ефекти та localStorage</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>useEffect для збереження стану, повідомлення про зміну</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          <ul>
                            <li>Збереження у localStorage: <code>frontend/src/entities/cart/model/cartSlice.ts</code></li>
                            <li>Клієнтська гідрація без Hydration Mismatch: <code>frontend/src/app/providers/StoreProvider.tsx</code></li>
                            <li>Спливаючі повідомлення <code>message.success</code> при змінах кошика.</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Глобальний стан кошика (Redux)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Redux RTK як альтернатива Context API</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Для глобального стану було обрано **Redux Toolkit**.
                          <ul>
                            <li>Сховище та Slices: <code>frontend/src/entities/cart/model/cartSlice.ts</code></li>
                            <li>Глобальний провайдер: <code>frontend/src/app/providers/StoreProvider.tsx</code></li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Кількість товарів у хедері</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Вивід лічильника у верхній панелі</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          У компоненті <code>frontend/src/widgets/header/ui/Header.tsx</code> підраховується сумарна кількість одиниць товарів у кошику та виводиться поверх іконки кошика.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Сторінка кошика</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Список обраного, кількість, загальна вартість</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Сторінка кошика реалізована у <code>frontend/src/pages-flat/cart/ui/CartPage.tsx</code>. Відображає перелік ліків із підрахунком вартості для кожного найменування.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Редагування кількості та очищення кошика</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Кнопки зміни кількості, очищення кошика</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Редагування кількості та видалення/очищення кошика реалізовано за допомогою dispatch відповідних екшенів (<code>updateQuantity</code>, <code>removeItem</code>, <code>clearCart</code>) з файлу <code>frontend/src/entities/cart/model/cartSlice.ts</code>.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Індівидуальний варіант (Знижка 10%)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10% знижки при сумі від 1000 грн</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Реалізовано автоматичний перерахунок суми замовлення:
                          <ul>
                            <li>На фронтенді у кошику: <code>frontend/src/pages-flat/cart/ui/CartPage.tsx</code></li>
                            <li>При оформленні замовлення: <code>frontend/src/pages-flat/checkout/ui/CheckoutPage.tsx</code></li>
                            <li>На стороні сервера (остаточний розрахунок): <code>backend/src/controllers/order.controller.ts</code></li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📚 Відповіді на самостійну роботу</h3>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>1. Локальний vs Глобальний стан у React</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    <strong>Локальний стан (Local State)</strong> призначений для керування даними, які потрібні лише одному конкретному компоненту або його безпосереднім нащадкам (наприклад, стан відкриття випадаючого списку, введені дані форми, активна вкладка). Створюється за допомогою хука <code>useState</code> чи <code>useReducer</code>.
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    <strong>Глобальний стан (Global State)</strong> потрібен, коли дані мають бути доступні багатьом компонентам у різних гілках дерева інтерфейсу (наприклад, кошик товарів, інформація про поточного користувача, налаштування теми). Зберігання таких даних у глобальному сховищі запобігає проблемі <em>prop drilling</em> (передачі параметрів через багато рівнів вкладеності).
                  </p>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>2. Порівняння Context API та Redux (Redux Toolkit)</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '8px', fontWeight: 600 }}>Критерій порівняння</th>
                        <th style={{ padding: '8px', fontWeight: 600 }}>Context API</th>
                        <th style={{ padding: '8px', fontWeight: 600 }}>Redux Toolkit (RTK)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Продуктивність</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Гірша при частих оновленнях. Зміна контексту перерендерить всіх споживачів.</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Висока. Селектори (useSelector) оновлюють лише ті компоненти, які споживають змінене поле.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Налаштування</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Низька складність, вбудований інструмент React.</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Вимагає встановлення додаткових бібліотек та конфігурації Store.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Відлагодження</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Ускладнене відстежування історії оновлень стану.</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Відмінне завдяки Redux DevTools (підтримка Time Travel Debugging).</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Масштабованість</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Підходить для рідко оновлюваних даних (тема, мова).</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Ідеально для динамічного та великого стану (кошик, замовлення).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>3. Опис реалізації системи знижок</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Для виконання індивідуального завдання було реалізовано автоматичне надання знижки розміром <strong>10%</strong> при перевищенні загальної суми товарів у кошику порогу в <strong>1000 грн</strong>.
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    На клієнтській стороні в кошику (<code>frontend/src/pages-flat/cart/ui/CartPage.tsx</code>) та на сторінці оформлення (<code>frontend/src/pages-flat/checkout/ui/CheckoutPage.tsx</code>) додано візуальний блок із сумою знижки та оновлено кінцеву вартість. З метою запобігання фальсифікації даних на стороні клієнта, фінальний розрахунок суми замовлення з аналогічною знижкою повторно проводиться на сервері (<code>backend/src/controllers/order.controller.ts</code>) перед записом замовлення до бази даних.
                  </p>
                </div>
              </div>
            )}

            {activeLabTab === 'lab4' && (
              <div>
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary)', borderLeft: '4px solid var(--primary)' }}>
                  <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Лабораторна робота №4. Робота з локальним сховищем</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <strong>Мета роботи:</strong> сформувати практичні навички використання локального сховища браузера для збереження даних користувача; навчитися зберігати та відновлювати стан додатку після перезавантаження сторінки.
                  </p>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📋 Статус та файли реалізації завдань</h3>
                <div className="table-container" style={{ marginBottom: '3rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Завдання (Лабораторна 4)</th>
                        <th style={{ width: '15%' }}>Статус</th>
                        <th style={{ width: '45%' }}>Де реалізовано в проєкті</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Форма та localStorage</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Введення імені, email, телефону та їх збереження</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          <ul>
                            <li>Форма на сторінці профілю: <code>frontend/src/pages-flat/profile/ui/ProfilePage.tsx</code></li>
                            <li>Збереження у <code>localStorage</code> за ключем <code>'user_contact_data'</code></li>
                            <li>Автоматичне відновлення даних у полях форми при монтуванні сторінки</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Збереження стану кошика</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Кошик у localStorage, очищення кошика</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          <ul>
                            <li>Збереження кошика: <code>frontend/src/entities/cart/model/cartSlice.ts</code> за ключем <code>'pharmacy_cart'</code></li>
                            <li>Дані кошика автоматично очищуються після успішного оформлення замовлення або видалення товарів</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Робота з sessionStorage</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Сесійні токени/прапорці, статус входу на reload</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          <ul>
                            <li>Статус сесії та унікальний <code>session_id</code> зберігаються у <code>sessionStorage</code> для внутрішнього відстеження сеансу</li>
                            <li>Збережений стан входу автоматично відновлюється при перезавантаженні сторінки або повторному відкритті</li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📚 Відповіді на самостійну роботу</h3>
                
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>Порівняння технологій збереження даних на клієнті</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '8px', fontWeight: 600 }}>Характеристика</th>
                        <th style={{ padding: '8px', fontWeight: 600 }}>localStorage</th>
                        <th style={{ padding: '8px', fontWeight: 600 }}>sessionStorage</th>
                        <th style={{ padding: '8px', fontWeight: 600 }}>Cookies</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Обсяг даних</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>~5-10 МБ</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>~5 МБ</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>~4 КБ</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Час зберігання</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Безстроково (поки не буде видалено кодом чи користувачем)</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>До закриття вкладки або вікна браузера</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Встановлюється розробником (Expires / Max-Age)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Доступність на сервері</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Тільки на стороні клієнта (не передаються серверу)</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Тільки на стороні клієнта (не передаються серверу)</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Автоматично надсилаються на сервер з кожним HTTP-запитом</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Безпека</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Вразливий до XSS-атак (JS має прямий доступ)</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Вразливий до XSS-атак (JS має прямий доступ)</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Можна захистити прапорцями <code>HttpOnly</code> та <code>Secure</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>Висновки</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Для збереження глобальних користувацьких налаштувань, контактів чи стану кошика, які мають зберігатися протягом тривалого часу, найкраще підходить <strong>localStorage</strong>.
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    Для тимчасових токенів сесії чи прапорців входу, які мають бути видалені після завершення сеансу роботи з сайтом, раціонально використовувати <strong>sessionStorage</strong>.
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    Для збереження авторизаційних токенів (JWT) у комерційних застосунках безпечніше використовувати <strong>HTTP-only Cookies</strong>, що повністю нівелює можливість крадіжки токену через зловмисні скрипти.
                  </p>
                </div>
              </div>
            )}

            {activeLabTab === 'lab5' && (
              <div>
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary)', borderLeft: '4px solid var(--primary)' }}>
                  <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Лабораторна робота №5. Маршрутизація у React за допомогою React Router</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <strong>Мета роботи:</strong> сформувати практичні навички роботи з маршрутизацією у React-застосунках, навчитися організовувати багатосторінкову структуру вебдодатку та реалізовувати навігацію між різними сторінками.
                  </p>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📋 Статус та файли реалізації завдань</h3>
                <div className="table-container" style={{ marginBottom: '3rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Завдання (Лабораторна 5)</th>
                        <th style={{ width: '15%' }}>Статус</th>
                        <th style={{ width: '45%' }}>Де реалізовано в проєкті</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Налаштування роутера (BrowserRouter / App Router)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Вхідна точка роутера, оголошення маршрутів</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Проєкт використовує сучасний <strong>Next.js App Router</strong> (файлова система маршрутизації як нативний SPA-аналог <code>react-router-dom</code> для Next.js):
                          <ul>
                            <li>Маршрути оголошені структурою папок у <code>frontend/src/app/</code></li>
                            <li>Кореневий макет та ініціалізація: <code>frontend/src/app/layout.tsx</code></li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Реалізація сторінок додатку</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Catalog, Cart, Checkout, About</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Створені відповідні Next.js сторінки, які огорнуті у FSD-шари:
                          <ul>
                            <li>Catalog: <code>frontend/src/app/catalog/page.tsx</code></li>
                            <li>Cart: <code>frontend/src/app/cart/page.tsx</code></li>
                            <li>Checkout: <code>frontend/src/app/checkout/page.tsx</code></li>
                            <li>About: <code>frontend/src/app/about/page.tsx</code></li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Організація SPA-навігації</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Переходи без перезавантаження сторінки, підсвічування активних посилань</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Навігаційне меню у хедерах здійснює переходи без перезавантаження завдяки <code>Link</code> з <code>next/link</code>.
                          Підсвічування активних пунктів реалізовано порівнянням поточного шляху з хука <code>usePathname()</code> у <code>frontend/src/widgets/header/ui/Header.tsx</code>.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Динамічна маршрутизація</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Шлях /catalog/:id для деталей товару</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Реалізовано динамічний роут <code>frontend/src/app/catalog/[id]/page.tsx</code>. Компонент зчитує параметр <code>id</code> та відображає картку деталей препарату <code>frontend/src/pages-flat/medicine-details/ui/MedicineDetailsPage.tsx</code>.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Обробика невідомих маршрутів (404 сторінка)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Рендеринг 404 помилки</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Для невідомих маршрутів Next.js автоматично рендерить вбудовану сторінку 404 Not Found.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Захищений маршрут («Профіль»)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Заборона доступу для гостей</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Реалізовано у <code>frontend/src/app/profile/page.tsx</code>. Кабінет користувача захищено від неавторизованого перегляду; гостям пропонується увійти, а авторизованим користувачам показується персональний кабінет з історією замовлень.
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Навігація «Breadcrumbs» (Хлібні крихти)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Навігаційний ланцюжок</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Віджет <code>frontend/src/widgets/breadcrumbs/ui/Breadcrumbs.tsx</code> динамічно будує ланцюжок переходів на основі поточного шляху та Ant Design Breadcrumb.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📚 Відповіді на самостійну роботу</h3>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>1. Клієнтська (CSR) vs Серверна (SSR) маршрутизація</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '8px', fontWeight: 600 }}>Характеристика</th>
                        <th style={{ padding: '8px', fontWeight: 600 }}>Клієнтська (CSR/SPA Routing)</th>
                        <th style={{ padding: '8px', fontWeight: 600 }}>Серверна (SSR/Traditional)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Процес навігації</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Перехоплюється клієнтським JS (History API). Оновлюється лише частина DOM без перезавантаження сторінки.</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Браузер робить повноцінний HTTP-запит. Сторінка повністю перезавантажується.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Швидкість переходу</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Миттєва (долі секунди), оскільки завантажуються лише дані.</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Повільніша, залежить від часу відповіді сервера та парсингу HTML.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Збереження стану UI</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Стан зберігається у пам'яті (напр., Redux/React State), оскільки контекст не втрачається.</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Стан втрачається повністю. Потребує сесій, cookies чи повторного запиту даних.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}><strong>Навантаження на сервер</strong></td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Мінімальне (сервер повертає лише JSON дані).</td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>Високе (сервер має рендерити та віддавати цілу HTML сторінку при кожному кліку).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>2. Опис реалізації захищеного маршруту</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Захист маршруту реалізовано умовним рендерингом у компоненті <code>ProfilePage.tsx</code> на основі сесії <code>Redux store</code> (slice <code>userSlice</code>).
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    Коли користувач є гостем (неавторизованим), замість вмісту кабінету рендериться закрита картка із повідомленням <em>"Ви увійшли як Гість"</em> та кнопками переходу на вхід та реєстрацію. Після проходження авторизації з JWT-токеном, стан <code>isAuthenticated</code> стає <code>true</code>, і кабінет відображає персональні контактні дані користувача та його історію замовлень.
                  </p>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>3. Опис роботи системи хлібних крихт (Breadcrumbs)</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Система хлібних крихт у нашому SPA реалізована динамічно у файлі <code>Breadcrumbs.tsx</code>. Вона відстежує зміни URL через хук <code>usePathname()</code>.
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    Шлях розбивається на сегменти, які відображаються у навігаційному ланцюжку. Кожен елемент крихт є посиланням на відповідний розділ сайту, крім останнього (поточного) елемента. Для зручності сегменти підміняються зрозумілими назвами (наприклад, <code>catalog</code> перетворюється у <code>"Каталог ліків"</code>), а для деталей ліків виводиться дружній текст <code>"Деталі препарату"</code>.
                  </p>
                </div>

                <div className="card">
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>Висновки</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Завдяки використанню клієнтської SPA-маршрутизації було забезпечено високу швидкість роботи інтерфейсу та згладжені анімовані переходи без перезавантаження сторінки. Організація динамічних та захищених роутів надала можливість гнучко керувати відображенням даних залежно від сесії користувача та вибраного товару.
                  </p>
                </div>
              </div>
            )}

            {activeLabTab === 'lab6' && (
              <div>
                <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary)', borderLeft: '4px solid var(--primary)' }}>
                  <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Лабораторна робота №6. UI/UX та компоненти інтерфейсу</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <strong>Мета роботи:</strong> сформувати у студентів практичні навички розробки зручних та зрозумілих інтерфейсів користувача у React-додатках; навчитися реалізовувати модальні вікна, повідомлення про події, адаптивний дизайн і навігаційні елементи для покращення користувацького досвіду (UX).
                  </p>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📋 Статус та файли реалізації завдань</h3>
                <div className="table-container" style={{ marginBottom: '3rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Завдання (Лабораторна 6)</th>
                        <th style={{ width: '15%' }}>Статус</th>
                        <th style={{ width: '45%' }}>Де реалізовано в проєкті</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Навігаційне меню (Navbar / Header)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Посилання, active state, адаптивне меню</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          <ul>
                            <li>Посилання на основні сторінки та active state (usePathname) реалізовано у <code>frontend/src/widgets/header/ui/Header.tsx</code>.</li>
                            <li>Адаптивність забезпечується медіа-запитами та класами <code>.desktop-only</code> та <code>.mobile-only</code> в <code>frontend/src/app/globals.css</code>.</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Модальне вікно (Modal)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Універсальне вікно підтвердження дій</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Створено кастомний компонент модального вікна:
                          <ul>
                            <li>Компонент: <code>frontend/src/shared/ui/modal/Modal.tsx</code></li>
                            <li>Стилі: <code>frontend/src/shared/ui/modal/Modal.css</code></li>
                            <li>Коректно обробляє кліки поза вікном (overlay), клавішу <code>Escape</code>, містить focus trap та блокування скролу body.</li>
                            <li>Інтегровано у кошик: <code>frontend/src/pages-flat/cart/ui/CartPage.tsx</code> для підтвердження видалення товару та очищення кошика.</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Повідомлення про події (Alert/Toast)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toast сповіщення з таймером автозникнення</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Реалізовано систему глобальних спливаючих сповіщень:
                          <ul>
                            <li>Context провайдер: <code>frontend/src/shared/ui/toast/ToastContext.tsx</code></li>
                            <li>Стилі та анімації: <code>frontend/src/shared/ui/toast/Toast.css</code></li>
                            <li>Ініціалізовано у кореневому макеті <code>layout.tsx</code>.</li>
                            <li>Використовується на сторінці кошика (CartPage) та оформлення замовлення (CheckoutPage) при успішних діях або помилках валідації.</li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Індивідуальне завдання (Варіанти 8-9)</strong><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Мобільний Drawer з повним меню</span></td>
                        <td><span className="badge public">Виконано</span></td>
                        <td>
                          Реалізовано адаптивне Drawer-меню для мобільних пристроїв на основі Ant Design <code>Drawer</code>:
                          <ul>
                            <li>Кнопка-бургер та Drawer знаходяться у <code>frontend/src/widgets/header/ui/Header.tsx</code>.</li>
                            <li>Drawer містить усі посилання, індикатор авторизованого користувача та кнопку швидкого виходу (Logout).</li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 style={{ marginBottom: '1rem' }}>📚 Відповіді на самостійну роботу</h3>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>1. Принципи проектування доступних модальних вікон (Focus trapping, Escape close, Overlay)</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Для того, щоб модальне вікно було доступним для користувачів з обмеженими можливостями та відповідало WCAG 2.1, необхідно реалізувати такі механізми:
                  </p>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    <li><strong>Утримання фокусу (Focus Trapping):</strong> Фокус клавіатури (Tab) повинен циркулювати виключно всередині модального вікна. Користувач не повинен випадково вийти фокусом на інтерактивні елементи фонової сторінки. При закритті модального вікна фокус обов'язково має повертатися на той елемент, який його відкрив.</li>
                    <li><strong>Закриття за допомогою Escape:</strong> Натискання на клавішу `Escape` має негайно закривати модальне вікно без виконання будь-яких дій. Це стандартна очікувана поведінка.</li>
                    <li><strong>Закриття по кліку на Overlay:</strong> Клік по напівпрозорому задньому фону (overlay/backdrop) також повинен ініціювати закриття, якщо тільки це не модальне вікно з критично важливим вибором.</li>
                    <li><strong>Блокування прокрутки фону:</strong> Коли модальне вікно відкрито, скролінг сторінки (body) має блокуватися (напр., через <code>overflow: hidden</code>), щоб запобігти дезорієнтації користувача при прокручуванні контенту позаду.</li>
                  </ul>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>2. Патерни сповіщень: Toast/Snackbar vs. Dialog/Modal</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Вибір між Toast та Modal залежить від ступеня важливості інформації та необхідності взаємодії з нею:
                  </p>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    <li><strong>Toast/Snackbar:</strong> Використовується для некритичних, швидких повідомлень про статус системи чи результат дії (успішно додано товар, змінено тему, успішно оформлено замовлення). Вони з'являються збоку, не блокують роботу з сайтом і зникають самостійно.</li>
                    <li><strong>Dialog/Modal:</strong> Використовується, коли система потребує негайної уваги користувача та явного вибору (підтвердження видалення товару, очищення всього кошика, попередження про вихід без збереження даних). Блокує решту інтерфейсу доти, доки користувач не зробить вибір.</li>
                  </ul>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>3. Адаптивний дизайн: Техніки створення інтерфейсів, які пристосовуються до розміру екрану</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    У нашому проєкті використано три ключові підходи до забезпечення чуйності інтерфейсу:
                  </p>
                  <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    <li><strong>CSS Media Queries (Медіа-запити):</strong> Використання брейкпойнтів (breakpoints) для ховання, відображення та перекомпонування елементів. Наприклад, класи <code>.desktop-only</code> та <code>.mobile-only</code> регулюють видимість десктопного меню та мобільної кнопки бургер-меню.</li>
                    <li><strong>Гнучка сітка (Grid / Flexbox):</strong> Використання сіток Ant Design (Row/Col) з адаптивними параметрами <code>xs</code>, <code>sm</code>, <code>md</code>, <code>lg</code> дозволяє автоматично переходити від трьох колонок до однієї на мобільних пристроях.</li>
                    <li><strong>Drawer-компоненти для мобільних:</strong> Перенесення всього сайдбар-контенту чи навігаційного меню у висувний Drawer на мобільних екранах для збереження корисної площі екрану.</li>
                  </ul>
                </div>

                <div className="card">
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0' }}>Висновки</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Впровадження кастомних компонентів Modal та Toast, а також переробка Header під адаптивне Drawer-меню значно покращили користувацький досвід (UX). Додаток отримав більш професійний вигляд, надійну систему зворотного зв'язку на дії користувача та повністю підтримує роботу на пристроях з будь-якими екранами, зберігаючи високі стандарти доступності.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
