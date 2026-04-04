import React from 'react';
import { CalendarRange, Building2, Users, CreditCard, ChevronDown, CheckSquare, Settings } from 'lucide-react';
import './super-dashboard.css';

export default function SuperDashboard() {
  return (
    <div className="super-dashboard">
      <div className="sd-header">
        <div>
          <h1 className="sd-header-title">Welcome, Admin</h1>
          <p className="sd-header-subtitle">You have <span>200+</span> Orders, Today</p>
        </div>
        <button className="sd-date-picker">
          <CalendarRange size={16} />
          03/29/2026 - 04/04/2026
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="sd-banner">
        <div>
          <h2 className="sd-banner-title">Welcome Back, Adrian</h2>
          <p className="sd-banner-subtitle">14 New Companies Subscribed Today !!!</p>
        </div>
        <div className="sd-banner-actions">
          <button className="btn-sd-dark">Companies</button>
          <button className="btn-sd-light">All Packages</button>
        </div>
      </div>

      <div className="sd-stats-row">
        {/* Total Companies */}
        <div className="sd-stat-card">
          <div className="sd-stat-header">
            <div className="sd-stat-icon-wrapper" style={{background: '#1c2b36', color: 'white'}}>
              <Building2 size={18} />
            </div>
            <span className="sd-stat-badge badge-green">+19.01%</span>
          </div>
          <div className="sd-stat-value">5468</div>
          <div className="sd-stat-label">Total Companies</div>
          <div className="sd-stat-chart-mock">
            <div className="sd-stat-chart-bar c-orange" style={{height: '40%'}}></div>
            <div className="sd-stat-chart-bar c-orange" style={{height: '60%'}}></div>
            <div className="sd-stat-chart-bar c-orange" style={{height: '50%'}}></div>
            <div className="sd-stat-chart-bar c-orange" style={{height: '80%'}}></div>
            <div className="sd-stat-chart-bar c-orange" style={{height: '100%'}}></div>
            <div className="sd-stat-chart-bar c-orange" style={{height: '70%'}}></div>
          </div>
        </div>

        {/* Active Companies */}
        <div className="sd-stat-card">
          <div className="sd-stat-header">
            <div className="sd-stat-icon-wrapper" style={{background: '#1c2b36', color: 'white'}}>
              <CheckSquare size={18} />
            </div>
            <span className="sd-stat-badge badge-red">-12%</span>
          </div>
          <div className="sd-stat-value">4598</div>
          <div className="sd-stat-label">Active Companies</div>
          <div className="sd-stat-chart-mock">
            <div className="sd-stat-chart-bar c-purple" style={{height: '50%'}}></div>
            <div className="sd-stat-chart-bar c-purple" style={{height: '70%'}}></div>
            <div className="sd-stat-chart-bar c-purple" style={{height: '40%'}}></div>
            <div className="sd-stat-chart-bar c-purple" style={{height: '60%'}}></div>
            <div className="sd-stat-chart-bar c-purple" style={{height: '90%'}}></div>
            <div className="sd-stat-chart-bar c-purple" style={{height: '100%'}}></div>
          </div>
        </div>

        {/* Total Subscribers */}
        <div className="sd-stat-card">
          <div className="sd-stat-header">
            <div className="sd-stat-icon-wrapper" style={{background: '#1c2b36', color: 'white'}}>
              <Users size={18} />
            </div>
            <span className="sd-stat-badge badge-green">+8%</span>
          </div>
          <div className="sd-stat-value">3698</div>
          <div className="sd-stat-label">Total Subscribers</div>
          <div className="sd-stat-chart-mock">
            <div className="sd-stat-chart-bar c-blue" style={{height: '80%'}}></div>
            <div className="sd-stat-chart-bar c-blue" style={{height: '70%'}}></div>
            <div className="sd-stat-chart-bar c-blue" style={{height: '90%'}}></div>
            <div className="sd-stat-chart-bar c-blue" style={{height: '60%'}}></div>
            <div className="sd-stat-chart-bar c-blue" style={{height: '100%'}}></div>
            <div className="sd-stat-chart-bar c-blue" style={{height: '90%'}}></div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="sd-stat-card">
          <div className="sd-stat-header">
            <div className="sd-stat-icon-wrapper" style={{background: '#1c2b36', color: 'white'}}>
              <CreditCard size={18} />
            </div>
            <span className="sd-stat-badge badge-red">-16%</span>
          </div>
          <div className="sd-stat-value">$89,878.58</div>
          <div className="sd-stat-label">Total Earnings</div>
          <div className="sd-stat-chart-mock">
            <div className="sd-stat-chart-bar c-green" style={{height: '60%'}}></div>
            <div className="sd-stat-chart-bar c-green" style={{height: '80%'}}></div>
            <div className="sd-stat-chart-bar c-green" style={{height: '100%'}}></div>
            <div className="sd-stat-chart-bar c-green" style={{height: '70%'}}></div>
            <div className="sd-stat-chart-bar c-green" style={{height: '90%'}}></div>
            <div className="sd-stat-chart-bar c-green" style={{height: '50%'}}></div>
          </div>
        </div>
      </div>

      <div className="sd-charts-row">
        {/* Companies Chart */}
        <div className="sd-card">
          <div className="sd-card-header">
            <span className="sd-card-title">Companies</span>
            <button className="sd-card-action"><CalendarRange size={12} /> This Week</button>
          </div>
          <div className="sd-bar-mock-wrapper">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const heights = ['40%', '60%', '20%', '90%', '50%', '50%', '50%'];
              return (
                <div key={i} className="sd-bar-container">
                  <div className="sd-bar-main" style={{height: heights[i]}}></div>
                  <span className="sd-bar-label">{day}</span>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: '20px', fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span className="sd-stat-badge badge-green">+6%</span>
            <span>5 Companies from last month</span>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="sd-card">
          <div className="sd-card-header">
            <span className="sd-card-title">Revenue</span>
            <button className="sd-card-action"><CalendarRange size={12} /> 2026</button>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
              <div className="sd-stat-value" style={{fontSize: '20px'}}>$45787</div>
              <div style={{fontSize: '12px', color: '#888'}}><span style={{color: '#22c55e', fontWeight: 'bold'}}>+40%</span> increased from last year</div>
            </div>
            <div style={{fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px'}}>
              <div className="sd-dot d-orange"></div> Revenue
            </div>
          </div>
          <div className="sd-bar-mock-wrapper">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
              const heights = ['40%', '30%', '45%', '80%', '85%', '90%', '80%', '80%', '80%', '85%', '20%', '80%'];
              return (
                <div key={i} className="sd-bar-container">
                  <div className="sd-bar-main orange" style={{height: heights[i], width: '80%'}}></div>
                  <span className="sd-bar-label" style={{fontSize: '10px'}}>{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Plans Chart */}
        <div className="sd-card">
          <div className="sd-card-header">
            <span className="sd-card-title">Top Plans</span>
            <button className="sd-card-action"><CalendarRange size={12} /> This Month</button>
          </div>
          <div className="sd-donut-wrapper">
            <div className="sd-donut-chart">
              <div className="sd-donut-inner"></div>
            </div>
          </div>
          <div className="sd-legend">
            <div className="sd-legend-item">
              <div className="sd-legend-color"><div className="sd-dot d-orange"></div> Basic</div>
              <strong>60%</strong>
            </div>
            <div className="sd-legend-item">
              <div className="sd-legend-color"><div className="sd-dot d-yellow"></div> Premium</div>
              <strong>20%</strong>
            </div>
            <div className="sd-legend-item">
              <div className="sd-legend-color"><div className="sd-dot d-blue"></div> Enterprise</div>
              <strong>20%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="sd-lists-row">
        {/* Recent Transactions */}
        <div className="sd-card">
          <div className="sd-card-header">
            <span className="sd-card-title">Recent Transactions</span>
            <a href="#" className="sd-action-link" style={{color: '#888'}}>View All</a>
          </div>
          <div className="sd-list-item">
            <div className="sd-list-info">
              <div className="sd-list-avatar a-green">S</div>
              <div className="sd-list-text">
                <h4>Stellar Dynamics</h4>
                <p><span style={{color: '#3b82f6'}}>#12457</span> • 14 Jan 2026</p>
              </div>
            </div>
            <div className="sd-list-value">
              <h4>+$245</h4>
              <p>Basic</p>
            </div>
          </div>
          <div className="sd-list-item">
            <div className="sd-list-info">
              <div className="sd-list-avatar a-blue">Q</div>
              <div className="sd-list-text">
                <h4>Quantum Nexus</h4>
                <p><span style={{color: '#3b82f6'}}>#65974</span> • 14 Jan 2026</p>
              </div>
            </div>
            <div className="sd-list-value">
              <h4>+$395</h4>
              <p>Enterprise</p>
            </div>
          </div>
        </div>

        {/* Recently Registered */}
        <div className="sd-card">
          <div className="sd-card-header">
            <span className="sd-card-title">Recently Registered</span>
            <a href="#" className="sd-action-link" style={{color: '#888'}}>View All</a>
          </div>
          <div className="sd-list-item">
            <div className="sd-list-info">
              <div className="sd-list-avatar a-dark">P</div>
              <div className="sd-list-text">
                <h4>Pitch</h4>
                <p>Basic (Monthly)</p>
              </div>
            </div>
            <div className="sd-list-value">
              <h4 style={{fontSize: '13px'}}>150 Users</h4>
            </div>
          </div>
          <div className="sd-list-item">
            <div className="sd-list-info">
              <div className="sd-list-avatar a-purple">I</div>
              <div className="sd-list-text">
                <h4>Initech</h4>
                <p>Enterprise (Yearly)</p>
              </div>
            </div>
            <div className="sd-list-value">
              <h4 style={{fontSize: '13px'}}>200 Users</h4>
            </div>
          </div>
        </div>

        {/* Recent Plan Expired */}
        <div className="sd-card">
          <div className="sd-card-header">
            <span className="sd-card-title">Recent Plan Expired</span>
            <a href="#" className="sd-action-link" style={{color: '#888'}}>View All</a>
          </div>
          <div className="sd-list-item">
            <div className="sd-list-info">
              <div className="sd-list-avatar a-blue">S</div>
              <div className="sd-list-text">
                <h4>Silicon Corp</h4>
                <p>Expired: 10 Apr 2026</p>
              </div>
            </div>
            <div className="sd-list-value">
              <a href="#" className="sd-action-link">Send Reminder</a>
            </div>
          </div>
          <div className="sd-list-item">
            <div className="sd-list-info">
              <div className="sd-list-avatar a-orange">H</div>
              <div className="sd-list-text">
                <h4>Hubspot</h4>
                <p>Expired: 12 Jun 2026</p>
              </div>
            </div>
            <div className="sd-list-value">
              <a href="#" className="sd-action-link">Send Reminder</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
