import React from 'react';
import { 
  Search, 
  Eye, 
  Trash2, 
  Download,
  ChevronUp,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Zap,
  Globe,
  Sun,
  Aperture,
  Wind,
  TrendingUp
} from 'lucide-react';
import './super-subscriptions.css';

export default function SuperSubscriptions() {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const tableData = [
    {
      subscriber: 'BrightWave Innovations',
      logo: <Zap size={14} color="#9333ea" />,
      plan: 'Advanced (Monthly)',
      billingCycle: '30 Days',
      paymentMethod: 'Credit Card',
      amount: '$200',
      createdDate: '12 Sep 2024',
      expiringOn: '11 Oct 2024',
      status: 'Paid'
    },
    {
      subscriber: 'Stellar Dynamics',
      logo: <Aperture size={14} color="#16a34a" />,
      plan: 'Basic (Yearly)',
      billingCycle: '365 Days',
      paymentMethod: 'Paypal',
      amount: '$600',
      createdDate: '24 Oct 2024',
      expiringOn: '23 Oct 2026',
      status: 'Paid'
    },
    {
      subscriber: 'Quantum Nexus',
      logo: <Globe size={14} color="#2563eb" />,
      plan: 'Advanced (Monthly)',
      billingCycle: '30 Days',
      paymentMethod: 'Debit Card',
      amount: '$200',
      createdDate: '18 Feb 2024',
      expiringOn: '17 Mar 2024',
      status: 'Paid'
    },
    {
      subscriber: 'EcoVision Enterprises',
      logo: <Wind size={14} color="#0891b2" />,
      plan: 'Advanced (Monthly)',
      billingCycle: '30 Days',
      paymentMethod: 'Paypal',
      amount: '$200',
      createdDate: '17 Oct 2024',
      expiringOn: '16 Nov 2024',
      status: 'Paid'
    },
    {
      subscriber: 'Aurora Technologies',
      logo: <Sun size={14} color="#9333ea" />,
      plan: 'Enterprise (Monthly)',
      billingCycle: '30 Days',
      paymentMethod: 'Credit Card',
      amount: '$400',
      createdDate: '20 Jul 2024',
      expiringOn: '19 Aug 2024',
      status: 'Paid'
    },
    {
      subscriber: 'BlueSky Ventures',
      logo: <Zap size={14} color="#2563eb" />,
      plan: 'Advanced (Monthly)',
      billingCycle: '30 Days',
      paymentMethod: 'Paypal',
      amount: '$200',
      createdDate: '10 Apr 2024',
      expiringOn: '19 Aug 2024',
      status: 'Paid'
    },
    {
      subscriber: 'TerraFusion Energy',
      logo: <Sun size={14} color="#ea580c" />,
      plan: 'Enterprise (Yearly)',
      billingCycle: '365 Days',
      paymentMethod: 'Credit Card',
      amount: '$4800',
      createdDate: '29 Aug 2024',
      expiringOn: '28 Aug 2026',
      status: 'Paid'
    },
    {
      subscriber: 'UrbanPulse Design',
      logo: <Aperture size={14} color="#2563eb" />,
      plan: 'Basic (Monthly)',
      billingCycle: '30 Days',
      paymentMethod: 'Credit Card',
      amount: '$50',
      createdDate: '22 Feb 2024',
      expiringOn: '21 Mar 2024',
      status: 'Unpaid'
    },
    {
      subscriber: 'Nimbus Networks',
      logo: <Wind size={14} color="#16a34a" />,
      plan: 'Basic (Yearly)',
      billingCycle: '365 Days',
      paymentMethod: 'Paypal',
      amount: '$600',
      createdDate: '03 Nov 2024',
      expiringOn: '02 Nov 2026',
      status: 'Paid'
    },
    {
      subscriber: 'Epicurean Delights',
      logo: <Aperture size={14} color="#312e81" />,
      plan: 'Advanced (Monthly)',
      billingCycle: '30 Days',
      paymentMethod: 'Credit Card',
      amount: '$200',
      createdDate: '17 Dec 2024',
      expiringOn: '16 Jan 2024',
      status: 'Paid'
    }
  ];

  const filteredData = tableData.filter(item => 
    item.subscriber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="super-subscriptions-page">
      {/* Header */}
      <div className="ss-header-row">
        <div>
          <h1 className="ss-page-title">Subscriptions</h1>
          <p className="ss-page-subtitle">Manage your subscriptions</p>
        </div>
        <div className="ss-header-actions">
          <button className="ss-btn-icon-square" title="Export PDF"><FileText size={16} color="#ef4444" /></button>
          <button className="ss-btn-icon-square" title="Export Excel"><FileSpreadsheet size={16} color="#22c55e" /></button>
          <button className="ss-btn-icon-square" title="Refresh" onClick={() => window.location.reload()}><RefreshCw size={16} /></button>
          <button className="ss-btn-icon-square" title="Collapse"><ChevronUp size={16} /></button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ss-stats-container">
        <div className="ss-stat-card">
          <div className="ss-stat-top">
            <div className="ss-stat-info">
              <h4>Total Transaction</h4>
              <p>$5,340</p>
            </div>
            <svg className="ss-stat-sparkline" viewBox="0 0 100 40">
              <polyline points="0,30 10,25 20,35 30,15 40,28 50,18 60,32 70,12 80,22 90,5 100,20" fill="none" stroke="#ff902f" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="ss-stat-bottom">
            <TrendingUp size={14} /> +19.01% from last week
          </div>
        </div>

        <div className="ss-stat-card">
          <div className="ss-stat-top">
            <div className="ss-stat-info">
              <h4>Total Subscribers</h4>
              <p>600</p>
            </div>
            <svg className="ss-stat-sparkline" viewBox="0 0 100 40">
              <polyline points="0,35 15,25 30,30 45,15 60,25 75,10 90,20 100,5" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="ss-stat-bottom">
            <TrendingUp size={14} /> +19.01% from last week
          </div>
        </div>

        <div className="ss-stat-card">
          <div className="ss-stat-top">
            <div className="ss-stat-info">
              <h4>Active Subscribers</h4>
              <p>560</p>
            </div>
            <svg className="ss-stat-sparkline" viewBox="0 0 100 40">
              <polyline points="0,30 20,20 40,35 60,15 80,30 100,10" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="ss-stat-bottom">
            <TrendingUp size={14} /> +19.01% from last week
          </div>
        </div>

        <div className="ss-stat-card">
          <div className="ss-stat-top">
            <div className="ss-stat-info">
              <h4>Expired Subscribers</h4>
              <p>40</p>
            </div>
            <svg className="ss-stat-sparkline" viewBox="0 0 100 40">
              <polyline points="0,35 10,25 20,15 30,30 40,20 50,5 60,25 70,18 80,32 90,10 100,20" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="ss-stat-bottom">
            <TrendingUp size={14} /> +19.01% from last week
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="ss-main-panel">
        
        <div className="ss-table-controls">
          <div className="ss-search-wrap">
            <Search size={16} />
            <input 
              type="text" 
              className="ss-search-input" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ss-filters-wrap">
            <select className="ss-filter-select">
              <option>Select Plan</option>
            </select>
            <select className="ss-filter-select">
              <option>Status</option>
            </select>
            <select className="ss-filter-select">
              <option>Sort By : Last 7 Days</option>
            </select>
          </div>
        </div>

        <div className="ss-table-wrapper">
          <table className="ss-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}><input type="checkbox" className="ss-checkbox" /></th>
                <th>Subscriber</th>
                <th>Plan</th>
                <th>Billing Cycle</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Created Date</th>
                <th>Expiring On</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={index}>
                    <td><input type="checkbox" className="ss-checkbox" /></td>
                    <td>
                      <div className="ss-subscriber-info">
                        <div className="ss-subscriber-logo">
                          {row.logo}
                        </div>
                        {row.subscriber}
                      </div>
                    </td>
                    <td>{row.plan}</td>
                    <td>{row.billingCycle}</td>
                    <td>{row.paymentMethod}</td>
                    <td>{row.amount}</td>
                    <td>{row.createdDate}</td>
                    <td>{row.expiringOn}</td>
                    <td>
                      <span className={`ss-status-badge ${row.status === 'Paid' ? 'ss-status-paid' : 'ss-status-unpaid'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="ss-actions-group">
                        <button className="ss-action-btn" title="View"><Eye size={14} /></button>
                        <button className="ss-action-btn" title="Download"><Download size={14} /></button>
                        <button className="ss-action-btn" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                    No matching subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ss-pagination-row">
          <div className="ss-page-size">
            Row Per Page 
            <select>
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            Entries
          </div>
          <div className="ss-page-controls">
            <button className="ss-page-btn">&lt;</button>
            <button className="ss-page-btn active">1</button>
            <button className="ss-page-btn">&gt;</button>
          </div>
        </div>

      </div>
    </div>
  );
}
