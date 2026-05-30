import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Search } from 'lucide-react';
import apiClient, { API } from '../../../api/config';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await apiClient.get(`${API.CRM}/customers`);
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 text-gray-800 d-flex align-items-center">
            <Users className="me-2 text-primary" /> CRM Customers
          </h2>
          <p className="text-muted mb-0">Manage your business relationships and leads.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center">
          <Plus size={18} className="me-1" /> Add Customer
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          {loading ? (
            <div className="text-center p-5">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Tier</th>
                    <th>LTV</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-medium">{c.name}</td>
                      <td>{c.email || '-'}</td>
                      <td>{c.phone || '-'}</td>
                      <td>
                        <span className={`badge ${c.loyaltyTier === 'Gold' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          {c.loyaltyTier}
                        </span>
                      </td>
                      <td>₹{c.lifetimeValue}</td>
                      <td>
                        <Link to={`/crm/customers/${c.id}`} className="btn btn-sm btn-outline-primary">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted p-4">
                        No customers found. Start adding some!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
