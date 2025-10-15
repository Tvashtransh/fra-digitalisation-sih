/* Create Test Admin Officers for Hierarchical Visibility Testing */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');
const bcryptjs = require('bcryptjs');

async function createTestAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Creating Test Admin Officers ===\n');

    // Clean up existing test admins
    await Admin.deleteMany({ email: { $regex: 'test@' } });
    console.log('Cleaned up existing test admins');

    // Create Super Admin
    const superAdmin = new Admin({
      name: 'Super Admin Test',
      email: 'test@superadmin.com',
      password: 'password123', // Plain text - will be auto-hashed by pre-save middleware
      contactNumber: '9999999999',
      role: 'SuperAdmin',
      assignedDistrict: 'Bhopal'
    });
    await superAdmin.save();
    console.log('✅ Created Super Admin');

    // Create DLC Officer
    const dlcOfficer = new Admin({
      name: 'DLC Officer Test',
      email: 'test@dlc.com',
      password: 'password123', // Plain text - will be auto-hashed by pre-save middleware
      contactNumber: '9999999998',
      role: 'DLCOfficer',
      assignedDistrict: 'Bhopal'
    });
    await dlcOfficer.save();
    console.log('✅ Created DLC Officer');

    // Create Phanda SDLC Officer
    const phandaSDLC = new Admin({
      name: 'Phanda SDLC Officer',
      email: 'test@phanda-sdlc.com',
      password: 'password123', // Plain text - will be auto-hashed by pre-save middleware
      contactNumber: '9999999997',
      role: 'SDLCOfficer',
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Phanda'
    });
    await phandaSDLC.save();
    console.log('✅ Created Phanda SDLC Officer');

    // Create Berasia SDLC Officer
    const berasiaSDLC = new Admin({
      name: 'Berasia SDLC Officer',
      email: 'test@berasia-sdlc.com',
      password: 'password123', // Plain text - will be auto-hashed by pre-save middleware
      contactNumber: '9999999996',
      role: 'SDLCOfficer',
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Berasia'
    });
    await berasiaSDLC.save();
    console.log('✅ Created Berasia SDLC Officer');

    // Create Mendori Gram Sabha Officer
    const mendoriGS = new Admin({
      name: 'Mendori GS Officer',
      email: 'test@mendori-gs.com',
      password: 'password123', // Plain text - will be auto-hashed by pre-save middleware
      contactNumber: '9999999995',
      role: 'GramSabha',
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Phanda',
      assignedGramPanchayat: 'Mendori',
      assignedGpCode: 'GS-PHN-236194'
    });
    await mendoriGS.save();
    console.log('✅ Created Mendori Gram Sabha Officer');

    // Create another Gram Sabha Officer (from Berasia)
    const otherGS = new Admin({
      name: 'Other GS Officer',
      email: 'test@other-gs.com',
      password: 'password123', // Plain text - will be auto-hashed by pre-save middleware
      contactNumber: '9999999994',
      role: 'GramSabha',
      assignedDistrict: 'Bhopal',
      assignedSubdivision: 'Berasia',
      assignedGramPanchayat: 'AMARPUR',
      assignedGpCode: 'GS-BER-134252'
    });
    await otherGS.save();
    console.log('✅ Created Other Gram Sabha Officer');

    console.log('\n=== Test Admin Officers Created ===');
    console.log('Super Admin: test@superadmin.com / password123');
    console.log('DLC Officer: test@dlc.com / password123');
    console.log('Phanda SDLC: test@phanda-sdlc.com / password123');
    console.log('Berasia SDLC: test@berasia-sdlc.com / password123');
    console.log('Mendori GS: test@mendori-gs.com / password123');
    console.log('Other GS: test@other-gs.com / password123');

  } catch (error) {
    console.error('Error creating test admins:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestAdmins();
