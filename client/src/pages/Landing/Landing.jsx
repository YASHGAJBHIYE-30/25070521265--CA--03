import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  BarChart3,
  Star,
  TrendingUp,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Elevate Your Literary Life</span>
            </div>

            <h1 className="hero-title">
              Track Your <br />
              <span className="text-gradient">Reading Journey</span>
            </h1>

            <p className="hero-subtitle">
              Your personal library, beautifully organized. Set goals, track
              progress, record heartfelt reviews, and rediscover the joy of reading every day.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Log In
              </Link>
            </div>
          </div>

          {/* Floating Book Covers */}
          <div className="hero-visual" aria-hidden="true">
            <div className="book-stack-container">
              <div className="stack-card stack-card-1">
                <span className="stack-card-genre">Classic</span>
                <div>
                  <h3 className="stack-card-title">The Great Gatsby</h3>
                  <p className="stack-card-author">F. Scott Fitzgerald</p>
                </div>
                <span className="stack-card-spine">PageTurn Library</span>
              </div>

              <div className="stack-card stack-card-2">
                <span className="stack-card-genre">Philosophy</span>
                <div>
                  <h3 className="stack-card-title">Meditations</h3>
                  <p className="stack-card-author">Marcus Aurelius</p>
                </div>
                <span className="stack-card-spine">PageTurn Library</span>
              </div>

              <div className="stack-card stack-card-3">
                <span className="stack-card-genre">Fiction</span>
                <div>
                  <h3 className="stack-card-title">Norwegian Wood</h3>
                  <p className="stack-card-author">Haruki Murakami</p>
                </div>
                <span className="stack-card-spine">PageTurn Library</span>
              </div>

              <div className="stack-card stack-card-4">
                <span className="stack-card-genre">Dystopian</span>
                <div>
                  <h3 className="stack-card-title">1984</h3>
                  <p className="stack-card-author">George Orwell</p>
                </div>
                <span className="stack-card-spine">PageTurn Library</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip" aria-label="Reading Community Statistics">
        <div className="container stats-grid">
          <div className="stat-strip-item">
            <span className="stat-strip-number">10,000+</span>
            <span className="stat-strip-label">Passionate Readers</span>
          </div>
          <div className="stat-strip-item">
            <span className="stat-strip-number">50,000+</span>
            <span className="stat-strip-label">Books Tracked</span>
          </div>
          <div className="stat-strip-item">
            <span className="stat-strip-number">1,200,000+</span>
            <span className="stat-strip-label">Pages Turned</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Everything you need to nurture your reading habit
            </h2>
            <p className="section-subtitle">
              Designed with timeless elegance to keep you motivated and immersed in great stories.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-burgundy">
                <BookOpen size={24} />
              </div>
              <h3 className="feature-card-title">Organize Your Library</h3>
              <p className="feature-card-desc">
                Categorize by custom shelves, genres, and reading status. Keep every title you love in one organized place.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-amber">
                <BarChart3 size={24} />
              </div>
              <h3 className="feature-card-title">Track Progress</h3>
              <p className="feature-card-desc">
                Log current pages, watch animated progress indicators, and easily reach your yearly reading milestone.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-sage">
                <Star size={24} />
              </div>
              <h3 className="feature-card-title">Rate & Review</h3>
              <p className="feature-card-desc">
                Score books with 5-star ratings, jot down memorable takeaways, and craft private or shared reviews.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-blue">
                <TrendingUp size={24} />
              </div>
              <h3 className="feature-card-title">Reading Insights</h3>
              <p className="feature-card-desc">
                Visualize monthly pacing with interactive bar charts, page summaries, and habit trends throughout the year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How PageTurn Works</h2>
            <p className="section-subtitle">
              Three seamless steps to building your personalized digital bookshelf.
            </p>
          </div>

          <div className="steps-row">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3 className="step-title">Create your account</h3>
              <p className="step-desc">
                Sign up in seconds and configure your yearly reading goal to get tailored milestones.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">02</span>
              <h3 className="step-title">Add your books</h3>
              <p className="step-desc">
                Easily log books you want to read, are currently reading, or have finished with cover art.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">03</span>
              <h3 className="step-title">Track & discover</h3>
              <p className="step-desc">
                Watch your reading dashboard update live with charts, page counts, and rewarding habit streaks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-title">
              Ready to embark on your next reading chapter?
            </h2>
            <p className="cta-subtitle">
              Join thousands of readers who turn pages with purpose. PageTurn is free forever with no credit card required.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Start Tracking Today</span>
              <ArrowRight size={18} />
            </Link>
            <span className="cta-note">Free forever • No credit card required • Instant setup</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <BookOpen size={20} color="var(--color-primary)" />
            <span>PageTurn</span>
          </div>

          <p className="footer-copy">
            Made with ❤️ for book lovers everywhere. © {new Date().getFullYear()} PageTurn.
          </p>

          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#github">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
