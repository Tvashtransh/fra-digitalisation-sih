# Role-Based Mapping System for FRA Claims Management

## Overview

This implementation provides a comprehensive role-based mapping system for the Forest Rights Act (FRA) Claims Management System. The system allows different user roles to interact with map data based on their administrative level and permissions.

## Features

### 🗺️ **Role-Based Map Views**
- **Gram Sabha Officer**: Village-level view with drawing capabilities
- **Block Officer**: Subdivision-level view for claim review
- **District Officer**: District-wide overview for final approval

### 🎨 **Interactive Mapping**
- **Mapbox GL JS** integration with fallback to OpenStreetMap
- **Real-time claim visualization** with status-based color coding
- **Polygon drawing tools** for Gram Sabha officers
- **Click-to-view details** for reviewers

### 🔐 **Secure API Endpoints**
- **JWT-based authentication** for all map data requests
- **Role-based data filtering** at the database level
- **GeoJSON FeatureCollection** response format

## Architecture

### Backend Components

#### 1. **Map Controller** (`/backend/controller/mapController.js`)
```javascript
// Main endpoints:
GET /api/map-data          // Get role-based map data
POST /api/save-claim-geometry  // Save new claim with geometry
```

#### 2. **Updated Claim Model** (`/backend/model/claim.js`)
```javascript
// Added GeoJSON geometry field:
geometry: {
  type: { type: String, enum: ['Polygon', 'MultiPolygon'] },
  coordinates: { type: mongoose.Schema.Types.Mixed, required: true }
}
```

#### 3. **Map Routes** (`/backend/routes/mapRoutes.js`)
- Handles authentication for all user types
- Routes to appropriate map controller functions

### Frontend Components

#### 1. **Gram Sabha Map View** (`/frontend/src/components/gramSabhaDashboard/components/GramSabhaMapView.jsx`)
- **Drawing Tools**: Polygon creation with MapboxDraw
- **Existing Claims**: Display of current village claims
- **Claim Submission**: Save new claims with geometry data
- **Real-time Updates**: Refresh map after submission

#### 2. **Review Map View** (`/frontend/src/components/ReviewMapView.jsx`)
- **Read-only Interface**: No drawing tools for reviewers
- **Status Filtering**: Filter claims by status
- **Interactive Popups**: Click to view claim details
- **Statistics Panel**: Quick overview of claim counts

## User Roles & Permissions

### Gram Sabha Officer
- **Scope**: Single village only
- **Permissions**:
  - View existing claims in their village
  - Draw new polygons for claim applications
  - Submit new claims with geometry data
- **Map Features**: Drawing tools, polygon creation, claim submission

### Block Officer
- **Scope**: Entire subdivision (Phanda or Berasia)
- **Permissions**:
  - View all claims in their subdivision
  - Click on claims to view details
  - Approve/reject claims
- **Map Features**: Read-only view, status filtering, interactive popups

### District Officer
- **Scope**: Entire Bhopal district
- **Permissions**:
  - View all claims across all subdivisions
  - Final approval authority
  - District-wide statistics
- **Map Features**: District overview, comprehensive filtering, final approval

## Data Flow

### 1. **Map Data Request**
```
User Login → JWT Authentication → Role Detection → Database Query → GeoJSON Response
```

### 2. **Claim Submission**
```
Draw Polygon → Validate Geometry → Save to Database → Update Map → Refresh View
```

### 3. **Claim Review**
```
Click Claim → Fetch Details → Display Popup → Action (Approve/Reject) → Update Status
```

## API Endpoints

### GET `/api/map-data`
**Authentication**: Required (JWT)
**Response**: GeoJSON FeatureCollection with role-filtered claims

```json
{
  "success": true,
  "data": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[77.4126, 23.2599], ...]]
        },
        "properties": {
          "claimId": "...",
          "frapattaid": "...",
          "claimantName": "...",
          "status": "Submitted",
          "fillColor": "#3b82f6",
          "strokeColor": "#3b82f6"
        }
      }
    ]
  },
  "mapConfig": {
    "center": [77.4126, 23.2599],
    "zoom": 12,
    "userRole": "gram_sabha",
    "jurisdiction": {
      "level": "Village",
      "name": "Acharpura",
      "code": "GS-PHN-134357"
    }
  },
  "summary": {
    "totalClaims": 15,
    "statusBreakdown": {
      "Submitted": 5,
      "Approved": 8,
      "Rejected": 2
    }
  }
}
```

### POST `/api/save-claim-geometry`
**Authentication**: Required (Gram Sabha only)
**Body**: Claim data with GeoJSON geometry

```json
{
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[77.4126, 23.2599], ...]]
  },
  "claimData": {
    "claimType": "Individual",
    "forestLandArea": 2.5,
    "applicantDetails": {
      "claimantName": "John Doe",
      "village": "Acharpura"
    }
  }
}
```

## Installation & Setup

### 1. **Backend Setup**
```bash
# Install dependencies
npm install

# Add map routes to main app
# Already integrated in index.js

# Start server
npm start
```

### 2. **Frontend Setup**
```bash
# Install Mapbox dependencies
npm install mapbox-gl @mapbox/mapbox-gl-draw

# Import components in your dashboard
import GramSabhaMapView from './components/gramSabhaDashboard/components/GramSabhaMapView';
import ReviewMapView from './components/ReviewMapView';
```

### 3. **Environment Variables**
```env
# Add to .env file
VITE_MAPBOX_PUBLIC_TOKEN=your_mapbox_token_here
```

## Usage Examples

### Gram Sabha Dashboard Integration
```jsx
import GramSabhaMapView from './components/gramSabhaDashboard/components/GramSabhaMapView';

const GramSabhaDashboard = () => {
  const handleClaimSubmit = (claim) => {
    console.log('New claim submitted:', claim);
    // Refresh claims list, show success message, etc.
  };

  return (
    <div>
      <h1>Village Land Mapping</h1>
      <GramSabhaMapView onClaimSubmit={handleClaimSubmit} />
    </div>
  );
};
```

### Block Officer Dashboard Integration
```jsx
import ReviewMapView from './components/ReviewMapView';

const BlockOfficerDashboard = () => {
  const handleClaimClick = (claimData) => {
    console.log('Claim clicked:', claimData);
    // Open claim details modal, navigate to claim page, etc.
  };

  return (
    <div>
      <h1>Block Claims Review</h1>
      <ReviewMapView level="block" onClaimClick={handleClaimClick} />
    </div>
  );
};
```

## Status Color Coding

| Status | Color | Description |
|--------|-------|-------------|
| Submitted | Blue (#3b82f6) | New claims awaiting review |
| MappedByGramSabha | Green (#10b981) | Claims mapped by Gram Sabha |
| UnderReview | Orange (#f59e0b) | Claims under review |
| Approved | Green (#10b981) | Approved claims |
| Rejected | Red (#ef4444) | Rejected claims |
| DistrictReview | Purple (#8b5cf6) | Under district review |

## Error Handling

### Mapbox Token Issues
- **Automatic Fallback**: Switches to OpenStreetMap if Mapbox fails
- **Error Logging**: Console logs for debugging
- **User Feedback**: Loading states and error messages

### Authentication Errors
- **401 Unauthorized**: Redirect to login
- **403 Forbidden**: Show access denied message
- **Network Errors**: Retry mechanism with user feedback

## Performance Considerations

### Database Optimization
- **Indexed Queries**: GP codes and status fields indexed
- **Selective Fields**: Only necessary fields fetched
- **Population Limits**: Controlled data population

### Frontend Optimization
- **Lazy Loading**: Map components load on demand
- **Debounced Updates**: Reduced API calls during interactions
- **Cached Data**: Map data cached for session

## Security Features

### Authentication
- **JWT Tokens**: Secure user authentication
- **Role Validation**: Server-side role verification
- **Session Management**: Secure cookie handling

### Data Protection
- **Input Validation**: Geometry data validation
- **SQL Injection Prevention**: Mongoose ODM protection
- **CORS Configuration**: Restricted origin access

## Future Enhancements

### Planned Features
- **Offline Support**: PWA capabilities for field work
- **Mobile Optimization**: Touch-friendly drawing tools
- **Advanced Analytics**: Claim processing metrics
- **Export Functionality**: PDF/Excel report generation
- **Real-time Updates**: WebSocket integration

### Technical Improvements
- **Caching Layer**: Redis for improved performance
- **CDN Integration**: Faster map tile loading
- **Progressive Web App**: Offline functionality
- **Advanced Filtering**: Date range, area size filters

## Troubleshooting

### Common Issues

#### Map Not Loading
1. Check Mapbox token validity
2. Verify network connectivity
3. Check browser console for errors
4. Ensure CORS configuration

#### Claims Not Visible
1. Verify user authentication
2. Check role permissions
3. Confirm GP code matching
4. Validate database queries

#### Drawing Tools Not Working
1. Check MapboxDraw import
2. Verify map initialization
3. Ensure proper event handlers
4. Check browser compatibility

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Compatibility**: React 18+, Node.js 16+, MongoDB 5+
