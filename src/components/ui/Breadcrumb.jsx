import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <div className="breadcrumb-item">
        <Link to="/" className="breadcrumb-link" aria-label="Home">
          <Home size={14} />
        </Link>
      </div>
      {items.map((item, i) => (
        <div key={i} className="breadcrumb-item">
          <ChevronRight size={14} className="breadcrumb-separator" aria-hidden="true" />
          {item.to ? (
            <Link to={item.to} className="breadcrumb-link">{item.label}</Link>
          ) : (
            <span className="breadcrumb-current" aria-current="page">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
