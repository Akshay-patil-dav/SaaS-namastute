import React, { useState, useEffect } from 'react';
import './SalesDashboard.css';
import { 
    Calendar, 
    RefreshCw, 
    ChevronUp, 
    Briefcase,
    Activity,
    ShoppingBag,
    Clock,
    Laptop,
    Smartphone,
    Monitor,
    Watch,
    Speaker,
    ChevronDown
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

export default function SalesDashboard() {
  const [dateRange] = useState("Last 7 Days");
  
  const [dashboardData, setDashboardData] = useState({
    weeklyEarnings: 0,
    percentageIncrease: 0,
    totalOrders: 0,
    totalCustomers: 0,
    bestSellers: [],
    recentTransactions: [],
    chartData: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/dashboard/sales', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const { bestSellers, recentTransactions, chartData, weeklyEarnings, percentageIncrease, totalOrders, totalCustomers } = dashboardData;

  return (
    <div className="sales-dashboard">
      <div className="sd-header">
        <div className="sd-header-title">
          <span role="img" aria-label="wave">👋</span>
          <b>Hi John Smilga,</b> here's what's happening with your store today.
        </div>
        <div className="sd-header-controls">
          <div className="sd-date-picker">
            <Calendar size={16} />
            {dateRange}
          </div>
          <button className="sd-btn-icon"><RefreshCw size={16} /></button>
          <button className="sd-btn-icon"><ChevronUp size={16} /></button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-6 col-md-12 mb-3 mb-lg-0">
          <div className="sd-stat-card sd-stat-card-white">
            <div className="sd-stat-title text-warning">Weekly Earning</div>
            <div className="sd-stat-value">${typeof weeklyEarnings === 'number' ? weeklyEarnings.toFixed(2) : weeklyEarnings}</div>
            <div className="sd-stat-subtitle text-success">
              <ChevronUp size={14} /> {percentageIncrease.toFixed(1)}% increase compare to last week
            </div>
            <div className="sd-icon-bg sd-icon-bg-white">
              <Briefcase size={24} color="#10b981" />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
          <div className="sd-stat-card sd-stat-card-orange">
            <div className="sd-stat-title"><Activity size={18} className="me-2" /></div>
            <br />
            <div className="sd-stat-value">{totalOrders}</div>
            <div className="sd-stat-subtitle">Total Orders</div>
            <div className="sd-icon-bg">
              <RefreshCw size={24} color="white" />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
          <div className="sd-stat-card sd-stat-card-navy">
            <div className="sd-stat-title"><ShoppingBag size={18} className="me-2" /></div>
            <br />
            <div className="sd-stat-value">{totalCustomers}</div>
            <div className="sd-stat-subtitle">Total Customers</div>
            <div className="sd-icon-bg">
              <RefreshCw size={24} color="white" />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-xl-4 col-lg-5 mb-3 mb-lg-0">
          <div className="sd-card">
            <div className="sd-card-header">
              <h5 className="sd-card-title">Best Seller</h5>
              <button className="btn sd-btn-view">View All</button>
            </div>
            <div className="sd-bestseller-list">
              {bestSellers.map((item, index) => (
                <div className="sd-bestseller-item" key={index}>
                  <div className="sd-bs-info">
                    <div className="sd-bs-img" style={{backgroundColor: '#e0e7ff'}}><ShoppingBag size={20} color="#4f46e5" /></div>
                    <div>
                      <h6 className="sd-bs-name">{item.name}</h6>
                      <p className="sd-bs-price">{item.price}</p>
                    </div>
                  </div>
                  <div className="sd-bs-stats text-end">
                    <p className="sd-bs-sales-label">Sales</p>
                    <p className="sd-bs-sales-val">{item.sales}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-xl-8 col-lg-7 mb-3 mb-lg-0">
          <div className="sd-card">
            <div className="sd-card-header">
              <h5 className="sd-card-title">Recent Transactions</h5>
              <button className="btn sd-btn-view">View All</button>
            </div>
            <div className="table-responsive">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order Details</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.id}</td>
                      <td>
                        <div className="sd-trans-product">
                          <div className="sd-trans-p-img"></div>
                          <div>
                            <h6 className="sd-trans-p-name">{tx.name}</h6>
                            <p className="sd-trans-p-time"><Clock size={12} /> {tx.time}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <h6 className="sd-trans-pay-type">{tx.payment}</h6>
                        <p className="sd-trans-pay-id">{tx.tid}</p>
                      </td>
                      <td>
                        <span className={`sd-badge sd-badge-${tx.stClass}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        <span className="sd-trans-amount">{tx.amount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-7 mb-4 mb-lg-0">
          <div className="sd-card">
            <div className="sd-card-header">
              <h5 className="sd-card-title">Sales Analytics</h5>
              <div className="sd-date-picker" style={{cursor: 'pointer'}}>
                <Calendar size={14} /> 2023 <ChevronDown size={14} className="ms-1" />
              </div>
            </div>
            <div className="sd-chart-wrapper" style={{minHeight: '300px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(value) => `${value/1000}K`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="uv" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="col-lg-5 mb-4 mb-lg-0">
          <div className="sd-card">
            <div className="sd-card-header">
              <h5 className="sd-card-title">Sales By Countries</h5>
              <div className="sd-date-picker" style={{cursor: 'pointer'}}>
                This Week <ChevronDown size={14} className="ms-1" />
              </div>
            </div>
            <div className="sd-map-wrapper align-items-center justify-content-center p-3">
              {/* Fallback to SVG of world map */}
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
                alt="World Map" 
                className="sd-map-img" 
                style={{filter: 'grayscale(1) contrast(1.2)'}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
