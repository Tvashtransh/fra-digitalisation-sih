/* Remove Block Officer from Database */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');

async function removeBlockOfficer() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Removing Block Officer ===\n');

    // Remove block officer
    const result = await Admin.deleteOne({ 
      districtId: 'BHO002',
      role: 'block_officer'
    });

    if (result.deletedCount > 0) {
      console.log('✅ Block Officer (BHO002) removed successfully');
    } else {
      console.log('ℹ️ Block Officer (BHO002) not found or already removed');
    }

    // Verify only district officer remains
    const districtOfficer = await Admin.findOne({ 
      districtId: 'BHO001',
      role: 'district_officer'
    });

    if (districtOfficer) {
      console.log('✅ District Officer (BHO001) confirmed present:');
      console.log('   Name:', districtOfficer.name);
      console.log('   District ID:', districtOfficer.districtId);
      console.log('   District:', districtOfficer.assignedDistrict);
    } else {
      console.log('❌ District Officer (BHO001) not found');
    }

    console.log('\n🎉 Block Officer removal complete!');

  } catch (error) {
    console.error('Error removing block officer:', error);
  } finally {
    await mongoose.disconnect();
  }
}

removeBlockOfficer();
