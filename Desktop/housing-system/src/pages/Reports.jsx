import React from 'react';

const Reports = () => {
  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Reports & Analytics</h2>
          <p className="text-muted mb-0">Generate and view system reports</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <i className="bi bi-file-pdf me-2"></i>Export PDF
          </button>
          <button className="btn btn-outline-success">
            <i className="bi bi-file-excel me-2"></i>Export Excel
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Total Applications</h6>
                  <h3 className="mb-0 fw-bold">306</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> 12% from last month
                  </small>
                </div>
                <div className="text-primary">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                    <i className="bi bi-file-earmark-text fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Approved</h6>
                  <h3 className="mb-0 fw-bold text-success">207</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> 8% from last month
                  </small>
                </div>
                <div className="text-success">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3">
                    <i className="bi bi-check-circle fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Pending</h6>
                  <h3 className="mb-0 fw-bold text-warning">67</h3>
                  <small className="text-muted">
                    <i className="bi bi-dash"></i> Same as last month
                  </small>
                </div>
                <div className="text-warning">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                    <i className="bi bi-clock-history fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Rejected</h6>
                  <h3 className="mb-0 fw-bold text-danger">32</h3>
                  <small className="text-danger">
                    <i className="bi bi-arrow-down"></i> 3% from last month
                  </small>
                </div>
                <div className="text-danger">
                  <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                    <i className="bi bi-x-circle fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-bar-chart me-2 text-primary"></i>
                  Monthly Applications Trend
                </h5>
                <select className="form-select form-select-sm" style={{ width: '120px' }}>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-end justify-content-between" style={{ height: '300px', padding: '20px 10px' }}>
                <div className="text-center" style={{ flex: 1 }}>
                  <div className="d-flex flex-column align-items-center" style={{ height: '250px', justifyContent: 'flex-end' }}>
                    <div className="bg-primary rounded-top" style={{ width: '35px', height: '120px', marginBottom: '2px' }}></div>
                    <div className="mt-2" style={{ fontSize: '12px', fontWeight: '500' }}>Jan</div>
                    <div className="text-muted" style={{ fontSize: '10px' }}>45</div>
                  </div>
                </div>
                <div className="text-center" style={{ flex: 1 }}>
                  <div className="d-flex flex-column align-items-center" style={{ height: '250px', justifyContent: 'flex-end' }}>
                    <div className="bg-primary rounded-top" style={{ width: '35px', height: '140px', marginBottom: '2px' }}></div>
                    <div className="mt-2" style={{ fontSize: '12px', fontWeight: '500' }}>Feb</div>
                    <div className="text-muted" style={{ fontSize: '10px' }}>52</div>
                  </div>
                </div>
                <div className="text-center" style={{ flex: 1 }}>
                  <div className="d-flex flex-column align-items-center" style={{ height: '250px', justifyContent: 'flex-end' }}>
                    <div className="bg-primary rounded-top" style={{ width: '35px', height: '100px', marginBottom: '2px' }}></div>
                    <div className="mt-2" style={{ fontSize: '12px', fontWeight: '500' }}>Mar</div>
                    <div className="text-muted" style={{ fontSize: '10px' }}>38</div>
                  </div>
                </div>
                <div className="text-center" style={{ flex: 1 }}>
                  <div className="d-flex flex-column align-items-center" style={{ height: '250px', justifyContent: 'flex-end' }}>
                    <div className="bg-primary rounded-top" style={{ width: '35px', height: '160px', marginBottom: '2px' }}></div>
                    <div className="mt-2" style={{ fontSize: '12px', fontWeight: '500' }}>Apr</div>
                    <div className="text-muted" style={{ fontSize: '10px' }}>65</div>
                  </div>
                </div>
                <div className="text-center" style={{ flex: 1 }}>
                  <div className="d-flex flex-column align-items-center" style={{ height: '250px', justifyContent: 'flex-end' }}>
                    <div className="bg-primary rounded-top" style={{ width: '35px', height: '130px', marginBottom: '2px' }}></div>
                    <div className="mt-2" style={{ fontSize: '12px', fontWeight: '500' }}>May</div>
                    <div className="text-muted" style={{ fontSize: '10px' }}>48</div>
                  </div>
                </div>
                <div className="text-center" style={{ flex: 1 }}>
                  <div className="d-flex flex-column align-items-center" style={{ height: '250px', justifyContent: 'flex-end' }}>
                    <div className="bg-primary rounded-top" style={{ width: '35px', height: '150px', marginBottom: '2px' }}></div>
                    <div className="mt-2" style={{ fontSize: '12px', fontWeight: '500' }}>Jun</div>
                    <div className="text-muted" style={{ fontSize: '10px' }}>58</div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center gap-4 mt-3">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded" style={{ width: '12px', height: '12px', marginRight: '6px' }}></div>
                  <small>Total Applications</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <h5 className="mb-0">
                <i className="bi bi-pie-chart me-2 text-primary"></i>
                Application Status
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto' }}>
                  <div 
                    style={{ 
                      width: '180px', 
                      height: '180px', 
                      borderRadius: '50%', 
                      background: 'conic-gradient(#28a745 0deg 204deg, #ffc107 204deg 272deg, #dc3545 272deg 360deg)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  ></div>
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)', 
                      background: 'white', 
                      width: '90px', 
                      height: '90px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      fontSize: '18px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    306
                  </div>
                </div>
              </div>
              <div className="legend">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <div style={{ width: '12px', height: '12px', background: '#28a745', marginRight: '8px', borderRadius: '2px' }}></div>
                    <span className="small">Approved</span>
                  </div>
                  <span className="small fw-bold">207</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <div style={{ width: '12px', height: '12px', background: '#ffc107', marginRight: '8px', borderRadius: '2px' }}></div>
                    <span className="small">Pending</span>
                  </div>
                  <span className="small fw-bold">67</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div style={{ width: '12px', height: '12px', background: '#dc3545', marginRight: '8px', borderRadius: '2px' }}></div>
                    <span className="small">Rejected</span>
                  </div>
                  <span className="small fw-bold">32</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Average Processing Time</h6>
                  <h3 className="mb-0 fw-bold">3.2 <small className="text-muted">days</small></h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> 0.5 days faster
                  </small>
                </div>
                <div className="text-info">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3">
                    <i className="bi bi-speedometer2 fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Approval Rate</h6>
                  <h3 className="mb-0 fw-bold">67.6 <small className="text-muted">%</small></h3>
                  <small className="text-muted">
                    <i className="bi bi-dash"></i> No change
                  </small>
                </div>
                <div className="text-primary">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                    <i className="bi bi-graph-up fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Active Projects</h6>
                  <h3 className="mb-0 fw-bold">6</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> 2 new this month
                  </small>
                </div>
                <div className="text-success">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3">
                    <i className="bi bi-building fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-4 pb-3">
              <h5 className="mb-0">
                <i className="bi bi-building me-2 text-primary"></i>
                Project Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Applications</th>
                      <th>Approved</th>
                      <th>Pending</th>
                      <th>Rejected</th>
                      <th>Approval Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                            <i className="bi bi-building text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-medium">Cairo Garden Residences</div>
                            <small className="text-muted">Cairo, Egypt</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark">45</span></td>
                      <td><span className="badge bg-success">30</span></td>
                      <td><span className="badge bg-warning">12</span></td>
                      <td><span className="badge bg-danger">3</span></td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px', width: '60px' }}>
                            <div className="progress-bar bg-success" style={{ width: '66.7%' }}></div>
                          </div>
                          <small className="text-muted">66.7%</small>
                        </div>
                      </td>
                      <td><span className="badge bg-success">Active</span></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                            <i className="bi bi-building text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-medium">Alexandria Coastal Towers</div>
                            <small className="text-muted">Alexandria, Egypt</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark">38</span></td>
                      <td><span className="badge bg-success">28</span></td>
                      <td><span className="badge bg-warning">7</span></td>
                      <td><span className="badge bg-danger">3</span></td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px', width: '60px' }}>
                            <div className="progress-bar bg-success" style={{ width: '73.7%' }}></div>
                          </div>
                          <small className="text-muted">73.7%</small>
                        </div>
                      </td>
                      <td><span className="badge bg-success">Active</span></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                            <i className="bi bi-building text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-medium">New Capital City Complex</div>
                            <small className="text-muted">New Capital, Egypt</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark">52</span></td>
                      <td><span className="badge bg-success">35</span></td>
                      <td><span className="badge bg-warning">14</span></td>
                      <td><span className="badge bg-danger">3</span></td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px', width: '60px' }}>
                            <div className="progress-bar bg-success" style={{ width: '67.3%' }}></div>
                          </div>
                          <small className="text-muted">67.3%</small>
                        </div>
                      </td>
                      <td><span className="badge bg-success">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
