import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SeriesDetailPage from './pages/SeriesDetailPage';
import SearchPage from './pages/SearchPage';
import GenrePage from './pages/GenrePage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MoviesPage type="movie" title="Film" />} />
        <Route path="/series" element={<MoviesPage type="tv" title="Series" />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/series/:id" element={<SeriesDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/genre/:id" element={<GenrePage />} />
        <Route path="/trending" element={<MoviesPage type="movie" title="Trending" />} />
        <Route path="/top-rated" element={<MoviesPage type="movie" title="Top Rated" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;