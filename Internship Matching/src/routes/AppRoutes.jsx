import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentProfilePage from '../pages/student/ProfilePage';
import BrowseInternships from '../pages/student/BrowseInternships';
import InternshipDetails from '../pages/student/InternshipDetails';
import MyApplications from '../pages/student/MyApplications';
import EmployerDashboard from '../pages/employer/EmployerDashboard';
import EmployerProfilePage from '../pages/employer/ProfilePage';
import PostInternship from '../pages/employer/PostInternship';
import ManageListings from '../pages/employer/ManageListings';
import ViewApplicants from '../pages/employer/ViewApplicants';
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfilePage />} />
                <Route path="/student/browse" element={<BrowseInternships />} />
                <Route path="/student/internship/:id" element={<InternshipDetails />} />
                <Route path="/student/applications" element={<MyApplications />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
                <Route path="/employer" element={<EmployerDashboard />} />
                <Route path="/employer/profile" element={<EmployerProfilePage />} />
                <Route path="/employer/post-internship" element={<PostInternship />} />
                <Route path="/employer/manage-listings" element={<ManageListings />} />
                <Route path="/employer/internship/:id/applicants" element={<ViewApplicants />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
