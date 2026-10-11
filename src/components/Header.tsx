import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiFilm, FiTv, FiTrendingUp, FiStar } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navLinks = [
    { path: '/', label: 'Beranda', icon: FiFilm },
    { path: '/movies', label: 'Film', icon: FiFilm },
    { path: '/series', label: 'Series', icon: FiTv },
    { path: '/trending', label: 'Trending', icon: FiTrendingUp },
    { path: '/top-rated', label: 'Top Rated', icon: FiStar },
  ];

  // header solid when scrolled OR mobile menu open (avoid transparent overlay on content)
  const headerBg = isMenuOpen
    ? 'bg-dark-950 border-b border-dark-800 shadow-xl shadow-black/30'
    : isScrolled
      ? 'bg-dark-950/95 backdrop-blur-xl border-b border-dark-800 shadow-lg shadow-black/20'
      : 'bg-dark-950/70 backdrop-blur-md border-b border-dark-800/50';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="MovieFlix Home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
              <FiFilm className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-display font-bold text-xl text-white hidden sm:block">
              MovieFlix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link flex items-center gap-1.5 ${location.pathname === link.path ? 'active' : ''}`}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                <link.icon className="h-4 w-4" aria-hidden="true" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative hidden lg:block" role="search">
              <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-500" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari film, series..."
                className="input-search w-64"
                aria-label="Cari film atau series"
              />
            </form>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-dark-300 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-dark-800 animate-slide-down bg-dark-950/95 backdrop-blur-xl">
            <form onSubmit={handleSearch} className="mb-4 px-4" role="search">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-500" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari film, series..."
                  className="input-search"
                  aria-label="Cari film atau series"
                  autoFocus
                />
              </div>
            </form>
            <div className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`nav-link flex items-center gap-3 px-4 py-3.5 rounded-xl mx-2 transition-all duration-200 ${location.pathname === link.path ? 'bg-dark-800 text-white active' : 'text-dark-300 hover:bg-dark-800/60 hover:text-white'}`}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  <link.icon className="h-5 w-5" aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}