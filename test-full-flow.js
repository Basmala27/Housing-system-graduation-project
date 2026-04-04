const testFullFlow = async () => {
  try {
    console.log('🚀 Starting Full Application Flow Test');
    
    // Step 1: Create a new test application
    console.log('\n📝 Step 1: Creating new test application...');
    const createResponse = await fetch('http://localhost:5000/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        nationalId: '98765432109876',
        email: 'testuser@example.com',
        phone: '01234567890',
        projectId: '507f1f77bcf86cd799439011',
        projectName: 'Test Project',
        income: 5000,
        familySize: 3,
        currentHousing: 'Test housing for full flow test'
      })
    });
    
    const createData = await createResponse.json();
    
    if (createData.success) {
      console.log('✅ Test application created successfully!');
      console.log('📋 Application ID:', createData.data._id);
      console.log('📊 Initial status:', createData.data.status);
      
      const testAppId = createData.data._id;
      
      // Step 2: Approve the application
      console.log('\n🟢 Step 2: Approving the application...');
      const approveResponse = await fetch(`http://localhost:5000/api/applications/${testAppId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          reviewedBy: 'Test Admin'
        })
      });
      
      const approveData = await approveResponse.json();
      
      if (approveData.success) {
        console.log('✅ Application approved successfully!');
        console.log('📊 New status:', approveData.data.status);
        console.log('👤 Reviewed by:', approveData.data.reviewedBy);
        console.log('📅 Reviewed at:', approveData.data.reviewedAt);
        
        // Step 3: Verify the change
        console.log('\n🔍 Step 3: Verifying the change...');
        const verifyResponse = await fetch('http://localhost:5000/api/applications');
        const verifyData = await verifyResponse.json();
        const verifiedApp = verifyData.data.find(app => app._id === testAppId);
        
        if (verifiedApp && verifiedApp.status === 'approved') {
          console.log('✅ SUCCESS: Status change verified in database!');
          console.log('🎉 Full application flow is working correctly!');
        } else {
          console.log('❌ FAILED: Status change not persisted');
          console.log('Expected: approved, Got:', verifiedApp?.status);
        }
      } else {
        console.log('❌ Approval failed:', approveData.message);
      }
      
    } else {
      console.log('❌ Failed to create test application:', createData.message);
    }
    
  } catch (error) {
    console.error('❌ Error in full flow test:', error);
  }
};

testFullFlow();
