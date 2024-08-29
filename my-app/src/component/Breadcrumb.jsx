import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import "../css/breadcrumb.css";
import { variables } from '../Variables';

function Breadcrumb() {
  const [productTitle, setProductTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  useEffect(() => {
    const fetchProductTitle = async () => {
      const productId = pathnames[pathnames.length - 1];
      if (pathnames.length > 1 && pathnames[pathnames.length - 2] === "product" && productId) {
        try {
          const response = await axios.get(`${variables.LISTING_API_URL}/${productId}`);
          setProductTitle(response.data.title);
        } catch (error) {
          console.error('Error fetching product title:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); 
      }
    };

    fetchProductTitle();
  }, [pathnames]);

  const renderBreadcrumbs = () => {
    return pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      if (isLast && pathnames[pathnames.length - 2] === "product") {
        return (
          <li key={to} className="breadcrumb-item active" aria-current="page">
            {loading ? 'Loading...' : productTitle || 'Product'}
          </li>
        );
      } else if (index === 0 && value === "product") {
        return null; 
      } else {
        return isLast ? (
          <li key={to} className="breadcrumb-item active" aria-current="page">
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </li>
        ) : (
          <li key={to} className="breadcrumb-item">
            <Link to={to}>{value.charAt(0).toUpperCase() + value.slice(1)}</Link>
          </li>
        );
      }
    });
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {pathnames.length > 0 && (
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
        )}
        {renderBreadcrumbs()}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
