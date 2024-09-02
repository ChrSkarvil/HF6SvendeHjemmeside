import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { variables } from '../Variables';
import Notification from './Notification';
import '../css/orderPage.css';

function OrderPage() {
  const { id } = useParams();
  const { userId: userIdFromRedux } = useSelector(state => state.auth);
  const [userId, setUserId] = useState(userIdFromRedux);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${variables.LISTING_API_URL}/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!userId) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUserId(parsedUser.userId);
      }
    }
  }, [userId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Please enter a valid name (letters and spaces only).';
    }

    if (!formData.address) {
      newErrors.address = 'Please enter your address.';
    }

    if (!formData.city || !/^[A-Za-z\s]+$/.test(formData.city)) {
      newErrors.city = 'Please enter a valid city (letters and spaces only).';
    }

    if (!formData.zip || !/^\d{4}$/.test(formData.zip)) {
      newErrors.zip = 'Please enter a valid 4-digit zip code.';
    }

    if (!formData.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone || !/^\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 8-digit phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Order submitted:', formData);
      setShowNotification(true);
      const orderData = {
        createDate: new Date().toISOString(),
        customerId: userId,
        paymentId: 1,
        deliveryId: 2,
        orderItems: [
          {
            price: product.price,
            quantity: 1,
            listingId: product.id
          }
        ]
      };
      try {
        const response = await axios.post(`${variables.ORDER_API_URL}`, orderData);

        if (response.status === 201) {
          console.log('Order successfully created:', response.data);
          setShowNotification(true);
          setTimeout(() => {
            navigate('/');
        }, 2000);
        } else {
          console.error('Failed to create order:', response.data);
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const { title, price, product: { images } } = product;

  return (
    <div className="order-page">
      <div className="order-info">
        <h2>{title}</h2>
        <p><strong>Price:</strong> ${price}</p>
        <div className="product-images">
          {images && Array.isArray(images) && images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={`data:image/jpeg;base64,${image.fileBase64}`}
                alt={title || 'Product Image'}
                className="product-image"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
        <button onClick={handleSubmit}>Place Order</button>
      </div>

      <div className="order-form">
        <h3>Shipping Information</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </label>
          <label>
            Zip Code:
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
            />
            {errors.zip && <p className="error">{errors.zip}</p>}
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </label>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </label>
        </form>
      </div>

      {showNotification && (
        <Notification
          message="Order successfully placed!"
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

export default OrderPage;
