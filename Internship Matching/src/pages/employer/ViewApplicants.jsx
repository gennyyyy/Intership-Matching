import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import applicationService from '../../services/applicationService';
import internshipService from '../../services/internshipService';
import toast from 'react-hot-toast';
import {
    Loader2, ChevronLeft, User as UserIcon, Mail,
    GraduationCap, BookOpen, CheckCircle2, XCircle,
    ExternalLink, FileText, Calendar, Users
} from 'lucide-react';

const ViewApplicantsPage = () => {
    const { id } = useParams(); // Internship ID
    const [internship, setInternship] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [internshipData, applicantsData] = await Promise.all([
                internshipService.getInternship(id),
                applicationService.getInternshipApplicants(id)
            ]);
            setInternship(internshipData);
            setApplicants(applicantsData || []);
        } catch (error) {
            toast.error('Failed to load applicant data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (applicationId, newStatus) => {
        setUpdatingId(applicationId);
        try {
            await applicationService.updateStatus(applicationId, newStatus);
            toast.success(`Application ${newStatus}`);
            // Update local state
            setApplicants(applicants.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <PageLayout title="Review Applicants">
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </PageLayout>
        );
    }

    if (!internship) {
        return (
            <PageLayout title="Not Found">
                <div className="text-center py-12">
                    <p className="text-gray-500 font-medium">Internship not found.</p>
                    <Link to="/employer/manage-listings" className="mt-4 inline-block">
                        <Button variant="secondary">Back to Postings</Button>
                    </Link>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={`Applicants: ${internship?.title}`}>
            <div className="mx-auto max-w-6xl">
                <Link to="/employer/manage-listings" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
                    <ChevronLeft size={16} /> Back to Manage Listings
                </Link>

                <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
                    <h1 className="text-2xl font-black uppercase tracking-tight mb-2">{internship?.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm font-medium opacity-90">
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> Posted on {internship?.created_at ? new Date(internship.created_at).toLocaleDateString() : 'N/A'}</span>
                        <span className="flex items-center gap-1.5"><Users size={16} className="w-4 h-4" /> {applicants.length} Total Applicants</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {applicants.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <Users size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">No applicants yet</h3>
                            <p className="text-gray-500 font-medium">Applications will appear here once students start applying.</p>
                        </div>
                    ) : (
                        applicants.map((app) => (
                            <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                                    {/* Student Card Info */}
                                    <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-8">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                <UserIcon size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900 uppercase leading-none mb-1">
                                                    {app.student_name || 'Anonymous Student'}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <GraduationCap size={18} className="text-gray-400" />
                                                <span className="font-medium">{app.student_profile?.university || 'No university listed'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <BookOpen size={18} className="text-gray-400" />
                                                <span className="font-medium">{app.student_profile?.course || 'No course listed'}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 pt-2">
                                                {app.student_profile?.skills?.map((skill, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Application Details */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h4 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                                <FileText size={14} /> Cover Letter / Interest
                                            </h4>
                                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-gray-600 text-sm italic leading-relaxed">
                                                "{app.cover_letter || 'No cover letter provided.'}"
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                Applied on {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}
                                            </div>

                                            <div className="flex gap-2">
                                                {app.status === 'pending' ? (
                                                    <>
                                                        <Button
                                                            variant="secondary"
                                                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 border-red-100 whitespace-nowrap"
                                                            onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                                            disabled={updatingId === app.id}
                                                        >
                                                            <XCircle size={18} /> Reject
                                                        </Button>
                                                        <Button
                                                            variant="primary"
                                                            className="flex items-center gap-2 whitespace-nowrap"
                                                            onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                                            disabled={updatingId === app.id}
                                                        >
                                                            <CheckCircle2 size={18} /> Accept Applicant
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2"
                                                        onClick={() => handleUpdateStatus(app.id, 'pending')}
                                                        disabled={updatingId === app.id}
                                                    >
                                                        Reset to Pending
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default ViewApplicantsPage;
