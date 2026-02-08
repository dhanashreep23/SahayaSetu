# SahayaSetu Frontend-Backend API Mapping

## Backend Server Configuration
- **Port**: 8080
- **Base URL**: http://localhost:8080/api
- **CORS**: Configured for http://localhost:5173 (Vite dev server)

## Frontend Configuration
- **Port**: 5173 (Vite default)
- **API Base URL**: http://localhost:8080/api
- **Authentication**: JWT Bearer token in Authorization header

## API Endpoints Mapping

### Authentication Endpoints (`/api/auth`)
| Frontend Service | Backend Endpoint | Method | Description |
|------------------|------------------|--------|-------------|
| `authService.registerDonor()` | `/auth/register` | POST | Register new donor |
| `authService.registerNGO()` | `/auth/register-ngo` | POST | Register new NGO |
| `authService.registerAdmin()` | `/auth/register-admin` | POST | Register new admin |
| `authService.login()` | `/auth/login` | POST | Login donor/admin |
| `authService.loginNGO()` | `/auth/login-ngo` | POST | Login NGO |

### Donor Endpoints (`/api/donor`)
| Frontend Service | Backend Endpoint | Method | Description |
|------------------|------------------|--------|-------------|
| `donorService.getAvailableRequests()` | `/donor/requests` | GET | Get all open requests |
| `donorService.donateToFundraiser()` | `/donor/requests/{id}/donate?donorId={id}` | POST | Donate to fundraiser |
| `donorService.applyForVolunteer()` | `/donor/requests/{id}/volunteer?donorId={id}` | POST | Apply for volunteer work |
| `donorService.fulfillResourceRequest()` | `/donor/requests/{id}/fulfill-resource?donorId={id}` | POST | Fulfill resource request |

### NGO Endpoints (`/api/ngo`)
| Frontend Service | Backend Endpoint | Method | Description |
|------------------|------------------|--------|-------------|
| `ngoService.createResourceRequest()` | `/ngo/requests/resource?ngoId={id}` | POST | Create resource request |
| `ngoService.createVolunteerRequest()` | `/ngo/requests/volunteer?ngoId={id}` | POST | Create volunteer request |
| `ngoService.createFundraiserRequest()` | `/ngo/requests/fundraiser?ngoId={id}` | POST | Create fundraiser request |
| `ngoService.getOwnRequests()` | `/ngo/{id}/requests` | GET | Get NGO's own requests |
| `ngoService.updateNGOProfile()` | `/ngo/{id}` | PUT | Update NGO profile |

### Admin Endpoints (`/api/admin`)
| Frontend Service | Backend Endpoint | Method | Description |
|------------------|------------------|--------|-------------|
| `adminService.getAllNGOs()` | `/admin/ngos` | GET | Get all NGOs |
| `adminService.getAllRequests()` | `/admin/requests` | GET | Get all requests |
| `adminService.approveNGO()` | `/admin/ngos/{id}/approve` | PUT | Approve NGO |
| `adminService.disapproveNGO()` | `/admin/ngos/{id}/disapprove` | PUT | Disapprove NGO |
| `adminService.disableNGO()` | `/admin/ngos/{id}/disable` | PUT | Disable NGO |

## Configuration Files

### Frontend Configuration (`src/config/config.js`)
- Base URL: `http://localhost:8080/api`
- All endpoints properly mapped
- Storage keys for user data and tokens

### Backend Configuration (`application.properties`)
- Server port: 8080
- Database: MySQL on localhost:3306
- CORS: Allows http://localhost:5173

## Authentication Flow
1. User logs in via appropriate endpoint
2. Backend returns JWT token in response
3. Frontend stores token in localStorage
4. API interceptor adds token to all subsequent requests
5. Backend validates token for protected endpoints

## Error Handling
- 401 responses automatically redirect to login
- Global error handling in API interceptor
- Proper error messages returned from backend

## Status: ✅ FULLY MAPPED
All backend endpoints are properly mapped to frontend services. No additional mapping required.