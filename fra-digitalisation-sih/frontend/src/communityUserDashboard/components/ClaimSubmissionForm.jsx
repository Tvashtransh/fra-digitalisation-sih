import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

const ClaimSubmissionForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    claimantName: '',
    spouseName: '',
    fatherOrMotherName: '',
    village: '',
    gramPanchayat: '',
    tehsil: '',
    district: 'Bhopal',
    address: '',
    
    // Contact Information
    contactNumber: '',
    email: '',
    aadhaarNumber: '',
    
    // Family Members
    familyMembers: [{ name: '', age: '', relation: '' }],
    
    // Eligibility Status
    isST: false,
    isOTFD: false,
    isSpouseST: false,
    otfdJustification: '',
    
    // Land Details
    extentHabitation: '',
    extentSelfCultivation: '',
    compartmentNumber: '',
    landDescription: '',
    
    // Coordinates - NEW FIELD
    coordinates: {
      latitude: '',
      longitude: ''
    },
    
    // Claim Basis
    hasDisputes: false,
    disputeDescription: '',
    hasOldTitles: false,
    oldTitlesDescription: '',
    wasDisplaced: false,
    displacementDescription: '',
    isForestVillage: false,
    forestVillageDescription: '',
    hasOtherRights: false,
    otherRightsDescription: '',
    
    // Rights Requested
    rightsRequested: [],
    
    // Evidence
    evidence: {
      governmentDocuments: [],
      elderTestimonies: [],
      physicalProof: [],
      oldGovernmentRecords: [],
      thumbImpression: null
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [gps, setGps] = useState([]);

  const totalSteps = 6;

  // Fetch GPS data when tehsil changes
  useEffect(() => {
    if (formData.tehsil) {
      fetch(`/api/geo/bhopal/gps?tehsil=${encodeURIComponent(formData.tehsil)}`)
        .then(res => res.json())
        .then(data => setGps(data?.items || []))
        .catch(err => console.error('Error fetching GPS:', err));
    }
  }, [formData.tehsil]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: '', age: '', relation: '' }]
    }));
  };

  const removeFamilyMember = (index) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleRightsChange = (right) => {
    setFormData(prev => ({
      ...prev,
      rightsRequested: prev.rightsRequested.includes(right)
        ? prev.rightsRequested.filter(r => r !== right)
        : [...prev.rightsRequested, right]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.claimantName) newErrors.claimantName = 'Claimant name is required';
        if (!formData.village) newErrors.village = 'Village is required';
        if (!formData.gramPanchayat) newErrors.gramPanchayat = 'Gram Panchayat is required';
        if (!formData.tehsil) newErrors.tehsil = 'Tehsil is required';
        break;
      
      case 2: // Contact Information
        if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
        if (!formData.aadhaarNumber) newErrors.aadhaarNumber = 'Aadhaar number is required';
        break;
      
      case 3: // Land Details
        if (!formData.extentHabitation && !formData.extentSelfCultivation) {
          newErrors.landArea = 'At least one land area is required';
        }
        if (!formData.landDescription) newErrors.landDescription = 'Land description is required';
        // Validate coordinates
        if (!formData.coordinates.latitude) newErrors.latitude = 'Latitude is required';
        if (!formData.coordinates.longitude) newErrors.longitude = 'Longitude is required';
        break;
      
      case 4: // Eligibility
        if (formData.isOTFD && !formData.otfdJustification) {
          newErrors.otfdJustification = 'OTFD justification is required';
        }
        break;
      
      case 5: // Rights
        if (formData.rightsRequested.length === 0) {
          newErrors.rightsRequested = 'At least one right must be selected';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Calculate total area
      const totalArea = (parseFloat(formData.extentHabitation) || 0) + 
                       (parseFloat(formData.extentSelfCultivation) || 0);

      // Prepare claim data
      const claimData = {
        claimType: 'Individual',
        forestLandArea: totalArea,
        ifrData: {
          applicantDetails: {
            claimantName: formData.claimantName,
            spouseName: formData.spouseName,
            fatherOrMotherName: formData.fatherOrMotherName,
            address: formData.address,
            village: formData.village,
            familyMembers: formData.familyMembers.filter(m => m.name),
            gramPanchayat: formData.gramPanchayat,
            tehsil: formData.tehsil,
            district: formData.district
          },
          eligibilityStatus: {
            isST: formData.isST,
            isOTFD: formData.isOTFD,
            isSpouseST: formData.isSpouseST,
            otfdJustification: formData.otfdJustification
          },
          landDetails: {
            extentHabitation: parseFloat(formData.extentHabitation) || 0,
            extentSelfCultivation: parseFloat(formData.extentSelfCultivation) || 0,
            compartmentNumber: formData.compartmentNumber,
            landDescription: formData.landDescription
          },
          claimBasis: {
            hasDisputes: formData.hasDisputes,
            disputeDescription: formData.disputeDescription,
            hasOldTitles: formData.hasOldTitles,
            oldTitlesDescription: formData.oldTitlesDescription,
            wasDisplaced: formData.wasDisplaced,
            displacementDescription: formData.displacementDescription,
            isForestVillage: formData.isForestVillage,
            forestVillageDescription: formData.forestVillageDescription,
            hasOtherRights: formData.hasOtherRights,
            otherRightsDescription: formData.otherRightsDescription
          },
          evidence: formData.evidence
        },
        // Add coordinates to the claim
        landCoordinates: [{
          lat: parseFloat(formData.coordinates.latitude),
          lng: parseFloat(formData.coordinates.longitude)
        }]
      };

      const response = await fetch('/api/claim/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(claimData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSuccess?.(result);
        onClose();
      } else {
        setErrors({ submit: result.message || 'Failed to submit claim' });
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Claimant Name *
          </label>
          <input
            type="text"
            value={formData.claimantName}
            onChange={(e) => handleInputChange('claimantName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.claimantName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter claimant name"
          />
          {errors.claimantName && (
            <p className="text-red-500 text-sm mt-1">{errors.claimantName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spouse Name
          </label>
          <input
            type="text"
            value={formData.spouseName}
            onChange={(e) => handleInputChange('spouseName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter spouse name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father/Mother Name
          </label>
          <input
            type="text"
            value={formData.fatherOrMotherName}
            onChange={(e) => handleInputChange('fatherOrMotherName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter father or mother name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Village *
          </label>
          <input
            type="text"
            value={formData.village}
            onChange={(e) => handleInputChange('village', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.village ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter village name"
          />
          {errors.village && (
            <p className="text-red-500 text-sm mt-1">{errors.village}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tehsil *
          </label>
          <select
            value={formData.tehsil}
            onChange={(e) => handleInputChange('tehsil', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.tehsil ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Tehsil</option>
            <option value="Phanda">Phanda</option>
            <option value="Berasia">Berasia</option>
          </select>
          {errors.tehsil && (
            <p className="text-red-500 text-sm mt-1">{errors.tehsil}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gram Panchayat *
          </label>
          <select
            value={formData.gramPanchayat}
            onChange={(e) => handleInputChange('gramPanchayat', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.gramPanchayat ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Gram Panchayat</option>
            {gps.map(gp => (
              <option key={gp.gpCode} value={gp.gpName}>{gp.gpName}</option>
            ))}
          </select>
          {errors.gramPanchayat && (
            <p className="text-red-500 text-sm mt-1">{errors.gramPanchayat}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District
          </label>
          <input
            type="text"
            value={formData.district}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Enter full address"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number *
          </label>
          <input
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contactNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 10-digit mobile number"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhaar Number *
          </label>
          <input
            type="text"
            value={formData.aadhaarNumber}
            onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 12-digit Aadhaar number"
            maxLength="12"
          />
          {errors.aadhaarNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>
          )}
        </div>
      </div>

      {/* Family Members */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Family Members</h4>
          <button
            type="button"
            onClick={addFamilyMember}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.familyMembers.map((member, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-md">
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
              />
              <input
                type="number"
                value={member.age}
                onChange={(e) => handleFamilyMemberChange(index, 'age', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Age"
              />
              <input
                type="text"
                value={member.relation}
                onChange={(e) => handleFamilyMemberChange(index, 'relation', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Relation"
              />
              <button
                type="button"
                onClick={() => removeFamilyMember(index)}
                className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Land Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extent of Habitation (hectares)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.extentHabitation}
            onChange={(e) => handleInputChange('extentHabitation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter area in hectares"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extent of Self Cultivation (hectares)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.extentSelfCultivation}
            onChange={(e) => handleInputChange('extentSelfCultivation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter area in hectares"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compartment Number / Khasra Number
          </label>
          <input
            type="text"
            value={formData.compartmentNumber}
            onChange={(e) => handleInputChange('compartmentNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter compartment or khasra number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Area (hectares)
          </label>
          <input
            type="number"
            step="0.1"
            value={(parseFloat(formData.extentHabitation) || 0) + (parseFloat(formData.extentSelfCultivation) || 0)}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description of Land Boundaries *
        </label>
        <textarea
          value={formData.landDescription}
          onChange={(e) => handleInputChange('landDescription', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.landDescription ? 'border-red-500' : 'border-gray-300'
          }`}
          rows="4"
          placeholder="Describe the boundaries of the land being claimed"
        />
        {errors.landDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.landDescription}</p>
        )}
      </div>

      {/* NEW: Coordinate Input Fields */}
      <div className="border-t pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Land Coordinates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude *
            </label>
            <input
              type="number"
              step="any"
              value={formData.coordinates.latitude}
              onChange={(e) => handleNestedInputChange('coordinates', 'latitude', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.latitude ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 23.2599"
            />
            {errors.latitude && (
              <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude *
            </label>
            <input
              type="number"
              step="any"
              value={formData.coordinates.longitude}
              onChange={(e) => handleNestedInputChange('coordinates', 'longitude', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.longitude ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 77.4126"
            />
            {errors.longitude && (
              <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Please provide the approximate coordinates of the land being claimed. You can find these using GPS or online maps.
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Eligibility Status</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isST"
            checked={formData.isST}
            onChange={(e) => handleInputChange('isST', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isST" className="ml-2 block text-sm text-gray-900">
            Scheduled Tribe (ST)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isOTFD"
            checked={formData.isOTFD}
            onChange={(e) => handleInputChange('isOTFD', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isOTFD" className="ml-2 block text-sm text-gray-900">
            Other Traditional Forest Dweller (OTFD)
          </label>
        </div>

        {formData.isOTFD && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTFD Justification *
            </label>
            <textarea
              value={formData.otfdJustification}
              onChange={(e) => handleInputChange('otfdJustification', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.otfdJustification ? 'border-red-500' : 'border-gray-300'
              }`}
              rows="3"
              placeholder="Explain why you qualify as OTFD"
            />
            {errors.otfdJustification && (
              <p className="text-red-500 text-sm mt-1">{errors.otfdJustification}</p>
            )}
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isSpouseST"
            checked={formData.isSpouseST}
            onChange={(e) => handleInputChange('isSpouseST', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isSpouseST" className="ml-2 block text-sm text-gray-900">
            Spouse is Scheduled Tribe
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Rights Requested</h3>
      
      <div className="space-y-3">
        {[
          'Right to hold and live in the forest land',
          'Right to access and use forest resources',
          'Right to manage and protect forest resources',
          'Right to use water bodies',
          'Right to use minor forest produce',
          'Right to use traditional knowledge',
          'Right to use forest land for cultivation',
          'Right to use forest land for habitation'
        ].map((right) => (
          <div key={right} className="flex items-center">
            <input
              type="checkbox"
              id={right}
              checked={formData.rightsRequested.includes(right)}
              onChange={() => handleRightsChange(right)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={right} className="ml-2 block text-sm text-gray-900">
              {right}
            </label>
          </div>
        ))}
      </div>
      
      {errors.rightsRequested && (
        <p className="text-red-500 text-sm mt-2">{errors.rightsRequested}</p>
      )}
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Evidence & Documents</h3>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Physical Proof on the Land</h4>
          <p className="text-sm text-gray-600 mb-3">
            Photos of old houses, wells, bunds, fruit trees, graves, sacred sites
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Testimonies from Elders</h4>
          <p className="text-sm text-gray-600 mb-3">
            Statements from elderly community members
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Government Documents</h4>
          <p className="text-sm text-gray-600 mb-3">
            Voter ID, Ration Card, Aadhaar Card, etc.
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Old Government Records</h4>
          <p className="text-sm text-gray-600 mb-3">
            Old maps, census records, forest settlement reports
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Upload Thumb Impression or Signature</h4>
          <p className="text-sm text-gray-600 mb-3">
            Digital signature or thumb impression for verification
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">File New Claim</h2>
              <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {renderCurrentStep()}
            
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Submit Claim
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClaimSubmissionForm;
