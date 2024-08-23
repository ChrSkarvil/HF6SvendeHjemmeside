import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/breadcrumb.css";

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {pathnames.length > 0 && (
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
        )}

        {pathnames.includes("product") && (
          <li className="breadcrumb-item">
            <Link to="/watches">Watches</Link>
          </li>
        )}

        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;

          if (value.match(/^\d+$/) && pathnames[index - 1] === "product") {
            return (
              <li key={value} className="breadcrumb-item active" aria-current="page">
                Product-{value}
              </li>
            );
          }

          if (value === "product") {
            return null;
          }

          return isLast ? (
            <li key={value} className="breadcrumb-item active" aria-current="page">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </li>
          ) : (
            <li key={value} className="breadcrumb-item">
              <Link to={`/${value}`}>{value.charAt(0).toUpperCase() + value.slice(1)}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
