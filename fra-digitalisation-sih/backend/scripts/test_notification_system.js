/* Test Notification System */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Claim = require('../model/claim.js');
const Claimant = require('../model/claimant.js');
const Notification = require('../model/notification.js');
const { createClaimNotification } = require('../controller/notificationController');

async function testNotificationSystem() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing Notification System ===\n');

    // Step 1: Create a test claim for Mendori
    console.log('1. Creating test claim for Mendori...');
    
    // Find or create test claimant
    let testClaimant = await Claimant.findOne({ aadhaarNumber: '987654321098' });
    if (!testClaimant) {
      testClaimant = new Claimant({
        name: 'Test User Notification',
        aadhaarNumber: '987654321098',
        village: 'Mendori',
        gramPanchayat: 'Mendori',
        tehsil: 'Phanda',
        district: 'Bhopal',
        password: 'hashedpassword',
        tribeCategory: 'ST',
        gender: 'Male'
      });
      await testClaimant.save();
      console.log('✅ Created test claimant');
    } else {
      console.log('✅ Found existing test claimant');
    }

    // Clean up any existing test claims
    await Claim.deleteMany({ frapattaid: { $regex: 'FRA-2025-NOTIFICATION-' } });
    console.log('✅ Cleaned up existing test claims');

    // Create test claim
    const testClaim = new Claim({
      claimant: testClaimant._id,
      claimType: 'Individual',
      forestLandArea: 3.0,
      frapattaid: `FRA-2025-NOTIFICATION-${Date.now()}`,
      gramPanchayat: 'Mendori',
      tehsil: 'Phanda',
      district: 'Bhopal',
      gpCode: 'GS-PHN-236194', // Mendori GP Code
      status: 'Submitted',
      applicantDetails: {
        claimantName: 'Test User Notification',
        spouseName: 'Test Spouse',
        fatherOrMotherName: 'Test Father',
        address: 'Test Address, Mendori Village',
        village: 'Mendori',
        familyMembers: [
          { name: 'Test User Notification', age: 35, relation: 'Self' },
          { name: 'Test Spouse', age: 30, relation: 'Spouse' }
        ]
      },
      eligibilityStatus: {
        isST: true,
        isOTFD: false,
        isSpouseST: false,
        otfdJustification: ''
      },
      landDetails: {
        extentHabitation: 1.5,
        extentSelfCultivation: 1.5,
        totalAreaClaimed: 3.0,
        compartmentNumber: 'Comp-456',
        landDescription: 'Test land description for notification test'
      },
      claimBasis: {
        hasDisputes: false,
        disputeDescription: '',
        hasOldTitles: false,
        oldTitlesDescription: '',
        wasDisplaced: false,
        displacementDescription: '',
        isForestVillage: true,
        forestVillageDescription: 'This is a forest village claim for notification test',
        hasOtherRights: false,
        otherRightsDescription: ''
      },
      evidence: {
        governmentDocuments: [
          { docType: 'Aadhaar Card', details: 'Test Aadhaar details', fileUrl: '' }
        ],
        elderTestimonies: [
          { elderName: 'Elder Test Notification', testimonyDetails: 'Test testimony', fileUrl: '' }
        ],
        physicalProof: [
          { description: 'Old house structure', fileUrls: [] }
        ],
        oldGovernmentRecords: [
          { recordDescription: 'Old land records', fileUrl: '' }
        ]
      },
      declaration: {
        isInformationTrue: true,
        signatureFile: ''
      }
    });

    await testClaim.save();
    console.log(`✅ Created test claim: ${testClaim.frapattaid}`);

    // Step 2: Test notification creation
    console.log('\n2. Testing notification creation...');
    const notification = await createClaimNotification(testClaim);
    
    if (notification) {
      console.log('✅ Notification created successfully');
      console.log(`   - Notification ID: ${notification._id}`);
      console.log(`   - Title: ${notification.title}`);
      console.log(`   - Message: ${notification.message}`);
      console.log(`   - Claim ID: ${notification.claimFrapattaid}`);
    } else {
      console.log('❌ Failed to create notification');
    }

    // Step 3: Verify notification in database
    console.log('\n3. Verifying notification in database...');
    const notifications = await Notification.find({ recipientGpCode: 'GS-PHN-236194' })
      .populate('claimId', 'frapattaid status')
      .sort({ createdAt: -1 });

    console.log(`Found ${notifications.length} notifications for Mendori GP`);
    notifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. ${notif.title} - ${notif.isRead ? 'Read' : 'Unread'}`);
    });

    // Step 4: Test API endpoints
    console.log('\n4. Testing notification API endpoints...');
    
    // Test login as Mendori GS Officer
    const loginResponse = await fetch('http://localhost:8000/api/gs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gramSabhaId: 'GS-PHN-236194',
        password: 'phn-236194-2025'
      })
    });
    
    const loginResult = await loginResponse.json();
    if (loginResult.success) {
      console.log('✅ GS Officer login successful');
      
      // Extract cookies
      const cookies = loginResponse.headers.get('set-cookie');
      
      // Test notifications endpoint
      const notificationsResponse = await fetch('http://localhost:8000/api/gs/notifications', {
        method: 'GET',
        headers: {
          'Cookie': cookies || '',
          'Content-Type': 'application/json',
        }
      });
      
      const notificationsData = await notificationsResponse.json();
      if (notificationsData.success) {
        console.log(`✅ Notifications API working - Found ${notificationsData.notifications.length} notifications`);
      } else {
        console.log('❌ Notifications API failed');
      }

      // Test unread count endpoint
      const unreadResponse = await fetch('http://localhost:8000/api/gs/notifications/unread-count', {
        method: 'GET',
        headers: {
          'Cookie': cookies || '',
          'Content-Type': 'application/json',
        }
      });
      
      const unreadData = await unreadResponse.json();
      if (unreadData.success) {
        console.log(`✅ Unread count API working - ${unreadData.unreadCount} unread notifications`);
      } else {
        console.log('❌ Unread count API failed');
      }
    } else {
      console.log('❌ GS Officer login failed');
    }

    console.log('\n=== Notification System Test Complete ===');
    console.log('The Mendori GS Officer should now see a notification in their dashboard!');

  } catch (error) {
    console.error('Error testing notification system:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testNotificationSystem();

