import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Building,
    CheckCircle,
    GraduationCap,
    HelpCircle,
    Languages,
    Phone,
    Shield,
    User,
    Users,
    MapPin,
    FileText,
    Globe
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Validation schemas for different roles
// User/Claimant: separate schemas for login vs register
const userClaimantLoginSchema = z.object({
  aadhaarNumber: z
    .string()
    .min(12, 'Aadhaar must be 12 digits')
    .max(12, 'Aadhaar must be 12 digits')
    .regex(/^\d{12}$/,'Aadhaar must be 12 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const userClaimantRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  aadhaarNumber: z
    .string()
    .min(12, 'Aadhaar must be 12 digits')
    .max(12, 'Aadhaar must be 12 digits')
    .regex(/^\d{12}$/,'Aadhaar must be 12 digits'),
  contactNumber: z
    .string()
    .min(10, 'Contact must be 10 digits')
    .max(10, 'Contact must be 10 digits')
    .regex(/^\d{10}$/,'Contact must be 10 digits'),
  gender: z.enum(['Male','Female','Other'], { required_error: 'Gender is required' }),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  tribeCategory: z.enum(['ST','OTFD'], { required_error: 'Tribe category is required' }),
  village: z.string().min(1, 'Village is required'),
  // optional fields captured in UI but not strictly required by API
  address: z.string().optional(),
  gramPanchayat: z.string().optional(),
  tehsil: z.string().optional(),
  district: z.string().optional(),
  // new required for Bhopal focus
  tehsil: z.enum(['Berasia','Phanda'], { required_error: 'Tehsil is required' }),
  gramPanchayat: z.string().min(1, 'Gram Panchayat is required'),
  state: z.string().optional(),
});

const gramSabhaOfficerSchema = z.object({
  gramSabhaId: z.string().min(1, 'Gram Sabha ID is required'),
  password: z.string().min(1, 'Password is required')
});

const blockOfficerSchema = z.object({
  blockId: z.string().min(1, 'Block ID is required'),
  password: z.string().min(1, 'Password is required')
});

const districtOfficerSchema = z.object({
  districtForestOfficerId: z.string().min(1, 'District Forest Officer ID is required'),
  password: z.string().min(1, 'Password is required')
});

const stateMinistryOfficerSchema = z.object({
  stateId: z.string().min(1, 'State ID is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  ministryDept: z.string().min(1, 'Ministry department is required'),
  mfaCode: z.string().min(6, 'MFA code must be 6 digits').max(6, 'MFA code must be 6 digits')
});

const motaNationalOfficerSchema = z.object({
  nationalId: z.string().min(1, 'National ID is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  deptId: z.string().min(1, 'Department ID is required'),
  mfaCode: z.string().min(6, 'MFA code must be 6 digits').max(6, 'MFA code must be 6 digits')
});

const supportingOfficerSchema = z.object({
  orgId: z.string().min(1, 'Organization ID is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  orgType: z.string().min(1, 'Organization type is required'),
  stateAdminApproval: z.boolean().refine(val => val === true, 'State Admin approval is required')
});

// Whitelisted Gram Sabha Officer credentials
// You can override this at runtime by setting window.__GS_CREDENTIALS__ = [{ gramSabhaId, password }]
const GRAM_SABHA_CREDENTIALS = (typeof window !== 'undefined' && window.__GS_CREDENTIALS__) || [
  { gramSabhaId: 'GS001', password: 'password123' },
];

// Whitelisted Subdivision Officer credentials for Bhopal (Phanda & Berasia)
// Override at runtime via: window.__BLOCK_CREDENTIALS__ = [{ blockId, password, subdivision, district }]
const BLOCK_OFFICER_CREDENTIALS = (typeof window !== 'undefined' && window.__BLOCK_CREDENTIALS__) || [
  { blockId: 'PHN001', password: 'phandasubdivision123', subdivision: 'Phanda', district: 'Bhopal' },
  { blockId: 'BRS001', password: 'berasiasubdivision123', subdivision: 'Berasia', district: 'Bhopal' },
];

// Whitelisted District Forest Officer credentials for Bhopal
// You can override this at runtime by setting window.__DISTRICT_CREDENTIALS__ = [{ districtForestOfficerId, password }]
const DISTRICT_OFFICER_CREDENTIALS = (typeof window !== 'undefined' && window.__DISTRICT_CREDENTIALS__) || [
  { districtForestOfficerId: 'BHO001', password: 'bhopaldistrict123', district: 'Bhopal' },
];

const roles = [
  {
    id: 'user-claimant',
    name: 'User/Claimant',
    icon: User,
    // schema chosen dynamically based on authMode below
    schema: undefined,
    description: 'Community members and forest rights claimants',
    color: 'bg-green-500'
  },
  {
    id: 'gram-sabha-officer',
    name: 'Gram Sabha Officer',
    icon: MapPin,
    schema: gramSabhaOfficerSchema,
    description: 'Village-level forest rights officers',
    color: 'bg-blue-500'
  },
  {
    id: 'block-officer',
    name: 'Subdivisional Officer',
    icon: Building,
    schema: blockOfficerSchema,
    description: 'Subdivision-level (Block) officers for district administration',
    color: 'bg-purple-500'
  },
  {
    id: 'district-officer',
    name: 'District Officer',
    icon: FileText,
    schema: districtOfficerSchema,
    description: 'District-level forest department officers',
    color: 'bg-orange-500'
  },
  {
    id: 'state-ministry-officer',
    name: 'State Ministry Officer',
    icon: Shield,
    schema: stateMinistryOfficerSchema,
    description: 'State ministry officials and administrators',
    color: 'bg-red-500'
  },
  {
    id: 'mota-national-officer',
    name: 'MoTA/National Officer',
    icon: Globe,
    schema: motaNationalOfficerSchema,
    description: 'Ministry of Tribal Affairs national officers',
    color: 'bg-indigo-500'
  },
  {
    id: 'supporting-officer',
    name: 'Supporting Officers',
    icon: GraduationCap,
    schema: supportingOfficerSchema,
    description: 'NGOs, researchers, and supporting organizations',
    color: 'bg-teal-500'
  }
];

const AuthModule = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('user-claimant');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const [tehsils, setTehsils] = useState([]);
  const [gps, setGps] = useState([]);
  const canRegister = activeRole === 'user-claimant';

  const activeRoleData = roles.find(role => role.id === activeRole);
  const schema = activeRole === 'user-claimant'
    ? (authMode === 'register' ? userClaimantRegisterSchema : userClaimantLoginSchema)
    : activeRoleData?.schema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined
  });

  useEffect(() => {
    reset();
    setSuccessMessage('');
    setErrorMessage('');
    // Force login mode for roles that cannot register
    if (!canRegister && authMode === 'register') {
      setAuthMode('login');
    }
  }, [activeRole, authMode, reset, canRegister]);

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

  // Load GPs for selected tehsil during registration
  useEffect(() => {
    if (activeRole !== 'user-claimant' || authMode !== 'register') return;
    const subscription = () => {
      // react-hook-form does not expose value here; we rely on state via setValue when changed below
    };
    return subscription;
  }, [activeRole, authMode]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (activeRole === 'user-claimant' && authMode === 'login') {
        const payload = {
          aadhaarNumber: data.aadhaarNumber,
          password: data.password
        };

        const res = await fetch('/api/claimant/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        const body = await res.json().catch(() => ({}));
        if (res.status === 200 && body?.success) {
          setSuccessMessage('Login successful!');
          reset();
          // Redirect claimant to community users dashboard
          navigate('/communityUsersDashboard');
        } else if (res.status === 401) {
          setErrorMessage(body?.message || 'Invalid credentials');
        } else if (res.status === 400) {
          setErrorMessage(body?.message || 'Invalid input');
        } else {
          setErrorMessage(body?.message || 'Failed to login');
        }
      } else if (activeRole === 'user-claimant' && authMode === 'register') {
        const payload = {
          name: data.name,
          aadhaarNumber: data.aadhaarNumber,
          contactNumber: data.contactNumber,
          gender: data.gender,
          password: data.password,
          email: data.email,
          tribeCategory: data.tribeCategory,
          village: data.village,
          address: data.address,
          gramPanchayat: data.gramPanchayat,
          tehsil: data.tehsil,
          district: data.district,
          state: data.state
        };

        const res = await fetch('/api/claimant/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        const body = await res.json().catch(() => ({}));
        if (res.status === 201 && body?.success) {
          setSuccessMessage('Registration successful!');
          reset();
        } else if (res.status === 409) {
          setErrorMessage(body?.message || 'Aadhaar already registered');
        } else if (res.status === 400) {
          setErrorMessage(body?.message || 'Invalid input');
        } else {
          setErrorMessage(body?.message || 'Failed to register');
        }
      } else if (activeRole === 'gram-sabha-officer' && authMode === 'login') {
        // Use real backend API for Gram Sabha authentication
        const { gramSabhaId, password } = data;
        
        try {
          setIsLoading(true);
          setErrorMessage('');
          setSuccessMessage('');
          
          const response = await fetch('/api/gs/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ gramSabhaId, password }),
          });
          
          const result = await response.json();
          
          if (response.ok && result.success) {
            setSuccessMessage('Login successful!');
            reset();
            setTimeout(() => {
              navigate('/gram-sabha-dashboard');
            }, 1000);
          } else {
            setErrorMessage(result.message || 'Invalid Gram Sabha ID or password');
          }
        } catch (error) {
          console.error('Gram Sabha login error:', error);
          setErrorMessage('Login failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else if (activeRole === 'block-officer' && authMode === 'login') {
        // Block Officer authentication - call backend API
        const { blockId, password } = data;
        const normalizedId = (blockId || '').toString().trim().toUpperCase();
        const normalizedPass = (password || '').toString();

        const AVAILABLE_BLOCK_CREDS = (typeof window !== 'undefined' && window.__BLOCK_CREDENTIALS__ && Array.isArray(window.__BLOCK_CREDENTIALS__) && window.__BLOCK_CREDENTIALS__.length > 0)
          ? window.__BLOCK_CREDENTIALS__
          : BLOCK_OFFICER_CREDENTIALS;

        console.log('Block Officer Login attempt:', { blockId: normalizedId, password: normalizedPass });
        console.log('Available Block credentials:', AVAILABLE_BLOCK_CREDS);

        const match = AVAILABLE_BLOCK_CREDS.find((c) => {
          const cid = (c.blockId || '').toString().trim().toUpperCase();
          const cpass = (c.password || '').toString();
          return cid === normalizedId && cpass === normalizedPass;
        });

        console.log('Block Officer Match found:', match);

        if (match) {
          // Call backend API for block officer login
          try {
            const response = await fetch('http://localhost:8000/api/block-officer/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                officerId: normalizedId,
                password: normalizedPass
              })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
              setSuccessMessage(`Login successful! Welcome to ${match.district} Block Officer Dashboard`);
              reset();
              setTimeout(() => {
                navigate('/block-officer-dashboard');
              }, 1000);
            } else {
              setErrorMessage(result.message || 'Invalid Block Officer ID or password');
            }
          } catch (error) {
            console.error('Block Officer login error:', error);
            setErrorMessage('Network error. Please try again.');
          }
        } else {
          setErrorMessage('Invalid Block Officer ID or password');
        }
      } else if (activeRole === 'district-officer' && authMode === 'login') {
        // Validate against whitelist for Indore District Forest Officers
        const { districtForestOfficerId, password } = data;
        const normalizedId = (districtForestOfficerId || '').toString().trim().toUpperCase();
        const normalizedPass = (password || '').toString();

        const AVAILABLE_DISTRICT_CREDS = (typeof window !== 'undefined' && window.__DISTRICT_CREDENTIALS__ && Array.isArray(window.__DISTRICT_CREDENTIALS__) && window.__DISTRICT_CREDENTIALS__.length > 0)
          ? window.__DISTRICT_CREDENTIALS__
          : DISTRICT_OFFICER_CREDENTIALS;

        console.log('District Officer Login attempt:', { districtForestOfficerId: normalizedId, password: normalizedPass });
        console.log('Available District credentials:', AVAILABLE_DISTRICT_CREDS);

        const match = AVAILABLE_DISTRICT_CREDS.find((c) => {
          const cid = (c.districtForestOfficerId || '').toString().trim().toUpperCase();
          const cpass = (c.password || '').toString();
          return cid === normalizedId && cpass === normalizedPass;
        });

        console.log('District Officer Match found:', match);

        if (match) {
          // Call backend API for district officer login
          try {
            const response = await fetch('http://localhost:8000/api/district/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                officerId: normalizedId,
                password: normalizedPass
              })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
              setSuccessMessage(`Login successful! Welcome to ${match.district} District Forest Officer Dashboard`);
              reset();
              setTimeout(() => {
                navigate('/district-officer-dashboard');
              }, 1000);
            } else {
              setErrorMessage(result.message || 'Invalid District Forest Officer ID or password');
            }
          } catch (error) {
            console.error('District Officer login error:', error);
            setErrorMessage('Network error. Please try again.');
          }
        } else {
          setErrorMessage('Invalid District Forest Officer ID or password');
        }
      } else {
        // fallback demo behaviour for other roles or login
        await new Promise(resolve => setTimeout(resolve, 800));
        setSuccessMessage(`${authMode === 'login' ? 'Login' : 'Registration'} successful!`);
        reset();
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (activeRole) {
      case 'user-claimant':
        return (
          authMode === 'login' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                <Input
                  id="aadhaarNumber"
                  placeholder="12-digit Aadhaar"
                  {...register('aadhaarNumber')}
                  className={errors.aadhaarNumber ? 'border-red-500' : ''}
                />
                {errors.aadhaarNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.aadhaarNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
                  {errors.name && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.name.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                  <Input id="aadhaarNumber" placeholder="12-digit Aadhaar" {...register('aadhaarNumber')} className={errors.aadhaarNumber ? 'border-red-500' : ''} />
                  {errors.aadhaarNumber && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.aadhaarNumber.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" placeholder="10-digit mobile" {...register('contactNumber')} className={errors.contactNumber ? 'border-red-500' : ''} />
                  {errors.contactNumber && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.contactNumber.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select id="gender" {...register('gender')} className={`w-full border rounded-md h-10 px-3 ${errors.gender ? 'border-red-500' : ''}`}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.gender.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                  {errors.email && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.email.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create password" {...register('password')} className={errors.password ? 'border-red-500' : ''} />
                  {errors.password && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.password.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tribeCategory">Tribe Category</Label>
                  <select id="tribeCategory" {...register('tribeCategory')} className={`w-full border rounded-md h-10 px-3 ${errors.tribeCategory ? 'border-red-500' : ''}`}>
                    <option value="">Select category</option>
                    <option value="ST">ST</option>
                    <option value="OTFD">OTFD</option>
                  </select>
                  {errors.tribeCategory && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.tribeCategory.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village">Village</Label>
                  <Input id="village" placeholder="Village" {...register('village')} className={errors.village ? 'border-red-500' : ''} />
                  {errors.village && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.village.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Address" {...register('address')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tehsil">Tehsil</Label>
                  <select
                    id="tehsil"
                    {...register('tehsil')}
                    onChange={async (e) => {
                      const val = e.target.value;
                      setValue('tehsil', val, { shouldValidate: true });
                      setGps([]);
                      try {
                        const res = await fetch(`/api/geo/bhopal/gps?tehsil=${encodeURIComponent(val)}`);
                        const body = await res.json();
                        setGps(body?.items || []);
                      } catch {}
                    }}
                    className={`w-full border rounded-md h-10 px-3 ${errors.tehsil ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select tehsil (Bhopal)</option>
                    {tehsils.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.tehsil && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.tehsil.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gramPanchayat">Gram Panchayat</Label>
                  <select
                    id="gramPanchayat"
                    {...register('gramPanchayat')}
                    className={`w-full border rounded-md h-10 px-3 ${errors.gramPanchayat ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Gram Panchayat</option>
                    {gps.map(g => (
                      <option key={g.gpCode} value={g.gpName}>{g.gpName}</option>
                    ))}
                  </select>
                  {errors.gramPanchayat && (<p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{errors.gramPanchayat.message}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input id="district" placeholder="District" defaultValue="Bhopal" {...register('district')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="State" {...register('state')} />
                </div>
              </div>
            </>
          )
        );

      case 'gram-sabha-officer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="gramSabhaId">Gram Sabha ID</Label>
              <Input
                id="gramSabhaId"
                placeholder="Enter Gram Sabha ID"
                {...register('gramSabhaId')}
                className={errors.gramSabhaId ? 'border-red-500' : ''}
              />
              {errors.gramSabhaId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.gramSabhaId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>
          </>
        );

      case 'block-officer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="blockId">Subdivision Officer ID</Label>
              <Input
                id="blockId"
                placeholder="Enter Subdivision ID (e.g., PHN001, BRS001)"
                {...register('blockId')}
                className={errors.blockId ? 'border-red-500' : ''}
              />
              {errors.blockId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.blockId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-md">
              <strong>Available Bhopal Subdivision Officers:</strong><br/>
              • Phanda: PHN001 / phandasubdivision123<br/>
              • Berasia: BRS001 / berasiasubdivision123
            </div>
          </>
        );

      case 'district-officer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="districtForestOfficerId">District Forest Officer ID</Label>
              <Input
                id="districtForestOfficerId"
                placeholder="Enter District Forest Officer ID (e.g., BHO001)"
                {...register('districtForestOfficerId')}
                className={errors.districtForestOfficerId ? 'border-red-500' : ''}
              />
              {errors.districtForestOfficerId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.districtForestOfficerId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="text-xs text-gray-600 bg-green-50 p-3 rounded-md">
              <strong>Available Bhopal District Forest Officers:</strong><br/>
              • District Officer: BHO001 / bhopaldistrict123
            </div>
          </>
        );

      case 'state-ministry-officer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="stateId">State ID</Label>
              <Input
                id="stateId"
                placeholder="Enter state ID"
                {...register('stateId')}
                className={errors.stateId ? 'border-red-500' : ''}
              />
              {errors.stateId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.stateId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ministryDept">Ministry Department</Label>
              <Input
                id="ministryDept"
                placeholder="Enter ministry department"
                {...register('ministryDept')}
                className={errors.ministryDept ? 'border-red-500' : ''}
              />
              {errors.ministryDept && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.ministryDept.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="officer@state.gov.in"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mfaCode">MFA Code</Label>
              <Input
                id="mfaCode"
                placeholder="Enter 6-digit MFA code"
                {...register('mfaCode')}
                className={errors.mfaCode ? 'border-red-500' : ''}
              />
              {errors.mfaCode && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.mfaCode.message}
                </p>
              )}
            </div>
          </>
        );

      case 'mota-national-officer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID</Label>
              <Input
                id="nationalId"
                placeholder="Enter national ID"
                {...register('nationalId')}
                className={errors.nationalId ? 'border-red-500' : ''}
              />
              {errors.nationalId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.nationalId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deptId">Department ID</Label>
              <Input
                id="deptId"
                placeholder="Enter department ID"
                {...register('deptId')}
                className={errors.deptId ? 'border-red-500' : ''}
              />
              {errors.deptId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.deptId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="officer@mota.gov.in"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mfaCode">MFA Code</Label>
              <Input
                id="mfaCode"
                placeholder="Enter 6-digit MFA code"
                {...register('mfaCode')}
                className={errors.mfaCode ? 'border-red-500' : ''}
              />
              {errors.mfaCode && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.mfaCode.message}
                </p>
              )}
            </div>
          </>
        );

      case 'supporting-officer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="orgId">Organization ID</Label>
              <Input
                id="orgId"
                placeholder="Enter organization ID"
                {...register('orgId')}
                className={errors.orgId ? 'border-red-500' : ''}
              />
              {errors.orgId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.orgId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgType">Organization Type</Label>
              <Input
                id="orgType"
                placeholder="NGO, Research Institute, etc."
                {...register('orgType')}
                className={errors.orgType ? 'border-red-500' : ''}
              />
              {errors.orgType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.orgType.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@organization.org"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stateAdminApproval">State Admin Approval</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="stateAdminApproval"
                  {...register('stateAdminApproval')}
                  className="rounded"
                />
                <label htmlFor="stateAdminApproval" className="text-sm">
                  I have State Admin approval
                </label>
              </div>
              {errors.stateAdminApproval && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.stateAdminApproval.message}
                </p>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-[#044e2b] shadow-lg border-b border-[#d4c5a9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* FRA Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#d4c5a9] rounded-xl flex items-center justify-center shadow-lg">
                <Shield size={20} className="text-[#044e2b]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#d4c5a9]">
                  FRA Digital Platform
                </h1>
                <p className="text-xs text-[#d4c5a9] opacity-90">
                  Forest Rights Act Management System
                </p>
              </div>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center space-x-2">
                <Languages size={16} className="text-[#d4c5a9]" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm border-none bg-[#d4c5a9] text-[#044e2b] rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#d4c5a9]"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="bn">বাংলা</option>
                  <option value="te">తెలుగు</option>
                </select>
              </div>

              {/* Help & Support */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-[#d4c5a9] hover:text-[#e8d5b7] text-sm transition-colors">
                  <HelpCircle size={16} />
                  <span>Help</span>
                </button>
                <button className="flex items-center space-x-1 text-[#d4c5a9] hover:text-[#e8d5b7] text-sm transition-colors">
                  <Phone size={16} />
                  <span>Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-b from-[#044e2b] to-[#0a5a35] p-8 flex-col justify-center items-center text-white shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-8">
              <Shield size={64} className="mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl font-bold mb-2">Welcome to FRA</h2>
              <p className="text-lg opacity-90 mb-6">
                Secure Access Portal
              </p>
            </div>
            <div className="space-y-3 text-left max-w-sm mx-auto text-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle size={16} />
                <span>Multi-role Authentication</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle size={16} />
                <span>Forest Rights Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle size={16} />
                <span>Community Empowerment</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle size={16} />
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle size={16} />
                <span>Secure Data Protection</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Authentication */}
        <div className="w-full lg:w-2/3 flex flex-col">
          {/* Header with Login/Register Toggle */}
          <div className="bg-white shadow-sm p-6 border-b border-[#d4c5a9]/30">
            <div className="flex justify-center">
              <div className="bg-[#d4c5a9]/20 p-1 rounded-lg border border-[#d4c5a9]/30">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`px-8 py-3 rounded-md font-medium transition-all ${
                    authMode === 'login'
                      ? 'bg-[#044e2b] text-[#d4c5a9] shadow-md border-2 border-[#d4c5a9]/50'
                      : 'bg-white text-[#044e2b] hover:bg-[#d4c5a9]/20 hover:text-[#044e2b] border-2 border-[#d4c5a9]/30 hover:border-[#d4c5a9]/50'
                  }`}
                >
                  Login
                </button>
                {canRegister && (
                  <button
                    onClick={() => setAuthMode('register')}
                    className={`px-8 py-3 rounded-md font-medium transition-all ${
                      authMode === 'register'
                        ? 'bg-[#044e2b] text-[#d4c5a9] shadow-md border-2 border-[#d4c5a9]/50'
                        : 'bg-white text-[#044e2b] hover:bg-[#d4c5a9]/20 hover:text-[#044e2b] border-2 border-[#d4c5a9]/30 hover:border-[#d4c5a9]/50'
                    }`}
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Sidebar */}
            <div className="w-80 bg-gradient-to-b from-[#044e2b] to-[#0a5a35] shadow-xl p-6 border-r-2 border-[#d4c5a9]/30 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-6 text-[#d4c5a9] flex items-center space-x-2">
                <Users size={20} className="text-[#d4c5a9]" />
                <span>Select Your Role</span>
              </h2>
              <div className="space-y-2">
                {roles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <motion.button
                      key={role.id}
                      onClick={() => setActiveRole(role.id)}
                      className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all ${
                        activeRole === role.id
                          ? 'bg-[#d4c5a9] text-[#044e2b] shadow-md border-2 border-[#d4c5a9] hover:bg-[#e8d5b7] hover:border-[#e8d5b7]'
                          : 'bg-[#044e2b]/20 text-[#d4c5a9] hover:bg-[#044e2b]/40 hover:text-white border border-[#d4c5a9]/20 hover:border-[#d4c5a9]/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-lg ${role.color} text-white shadow-md`}>
                        <IconComponent size={16} />
                      </div>
                      <div className="text-left">
                        <div className={`font-medium text-sm ${
                          activeRole === role.id ? 'text-[#044e2b]' : 'text-[#d4c5a9]'
                        }`}>
                          {role.name}
                        </div>
                        <div className={`text-xs ${
                          activeRole === role.id ? 'text-[#044e2b]/80' : 'text-[#d4c5a9]/90'
                        }`}>
                          {role.description}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeRole}-${authMode}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-lg mx-auto"
                >
                  <Card className="shadow-xl border border-[#d4c5a9]/30">
                    <CardHeader className="bg-gradient-to-r from-[#d4c5a9]/20 to-[#e8d5b7]/20 border-b border-[#d4c5a9]/30">
                      <CardTitle className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${activeRoleData?.color} text-white shadow-md`}>
                          <activeRoleData.icon size={20} />
                        </div>
                        <div>
                          <span className="text-lg text-[#044e2b]">
                            {authMode === 'login' ? 'Login' : 'Register'} as {activeRoleData?.name}
                          </span>
                          <p className="text-sm font-normal text-[#044e2b]/90 mt-1">
                            {activeRoleData?.description}
                          </p>
                        </div>
                      </CardTitle>
                      <CardDescription className="text-base text-[#044e2b]/90">
                        {authMode === 'login'
                          ? 'Enter your credentials to access your account'
                          : 'Fill in your details to create an account'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {renderFormFields()}

                        {successMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-100 border border-green-300 rounded-md flex items-center space-x-2"
                          >
                            <CheckCircle size={18} className="text-green-600" />
                            <span className="text-green-800 text-sm font-medium">{successMessage}</span>
                          </motion.div>
                        )}

                        {errorMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-100 border border-red-300 rounded-md flex items-center space-x-2"
                          >
                            <AlertCircle size={18} className="text-red-600" />
                            <span className="text-red-800 text-sm font-medium">{errorMessage}</span>
                          </motion.div>
                        )}

                        <Button
                          type="submit"
                          className="w-full bg-[#044e2b] hover:bg-[#0a5a35] text-[#d4c5a9] py-3 text-base font-medium border border-[#d4c5a9]/30 shadow-md hover:shadow-lg transition-all"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-[#d4c5a9] border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            `${authMode === 'login' ? 'Login' : 'Register'}`
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModule;