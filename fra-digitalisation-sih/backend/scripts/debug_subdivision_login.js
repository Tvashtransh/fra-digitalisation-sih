/* Debug Subdivision Login Issue */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Admin } = require('../model/admin.js');
const bcrypt = require('bcryptjs');

async function debugSubdivisionLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== DEBUGGING SUBDIVISION LOGIN ===\n');

    // Check if subdivision officers exist
    const subdivisionOfficers = await Admin.find({ role: 'SDLCOfficer' });
    console.log(`Found ${subdivisionOfficers.length} subdivision officers:`);
    
    subdivisionOfficers.forEach(officer => {
      console.log(`- ${officer.name} (${officer.subdivisionId}) - ${officer.assignedSubdivision}`);
    });

    // Check specific officer PHN001
    const testOfficer = await Admin.findOne({ 
      subdivisionId: 'PHN001',
      role: 'SDLCOfficer'
    });

    if (testOfficer) {
      console.log('\n✅ PHN001 officer found:');
      console.log(`   Name: ${testOfficer.name}`);
      console.log(`   Subdivision ID: ${testOfficer.subdivisionId}`);
      console.log(`   Role: ${testOfficer.role}`);
      console.log(`   Subdivision: ${testOfficer.assignedSubdivision}`);
      console.log(`   Password Hash: ${testOfficer.password}`);

      // Test password
      const isPasswordValid = await bcrypt.compare('phandasubdivision123', testOfficer.password);
      console.log(`   Password Valid: ${isPasswordValid}`);

      if (!isPasswordValid) {
        console.log('\n❌ Password mismatch! Let me fix this...');
        const hashedPassword = await bcrypt.hash('phandasubdivision123', 10);
        await Admin.updateOne(
          { subdivisionId: 'PHN001' },
          { password: hashedPassword }
        );
        console.log('✅ Password updated');
      }
    } else {
      console.log('\n❌ PHN001 officer not found!');
    }

    // Test JWT secret
    console.log(`\n🔑 JWT Secret exists: ${!!process.env.JWT_SECRET}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugSubdivisionLogin();
