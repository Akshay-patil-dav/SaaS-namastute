import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  CheckCircle2, 
  XSquare, 
  Layers,
  ChevronUp,
  RefreshCw,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import './super-packages.css';

export default function SuperPackages() {
  const tableData = [
    { name: 'Basic', type: 'Monthly', subscribers: 56, price: '$50', date: '14 Jan 2024', status: 'Active' },
    { name: 'Advanced', type: 'Monthly', subscribers: 99, price: '$200', date: '21 Jan 2024', status: 'Active' },
    { name: 'Premium', type: 'Monthly', subscribers: 58, price: '$300', date: '10 Feb 2024', status: 'Active' },
    { name: 'Enterprise', type: 'Monthly', subscribers: 67, price: '$400', date: '18 Feb 2024', status: 'Active' },
    { name: 'Basic', type: 'Yearly', subscribers: 78, price: '$600', date: '15 Mar 2024', status: 'Active' },
    { name: 'Advanced', type: 'Yearly', subscribers: 99, price: '$2400', date: '26 Mar 2024', status: 'Active' },
    { name: 'Premium', type: 'Yearly', subscribers: 48, price: '$3600', date: '05 Apr 2024', status: 'Active' },
    { name: 'Enterprise', type: 'Yearly', subscribers: 17, price: '$4800', date: '16 Apr 2024', status: 'Active' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [accessTrial, setAccessTrial] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [data, setData] = useState(tableData);

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedIds(filteredData.map((_, index) => index));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (index, isChecked) => {
    if (isChecked) {
      setSelectedIds(prev => [...prev, index]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== index));
    }
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} packages?`)) return;
    
    setData(prev => prev.filter((_, index) => !selectedIds.includes(index)));
    setSelectedIds([]);
    alert('Simulated deletion: Backend connection pending for Super Admin entities.');
  };

  const modules = [
    'Employees', 'Invoices', 'Reports', 'Contacts',
    'Clients', 'Estimates', 'Goals', 'Deals',
    'Projects', 'Payments', 'Assets', 'Leads',
    'Tickets', 'Taxes', 'Activities', 'Pipelines'
  ];

  return (
    <div className="super-packages-page">
      {/* Header */}
      <div className="sp-header-row">
        <div>
          <h1 className="sp-page-title">Packages</h1>
          <p className="sp-page-subtitle">Manage your packages</p>
        </div>
        <div className="sp-header-actions">
          <button className="sp-btn-icon-square" title="Export PDF"><FileText size={16} color="#ef4444" /></button>
          <button className="sp-btn-icon-square" title="Export Excel"><FileSpreadsheet size={16} color="#22c55e" /></button>
          <button className="sp-btn-icon-square" title="Refresh" onClick={() => window.location.reload()}><RefreshCw size={16} /></button>
          <button className="sp-btn-icon-square" title="Collapse"><ChevronUp size={16} /></button>
          {selectedIds.length > 0 && (
            <button className="sp-btn-red-outline" onClick={handleBulkDelete} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 15px', height: '40px', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', background: '#fff', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s', marginLeft: '10px' }}>
              <Trash2 size={16} /> Delete Selected ({selectedIds.length})
            </button>
          )}
          <button className="sp-btn-add" onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle size={16} /> Add Packages
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="sp-stats-container">
        <div className="sp-stat-card">
          <div className="sp-stat-content">
            <h4>Total Plans</h4>
            <p>08</p>
          </div>
          <div className="sp-stat-icon-square sp-icon-orange">
            <Package size={22} />
          </div>
        </div>

        <div className="sp-stat-card">
          <div className="sp-stat-content">
            <h4>Active Plans</h4>
            <p>08</p>
          </div>
          <div className="sp-stat-icon-square sp-icon-green">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="sp-stat-card">
          <div className="sp-stat-content">
            <h4>Inactive Plans</h4>
            <p>0</p>
          </div>
          <div className="sp-stat-icon-square sp-icon-red">
            <XSquare size={22} />
          </div>
        </div>

        <div className="sp-stat-card">
          <div className="sp-stat-content">
            <h4>No of Plan Types</h4>
            <p>02</p>
          </div>
          <div className="sp-stat-icon-square sp-icon-blue">
            <Layers size={22} />
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="sp-main-panel">
        
        <div className="sp-table-controls">
          <div className="sp-search-wrap">
            <Search size={16} />
            <input 
              type="text" 
              className="sp-search-input" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sp-filters-wrap">
            <select className="sp-filter-select">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select className="sp-filter-select">
              <option>Sort By : Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="sp-table-wrapper">
          <table className="sp-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    className="sp-checkbox" 
                    checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th>Plan Name</th>
                <th>Plan Type</th>
                <th>Total Subscribers</th>
                <th>Price</th>
                <th>Created Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="sp-checkbox" 
                        checked={selectedIds.includes(index)}
                        onChange={(e) => handleSelectItem(index, e.target.checked)}
                      />
                    </td>
                    <td className="sp-plan-name">{row.name}</td>
                    <td>{row.type}</td>
                    <td>{row.subscribers}</td>
                    <td>{row.price}</td>
                    <td>{row.date}</td>
                    <td>
                      <span className="sp-status-badge sp-status-active">
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="sp-actions-group">
                        <button className="sp-action-btn" title="Edit"><Edit size={14} /></button>
                        <button className="sp-action-btn" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                    No matching packages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sp-pagination-row">
          <div className="sp-page-size">
            Row Per Page 
            <select>
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            Entries
          </div>
          <div className="sp-page-controls">
            <button className="sp-page-btn">&lt;</button>
            <button className="sp-page-btn active">1</button>
            <button className="sp-page-btn">&gt;</button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="sp-footer">
        <div className="sp-footer-left">
          2014 - 2026 © DreamsPOS. All Right Reserved
        </div>
        <div className="sp-footer-right">
          Designed & Developed by <span>Dreams</span>
        </div>
      </footer>

      {/* Add Plan Modal */}
      {isAddModalOpen && (
        <div className="sp-modal-overlay" onMouseDown={() => setIsAddModalOpen(false)}>
          <div className="sp-modal-content" onMouseDown={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <h2>Add New Plan</h2>
              <button className="sp-modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <XSquare size={24} fill="#ef4444" color="white" />
              </button>
            </div>
            
            <div className="sp-modal-body">
              <div className="sp-upload-section">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" alt="Profile" className="sp-upload-image" />
                <div className="sp-upload-info">
                  <h4>Upload Profile Image</h4>
                  <p>Image should be below 4 mb</p>
                  <div className="sp-upload-actions">
                    <button className="sp-btn-orange-full" style={{padding: '6px 14px', fontSize: '12px'}}>Upload</button>
                    <button className="sp-btn-dark" style={{padding: '6px 14px', fontSize: '12px'}}>Cancel</button>
                  </div>
                </div>
              </div>

              <div className="sp-form-grid">
                <div className="sp-form-group">
                  <label className="sp-label">Plan Name <span className="required">*</span></label>
                  <select className="sp-select">
                    <option>Advanced</option>
                    <option>Basic</option>
                    <option>Premium</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div className="sp-form-group">
                  <label className="sp-label">Plan Type <span className="required">*</span></label>
                  <select className="sp-select">
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>

                <div className="sp-form-group">
                  <label className="sp-label">Plan Position <span className="required">*</span></label>
                  <select className="sp-select">
                    <option>3</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </div>
                <div className="sp-form-group">
                  <label className="sp-label">Plan Currency <span className="required">*</span></label>
                  <select className="sp-select">
                    <option>EURO</option>
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>

              <div className="sp-form-grid-3">
                <div className="sp-form-group">
                  <label className="sp-label">
                    Plan Currency <span className="required">*</span>
                    <span className="sp-label-notice"> <RefreshCw size={12} /> Set 0 for free</span>
                  </label>
                  <select className="sp-select">
                    <option>Select</option>
                  </select>
                </div>
                <div className="sp-form-group">
                  <label className="sp-label">Discount Type <span className="required">*</span></label>
                  <select className="sp-select">
                    <option>Select</option>
                  </select>
                </div>
                <div className="sp-form-group">
                  <label className="sp-label">Discount <span className="required">*</span></label>
                  <input type="text" className="sp-input" />
                </div>
              </div>

              <div className="sp-form-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                <div className="sp-form-group">
                  <label className="sp-label">Limitations Invoices</label>
                  <input type="text" className="sp-input" />
                </div>
                <div className="sp-form-group">
                  <label className="sp-label">Max Customers</label>
                  <input type="text" className="sp-input" />
                </div>
                <div className="sp-form-group">
                  <label className="sp-label">Product</label>
                  <input type="text" className="sp-input" />
                </div>
                <div className="sp-form-group">
                  <label className="sp-label">Supplier</label>
                  <input type="text" className="sp-input" />
                </div>
              </div>

              <div className="sp-modules-header">
                <h3>Plan Modules</h3>
                <label className="sp-select-all">
                  <input type="checkbox" /> Select All
                </label>
              </div>

              <div className="sp-modules-grid">
                {modules.map(mod => (
                  <label key={mod} className="sp-module-item">
                    <input type="checkbox" /> {mod}
                  </label>
                ))}
              </div>

              <div className="sp-toggles-row">
                <div className="sp-toggle-group">
                  <label>Access Trial</label>
                  <label className="sp-switch">
                    <input type="checkbox" checked={accessTrial} onChange={() => setAccessTrial(!accessTrial)} />
                    <span className="sp-slider"></span>
                  </label>
                </div>
                <div className="sp-toggle-group">
                  <label>Is Recommended</label>
                  <label className="sp-switch">
                    <input type="checkbox" checked={isRecommended} onChange={() => setIsRecommended(!isRecommended)} />
                    <span className="sp-slider"></span>
                  </label>
                </div>
              </div>

              <div className="sp-form-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                <div className="sp-form-group">
                  <label className="sp-label">Trial Days</label>
                  <input type="text" className="sp-input" />
                </div>
                <div className="sp-form-group">
                  <label className="sp-label">Status <span className="required">*</span></label>
                  <select className="sp-select">
                    <option>Select</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="sp-form-group full-width" style={{ marginTop: '20px' }}>
                <label className="sp-label">Description</label>
                <textarea className="sp-textarea"></textarea>
              </div>

            </div>

            <div className="sp-modal-footer">
              <button className="sp-btn-dark" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="sp-btn-orange-full">Add Plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
