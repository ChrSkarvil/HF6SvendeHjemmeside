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
      if (pathnames.length > 0 && pathnames[pathnames.length - 2] === "product" && productId) {
        try {
          const response = await axios.get(`${variables.LISTING_API_URL}/${productId}`);
          setProductTitle(response.data.title);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching product title:', error);
          setLoading(false);
        }
      } else {
        setLoading(false); 
      }
    };

    fetchProductTitle();
  }, [pathnames]);

  const renderPathname = () => {
    if (pathnames.length > 0) {
      const lastPath = pathnames[pathnames.length - 1];
      return lastPath ? lastPath.charAt(0).toUpperCase() + lastPath.slice(1) : '';
    }
    return '';
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {pathnames.length > 0 && pathnames[0] !== "" && (
          <>
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            {pathnames[0] === "watches" ? (
              <li className="breadcrumb-item active" aria-current="page">
                Watches
              </li>
            ) : (
              <>
                {pathnames.length > 0 && pathnames[0] === "watches" && (
                  <li className="breadcrumb-item">
                    <Link to="/watches">Watches</Link>
                  </li>
                )}
                {pathnames.length > 0 && pathnames[pathnames.length - 2] === "product" ? (
                  <li className="breadcrumb-item active" aria-current="page">
                    {loading ? 'Loading...' : productTitle}
                  </li>
                ) : (
                  <li className="breadcrumb-item active" aria-current="page">
                    {renderPathname()}
                  </li>
                )}
              </>
            )}
          </>
        )}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
