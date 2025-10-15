const Claimant = require("../model/claimant");
const { createSecretToken } = require("../middlewares/ClaimantAuth");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { name, aadhaarNumber, contactNumber, gender, password, email, tribeCategory, village, family, address, gramPanchayat, tehsil, district, state } = req.body;
    
    // sanitize Aadhaar to digits only
    const normalizedAadhaar = (aadhaarNumber || '').toString().replace(/\D+/g, '');
    if (!/^\d{12}$/.test(normalizedAadhaar)) {
      return res.status(400).json({ message: 'Invalid Aadhaar format', success: false });
    }
    
    const existingClaimant = await Claimant.findOne({ aadhaarNumber: normalizedAadhaar });
    if (existingClaimant) {
      return res.status(409).json({ message: "Aadhaar already registered", success: false });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const claimant = await Claimant.create({
      name,
      contactNumber,
      password: hashedPassword,
      gender,
      email,
      tribeCategory,
      village,
      aadhaarNumber: normalizedAadhaar,
      family,
      address,
      gramPanchayat,
      tehsil,
      district,
      state
    });
    
    const token = createSecretToken(claimant._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    
    res.status(201).json({ 
      message: "User registered successfully", 
      success: true, 
      claimant: {
        id: claimant._id,
        name: claimant.name,
        aadhaarNumber: claimant.aadhaarNumber,
        email: claimant.email,
        village: claimant.village
      }
    });
  } catch (error) {
    if (error && error.code === 11000 && error.keyPattern && error.keyPattern.aadhaarNumber) {
      return res.status(409).json({ message: "Aadhaar already registered", success: false });
    }
    console.error('Signup error:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


module.exports.Login = async (req, res, next) => {
  try {
    const { aadhaarNumber, password } = req.body;
    
    if (!password || !aadhaarNumber) {
      return res.status(400).json({ message: 'All fields are required', success: false });
    }

    // Normalize Aadhaar number (remove non-digits)
    const normalizedAadhaar = (aadhaarNumber || '').toString().replace(/\D+/g, '');
    if (!/^\d{12}$/.test(normalizedAadhaar)) {
      return res.status(400).json({ message: 'Invalid Aadhaar format', success: false });
    }

    const claimant = await Claimant.findOne({ aadhaarNumber: normalizedAadhaar });
    if (!claimant) {
      return res.status(401).json({ message: "Claimant not found", success: false });
    }

    // Handle legacy records that may not have a password field
    if (!claimant.password) {
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }

    const isMatch = await bcrypt.compare(password, claimant.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }   
    
    const token = createSecretToken(claimant._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    
    res.status(200).json({ 
      message: "Claimant logged in successfully", 
      success: true, 
      claimant: {
        id: claimant._id,
        name: claimant.name,
        aadhaarNumber: claimant.aadhaarNumber,
        email: claimant.email,
        village: claimant.village
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Claimant Logout
module.exports.Logout = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token", {
      httpOnly: false,
      sameSite: 'lax'
    });
    
    res.status(200).json({ 
      message: "Claimant logged out successfully", 
      success: true 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const claimant = await Claimant.findById(req.user.id).select('-password');
    if (!claimant) {
      return res.status(404).json({ message: "Claimant not found", success: false });
    }
    
    res.status(200).json({ 
      message: "Profile retrieved successfully", 
      success: true, 
      claimant: {
        id: claimant._id,
        name: claimant.name,
        spouseName: claimant.spouseName,
        fatherOrMotherName: claimant.fatherOrMotherName,
        gender: claimant.gender,
        aadhaarNumber: claimant.aadhaarNumber,
        contactNumber: claimant.contactNumber,
        address: claimant.address,
        village: claimant.village,
        gramPanchayat: claimant.gramPanchayat,
        tehsil: claimant.tehsil,
        district: claimant.district,
        state: claimant.state,
        tribeCategory: claimant.tribeCategory,
        family: claimant.family || [],
        email: claimant.email || '',
        dateOfBirth: claimant.dateOfBirth || '',
        occupation: claimant.occupation || '',
        joinDate: claimant.createdAt ? new Date(claimant.createdAt).toISOString().split('T')[0] : '',
        fraId: claimant.fraId || null // FRA ID will be generated when user applies for first claim
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Update claimant profile
module.exports.updateProfile = async (req, res) => {
  try {
    const { 
      name, 
      spouseName, 
      fatherOrMotherName, 
      gender, 
      contactNumber, 
      address, 
      village, 
      gramPanchayat, 
      tehsil, 
      district, 
      state, 
      tribeCategory, 
      family,
      email,
      dateOfBirth,
      occupation
    } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        message: 'Name is required', 
        success: false 
      });
    }
    
    // Check if email is already taken by another claimant
    if (email) {
      const existingClaimant = await Claimant.findOne({ 
        email: email, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingClaimant) {
        return res.status(400).json({ 
          message: 'Email already in use by another user', 
          success: false 
        });
      }
    }
    
    // Update claimant profile
    const updatedClaimant = await Claimant.findByIdAndUpdate(
      req.user.id,
      {
        name,
        spouseName,
        fatherOrMotherName,
        gender,
        contactNumber,
        address,
        village,
        gramPanchayat,
        tehsil,
        district,
        state,
        tribeCategory,
        family: family || [],
        email,
        dateOfBirth,
        occupation
      },
      { new: true, select: '-password' }
    );
    
    if (!updatedClaimant) {
      return res.status(404).json({ 
        message: 'Claimant not found', 
        success: false 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      claimant: {
        id: updatedClaimant._id,
        name: updatedClaimant.name,
        spouseName: updatedClaimant.spouseName,
        fatherOrMotherName: updatedClaimant.fatherOrMotherName,
        gender: updatedClaimant.gender,
        aadhaarNumber: updatedClaimant.aadhaarNumber,
        contactNumber: updatedClaimant.contactNumber,
        address: updatedClaimant.address,
        village: updatedClaimant.village,
        gramPanchayat: updatedClaimant.gramPanchayat,
        tehsil: updatedClaimant.tehsil,
        district: updatedClaimant.district,
        state: updatedClaimant.state,
        tribeCategory: updatedClaimant.tribeCategory,
        family: updatedClaimant.family || [],
        email: updatedClaimant.email || '',
        dateOfBirth: updatedClaimant.dateOfBirth || '',
        occupation: updatedClaimant.occupation || '',
        joinDate: updatedClaimant.createdAt ? new Date(updatedClaimant.createdAt).toISOString().split('T')[0] : '',
        fraId: updatedClaimant.fraId || null // FRA ID will be generated when user applies for first claim
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};
