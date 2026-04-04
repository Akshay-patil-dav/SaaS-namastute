import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Building2, 
  Building, 
  MapPin, 
  ChevronDown,
  RefreshCw,
  ChevronUp,
  FileText,
  FileSpreadsheet,
  Zap,
  Globe,
  Sun,
  Aperture,
  Wind,
  XCircle,
  Image as ImageIcon,
  EyeOff
} from 'lucide-react';
import './super-companies.css';

export default function SuperCompanies() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tableData = [
    {
      company: 'BrightWave Innovations',
      logo: <Zap size={16} color="#9333ea" />,
      email: 'michael@example.com',
      url: 'bwi.example.com',
      plan: 'Advanced (Monthly)',
      date: '12 Sep 2024',
      status: 'Active'
    },
    {
      company: 'Stellar Dynamics',
      logo: <Aperture size={16} color="#16a34a" />,
      email: 'sophie@example.com',
      url: 'sd.example.com',
      plan: 'Basic (Yearly)',
      date: '24 Oct 2024',
      status: 'Active'
    },
    {
      company: 'Quantum Nexus',
      logo: <Globe size={16} color="#2563eb" />,
      email: 'cameron@example.com',
      url: 'qn.example.com',
      plan: 'Advanced (Monthly)',
      date: '18 Feb 2024',
      status: 'Active'
    },
    {
      company: 'EcoVision Enterprises',
      logo: <Wind size={16} color="#0891b2" />,
      email: 'doris@example.com',
      url: 'eve.example.com',
      plan: 'Advanced (Monthly)',
      date: '17 Oct 2024',
      status: 'Active'
    },
    {
      company: 'Aurora Technologies',
      logo: <Sun size={16} color="#9333ea" />,
      email: 'thomas@example.com',
      url: 'at.example.com',
      plan: 'Enterprise (Monthly)',
      date: '20 Jul 2024',
      status: 'Active'
    },
    {
      company: 'BlueSky Ventures',
      logo: <Zap size={16} color="#2563eb" />,
      email: 'kathleen@example.com',
      url: 'bsv.example.com',
      plan: 'Advanced (Monthly)',
      date: '10 Apr 2024',
      status: 'Active'
    },
    {
      company: 'TerraFusion Energy',
      logo: <Sun size={16} color="#ea580c" />,
      email: 'bruce@example.com',
      url: 'tfe.example.com',
      plan: 'Enterprise (Yearly)',
      date: '29 Aug 2024',
      status: 'Active'
    },
    {
      company: 'UrbanPulse Design',
      logo: <Aperture size={16} color="#2563eb" />,
      email: 'estelle@example.com',
      url: 'upd.example.com',
      plan: 'Basic (Monthly)',
      date: '22 Feb 2024',
      status: 'Inactive'
    },
    {
      company: 'Nimbus Networks',
      logo: <Wind size={16} color="#16a34a" />,
      email: 'stephen@example.com',
      url: 'nn.example.com',
      plan: 'Basic (Yearly)',
      date: '03 Nov 2024',
      status: 'Active'
    },
    {
      company: 'Epicurean Delights',
      logo: <Aperture size={16} color="#312e81" />,
      email: 'angela@example.com',
      url: 'ed.example.com',
      plan: 'Advanced (Monthly)',
      date: '17 Dec 2024',
      status: 'Active'
    }
  ];

  return (
    <div className="super-companies-page">
      {/* Header */}
      <div className="sc-header-row">
        <div>
          <h1 className="sc-page-title">Companies</h1>
          <p className="sc-page-subtitle">Manage your companies</p>
        </div>
        <div className="sc-header-actions">
          <button className="sc-btn-icon-square" title="Export PDF"><FileText size={16} color="#ef4444" /></button>
          <button className="sc-btn-icon-square" title="Export Excel"><FileSpreadsheet size={16} color="#22c55e" /></button>
          <button className="sc-btn-icon-square" title="Refresh"><RefreshCw size={16} /></button>
          <button className="sc-btn-icon-square" title="Collapse"><ChevronUp size={16} /></button>
          <button className="sc-btn-add" onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle size={16} /> Add Company
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="sc-stats-container">
        <div className="sc-stat-card">
          <div className="sc-stat-info">
            <div className="sc-stat-icon-wrapper sc-icon-orange">
              <Building2 size={24} />
            </div>
            <div className="sc-stat-content">
              <h4>Total Companies</h4>
              <p>950</p>
            </div>
          </div>
          <svg className="sc-stat-sparkline" viewBox="0 0 60 30" preserveAspectRatio="none">
            <polyline points="0,20 10,10 20,15 30,5 40,20 50,15 60,30" fill="none" stroke="#ff902f" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="sc-stat-card">
          <div className="sc-stat-info">
            <div className="sc-stat-icon-wrapper sc-icon-green">
              <Building size={24} />
            </div>
            <div className="sc-stat-content">
              <h4>Active Companies</h4>
              <p>920</p>
            </div>
          </div>
          <svg className="sc-stat-sparkline" viewBox="0 0 60 30" preserveAspectRatio="none">
            <polyline points="0,15 15,25 30,10 45,20 60,5" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="sc-stat-card">
          <div className="sc-stat-info">
            <div className="sc-stat-icon-wrapper sc-icon-red">
              <Building size={24} />
            </div>
            <div className="sc-stat-content">
              <h4>Inactive Companies</h4>
              <p>30</p>
            </div>
          </div>
          <svg className="sc-stat-sparkline" viewBox="0 0 60 30" preserveAspectRatio="none">
            <polyline points="0,25 20,5 40,15 60,10" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="sc-stat-card">
          <div className="sc-stat-info">
            <div className="sc-stat-icon-wrapper sc-icon-blue">
              <MapPin size={24} />
            </div>
            <div className="sc-stat-content">
              <h4>Company Location</h4>
              <p>180</p>
            </div>
          </div>
          <svg className="sc-stat-sparkline" viewBox="0 0 60 30" preserveAspectRatio="none">
            <polyline points="0,10 15,25 30,20 45,30 60,15" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Main Panel */}
      <div className="sc-main-panel">
        
        <div className="sc-table-controls">
          <div className="sc-search-wrap">
            <Search size={16} />
            <input type="text" className="sc-search-input" placeholder="Search" />
          </div>
          <div className="sc-filters-wrap">
            <select className="sc-filter-select sc-select">
              <option>Select Plan</option>
            </select>
            <select className="sc-filter-select sc-select">
              <option>Select Status</option>
            </select>
            <select className="sc-filter-select sc-select">
              <option>Sort By : Last 7 Days</option>
            </select>
          </div>
        </div>

        <div className="sc-table-wrapper">
          <table className="sc-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}><input type="checkbox" className="sc-checkbox" /></th>
                <th>Company Name</th>
                <th>Email</th>
                <th>Account URL</th>
                <th>Plan</th>
                <th>Created Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td><input type="checkbox" className="sc-checkbox" /></td>
                  <td>
                    <div className="sc-company-info">
                      <div className="sc-company-logo">
                        {row.logo}
                      </div>
                      {row.company}
                    </div>
                  </td>
                  <td>{row.email}</td>
                  <td>{row.url}</td>
                  <td>
                    {row.plan}
                    <span className="sc-badge-upgrade">Upgrade</span>
                  </td>
                  <td>{row.date}</td>
                  <td>
                    <span className={`sc-status-badge ${row.status === 'Active' ? 'sc-status-active' : 'sc-status-inactive'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="sc-actions-group">
                      <button className="sc-action-btn" title="View"><Eye size={14} /></button>
                      <button className="sc-action-btn" title="Edit"><Edit size={14} /></button>
                      <button className="sc-action-btn" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sc-pagination-row">
          <div className="sc-page-size">
            Row Per Page 
            <select className="sc-select" style={{padding: '4px 20px 4px 8px', border: '1px solid #eaedf0', borderRadius: '4px'}}>
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            Entries
          </div>
          <div className="sc-page-controls">
            <button className="sc-page-btn">&lt;</button>
            <button className="sc-page-btn active">1</button>
            <button className="sc-page-btn">&gt;</button>
          </div>
        </div>

      </div>

      {/* Add Company Modal Overlay */}
      {isAddModalOpen && (
        <div className="sc-modal-overlay" onMouseDown={() => setIsAddModalOpen(false)}>
          <div className="sc-modal-content" onMouseDown={(e) => e.stopPropagation()}>
            <div className="sc-modal-header">
              <h2>Add New Company</h2>
              <button className="sc-modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <XCircle size={24} fill="#ef4444" color="white" />
              </button>
            </div>
            
            <div className="sc-modal-body">
              <div className="sc-upload-section">
                <div className="sc-upload-circle">
                  <ImageIcon size={24} />
                </div>
                <div className="sc-upload-info">
                  <h4>Upload Profile Image</h4>
                  <p>Image should be below 4 mb</p>
                  <div className="sc-upload-actions">
                    <button className="sc-btn-orange" style={{padding: '6px 14px', fontSize: '12px'}}>Upload</button>
                    <button className="sc-btn-dark" style={{padding: '6px 14px', fontSize: '12px'}}>Cancel</button>
                  </div>
                </div>
              </div>

              <div className="sc-form-grid">
                <div className="sc-form-group">
                  <label className="sc-label">Name <span>*</span></label>
                  <div className="sc-input-wrap">
                    <input type="text" className="sc-input" />
                  </div>
                </div>
                <div className="sc-form-group">
                  <label className="sc-label">Email Address</label>
                  <div className="sc-input-wrap">
                    <input type="email" className="sc-input" />
                  </div>
                </div>

                <div className="sc-form-group full-width">
                  <label className="sc-label">Account URL</label>
                  <div className="sc-input-wrap">
                    <input type="text" className="sc-input" />
                  </div>
                </div>

                <div className="sc-form-group">
                  <label className="sc-label">Phone Number <span>*</span></label>
                  <div className="sc-input-wrap">
                    <input type="text" className="sc-input" />
                  </div>
                </div>
                <div className="sc-form-group">
                  <label className="sc-label">Website</label>
                  <div className="sc-input-wrap">
                    <input type="text" className="sc-input" />
                  </div>
                </div>

                <div className="sc-form-group">
                  <label className="sc-label">Password <span>*</span></label>
                  <div className="sc-input-wrap">
                    <input type={showPassword ? 'text' : 'password'} className="sc-input with-icon" />
                    <button type="button" className="sc-input-icon" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>
                <div className="sc-form-group">
                  <label className="sc-label">Confirm Password <span>*</span></label>
                  <div className="sc-input-wrap">
                    <input type={showConfirmPassword ? 'text' : 'password'} className="sc-input with-icon" />
                    <button type="button" className="sc-input-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                <div className="sc-form-group full-width">
                  <label className="sc-label">Address</label>
                  <div className="sc-input-wrap">
                    <input type="text" className="sc-input" />
                  </div>
                </div>

                <div className="sc-form-group">
                  <label className="sc-label">Plan Name <span>*</span></label>
                  <div className="sc-input-wrap">
                    <select className="sc-input sc-select">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div className="sc-form-group">
                  <label className="sc-label">Plan Type <span>*</span></label>
                  <div className="sc-input-wrap">
                    <select className="sc-input sc-select">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sc-form-row-3">
                <div className="sc-form-group">
                  <label className="sc-label">Currency <span>*</span></label>
                  <div className="sc-input-wrap">
                    <select className="sc-input sc-select">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div className="sc-form-group">
                  <label className="sc-label">Language <span>*</span></label>
                  <div className="sc-input-wrap">
                    <select className="sc-input sc-select">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div className="sc-form-group">
                  <label className="sc-label">Status</label>
                  <div className="sc-input-wrap">
                    <select className="sc-input sc-select">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div className="sc-modal-footer">
              <button className="sc-btn-dark" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="sc-btn-orange">Add Company</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
