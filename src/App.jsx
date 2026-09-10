import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  CalendarDays,
  CheckSquare,
  Clapperboard,
  Compass,
  Home,
  ListTodo,
  Search,
  Settings,
  Moon,
  Sun,
} from 'lucide-react'

import { TaskProvider } from './context/TaskContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { WatchlistProvider } from './context/WatchlistContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { ToastProvider } from './context/ToastContext'

import KalistLogo from './components/common/KalistLogo'

import Today from './pages/Today'
import Tasks from './pages/Tasks'
import Watchlist from './pages/Watchlist'
import SettingsPage from './pages/Settings'
import SearchPage from './pages/Search'
import MovieDetails from './pages/MovieDetails'
import TVDetails from './pages/TVDetails'

import './App.css'


// ========================================
// NAVIGATION
// ========================================

const navigation = [
  {
    label: 'Today',
    path: '/today',
    icon: CalendarDays,
  },
  {
    label: 'Tasks',
    path: '/tasks',
    icon: ListTodo,
  },
  {
    label: 'Watchlist',
    path: '/watchlist',
    icon: Clapperboard,
  },
  {
    label: 'Search',
    path: '/search',
    icon: Search,
  },
]

const utilityNavigation = [
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
]


// ========================================
// PAGE COPY
// ========================================

const pageCopy = {
  '/today': {
    eyebrow: 'Your day',
    title: 'Make room for what matters.',
    description:
      'Your daily focus will live here once your task list is ready.',
  },

  '/tasks': {
    eyebrow: 'Task library',
    title: 'A clearer list is a calmer mind.',
    description:
      'Create, organize, and move through your tasks from one focused view.',
  },

  '/watchlist': {
    eyebrow: 'Saved for later',
    title: 'Keep good stories close.',
    description:
      'Your saved movies and shows will have a home here, separate from the noise.',
  },

  '/search': {
    eyebrow: 'Discover',
    title: 'Find something worth watching.',
    description:
      'Search and save movies or shows when the watchlist foundation is ready.',
  },

  '/settings': {
    eyebrow: 'Preferences',
    title: 'Make KALIST yours.',
    description:
      'Your app preferences will be gathered here.',
  },

  '/movie': {
    eyebrow: 'Movie detail',
    title: 'A closer look is coming.',
    description:
      'Movie details will be available here once the watchlist foundation is ready.',
  },

  '/tv': {
    eyebrow: 'TV detail',
    title: 'A closer look is coming.',
    description:
      'TV details will be available here once the watchlist foundation is ready.',
  },

  '/not-found': {
    eyebrow: '404',
    title: 'This page took a wrong turn.',
    description:
      'The page you are looking for does not exist in KALIST yet.',
  },
}


// ========================================
// NOT FOUND
// ========================================

function NotFoundPage() {
  return <PlaceholderPage path="/not-found" />
}


// ========================================
// PLACEHOLDER PAGE
// ========================================

function PlaceholderPage({ path }) {
  const copy = pageCopy[path]

  return (
    <section
      className="placeholder-page"
      aria-labelledby="page-title"
    >
      <div
        className="placeholder-mark"
        aria-hidden="true"
      >
        <Compass
          size={22}
          strokeWidth={1.5}
        />
      </div>

      <p className="eyebrow">
        {copy.eyebrow}
      </p>

      <h1 id="page-title">
        {copy.title}
      </h1>

      <p className="placeholder-description">
        {copy.description}
      </p>

      <span className="phase-note">
        Foundation in place
      </span>
    </section>
  )
}


// ========================================
// HOME PAGE
// ========================================

function HomePage() {
  return (
    <section
      className="home-page"
      aria-labelledby="home-title"
    >
      <div className="home-copy">

        <p className="eyebrow">
          A quieter way to keep up
        </p>

        <h1 id="home-title">
          Plan your day.
          <br />
          <em>Keep the good stuff.</em>
        </h1>

        <p className="home-description">
          KALIST brings daily momentum and your next watch
          together in one considered place.
        </p>

        <NavLink
          className="primary-link"
          to="/today"
        >
          Open today
          <span aria-hidden="true">
            &#8594;
          </span>
        </NavLink>

      </div>

      <div
        className="home-aside"
        aria-label="KALIST principles"
      >

        <div className="aside-rule" />

        <p className="aside-label">
          The essentials
        </p>

        <ul>
          <li>
            <CheckSquare size={16} />
            Daily focus
          </li>

          <li>
            <Clapperboard size={16} />
            Saved stories
          </li>

          <li>
            <Home size={16} />
            One calm place
          </li>
        </ul>

      </div>
    </section>
  )
}


// ========================================
// APP SHELL
// ========================================

function AppShell() {
  const location = useLocation()
  const { t } = useLanguage()

  const pageKind =
    location.pathname.startsWith('/movie/') ||
    location.pathname.startsWith('/tv/')
      ? 'details'
      : location.pathname.slice(1) || 'home'

  return (
    <div className="app-shell">

      {/* ==================================
          DESKTOP SIDEBAR
      ================================== */}

      <aside className="sidebar">

        {/* Brand */}
        <NavLink
          className="brand"
          to="/"
          aria-label="KALIST home"
        >
          <KalistLogo />
        </NavLink>


        {/* Primary Navigation */}
        <div className="sidebar-group">

          <p className="nav-label">
            {t('nav.workspace')}
          </p>

          <nav
            className="primary-nav"
            aria-label="Primary navigation"
          >
            {navigation.map(
              ({
                label,
                path,
                icon: Icon,
              }) => (
                <NavItem
                  key={path}
                  label={t(
                    `nav.${label.toLowerCase()}`
                  )}
                  path={path}
                  Icon={Icon}
                />
              )
            )}
          </nav>

        </div>


        {/* Utility Navigation */}
        <nav
          className="utility-nav"
          aria-label="Utility navigation"
        >
          {utilityNavigation.map(
            ({
              path,
              icon: Icon,
            }) => (
              <NavItem
                key={path}
                label={t('nav.settings')}
                path={path}
                Icon={Icon}
              />
            )
          )}
        </nav>


        {/* Sidebar Status */}
        <div className="sidebar-footer">

          <span
            className="status-dot"
            aria-hidden="true"
          />

          <span>
            {t('nav.personal')}
          </span>

        </div>


        {/* Sidebar Theme Toggle */}
        <div className="sidebar-theme">
          <ThemeToggle />
        </div>

      </aside>


      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <main
        className={`main-content page-shell page-shell--${pageKind}`}
      >

        {/* Mobile Header */}
        <header className="mobile-header">

          <NavLink
            className="brand"
            to="/"
            aria-label="KALIST home"
          >
            <KalistLogo compact />
          </NavLink>


          <div className="mobile-header-actions">

            <span className="mobile-context">
              {t('nav.workspace')}
            </span>

            <ThemeToggle />

          </div>

        </header>


        {/* Routes */}
        <Routes>

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/today"
            element={<Today />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />

          <Route
            path="/watchlist"
            element={<Watchlist />}
          />

          <Route
            path="/search"
            element={<SearchPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />

          <Route
            path="/movie/:id"
            element={<MovieDetails />}
          />

          <Route
            path="/tv/:id"
            element={<TVDetails />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />

        </Routes>


        {/* Footer */}
        <footer className="page-footer">
          KALIST
          <span>/</span>
          {t('nav.footer')}
        </footer>

      </main>


      {/* ==================================
          MOBILE BOTTOM NAVIGATION
      ================================== */}

      <nav
        className="bottom-nav"
        aria-label="Mobile navigation"
      >

        {[
          ...navigation,
          ...utilityNavigation,
        ].map(
          ({
            label,
            path,
            icon: Icon,
          }) => (
            <NavItem
              key={path}
              label={t(
                `nav.${label.toLowerCase()}`
              )}
              path={path}
              Icon={Icon}
            />
          )
        )}

      </nav>

    </div>
  )
}


// ========================================
// NAV ITEM
// ========================================

function NavItem({
  label,
  path,
  Icon,
}) {
  return (
    <NavLink
      className="nav-item"
      to={path}
    >
      <Icon
        size={18}
        strokeWidth={1.7}
      />

      <span>
        {label}
      </span>
    </NavLink>
  )
}


// ========================================
// THEME TOGGLE
// ========================================

function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useTheme()

  const { t } = useLanguage()

  const nextTheme =
    theme === 'dark'
      ? 'light'
      : 'dark'

  const Icon =
    theme === 'dark'
      ? Sun
      : Moon

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >

      <Icon
        size={16}
        strokeWidth={1.8}
      />

      <span>
        {theme === 'dark'
          ? t('nav.light')
          : t('nav.dark')}
      </span>

    </button>
  )
}


// ========================================
// APP
// ========================================

function App() {
  return (
    <LanguageProvider>

      <ToastProvider>

        <ThemeProvider>

          <TaskProvider>

            <WatchlistProvider>

              <BrowserRouter>
                <AppShell />
              </BrowserRouter>

            </WatchlistProvider>

          </TaskProvider>

        </ThemeProvider>

      </ToastProvider>

    </LanguageProvider>
  )
}


export default App