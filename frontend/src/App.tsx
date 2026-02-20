import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
import UserProfileSetup from './components/UserProfileSetup';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerJobPostings from './pages/EmployerJobPostings';
import CandidateBrowse from './pages/CandidateBrowse';
import CandidateProfile from './pages/CandidateProfile';
import FreelanceMarketplace from './pages/FreelanceMarketplace';
import JobApplications from './pages/JobApplications';
import MyApplications from './pages/MyApplications';
import Home from './pages/Home';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: Layout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home
});

const employerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/dashboard',
  component: EmployerDashboard
});

const candidateDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidate/dashboard',
  component: CandidateDashboard
});

const employerJobPostingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs',
  component: EmployerJobPostings
});

const candidateBrowseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: CandidateBrowse
});

const candidateProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: CandidateProfile
});

const freelanceMarketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/freelance',
  component: FreelanceMarketplace
});

const jobApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs/$jobId/applications',
  component: JobApplications
});

const myApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-applications',
  component: MyApplications
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  employerDashboardRoute,
  candidateDashboardRoute,
  employerJobPostingsRoute,
  candidateBrowseRoute,
  candidateProfileRoute,
  freelanceMarketplaceRoute,
  jobApplicationsRoute,
  myApplicationsRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      {isAuthenticated && <UserProfileSetup />}
      <Toaster />
    </ThemeProvider>
  );
}
