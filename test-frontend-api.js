// Test if frontend can call backend APIs correctly
const testFrontendAPIs = async () => {
  console.log('🧪 Testing Frontend API Connections');
  
  try {
    // Test 1: Get applications
    console.log('\n📋 Test 1: GET /api/applications');
    const appsResponse = await fetch('http://localhost:5000/api/applications');
    console.log('Status:', appsResponse.status);
    
    if (appsResponse.ok) {
      const appsData = await appsResponse.json();
      console.log('✅ Applications API working');
      console.log('📊 Found', appsData.count, 'applications');
      
      if (appsData.data && appsData.data.length > 0) {
        const testApp = appsData.data.find(app => app.status === 'pending');
        
        if (testApp) {
          console.log('\n🟢 Test 2: Approve a pending application');
          console.log('📋 Approving application:', testApp._id, testApp.name);
          
          const approveResponse = await fetch(`http://localhost:5000/api/applications/${testApp._id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'approved',
              reviewedBy: 'Frontend Test Admin'
            })
          });
          
          console.log('Approve Status:', approveResponse.status);
          
          if (approveResponse.ok) {
            const approveData = await approveResponse.json();
            console.log('✅ Approval successful:', approveData.success);
            console.log('📊 New status:', approveData.data.status);
            
            // Test 3: Verify the change
            console.log('\n🔍 Test 3: Verify the change');
            const verifyResponse = await fetch('http://localhost:5000/api/applications');
            const verifyData = await verifyResponse.json();
            const verifiedApp = verifyData.data.find(app => app._id === testApp._id);
            
            if (verifiedApp && verifiedApp.status === 'approved') {
              console.log('✅ SUCCESS: Frontend can update application status!');
              console.log('🎉 The issue is NOT with the backend');
              console.log('🔧 The issue is likely in the frontend state management');
            } else {
              console.log('❌ FAILED: Status not updated in backend');
              console.log('Expected: approved, Got:', verifiedApp?.status);
            }
          } else {
            const errorText = await approveResponse.text();
            console.log('❌ Approval failed:', errorText);
          }
        } else {
          console.log('ℹ️ No pending applications found to test approval');
        }
      }
    } else {
      console.log('❌ Applications API failed');
    }
    
  } catch (error) {
    console.error('❌ Frontend API test error:', error);
  }
};

testFrontendAPIs();
