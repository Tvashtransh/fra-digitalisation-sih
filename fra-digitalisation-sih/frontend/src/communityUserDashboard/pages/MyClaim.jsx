import {
    CheckCircleIcon,
    ClockIcon,
    CloudArrowUpIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    MapPinIcon as LocationMarkerIcon,
    BuildingOfficeIcon as OfficeBuildingIcon,
    PaperClipIcon,
    UserGroupIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import ClaimStatusCard from "../components/ClaimStatusCard";

const initialDocuments = [
  {
    id: 1,
    name: "Physical Proof on the Land",
    description: "Photos of old houses, wells, bunds, fruit trees, graves, sacred sites",
    status: "Pending Upload",
    uploadedOn: "-",
    type: "Physical Evidence",
    file: null,
    required: true,
  },
  {
    id: 2,
    name: "Testimonies from Elders",
    description: "Statements from elderly community members",
    status: "Pending Upload",
    uploadedOn: "-",
    type: "Testimonial Evidence",
    file: null,
    required: true,
  },
  {
    id: 3,
    name: "Government Documents",
    description: "Voter ID, Ration Card, Aadhaar Card, etc.",
    status: "Pending Upload",
    uploadedOn: "-",
    type: "Government Proof",
    file: null,
    required: true,
  },
  {
    id: 4,
    name: "Old Government Records",
    description: "Old maps, census records, forest settlement reports",
    status: "Pending Upload",
    uploadedOn: "-",
    type: "Historical Records",
    file: null,
    required: true,
  },
  {
    id: 5,
    name: "Upload Thumb Impression or Signature",
    description: "Digital signature or thumb impression for verification",
    status: "Pending Upload",
    uploadedOn: "-",
    type: "Verification",
    file: null,
    required: true,
  },
];

const timeline = [
  {
    id: 1,
    title: "Application Submitted",
    date: "2025-08-15",
    description: "Initial application submitted with basic documents",
    icon: DocumentTextIcon,
    status: "completed",
  },
  {
    id: 2,
    title: "Gram Sabha Verification",
    date: "2025-08-25",
    description: "Scheduled for next Gram Sabha meeting",
    icon: UserGroupIcon,
    status: "in-progress",
  },
  {
    id: 3,
    title: "GIS Survey",
    date: "Pending",
    description: "Land mapping survey to be conducted",
    icon: LocationMarkerIcon,
    status: "pending",
  },
  {
    id: 4,
    title: "District Level Committee",
    date: "Pending",
    description: "Final verification and approval",
    icon: OfficeBuildingIcon,
    status: "pending",
  },
];

export default function MyClaim() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [notifications, setNotifications] = useState([]);
  const fileInputRef = useRef(null);

  // IFR Application form state
  const [isSubmittingIFR, setIsSubmittingIFR] = useState(false);
  const [ifrResult, setIfrResult] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([{ name: "", age: "", relation: "" }]);
  // Bhopal geo dropdowns
  const [tehsils, setTehsils] = useState([]);
  const [gps, setGps] = useState([]);
  // User profile data
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Claim tracking data
  const [userClaims, setUserClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isLoadingClaims, setIsLoadingClaims] = useState(true);
  
  // Claim eligibility data
  const [claimEligibility, setClaimEligibility] = useState(null);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(true);
  
  // Structured IFR form data
  const [ifrData, setIfrData] = useState({
    // Section A: Applicant Details
    applicantDetails: {
    claimantName: "",
    spouseName: "",
    fatherOrMotherName: "",
    address: "",
    village: "",
    gramPanchayat: "",
    tehsil: "",
      district: "Bhopal"
    },
    
    // Section B: Eligibility Status
    eligibilityStatus: {
      isST: false,
      isOTFD: false,
      isSpouseST: false,
      otfdJustification: ""
    },
    
    // Section C: Land Details
    landDetails: {
    extentHabitation: "",
    extentSelfCultivation: "",
      compartmentNumber: "",
      landDescription: ""
    },
    
    // Section D: Claim Basis (Optional sections)
    claimBasis: {
      hasDisputes: false,
      disputeDescription: "",
      hasOldTitles: false,
      oldTitlesDescription: "",
      wasDisplaced: false,
      displacementDescription: "",
      isForestVillage: false,
      forestVillageDescription: "",
      hasOtherRights: false,
      otherRightsDescription: ""
    },
    
    // Section E: Evidence
    evidence: {
      governmentDocuments: [],
      elderTestimonies: [],
      physicalProof: [],
      oldGovernmentRecords: []
    },
    
    // Section F: Declaration
    declaration: {
      isInformationTrue: false,
      signatureFile: ""
    }
  });

  // Update functions for structured IFR data
  const updateIfrField = (section, field, value) => {
    setIfrData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateEvidenceField = (evidenceType, index, field, value) => {
    setIfrData(prev => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        [evidenceType]: prev.evidence[evidenceType].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addEvidenceItem = (evidenceType, newItem) => {
    setIfrData(prev => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        [evidenceType]: [...prev.evidence[evidenceType], newItem]
      }
    }));
  };

  const removeEvidenceItem = (evidenceType, index) => {
    setIfrData(prev => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        [evidenceType]: prev.evidence[evidenceType].filter((_, i) => i !== index)
      }
    }));
  };
  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const res = await fetch('/api/claimant/profile', {
        credentials: 'include'
      });
      const body = await res.json();
      if (res.ok && body.success) {
        setUserProfile(body.claimant);
        
        // Pre-populate IFR form with user data
        setIfrData(prev => ({
          ...prev,
          applicantDetails: {
            ...prev.applicantDetails,
            claimantName: body.claimant.name || "",
            spouseName: body.claimant.spouseName || "",
            fatherOrMotherName: body.claimant.fatherOrMotherName || "",
            address: body.claimant.address || "",
            village: body.claimant.village || "",
            gramPanchayat: body.claimant.gramPanchayat || "",
            tehsil: body.claimant.tehsil || "",
            district: body.claimant.district || "Bhopal"
          },
          eligibilityStatus: {
            ...prev.eligibilityStatus,
            isST: body.claimant.tribeCategory === "ST",
            isOTFD: body.claimant.tribeCategory === "OTFD"
          }
        }));
        
        // Pre-populate family members if available
        if (body.claimant.family && body.claimant.family.length > 0) {
          setFamilyMembers(body.claimant.family);
        }
      } else {
        addNotification('Failed to load profile data', 'error');
      }
    } catch (error) {
      addNotification('Error loading profile data', 'error');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Load Bhopal tehsils on mount
  useEffect(() => {
    (async()=>{
      try {
        const res = await fetch('/api/geo/bhopal/tehsils');
        const body = await res.json();
        setTehsils(body?.tehsils || []);
      } catch {}
    })();
  }, []);

  // Fetch user claims
  const fetchUserClaims = async () => {
    try {
      setIsLoadingClaims(true);
      console.log('🔍 Fetching user claims...');
      
      const res = await fetch('/api/claims', {
        credentials: 'include'
      });
      
      console.log('📡 API Response status:', res.status);
      
      const body = await res.json();
      console.log('📄 API Response body:', body);
      
      if (res.ok && body.success) {
        console.log('✅ Claims loaded successfully:', body.claims.length, 'claims');
        setUserClaims(body.claims);
        // Select the first claim if available
        if (body.claims.length > 0) {
          setSelectedClaim(body.claims[0]);
          console.log('🎯 Selected claim:', body.claims[0].frapattaid, 'Status:', body.claims[0].status);
        } else {
          console.log('⚠️ No claims found for user');
        }
      } else {
        console.error('❌ API Error:', body);
        addNotification('Failed to load claims', 'error');
      }
    } catch (error) {
      console.error('❌ Fetch Error:', error);
      addNotification('Error loading claims', 'error');
    } finally {
      setIsLoadingClaims(false);
    }
  };

  // Fetch claim eligibility
  const fetchClaimEligibility = async () => {
    try {
      setIsLoadingEligibility(true);
      const res = await fetch('/api/claim-eligibility', {
        credentials: 'include'
      });
      const body = await res.json();
      if (res.ok && body.success) {
        setClaimEligibility(body);
      } else {
        addNotification('Failed to check claim eligibility', 'error');
      }
    } catch (error) {
      addNotification('Error checking claim eligibility', 'error');
    } finally {
      setIsLoadingEligibility(false);
    }
  };

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
    fetchUserClaims();
    fetchClaimEligibility();
  }, []);

  // When tehsil changes, load respective Gram Panchayats
  useEffect(() => {
    if (!ifrData.applicantDetails.tehsil) { setGps([]); return; }
    (async()=>{
      try {
        const res = await fetch(`/api/geo/bhopal/gps?tehsil=${encodeURIComponent(ifrData.applicantDetails.tehsil)}`);
        const body = await res.json();
        setGps(body?.items || []);
      } catch { setGps([]); }
    })();
  }, [ifrData.applicantDetails.tehsil]);
  const updateFamilyMember = (index, field, value) => {
    setFamilyMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };
  const addFamilyMember = () => setFamilyMembers(prev => [...prev, { name: "", age: "", relation: "" }]);
  const removeFamilyMember = (index) => setFamilyMembers(prev => prev.filter((_, i) => i !== index));

  // Simulate API calls
  const fetchClaimStatus = async () => {
    // Simulate API call to fetch claim status
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      currentStep: 2,
      lastUpdated: new Date(),
      documents: documents
    };
  };

  const updateDocumentStatus = async (documentId, status) => {
    // Simulate API call to update document status
    await new Promise(resolve => setTimeout(resolve, 500));
    setDocuments(prev => prev.map(doc =>
      doc.id === documentId ? { ...doc, status } : doc
    ));
  };

  // Simulate periodic status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      // Simulate random status updates for documents under review
      const underReviewDocs = documents.filter(doc => doc.status === 'Under Review');
      if (underReviewDocs.length > 0 && Math.random() < 0.3) {
        const randomDoc = underReviewDocs[Math.floor(Math.random() * underReviewDocs.length)];
        await updateDocumentStatus(randomDoc.id, 'Verified');
        addNotification(`Document "${randomDoc.name}" has been verified!`, 'success');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [documents]);

  const handleFileUpload = async (event, documentId) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      addNotification('Invalid file type. Please upload PDF, JPG, or PNG files.', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification('File size too large. Please upload files smaller than 5MB.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update document status
    setDocuments(prev => prev.map(doc =>
      doc.id === documentId
        ? {
            ...doc,
            status: "Under Review",
            uploadedOn: new Date().toISOString().split('T')[0],
            file: file
          }
        : doc
    ));

    setIsUploading(false);
    setUploadProgress(0);
    addNotification(`Successfully uploaded ${file.name}`, 'success');
  };

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Under Review':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'Pending Upload':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Pending Upload':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const completedDocuments = documents.filter(doc => doc.status === 'Verified').length;
  const totalDocuments = documents.length;
  const uploadProgressPercent = (completedDocuments / totalDocuments) * 100;

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg max-w-sm ${
                notification.type === 'success'
                  ? 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-200'
                  : notification.type === 'error'
                  ? 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-200'
                  : 'bg-blue-100 border border-blue-400 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200'
              }`}
            >
              <div className="flex items-center">
                {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5 mr-2" />}
                {notification.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
                <p className="text-sm">{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-bg-1 px-4 sm:px-6 py-6 sm:py-8 rounded-b-lg shadow-md mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            My Claim Details
          </h1>
          <p className="text-white/90">
            Track your claim progress and manage documents
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Status and Timeline */}
        <div className="space-y-8">
          {isLoadingClaims ? (
            <div className="card">
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500 mt-2">Loading your claims...</p>
              </div>
            </div>
          ) : userClaims.length > 0 ? (
            <div className="space-y-4">
              {/* Claim Selector */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Your Claims</h3>
                <div className="space-y-2">
                  {userClaims.map((claim) => (
                    <div
                      key={claim._id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedClaim?._id === claim._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedClaim(claim)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{claim.frapattaid}</p>
                          <p className="text-sm text-gray-600">
                            {claim.landDetails?.totalAreaClaimed || claim.forestLandArea} hectares
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(claim.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          claim.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                          claim.status === 'MappedByGramSabha' ? 'bg-blue-100 text-blue-800' :
                          claim.status === 'forwarded_to_district' ? 'bg-purple-100 text-purple-800' :
                          claim.status === 'UnderDistrictReview' ? 'bg-orange-100 text-orange-800' :
                          claim.status === 'Title Granted' ? 'bg-green-100 text-green-800' :
                          claim.status === 'FinalRejected' ? 'bg-red-100 text-red-800' :
                          claim.status === 'RecommendedByGramSabha' ? 'bg-blue-100 text-blue-800' :
                          claim.status === 'ApprovedBySDLC' ? 'bg-green-100 text-green-800' :
                          claim.status === 'ApprovedByDLC' ? 'bg-green-100 text-green-800' :
                          claim.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {claim.status === 'Title Granted' ? 'Title Granted' :
                           claim.status === 'FinalRejected' ? 'Rejected' :
                           claim.status === 'forwarded_to_district' ? 'Under Review' :
                           claim.status === 'UnderDistrictReview' ? 'District Review' :
                           claim.status === 'MappedByGramSabha' ? 'GS Verified' :
                           claim.status.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Claim Status Card */}
              <ClaimStatusCard 
                claimId={selectedClaim?.frapattaid} 
                claim={selectedClaim}
                onRefresh={fetchUserClaims}
              />
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No claims found</p>
                <p className="text-sm text-gray-400">Submit your first IFR application below</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="card">
            <div className="section-heading mb-4 -mx-6 -mt-6">
              <h2 className="text-lg font-semibold">Claim Timeline</h2>
            </div>
            <div className="relative border-l-2 border-gray-200 ml-6 space-y-8">
              {timeline.map((item) => (
                <div key={item.id} className="relative pl-10">
                  {/* Icon */}
                  <span className={`absolute -left-[22px] flex items-center justify-center w-10 h-10 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'in-progress' ? 'bg-numbering' : 'bg-gray-300'
                  }`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </span>
                  {/* Content */}
                  <h3 className={`text-lg font-medium ${
                    item.status === 'completed' ? 'text-gray-500 line-through' : 'text-heading'
                  }`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                  <p className="mt-1 text-sm">{item.description}</p>
                  {item.status === 'in-progress' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-numbering/10 text-numbering mt-1">
                      In Progress
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - IFR Application + Documents */}
        <div className="space-y-8">
          {/* Claim Eligibility Check */}
          {isLoadingEligibility ? (
            <div className="card">
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500 mt-2">Checking claim eligibility...</p>
              </div>
            </div>
          ) : claimEligibility && !claimEligibility.canSubmit ? (
            <div className="card">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-yellow-800">Cannot Submit New Claim</h3>
                    <p className="text-sm text-yellow-700 mt-1">{claimEligibility.reason}</p>
                    {claimEligibility.currentClaim && (
                      <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-300">
                        <p className="text-xs font-medium text-yellow-800">Current Claim Details:</p>
                        <p className="text-xs text-yellow-700">Claim ID: {claimEligibility.currentClaim.frapattaid}</p>
                        <p className="text-xs text-yellow-700">Status: {claimEligibility.currentClaim.status.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-xs text-yellow-700">Submitted: {new Date(claimEligibility.currentClaim.createdAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    {claimEligibility.previousClaim && (
                      <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                        <p className="text-xs font-medium text-red-800">Previous Claim (Rejected):</p>
                        <p className="text-xs text-red-700">Claim ID: {claimEligibility.previousClaim.frapattaid}</p>
                        <p className="text-xs text-red-700">Status: {claimEligibility.previousClaim.status}</p>
                        <p className="text-xs text-red-700">Submitted: {new Date(claimEligibility.previousClaim.createdAt).toLocaleDateString()}</p>
                        {claimEligibility.previousClaim.remarks && (
                          <p className="text-xs text-red-700">Remarks: {claimEligibility.previousClaim.remarks}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : claimEligibility && claimEligibility.canSubmit ? (
            <div className="card">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-green-800">Ready to Submit</h3>
                    <p className="text-sm text-green-700 mt-1">{claimEligibility.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* IFR Application Form */}
          <div className="card">
            <div className="section-heading mb-4 -mx-6 -mt-6">
              <h2 className="text-lg font-semibold">Apply for Individual Forest Rights (IFR)</h2>
              <p className="text-sm text-gray-500">Fill the details below and submit your claim. This form is designed to be user-friendly and guide you through the application process.</p>
            </div>

            {/* Section A: Applicant Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Section A: Applicant Details</h3>
              {isLoadingProfile ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading your profile data...</p>
                </div>
              ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                    <Label>Name of the claimant(s) *</Label>
                    <Input 
                      value={ifrData.applicantDetails.claimantName} 
                      onChange={(e)=>updateIfrField('applicantDetails', 'claimantName', e.target.value)} 
                      placeholder="Full name" 
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">✓ Pre-filled from registration</p>
              </div>
              <div className="space-y-2">
                <Label>Name of the spouse</Label>
                    <Input 
                      value={ifrData.applicantDetails.spouseName} 
                      onChange={(e)=>updateIfrField('applicantDetails', 'spouseName', e.target.value)} 
                      placeholder="Spouse name" 
                    />
              </div>
              <div className="space-y-2">
                <Label>Name of father/ mother</Label>
                    <Input 
                      value={ifrData.applicantDetails.fatherOrMotherName} 
                      onChange={(e)=>updateIfrField('applicantDetails', 'fatherOrMotherName', e.target.value)} 
                      placeholder="Father/Mother name" 
                    />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                    <Input 
                      value={ifrData.applicantDetails.address} 
                      onChange={(e)=>updateIfrField('applicantDetails', 'address', e.target.value)} 
                      placeholder="Address" 
                    />
              </div>
              <div className="space-y-2">
                    <Label>Village *</Label>
                    <Input 
                      value={ifrData.applicantDetails.village} 
                      onChange={(e)=>updateIfrField('applicantDetails', 'village', e.target.value)} 
                      placeholder="Village" 
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">✓ Pre-filled from registration</p>
              </div>
              <div className="space-y-2">
                    <Label>Tehsil / Taluka *</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={ifrData.applicantDetails.tehsil}
                      onChange={(e)=>updateIfrField('applicantDetails', 'tehsil', e.target.value)}
                >
                  <option value="">Select Tehsil (Bhopal)</option>
                  {tehsils.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                    <Input 
                      value={ifrData.applicantDetails.district} 
                      onChange={(e)=>updateIfrField('applicantDetails', 'district', e.target.value)} 
                      placeholder="District" 
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">✓ Pre-filled from registration</p>
              </div>
              <div className="space-y-2">
                    <Label>Gram Panchayat *</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={ifrData.applicantDetails.gramPanchayat}
                      onChange={(e)=>updateIfrField('applicantDetails', 'gramPanchayat', e.target.value)}
                >
                  <option value="">Select Gram Panchayat</option>
                  {gps.map(g => (
                    <option key={g.gpCode} value={g.gpName}>{g.gpName}</option>
                  ))}
                </select>
              </div>
                  {/* Aadhaar Number - Read Only */}
                  <div className="space-y-2 md:col-span-2">
                    <Label>Aadhaar Number</Label>
                    <Input 
                      value={userProfile?.aadhaarNumber || ""} 
                      placeholder="Aadhaar Number" 
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">✓ Pre-filled from registration (cannot be changed)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section B: Eligibility Status */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Section B: Eligibility Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                  <Label>Are you a Scheduled Tribe?</Label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    value={ifrData.eligibilityStatus.isST ? 'Yes' : 'No'} 
                    onChange={(e)=>updateIfrField('eligibilityStatus', 'isST', e.target.value === 'Yes')}
                    disabled={userProfile?.tribeCategory}
                    className={userProfile?.tribeCategory ? 'bg-gray-50' : ''}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
                  {userProfile?.tribeCategory && (
                    <p className="text-xs text-gray-500">✓ Pre-filled from registration</p>
                  )}
              </div>
              <div className="space-y-2">
                  <Label>Are you an Other Traditional Forest Dweller?</Label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    value={ifrData.eligibilityStatus.isOTFD ? 'Yes' : 'No'} 
                    onChange={(e)=>updateIfrField('eligibilityStatus', 'isOTFD', e.target.value === 'Yes')}
                    disabled={userProfile?.tribeCategory}
                    className={userProfile?.tribeCategory ? 'bg-gray-50' : ''}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
                  {userProfile?.tribeCategory && (
                    <p className="text-xs text-gray-500">✓ Pre-filled from registration</p>
                  )}
              </div>
              <div className="space-y-2">
                  <Label>Is your spouse a Scheduled Tribe?</Label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    value={ifrData.eligibilityStatus.isSpouseST ? 'Yes' : 'No'} 
                    onChange={(e)=>updateIfrField('eligibilityStatus', 'isSpouseST', e.target.value === 'Yes')}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
              </div>
              </div>
              
              {/* OTFD Justification - Show only if OTFD is Yes */}
              {ifrData.eligibilityStatus.isOTFD && (
                <div className="mt-4">
                  <Label>Please briefly explain how your family has been residing in and depending on this forest for three generations (75 years):</Label>
                  <textarea 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" 
                    rows="3" 
                    value={ifrData.eligibilityStatus.otfdJustification} 
                    onChange={(e)=>updateIfrField('eligibilityStatus', 'otfdJustification', e.target.value)}
                    placeholder="Describe your family's history of residence and dependence on forest land..."
                  />
                </div>
              )}
            </div>

            {/* Family Members */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Family Members</h3>
              {userProfile?.family && userProfile.family.length > 0 && (
                <p className="text-xs text-gray-500 mb-3">✓ Family members pre-filled from registration. You can add more if needed.</p>
              )}
              <div className="space-y-3">
                {familyMembers.map((m, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                    <Input placeholder="Name" value={m.name} onChange={(e)=>updateFamilyMember(idx,'name',e.target.value)} />
                    <Input placeholder="Age" value={m.age} onChange={(e)=>updateFamilyMember(idx,'age',e.target.value)} />
                    <Input placeholder="Relation" value={m.relation} onChange={(e)=>updateFamilyMember(idx,'relation',e.target.value)} />
                    <Button variant="secondary" type="button" onClick={()=>removeFamilyMember(idx)}>Remove</Button>
                  </div>
                ))}
                <Button type="button" className="px-4 py-2 text-sm font-semibold rounded-md shadow-sm" onClick={addFamilyMember}>Add Member</Button>
              </div>
            </div>

            {/* Section C: Details of Forest Land Being Claimed */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Section C: Details of Forest Land Being Claimed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label>Extent for Habitation (in hectares)</Label>
                  <Input 
                    value={ifrData.landDetails.extentHabitation} 
                    onChange={(e)=>updateIfrField('landDetails', 'extentHabitation', e.target.value)} 
                    placeholder="e.g. 0.10" 
                  />
              </div>
              <div className="space-y-2">
                  <Label>Extent for Self-cultivation (in hectares)</Label>
                  <Input 
                    value={ifrData.landDetails.extentSelfCultivation} 
                    onChange={(e)=>updateIfrField('landDetails', 'extentSelfCultivation', e.target.value)} 
                    placeholder="e.g. 0.50" 
                  />
              </div>
                <div className="space-y-2">
                  <Label>Total Area Claimed (in hectares) *</Label>
                  <Input 
                    value={(() => {
                      const hab = parseFloat(ifrData.landDetails.extentHabitation) || 0;
                      const cult = parseFloat(ifrData.landDetails.extentSelfCultivation) || 0;
                      return (hab + cult).toFixed(2);
                    })()}
                    readOnly
                    className="bg-gray-50"
                  />
              </div>
                <div className="space-y-2">
                  <Label>Forest Compartment No. / Khasra No. (if known)</Label>
                  <Input 
                    value={ifrData.landDetails.compartmentNumber} 
                    onChange={(e)=>updateIfrField('landDetails', 'compartmentNumber', e.target.value)} 
                    placeholder="e.g. Compartment 123 or Khasra 456" 
                  />
              </div>
              </div>
              <div className="mt-4">
                <Label>Description of Land Boundaries</Label>
                <textarea 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" 
                  rows="3" 
                  value={ifrData.landDetails.landDescription} 
                  onChange={(e)=>updateIfrField('landDetails', 'landDescription', e.target.value)}
                  placeholder="Describe the boundaries of the land you are claiming (e.g., North: River, South: Road, East: Forest boundary, West: Village boundary)"
                />
              </div>
              </div>

            {/* Section D: Nature and Basis of Your Claim (Optional Sections) */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Section D: Nature and Basis of Your Claim (Optional Sections)</h3>
              <p className="text-sm text-gray-600 mb-4">Fill only those sections that apply to your situation</p>
              
              <div className="space-y-6">
                {/* Disputes */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <input 
                      type="checkbox" 
                      checked={ifrData.claimBasis.hasDisputes}
                      onChange={(e)=>updateIfrField('claimBasis', 'hasDisputes', e.target.checked)}
                      className="rounded"
                    />
                    <Label>Is this land under any dispute with the Forest Department or any other authority?</Label>
              </div>
                  {ifrData.claimBasis.hasDisputes && (
                    <div className="mt-2">
                      <Label className="text-sm">Please describe the dispute and who it is with:</Label>
                      <textarea 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" 
                        rows="2" 
                        value={ifrData.claimBasis.disputeDescription} 
                        onChange={(e)=>updateIfrField('claimBasis', 'disputeDescription', e.target.value)}
                        placeholder="e.g., land claimed by forest guard, ongoing court case, etc."
                      />
                    </div>
                  )}
            </div>

                {/* Old Titles */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <input 
                      type="checkbox" 
                      checked={ifrData.claimBasis.hasOldTitles}
                      onChange={(e)=>updateIfrField('claimBasis', 'hasOldTitles', e.target.checked)}
                      className="rounded"
                    />
                    <Label>Do you have any old patta, lease, or government grant for this land?</Label>
              </div>
                  {ifrData.claimBasis.hasOldTitles && (
                    <div className="mt-2">
                      <Label className="text-sm">Please provide details (Patta number, date, issuing authority):</Label>
                      <textarea 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" 
                        rows="2" 
                        value={ifrData.claimBasis.oldTitlesDescription} 
                        onChange={(e)=>updateIfrField('claimBasis', 'oldTitlesDescription', e.target.value)}
                        placeholder="e.g., Patta No. 12345, dated 15/03/1985, issued by Tehsildar"
                      />
              </div>
                  )}
            </div>

                {/* Displacement */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <input 
                      type="checkbox" 
                      checked={ifrData.claimBasis.wasDisplaced}
                      onChange={(e)=>updateIfrField('claimBasis', 'wasDisplaced', e.target.checked)}
                      className="rounded"
                    />
                    <Label>Were you illegally displaced from this land without compensation?</Label>
                  </div>
                  {ifrData.claimBasis.wasDisplaced && (
                    <div className="mt-2">
                      <Label className="text-sm">Please describe when and how you were displaced:</Label>
                      <textarea 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" 
                        rows="2" 
                        value={ifrData.claimBasis.displacementDescription} 
                        onChange={(e)=>updateIfrField('claimBasis', 'displacementDescription', e.target.value)}
                        placeholder="e.g., displaced in 1990 by forest department, no compensation provided"
                      />
                    </div>
                  )}
                </div>

                {/* Forest Village */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <input 
                      type="checkbox" 
                      checked={ifrData.claimBasis.isForestVillage}
                      onChange={(e)=>updateIfrField('claimBasis', 'isForestVillage', e.target.checked)}
                      className="rounded"
                    />
                    <Label>Is this land part of a forest village?</Label>
                  </div>
                  {ifrData.claimBasis.isForestVillage && (
                    <div className="mt-2">
                      <Label className="text-sm">Please provide details:</Label>
                      <textarea 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" 
                        rows="2" 
                        value={ifrData.claimBasis.forestVillageDescription} 
                        onChange={(e)=>updateIfrField('claimBasis', 'forestVillageDescription', e.target.value)}
                        placeholder="Describe the forest village details"
                      />
                    </div>
                  )}
                </div>

                {/* Other Rights */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <input 
                      type="checkbox" 
                      checked={ifrData.claimBasis.hasOtherRights}
                      onChange={(e)=>updateIfrField('claimBasis', 'hasOtherRights', e.target.checked)}
                      className="rounded"
                    />
                    <Label>Are you claiming any other traditional rights (access to paths, water bodies, sacred sites)?</Label>
                  </div>
                  {ifrData.claimBasis.hasOtherRights && (
                    <div className="mt-2">
                      <Label className="text-sm">Please describe the other rights you are claiming:</Label>
                      <textarea 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none" 
                        rows="2" 
                        value={ifrData.claimBasis.otherRightsDescription} 
                        onChange={(e)=>updateIfrField('claimBasis', 'otherRightsDescription', e.target.value)}
                        placeholder="e.g., access to water source, sacred grove, traditional path"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section E: Evidence in Support of Claim */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Section E: Evidence in Support of Claim</h3>
              <p className="text-sm text-gray-600 mb-4">Please provide at least two types of evidence. The more evidence you provide, the stronger your claim.</p>
              
              <div className="space-y-6">
                {/* Government Documents */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Government Documents (Voter ID, Ration Card, Aadhar Card, etc.)</h4>
                  {ifrData.evidence.governmentDocuments.map((doc, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <Input 
                        placeholder="Document Type" 
                        value={doc.docType} 
                        onChange={(e)=>updateEvidenceField('governmentDocuments', index, 'docType', e.target.value)} 
                      />
                      <Input 
                        placeholder="Details" 
                        value={doc.details} 
                        onChange={(e)=>updateEvidenceField('governmentDocuments', index, 'details', e.target.value)} 
                      />
                      <div className="flex gap-2">
                        <input type="file" className="text-sm" />
                        <Button size="sm" variant="destructive" onClick={()=>removeEvidenceItem('governmentDocuments', index)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button size="sm" onClick={()=>addEvidenceItem('governmentDocuments', {docType: '', details: '', fileUrl: ''})}>Add Document</Button>
                </div>

                {/* Elder Testimonies */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Testimonies from Elders (Statements from elderly community members)</h4>
                  {ifrData.evidence.elderTestimonies.map((testimony, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <Input 
                        placeholder="Elder's Name" 
                        value={testimony.elderName} 
                        onChange={(e)=>updateEvidenceField('elderTestimonies', index, 'elderName', e.target.value)} 
                      />
                      <div className="flex gap-2">
                        <input type="file" className="text-sm" />
                        <Button size="sm" variant="destructive" onClick={()=>removeEvidenceItem('elderTestimonies', index)}>Remove</Button>
                      </div>
                      <textarea 
                        className="col-span-2 rounded-md border border-input bg-background px-3 py-2 text-sm" 
                        rows="2" 
                        placeholder="Details of testimony"
                        value={testimony.testimonyDetails} 
                        onChange={(e)=>updateEvidenceField('elderTestimonies', index, 'testimonyDetails', e.target.value)} 
                      />
                    </div>
                  ))}
                  <Button size="sm" onClick={()=>addEvidenceItem('elderTestimonies', {elderName: '', testimonyDetails: '', fileUrl: ''})}>Add Testimony</Button>
                </div>

                {/* Physical Proof */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Physical Proof on the Land (Photos of old houses, wells, bunds, fruit trees, graves, sacred sites)</h4>
                  {ifrData.evidence.physicalProof.map((proof, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                      <textarea 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-2" 
                        rows="2" 
                        placeholder="Description of proof"
                        value={proof.description} 
                        onChange={(e)=>updateEvidenceField('physicalProof', index, 'description', e.target.value)} 
                      />
                      <div className="flex gap-2">
                        <input type="file" multiple className="text-sm" />
                        <Button size="sm" variant="destructive" onClick={()=>removeEvidenceItem('physicalProof', index)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button size="sm" onClick={()=>addEvidenceItem('physicalProof', {description: '', fileUrls: []})}>Add Physical Proof</Button>
                </div>

                {/* Old Government Records */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Old Government Records (Old maps, census records, forest settlement reports)</h4>
                  {ifrData.evidence.oldGovernmentRecords.map((record, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <textarea 
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm" 
                        rows="2" 
                        placeholder="Description of record"
                        value={record.recordDescription} 
                        onChange={(e)=>updateEvidenceField('oldGovernmentRecords', index, 'recordDescription', e.target.value)} 
                      />
                      <div className="flex gap-2">
                        <input type="file" className="text-sm" />
                        <Button size="sm" variant="destructive" onClick={()=>removeEvidenceItem('oldGovernmentRecords', index)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button size="sm" onClick={()=>addEvidenceItem('oldGovernmentRecords', {recordDescription: '', fileUrl: ''})}>Add Record</Button>
                </div>
              </div>
            </div>

            {/* Section F: Declaration and Submission */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Section F: Declaration and Submission</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    checked={ifrData.declaration.isInformationTrue}
                    onChange={(e)=>updateIfrField('declaration', 'isInformationTrue', e.target.checked)}
                    className="mt-1 rounded"
                  />
                  <Label className="text-sm">
                    I declare that the information provided in this application is true and correct to the best of my knowledge. 
                    I understand that any false information may result in rejection of my claim.
                  </Label>
                </div>
                
              <div className="space-y-2">
                  <Label>Upload Thumb Impression or Signature</Label>
                  <input type="file" accept="image/*" className="w-full text-sm" />
              </div>
                
                <div className="text-sm text-gray-600">
                  <p>Date of Application: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button
                  type="button"
                disabled={isSubmittingIFR || !ifrData.declaration.isInformationTrue || !claimEligibility?.canSubmit}
                  onClick={async ()=>{
                  // Check claim eligibility first
                  if (!claimEligibility?.canSubmit) {
                    addNotification('You cannot submit a new claim at this time', 'error');
                      return;
                    }
                  
                  // Validation
                  if (!ifrData.applicantDetails.claimantName || !ifrData.applicantDetails.village || !ifrData.applicantDetails.gramPanchayat || !ifrData.applicantDetails.tehsil) {
                    addNotification('Please fill required fields (name, village, gram panchayat, tehsil)', 'error');
                      return;
                    }
                  
                  const hab = parseFloat(ifrData.landDetails.extentHabitation) || 0;
                  const cult = parseFloat(ifrData.landDetails.extentSelfCultivation) || 0;
                  const totalArea = hab + cult;
                  
                  if (totalArea <= 0) {
                    addNotification('Please enter valid land area (habitation + cultivation)', 'error');
                      return;
                    }
                  
                  if (!ifrData.declaration.isInformationTrue) {
                    addNotification('Please accept the declaration to proceed', 'error');
                    return;
                  }
                  
                    try {
                      setIsSubmittingIFR(true);
                      const res = await fetch('/api/create-claim', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          claimType: 'Individual',
                        forestLandArea: totalArea,
                        ifrData: {
                          ...ifrData,
                          applicantDetails: {
                            ...ifrData.applicantDetails,
                            familyMembers
                          }
                        }
                        })
                      });
                      const body = await res.json().catch(()=>({}));
                      if (res.status === 201) {
                        setIfrResult(body);
                        addNotification(`Claim submitted successfully. Patta ID: ${body.frapattaid}`, 'success');
                      
                      // Refresh claims list
                      await fetchUserClaims();
                      
                      // Reset form
                      setIfrData({
                        applicantDetails: {
                          claimantName: "",
                          spouseName: "",
                          fatherOrMotherName: "",
                          address: "",
                          village: "",
                          gramPanchayat: "",
                          tehsil: "",
                          district: "Bhopal"
                        },
                        eligibilityStatus: {
                          isST: false,
                          isOTFD: false,
                          isSpouseST: false,
                          otfdJustification: ""
                        },
                        landDetails: {
                          extentHabitation: "",
                          extentSelfCultivation: "",
                          compartmentNumber: "",
                          landDescription: ""
                        },
                        claimBasis: {
                          hasDisputes: false,
                          disputeDescription: "",
                          hasOldTitles: false,
                          oldTitlesDescription: "",
                          wasDisplaced: false,
                          displacementDescription: "",
                          isForestVillage: false,
                          forestVillageDescription: "",
                          hasOtherRights: false,
                          otherRightsDescription: ""
                        },
                        evidence: {
                          governmentDocuments: [],
                          elderTestimonies: [],
                          physicalProof: [],
                          oldGovernmentRecords: []
                        },
                        declaration: {
                          isInformationTrue: false,
                          signatureFile: ""
                        }
                      });
                      setFamilyMembers([{ name: "", age: "", relation: "" }]);
                      } else if (res.status === 401) {
                        addNotification('Please login again to submit a claim', 'error');
                      } else {
                        addNotification(body?.message || body?.error || 'Failed to submit claim', 'error');
                      }
                    } catch (e) {
                      addNotification('Network error while submitting claim', 'error');
                    } finally {
                      setIsSubmittingIFR(false);
                    }
                  }}
                className={`px-8 py-3 text-sm font-semibold rounded-md shadow-md transition ${
                  !claimEligibility?.canSubmit 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'hover:shadow-lg'
                }`}
                >
                  {isSubmittingIFR ? 'Submitting...' : 
                   !claimEligibility?.canSubmit ? 'Cannot Submit Claim' : 
                   'Submit IFR Application'}
                </Button>
            </div>

            {ifrResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">Your application has been received.</p>
                <p className="text-sm text-green-800">Patta ID: <strong>{ifrResult.frapattaid}</strong></p>
                <p className="text-xs text-green-700 mt-1">Save this ID for tracking.</p>
              </div>
            )}
          </div>

          {/* Document Progress */}
          <div className="card">
            <div className="section-heading mb-4 -mx-6 -mt-6">
              <h2 className="text-lg font-semibold">Document Progress</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{completedDocuments}/{totalDocuments} documents</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-numbering h-2 rounded-full transition-all duration-500"
                  style={{ width: `${uploadProgressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {Math.round(uploadProgressPercent)}% complete
              </p>
            </div>
          </div>

          <div className="card">
            <div className="section-heading mb-4 -mx-6 -mt-6">
              <h2 className="text-lg font-semibold">Document Checklist</h2>
            </div>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type: {doc.type}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Uploaded: {doc.uploadedOn}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    {doc.status === 'Pending Upload' && (
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleFileUpload(e, doc.id)}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="text-numbering hover:text-bg-1 disabled:opacity-50"
                        >
                          <CloudArrowUpIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Uploading...</span>
                  <span className="text-sm text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload New Document Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              <PaperClipIcon className="h-5 w-5" />
              Upload New Document
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload New Document</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-bg-1 focus:ring-bg-1"
                  >
                    <option value="">Select document type</option>
                    <option value="additional-proof">Additional Proof</option>
                    <option value="supporting-document">Supporting Document</option>
                    <option value="legal-document">Legal Document</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Handle new document upload
                        addNotification(`Document "${file.name}" uploaded successfully!`, 'success');
                        setShowUploadModal(false);
                      }
                    }}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-bg-1 focus:ring-bg-1"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedDocumentType) {
                      addNotification('Document uploaded successfully!', 'success');
                      setShowUploadModal(false);
                    } else {
                      addNotification('Please select a document type', 'error');
                    }
                  }}
                  className="btn-primary flex-1"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
