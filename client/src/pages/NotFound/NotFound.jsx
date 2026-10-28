import React from 'react';
import { Link } from 'react-router-dom';
import { BookX, Home } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-icon-wrap">
          <BookX size={44} strokeWidth={1.75} />
        </div>
        <span className="notfound-code">404</span>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-desc">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
