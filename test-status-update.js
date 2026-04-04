const testStatusUpdate = async () => {
  try {
    // First, get all applications to find one to test
    const getResponse = await fetch('http://localhost:5000/api/applications');
    const getData = await getResponse.json();
    
    if (getData.data && getData.data.length > 0) {
      const testApp = getData.data[0];
      console.log('📋 Found application to test:', testApp._id, testApp.status);
      
      // Test status update
      const updateResponse = await fetch(`http://localhost:5000/api/applications/${testApp._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          reviewedBy: 'Test Admin'
        })
      });
      
      const updateData = await updateResponse.json();
      console.log('🔄 Status update response:', updateData);
      
      if (updateData.success) {
        console.log('✅ Status updated successfully!');
        console.log('📊 New status:', updateData.data.status);
        
        // Verify the update by fetching again
        const verifyResponse = await fetch('http://localhost:5000/api/applications');
        const verifyData = await verifyResponse.json();
        const updatedApp = verifyData.data.find(app => app._id === testApp._id);
        console.log('🔍 Verified status:', updatedApp.status);
      } else {
        console.log('❌ Status update failed:', updateData.message);
      }
    } else {
      console.log('❌ No applications found to test');
    }
  } catch (error) {
    console.error('❌ Error testing status update:', error);
  }
};

testStatusUpdate();
