import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { Landing } from './pages/public/Landing';
import { Register } from './pages/public/Register';
import { Login } from './pages/public/Login';
import { VerifyEmail } from './pages/public/VerifyEmail';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { PostJob } from './pages/customer/PostJob';
import { JobDetails } from './pages/customer/JobDetails';
import { BrowseProviders } from './pages/customer/BrowseProviders';
import { ProviderProfile } from './pages/customer/ProviderProfile';

// Provider Pages
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { BrowseJobs } from './pages/provider/BrowseJobs';
import { MyApplications } from './pages/provider/MyApplications';
import { ApplyToJob } from './pages/provider/ApplyToJob';
import { EditProfile as ProviderEditProfile } from './pages/provider/EditProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DisputesList } from './pages/admin/DisputesList';
import { DisputeDetails } from './pages/admin/DisputeDetails';

// Shared Pages
import { Notifications } from './pages/shared/Notifications';
import { Profile } from './pages/shared/Profile';
import { Transactions } from './pages/shared/Transactions';
import { Settings } from './pages/shared/Settings';

// Import constants
import { ROUTES, USER_ROLES } from './lib/constants';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
          <Routes>
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<Landing />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
          </Route>

          {/* Customer Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER, USER_ROLES.HYBRID]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.CUSTOMER_DASHBOARD} element={<CustomerDashboard />} />
            <Route path={ROUTES.POST_JOB} element={<PostJob />} />
            <Route path={ROUTES.CUSTOMER_JOB_DETAILS(':id')} element={<JobDetails />} />
            <Route path={ROUTES.BROWSE_PROVIDERS} element={<BrowseProviders />} />
            <Route path={ROUTES.PROVIDER_PROFILE(':id')} element={<ProviderProfile />} />
          </Route>

          {/* Provider Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.PROVIDER, USER_ROLES.HYBRID]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.PROVIDER_DASHBOARD} element={<ProviderDashboard />} />
            <Route path={ROUTES.BROWSE_JOBS} element={<BrowseJobs />} />
            <Route path={ROUTES.PROVIDER_JOB_DETAILS(':id')} element={<ApplyToJob />} />
            <Route path={ROUTES.MY_APPLICATIONS} element={<MyApplications />} />
            <Route path={ROUTES.EDIT_PROFILE} element={<ProviderEditProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_DISPUTES} element={<DisputesList />} />
            <Route path={ROUTES.ADMIN_DISPUTE_DETAILS(':id')} element={<DisputeDetails />} />
          </Route>

          {/* Shared Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
          </Route>

          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900">404</h1>
                  <p className="text-xl text-gray-600 mt-4">Page not found</p>
                  <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                    Go back home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
