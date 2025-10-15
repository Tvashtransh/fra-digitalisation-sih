// Authentication Module Demo Data & Testing Script
// This file contains sample data for testing the authentication module

const demoUsers = {
  admin: {
    login: {
      email: "admin@mota.gov.in",
      password: "AdminPass123",
      deptId: "DEPT001",
      mfaCode: "123456"
    },
    register: {
      email: "newadmin@mota.gov.in",
      password: "NewAdmin123",
      deptId: "DEPT002",
      mfaCode: "654321"
    }
  },

  stateAdmin: {
    login: {
      stateId: "ST001",
      email: "admin@maharashtra.gov.in",
      password: "StateAdmin123",
      department: "Tribal Affairs"
    },
    register: {
      stateId: "ST002",
      email: "admin@gujarat.gov.in",
      password: "GujaratAdmin123",
      department: "Forest Department"
    }
  },

  officer: {
    login: {
      districtBlockId: "DIST001",
      emailOrPhone: "officer@pune.gov.in",
      password: "OfficerPass123",
      department: "Revenue"
    },
    register: {
      districtBlockId: "BLOCK001",
      emailOrPhone: "+919876543210",
      password: "BlockOfficer123",
      department: "Forest"
    }
  },

  community: {
    login: {
      identifier: "CLAIM123456",
      passwordOrOtp: "CommunityPass123"
    },
    register: {
      identifier: "987654321012", // Aadhaar number
      passwordOrOtp: "NewCommunity123"
    }
  },

  researcher: {
    login: {
      orgId: "ORG001",
      email: "researcher@iitb.ac.in",
      password: "Researcher123",
      stateAdminApproval: true
    },
    register: {
      orgId: "ORG002",
      email: "ngo@forestconservation.org",
      password: "NGOPass123",
      stateAdminApproval: true
    }
  }
};

// Function to populate localStorage with demo data
function populateDemoData() {
  Object.keys(demoUsers).forEach(role => {
    Object.keys(demoUsers[role]).forEach(mode => {
      const storageKey = `${mode}_${role}`;
      const data = demoUsers[role][mode];
      const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');

      // Add demo data if not already present
      const isAlreadyPresent = existingData.some(item =>
        JSON.stringify(item) === JSON.stringify({ ...data, timestamp: expect.any(String) })
      );

      if (!isAlreadyPresent) {
        existingData.push({
          ...data,
          timestamp: new Date().toISOString(),
          demo: true // Mark as demo data
        });
        localStorage.setItem(storageKey, JSON.stringify(existingData));
      }
    });
  });

  console.log('✅ Demo data populated successfully!');
  console.log('📊 Check localStorage in browser dev tools to see stored data');
}

// Function to clear all authentication data
function clearAuthData() {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('login_') || key.startsWith('register_')) {
      localStorage.removeItem(key);
    }
  });
  console.log('🗑️ All authentication data cleared!');
}

// Function to view stored authentication data
function viewStoredData() {
  const authData = {};

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('login_') || key.startsWith('register_')) {
      try {
        authData[key] = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        console.error(`Error parsing ${key}:`, e);
      }
    }
  });

  console.log('📋 Stored Authentication Data:');
  console.table(authData);
  return authData;
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
  window.authDemo = {
    populateDemoData,
    clearAuthData,
    viewStoredData,
    demoUsers
  };

  console.log(`
🎯 FRA Authentication Module Demo

Available commands in browser console:
• authDemo.populateDemoData() - Add sample users
• authDemo.clearAuthData() - Clear all stored data
• authDemo.viewStoredData() - View stored authentication data
• authDemo.demoUsers - View sample user data

🚀 Try: authDemo.populateDemoData()
  `);
}

export { clearAuthData, demoUsers, populateDemoData, viewStoredData };
