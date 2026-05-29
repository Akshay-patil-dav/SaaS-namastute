import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Activity, Bot } from 'lucide-react';
import apiClient, { API } from '../../api/config';

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      const [custRes, interRes] = await Promise.all([
        apiClient.get(`${API.CRM}/customers/${id}`),
        apiClient.get(`${API.CRM}/customers/${id}/interactions`),
      ]);
      setCustomer(custRes.data);
      setInteractions(interRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    setLoadingAi(true);
    try {
      // In a full implementation, this calls your backend AI integration
      // which reads order history and generates this dynamically via Gemini.
      // For Phase 1 demo, we simulate it or call the actual AI helper endpoint
      const prompt = `Analyze customer data for ${customer.name} with lifetime value ${customer.lifetimeValue}. Give me a 2 sentence summary on how to up-sell them.`;
      const res = await apiClient.post(`${API.AI}/chat`, { message: prompt });
      setAiInsight(res.data.reply);
      
      // Save it as an interaction
      await apiClient.post(`${API.CRM}/customers/${id}/interactions`, {
        type: 'AI_Insight',
        notes: res.data.reply
      });
      fetchCustomerData(); // Refresh interactions
    } catch (err) {
      console.error(err);
      setAiInsight("AI failed to generate an insight. Please check your AI API Keys.");
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading) return <div className="p-5 text-center">Loading...</div>;
  if (!customer) return <div className="p-5 text-center">Customer not found</div>;

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <Link to="/crm/customers" className="text-decoration-none">&larr; Back to Customers</Link>
      </div>
      
      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                {customer.name.charAt(0)}
              </div>
              <h4 className="card-title">{customer.name}</h4>
              <p className="text-muted">{customer.company || 'Individual Customer'}</p>
              
              <div className="d-flex justify-content-around mt-4">
                <div className="text-center">
                  <h6 className="text-muted mb-1">LTV</h6>
                  <h5>₹{customer.lifetimeValue}</h5>
                </div>
                <div className="text-center">
                  <h6 className="text-muted mb-1">Tier</h6>
                  <span className={`badge ${customer.loyaltyTier === 'Gold' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                    {customer.loyaltyTier}
                  </span>
                </div>
              </div>
            </div>
            <ul className="list-group list-group-flush border-top">
              <li className="list-group-item d-flex align-items-center py-3">
                <Mail size={18} className="text-muted me-3" /> {customer.email || 'N/A'}
              </li>
              <li className="list-group-item d-flex align-items-center py-3">
                <Phone size={18} className="text-muted me-3" /> {customer.phone || 'N/A'}
              </li>
              <li className="list-group-item d-flex align-items-center py-3">
                <MapPin size={18} className="text-muted me-3" /> {customer.address || 'N/A'}
              </li>
            </ul>
          </div>
        </div>

        {/* AI & Interactions */}
        <div className="col-lg-8">
          
          {/* AI Insights Panel */}
          <div className="card shadow-sm border-0 mb-4 bg-light border-primary" style={{ borderLeft: '4px solid #0d6efd' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 text-primary d-flex align-items-center">
                  <Bot size={20} className="me-2" /> AI Sales Assistant
                </h5>
                <button onClick={handleGenerateInsight} disabled={loadingAi} className="btn btn-sm btn-primary">
                  {loadingAi ? 'Analyzing...' : 'Generate Next Best Offer'}
                </button>
              </div>
              {aiInsight && (
                <div className="p-3 bg-white border rounded">
                  <p className="mb-0 text-dark fw-medium">{aiInsight}</p>
                </div>
              )}
            </div>
          </div>

          {/* Interactions Timeline */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="card-title d-flex align-items-center">
                <Activity size={20} className="me-2 text-primary" /> Recent Interactions
              </h5>
            </div>
            <div className="card-body">
              {interactions.length === 0 ? (
                <p className="text-muted">No interactions logged yet.</p>
              ) : (
                <div className="timeline">
                  {interactions.map(inter => (
                    <div key={inter.id} className="mb-3 border-bottom pb-3">
                      <div className="d-flex justify-content-between">
                        <strong>{inter.type.replace('_', ' ')}</strong>
                        <small className="text-muted">
                          {new Date(inter.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <p className="mb-0 mt-1">{inter.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
