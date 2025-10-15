/* Update Admin Location Information */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Admin = require('../model/admin.js');

// Sample location assignments for different roles
const locationAssignments = {
  // Gram Sabha Officers - specific to Gram Panchayats
  'GramSabha': [
    { 
      email: 'mendori@gramsabha.com', 
      assignedSubdivision: 'Phanda', 
      assignedGramPanchayat: 'Mendori',
      assignedGpCode: 'GS-PHN-001',
      assignedDistrict: 'Bhopal'
    },
    { 
      email: 'berasia@gramsabha.com', 
      assignedSubdivision: 'Berasia', 
      assignedGramPanchayat: 'Berasia',
      assignedGpCode: 'GS-BRS-001',
      assignedDistrict: 'Bhopal'
    }
  ],
  
  // SDLC Officers - specific to Subdivisions
  'SDLCOfficer': [
    { 
      email: 'phanda@sdlc.com', 
      assignedSubdivision: 'Phanda', 
      assignedDistrict: 'Bhopal'
    },
    { 
      email: 'berasia@sdlc.com', 
      assignedSubdivision: 'Berasia', 
      assignedDistrict: 'Bhopal'
    }
  ],
  
  // DLC Officers - district level
  'DLCOfficer': [
    { 
      email: 'dlc@bhopal.com', 
      assignedDistrict: 'Bhopal'
    }
  ],
  
  // Super Admin - no location restrictions
  'SuperAdmin': [
    { 
      email: 'superadmin@fra.com'
    }
  ]
};

async function updateAdminLocations() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    for (const [role, assignments] of Object.entries(locationAssignments)) {
      for (const assignment of assignments) {
        const updateResult = await Admin.findOneAndUpdate(
          { email: assignment.email, role: role },
          { 
            $set: {
              assignedDistrict: assignment.assignedDistrict,
              assignedSubdivision: assignment.assignedSubdivision,
              assignedGramPanchayat: assignment.assignedGramPanchayat,
              assignedGpCode: assignment.assignedGpCode
            }
          },
          { new: true }
        );
        
        if (updateResult) {
          console.log(`Updated ${role}: ${assignment.email} with location:`, {
            district: assignment.assignedDistrict,
            subdivision: assignment.assignedSubdivision,
            gramPanchayat: assignment.assignedGramPanchayat,
            gpCode: assignment.assignedGpCode
          });
        } else {
          console.log(`No ${role} found with email: ${assignment.email}`);
        }
      }
    }

    console.log('Location update completed');
  } catch (error) {
    console.error('Error updating admin locations:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateAdminLocations();
