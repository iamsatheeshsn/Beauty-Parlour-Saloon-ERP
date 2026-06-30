import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { WebsiteLayout } from '@/layouts/WebsiteLayout'
import { MastersLayout } from '@/layouts/MastersLayout'
import { ProtectedRoute } from './ProtectedRoute'
import LoginPage from '@/pages/auth/LoginPage'
import HomePage from '@/pages/website/HomePage'
import AboutPage from '@/pages/website/AboutPage'
import WebsiteServicesPage from '@/pages/website/WebsiteServicesPage'
import TeamPage from '@/pages/website/TeamPage'
import BlogPage from '@/pages/website/BlogPage'
import BlogPostPage from '@/pages/website/BlogPostPage'
import ShopPage from '@/pages/website/ShopPage'
import ContactPage from '@/pages/website/ContactPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ActivityLogsPage from '@/pages/admin/ActivityLogsPage'
import PermissionsMatrixPage from '@/pages/admin/PermissionsMatrixPage'
import RolesPage from '@/pages/admin/RolesPage'
import UsersPage from '@/pages/admin/UsersPage'
import CompanyPage from '@/pages/masters/CompanyPage'
import MasterModulePage from '@/pages/masters/MasterModulePage'
import MastersIndexPage from '@/pages/masters/MastersIndexPage'
import CustomerSearchPage from '@/pages/customers/CustomerSearchPage'
import CustomersPage from '@/pages/customers/CustomersPage'
import CustomerProfilePage from '@/pages/customers/CustomerProfilePage'
import StaffDashboardPage from '@/pages/staff/StaffDashboardPage'
import StaffPage from '@/pages/staff/StaffPage'
import StaffProfilePage from '@/pages/staff/StaffProfilePage'
import ServicesPage from '@/pages/services/ServicesPage'
import PackagesPage from '@/pages/packages/PackagesPage'
import PosPage from '@/pages/pos/PosPage'
import AppointmentsPage from '@/pages/appointments/AppointmentsPage'
import InventoryPage from '@/pages/inventory/InventoryPage'
import ExpensesPage from '@/pages/expenses/ExpensesPage'
import PayrollPage from '@/pages/payroll/PayrollPage'
import ReportsPage from '@/pages/reports/ReportsPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import InquiriesPage from '@/pages/website/InquiriesPage'
import HomepageSlidesPage from '@/pages/website/HomepageSlidesPage'
import TestimonialsManagePage from '@/pages/website/TestimonialsPage'
import GalleryPage from '@/pages/website/GalleryPage'
import JournalPage from '@/pages/website/JournalPage'
import FaqsPage from '@/pages/website/FaqsPage'

export const router = createBrowserRouter([
  {
    element: <WebsiteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/our-services', element: <WebsiteServicesPage /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/blog/:slug', element: <BlogPostPage /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/contact', element: <ContactPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/users',
            element: <UsersPage />,
          },
          {
            path: '/roles',
            element: <RolesPage />,
          },
          {
            path: '/permissions',
            element: <PermissionsMatrixPage />,
          },
          {
            path: '/activity-logs',
            element: <ActivityLogsPage />,
          },
          {
            path: '/customers',
            element: <CustomerSearchPage />,
          },
          {
            path: '/customers/directory',
            element: <CustomersPage />,
          },
          {
            path: '/customers/:id',
            element: <CustomerProfilePage />,
          },
          {
            path: '/staff',
            element: <StaffDashboardPage />,
          },
          {
            path: '/staff/directory',
            element: <StaffPage />,
          },
          {
            path: '/staff/:id',
            element: <StaffProfilePage />,
          },
          {
            path: '/pos',
            element: <PosPage />,
          },
          {
            path: '/packages',
            element: <PackagesPage />,
          },
          {
            path: '/appointments',
            element: <AppointmentsPage />,
          },
          {
            path: '/payroll',
            element: <PayrollPage />,
          },
          {
            path: '/expenses',
            element: <ExpensesPage />,
          },
          {
            path: '/inventory',
            element: <InventoryPage />,
          },
          {
            path: '/reports',
            element: <ReportsPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
          {
            path: '/website/inquiries',
            element: <InquiriesPage />,
          },
          {
            path: '/website/homepage-slides',
            element: <HomepageSlidesPage />,
          },
          {
            path: '/website/testimonials',
            element: <TestimonialsManagePage />,
          },
          {
            path: '/website/gallery',
            element: <GalleryPage />,
          },
          {
            path: '/website/journal',
            element: <JournalPage />,
          },
          {
            path: '/website/faqs',
            element: <FaqsPage />,
          },
          {
            path: '/services',
            element: <ServicesPage />,
          },
          {
            path: '/masters',
            element: <MastersLayout />,
            children: [
              { index: true, element: <MastersIndexPage /> },
              { path: 'company', element: <CompanyPage /> },
              { path: 'settings', element: <Navigate to="/settings" replace /> },
              { path: ':module', element: <MasterModulePage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
