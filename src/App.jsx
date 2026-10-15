import { useEffect, useMemo, useRef, useState } from 'react';

const titles = [
  {
    title: 'The Last Stand',
    genre: 'Action',
    year: '2024',
    rating: 'TV-MA',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85',
    description: 'When the lights go out, one small town has to decide what it is willing to fight for.',
  },
  {
    title: 'Wild at Heart',
    genre: 'Adventure',
    year: '2023',
    rating: 'PG-13',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=85',
    description: 'A journey off the map brings an unlikely crew closer to home than they expected.',
  },
  {
    title: 'The Deep',
    genre: 'Thriller',
    year: '2024',
    rating: 'TV-14',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85',
    description: 'Far beneath the waves, a research crew discovers something that should have stayed hidden.',
  },
  {
    title: 'Golden Hour',
    genre: 'Drama',
    year: '2022',
    rating: 'PG',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85',
    description: 'A photographer returns to the place that taught her how to see the world differently.',
  },
  {
    title: 'The Great Escape',
    genre: 'Comedy',
    year: '2023',
    rating: 'PG-13',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=85',
    description: 'A very ordinary road trip takes a very unexpected turn.',
  },
  {
    title: 'After the Storm',
    genre: 'Drama',
    year: '2024',
    rating: 'R',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=85',
    description: 'Two strangers start over in a coastal town where everyone knows your story.',
  },
  {
    title: 'Neon City',
    genre: 'Sci-Fi',
    year: '2023',
    rating: 'TV-14',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85',
    description: 'In a city that never sleeps, one night can change everything.',
  },
  {
    title: 'Into the Wild',
    genre: 'Adventure',
    year: '2022',
    rating: 'PG-13',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=85',
    description: 'A wilderness guide leads a group of strangers on the expedition of a lifetime.',
  },
];

const navigation = [
  { label: 'Free Movies & TV', href: '/watch-free' },
  { label: 'Live TV', href: '/live-tv' },
  { label: 'Discover', href: '/discover' },
  { label: 'About Plex', href: '/about' },
];

function getRoutePath(pathname = window.location.pathname) {
  return decodeURIComponent(pathname).replace(/\/+$/, '') || '/watch-free';
}

function Icon({ name, size = 19 }) {
  const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'search') return <svg {...shared}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (name === 'sun') return <svg {...shared}><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>;
  if (name === 'moon') return <svg {...shared}><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" /></svg>;
  if (name === 'play') return <svg {...shared} fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5z" /></svg>;
  if (name === 'pause') return <svg {...shared} fill="currentColor" stroke="none"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>;
  if (name === 'arrow') return <svg {...shared}><path d="M5 12h14m-7-7 7 7-7 7" /></svg>;
  if (name === 'close') return <svg {...shared}><path d="m18 6-12 12M6 6l12 12" /></svg>;
  if (name === 'menu') return <svg {...shared}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  return null;
}

function MovieCard({ movie, onPlay }) {
  return (
    <article className="movie-card reveal">
      <a className="movie-poster" href={`/movie/${encodeURIComponent(movie.title.toLowerCase().replaceAll(' ', '-'))}`} aria-label={`View ${movie.title}`}>
        <img src={movie.image} alt="" loading="lazy" />
        <span className="poster-shade" />
        <span className="movie-rating">{movie.rating}</span>
        <span className="poster-play"><Icon name="play" size={24} /></span>
      </a>
      <div className="movie-meta">
        <div>
          <a className="movie-title" href={`/movie/${encodeURIComponent(movie.title.toLowerCase().replaceAll(' ', '-'))}`}>{movie.title}</a>
          <p>{movie.year} <span>·</span> {movie.genre}</p>
        </div>
        <button className="icon-button card-play" onClick={() => onPlay(movie)} aria-label={`Play ${movie.title}`}><Icon name="play" size={17} /></button>
      </div>
    </article>
  );
}

function PlaybackModal({ movie, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const playerRef = useRef(null);
  const duration = 134;

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setCurrentTime((time) => {
        if (time + 1 >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return time + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const formatTime = (time) => `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`;
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerRef.current?.requestFullscreen();
    }
  };

  return (
    <div className="playback-backdrop" role="presentation" onClick={onClose}>
      <section className="playback-modal" role="dialog" aria-modal="true" aria-label={`Preview ${movie.title}`} onClick={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close player"><Icon name="close" /></button>
        <div ref={playerRef} className="player-screen" style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.82), rgba(0,0,0,.14)), url("${movie.image}")` }}>
          <div className="player-message">
            <button className="player-play" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? 'Pause preview' : 'Play preview'}><Icon name={isPlaying ? 'pause' : 'play'} size={27} /></button>
            <strong>{movie.title}</strong>
            <span>{isPlaying ? 'Preview playing' : 'Preview paused'}</span>
          </div>
          <div className="player-controls">
            <button onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? 'Pause preview' : 'Play preview'}>{isPlaying ? 'Ⅱ' : '▶'}</button>
            <span>{formatTime(currentTime)}</span>
            <input className="player-progress" aria-label="Seek preview" type="range" min="0" max={duration} value={currentTime} onChange={(event) => setCurrentTime(Number(event.target.value))} style={{ '--progress': `${currentTime / duration * 100}%` }} />
            <span>{formatTime(duration)}</span>
            <button onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute preview' : 'Mute preview'}>{muted ? 'Muted' : 'Vol'}</button>
            <button onClick={toggleFullscreen} aria-label="Toggle fullscreen">⛶</button>
          </div>
        </div>
        <div className="player-caption">
          <div><p className="eyebrow">SAMPLE PREVIEW · {movie.genre.toUpperCase()}</p><h2>{movie.title}</h2><p>{movie.description}</p></div>
          <span className="demo-note">Preview</span>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('plex-theme') !== 'light');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [signInMessage, setSignInMessage] = useState('');
  const [path, setPath] = useState(() => getRoutePath());

  useEffect(() => {
    const navigate = (url) => {
      const nextPath = getRoutePath(url.pathname);
      if (nextPath !== path) {
        window.history.pushState({}, '', url.href);
        setPath(nextPath);
        window.scrollTo(0, 0);
      } else {
        window.history.replaceState({}, '', url.href);
        window.scrollTo(0, 0);
      }
      setMobileOpen(false);
      setSearchOpen(false);
      setQuery('');
      setPlaying(null);
    };

    const handleClick = (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target || link.hasAttribute('download') || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      navigate(url);
    };
    const handlePopState = () => {
      setPath(getRoutePath());
      setMobileOpen(false);
      setSearchOpen(false);
      setQuery('');
      setPlaying(null);
      window.scrollTo(0, 0);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopState);
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [path]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('plex-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => reveal.observe(element));
    return () => reveal.disconnect();
  }, [path, showAll]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setPlaying(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const matches = titles.filter((movie) => `${movie.title} ${movie.genre} ${movie.year}`.toLowerCase().includes(search));
    return showAll || search ? matches : matches.slice(0, 4);
  }, [query, showAll]);
  const searchResults = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search ? titles.filter((movie) => `${movie.title} ${movie.genre} ${movie.year}`.toLowerCase().includes(search)).slice(0, 5) : [];
  }, [query]);

  const openPlayback = (movie) => setPlaying(movie);
  const titleSlug = path.startsWith('/movie/') ? path.slice('/movie/'.length) : '';
  const selectedMovie = titles.find((movie) => movie.title.toLowerCase().replaceAll(' ', '-') === titleSlug);

  const header = (
    <header className="site-header">
      <a className="brand" href="/watch-free" aria-label="Plex home"><span className="brand-mark">plex</span><span className="brand-divider" /><span className="brand-tagline">WATCH FREE</span></a>
      <button className="mobile-menu icon-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation"><Icon name={mobileOpen ? 'close' : 'menu'} /></button>
      <nav className={`main-nav ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
        {navigation.map((item) => <a key={item.href} href={item.href} className={path === item.href ? 'active' : ''} onClick={() => setMobileOpen(false)}>{item.label}</a>)}
      </nav>
      <div className="header-actions">
        {searchOpen && <div className="search-wrap"><input className="search-input" autoFocus placeholder="Search movies and shows" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search movies and shows" />{query.trim() && <div className="search-results">{searchResults.length ? searchResults.map((movie) => <a key={movie.title} href={`/movie/${encodeURIComponent(movie.title.toLowerCase().replaceAll(' ', '-'))}`}><span>{movie.title}</span><small>{movie.year} · {movie.genre}</small></a>) : <p>No matches found</p>}</div>}</div>}
        <button className={`icon-button ${searchOpen ? 'selected' : ''}`} onClick={() => { setSearchOpen(!searchOpen); setQuery(''); }} aria-label={searchOpen ? 'Close search' : 'Search'}><Icon name={searchOpen ? 'close' : 'search'} /></button>
        <button className="icon-button theme-button" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} title={`Switch to ${dark ? 'light' : 'dark'} mode`}><Icon name={dark ? 'sun' : 'moon'} /></button>
        <a className="sign-in" href="/sign-in">Sign in</a>
      </div>
    </header>
  );

  const listSection = (heading = 'Popular movies', subtitle = 'Your next favorite is waiting.') => (
    <section className="catalog-section container-fluid page-container" id="browse">
      <div className="section-heading reveal">
        <div><p className="eyebrow">A world of entertainment</p><h2>{query ? `Search results for “${query}”` : heading}</h2><p>{query ? `${filtered.length} title${filtered.length === 1 ? '' : 's'} found` : subtitle}</p></div>
        {!query && <button className="text-link" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show less' : 'Explore all'} <Icon name="arrow" size={16} /></button>}
      </div>
      {filtered.length > 0 ? <div className="movie-grid">{filtered.map((movie) => <MovieCard key={movie.title} movie={movie} onPlay={openPlayback} />)}</div> : <div className="empty-results">No titles match that search. Try another title or genre.</div>}
    </section>
  );

  const hero = (eyebrow, title, description, image, actions = true) => (
    <section className="hero" style={{ '--hero-image': `url("${image}")` }}>
      <div className="hero-content container-fluid page-container">
        <div className="hero-copy reveal">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="hero-description">{description}</p>
          {actions && <div className="hero-actions"><button className="button button-primary" onClick={() => openPlayback(titles[0])}><Icon name="play" size={18} /> Start watching</button><a className="button button-outline" href="/discover">Explore free movies <Icon name="arrow" size={17} /></a></div>}
          <p className="hero-footnote">No subscription required <span>·</span> Free to stream <span>·</span> Ad-supported</p>
        </div>
      </div>
      <div className="hero-caption"><span>Stories worth staying in for.</span><span>PLEX ORIGINALS & MORE</span></div>
    </section>
  );

  const page = () => {
    if (path === '/sign-in') return <main className="simple-page container-fluid page-container"><p className="eyebrow">Welcome back</p><h1>Sign in to Plex</h1><p>Sign in to keep your watchlist and discover more of what you love.</p><form className="sign-in-form" onSubmit={(event) => { event.preventDefault(); setSignInMessage('Account sign-in is not connected in this demo.'); }}><label>Email address<input type="email" required placeholder="you@example.com" /></label><label>Password<input type="password" required minLength="6" placeholder="Enter your password" /></label><button className="button button-primary" type="submit">Sign in</button>{signInMessage && <p className="form-status" role="status">{signInMessage}</p>}<p>New to Plex? <a href="/about">Learn about Plex</a></p></form></main>;
    if (path === '/about') return <main>{hero('One place for everything you watch', 'Entertainment for everyone.', 'Plex brings your favorite movies, shows, live TV, and personal media together in one simple place.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=90', false)}<section className="feature-section container-fluid page-container"><p className="eyebrow">More to love</p><h2>All your entertainment. All in one place.</h2><p>Discover a world of free entertainment, find your next favorite, and make your watchlist yours.</p><a className="button button-primary" href="/watch-free">Explore free movies <Icon name="arrow" /></a></section></main>;
    if (path === '/live-tv') return <main>{hero('Always on. Always free.', 'Live TV, your way.', 'Flip through hundreds of free live channels, from breaking news and sports to classic TV and cult favorites.', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=2000&q=90')}<section className="channel-strip container-fluid page-container"><p className="eyebrow">Find your channel</p><h2>Something good is always on.</h2><div className="channel-grid">{['PLEX PICKS', 'TRUE CRIME', 'MOVIE TIME', 'FOOD & HOME', 'NEWS NOW', 'CLASSIC TV'].map((channel, index) => <button key={channel} className="channel-card" onClick={() => openPlayback(titles[index % titles.length])}><span>0{index + 1}</span><strong>{channel}</strong><Icon name="play" /></button>)}</div></section>{listSection('Trending on live TV', 'Popular picks to get you started.')}</main>;
    if (path === '/discover') return <main>{hero('Find your next favorite', 'A little bit of everything.', 'From hidden gems to all-time favorites, explore movies and shows picked just for you.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=90', false)}{listSection('Explore free movies', 'Handpicked stories for your next movie night.')}</main>;
    if (path.startsWith('/movie/')) {
      if (!selectedMovie) return <main className="simple-page container-fluid page-container"><p className="eyebrow">Title not found</p><h1>That movie has moved on.</h1><a className="button button-primary" href="/watch-free">Browse free movies</a></main>;
      return <main>{hero(`${selectedMovie.year} · ${selectedMovie.genre} · ${selectedMovie.rating}`, selectedMovie.title, selectedMovie.description, selectedMovie.image)}<section className="detail-section container-fluid page-container"><div><p className="eyebrow">About this movie</p><h2>A story worth watching.</h2><p>{selectedMovie.description} Stream it free on Plex, anytime.</p></div><button className="button button-outline" onClick={() => openPlayback(selectedMovie)}><Icon name="play" /> Play movie</button></section>{listSection('More like this', 'Keep the good stories coming.')}</main>;
    }
    if (path === '/watch-free' || path === '/') return <main>{hero('Free movies & TV, streaming now', 'Great stories.\nTotally free.', 'The movies and shows you love, ready when you are. Stream thousands of titles for free on Plex.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=90')}{listSection('Popular movies', 'A few good picks to get you started.')}<section className="free-banner container-fluid page-container reveal"><div><p className="eyebrow">The best things in life are free</p><h2>Your next movie night starts here.</h2><p>Great movies, live TV, and more. No subscription required.</p></div><a className="button button-primary" href="/discover">Find something to watch <Icon name="arrow" /></a></section><section className="feature-section container-fluid page-container"><p className="eyebrow">More than movies</p><h2>Live TV. Free streaming. All on Plex.</h2><p>From the latest headlines to a classic movie marathon, there's always something to watch.</p><a className="text-link" href="/live-tv">Explore live TV <Icon name="arrow" size={16} /></a></section></main>;
    return <main className="simple-page container-fluid page-container"><p className="eyebrow">Page not found</p><h1>Well, this is awkward.</h1><p>We can't find the page you're looking for.</p><a className="button button-primary" href="/watch-free">Back to Plex</a></main>;
  };

  return (
    <div className="app-shell">
      {header}
      {page()}
      <footer className="site-footer"><div className="footer-main container-fluid page-container"><a className="brand footer-brand" href="/watch-free"><span className="brand-mark">plex</span></a><div className="footer-links"><a href="/watch-free">Free Movies & TV</a><a href="/live-tv">Live TV</a><a href="/discover">Discover</a><a href="/about">About Plex</a><a href="/sign-in">Sign in</a></div><p>© {new Date().getFullYear()} Plex. Watch free, anytime.</p></div></footer>
      {playing && <PlaybackModal movie={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}

export default App;
