import React from 'react';
import '../css/adminpanel.css';

const AdminPanel = () => {
  // Dummy data for sales
  const sales = [
    { id: 1, product: 'Watch 1', customer: 'Customer A', status: 'Pending' },
    { id: 2, product: 'Watch 2', customer: 'Customer B', status: 'Pending' },
  ];

  const handleApprove = (id) => {
    alert(`Sale ${id} approved!`);
  };

  const handleDeny = (id) => {
    alert(`Sale ${id} denied.`);
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div className="sales-list">
        {sales.map((sale) => (
          <div key={sale.id} className="sale-item">
            <span>{sale.product} - {sale.customer}</span>
            <button onClick={() => handleApprove(sale.id)} className="approve-btn">Approve</button>
            <button onClick={() => handleDeny(sale.id)} className="deny-btn">Deny</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
