/* Check claims and GS officers to debug visibility issue */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');
const { Admin } = require('../model/admin.js');

async function checkClaimsAndGS() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Checking Claims and GS Officers ===\n');

    // Check all claims
    const claims = await Claim.find({}).select('frapattaid gramPanchayat tehsil district gpCode status createdAt');
    console.log(`Total claims in database: ${claims.length}\n`);
    
    if (claims.length > 0) {
      console.log('Claims:');
      claims.forEach((claim, index) => {
        console.log(`${index + 1}. FRA ID: ${claim.frapattaid}`);
        console.log(`   Gram Panchayat: ${claim.gramPanchayat}`);
        console.log(`   Tehsil: ${claim.tehsil}`);
        console.log(`   District: ${claim.district}`);
        console.log(`   GP Code: ${claim.gpCode}`);
        console.log(`   Status: ${claim.status}`);
        console.log('');
      });
    }

    // Check GS officers
    const gsOfficers = await Admin.find({ role: 'GramSabha' }).select('assignedGramPanchayat assignedGpCode assignedSubdivision assignedDistrict');
    console.log(`\nTotal GS officers: ${gsOfficers.length}\n`);
    
    if (gsOfficers.length > 0) {
      console.log('GS Officers:');
      gsOfficers.forEach((officer, index) => {
        console.log(`${index + 1}. GP Code: ${officer.assignedGpCode}`);
        console.log(`   Gram Panchayat: ${officer.assignedGramPanchayat}`);
        console.log(`   Subdivision: ${officer.assignedSubdivision}`);
        console.log(`   District: ${officer.assignedDistrict}`);
        console.log('');
      });
    }

    // Check for Amla specifically
    console.log('\n=== Checking for Amla specifically ===\n');
    
    const amlaClaims = await Claim.find({ 
      $or: [
        { gramPanchayat: /amla/i },
        { gpCode: /amla/i }
      ]
    }).select('frapattaid gramPanchayat tehsil district gpCode status');
    
    console.log(`Claims with Amla: ${amlaClaims.length}`);
    amlaClaims.forEach(claim => {
      console.log(`- FRA ID: ${claim.frapattaid}, GP: ${claim.gramPanchayat}, GP Code: ${claim.gpCode}`);
    });

    const amlaGS = await Admin.find({ 
      $or: [
        { assignedGramPanchayat: /amla/i },
        { assignedGpCode: /amla/i }
      ]
    }).select('assignedGramPanchayat assignedGpCode assignedSubdivision');
    
    console.log(`\nGS Officers for Amla: ${amlaGS.length}`);
    amlaGS.forEach(officer => {
      console.log(`- GP Code: ${officer.assignedGpCode}, GP: ${officer.assignedGramPanchayat}`);
    });

    console.log('\n=== Check Complete ===');

  } catch (error) {
    console.error('Error checking claims and GS:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkClaimsAndGS();
