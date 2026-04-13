import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import internshipService from '../../services/internshipService';
import applicationService from '../../services/applicationService';
import toast from 'react-hot-toast';
import {
    Loader2, MapPin, Clock, DollarSign, Calendar,
    ChevronLeft, Building2, CheckCircle2, ListChecks
} from 'lucide-react';

const InternshipDetailsPage = () => {
    const { id } = useParams();
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const data = await internshipService.getInternship(id);
            setInternship(data);
        } catch (error) {
            toast.error('Failed to load internship details');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!coverLetter.trim()) {
            toast.error('Please provide a short cover letter or intro');
            return;
        }

        setSubmitting(true);
        try {
            await applicationService.apply(internship.id, coverLetter);
            toast.success('Application submitted successfully!');
            setShowApplyModal(false);
            setCoverLetter('');
        } catch (error) {
            const message = error.response?.data?.detail || 'Failed to submit application';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <PageLayout title="Internship Details">
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
                    <p className="text-gray-500">Internship posting not found.</p>
                    <Link to="/student/browse" className="mt-4 inline-block">
                        <Button variant="secondary">Back to Browse</Button>
                    </Link>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={internship.title}>
            <div className="mx-auto max-w-5xl">
                <Link to="/student/browse" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
                    <ChevronLeft size={16} /> Back to Browse
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-blue-50 text-blue-700 text-xs font-bold uppercase px-2.5 py-1 rounded tracking-wider">
                                    {internship.field}
                                </span>
                                {internship.is_paid && (
                                    <span className="bg-green-50 text-green-700 text-xs font-bold uppercase px-2.5 py-1 rounded tracking-wider flex items-center gap-1">
                                        <DollarSign size={14} /> Paid
                                    </span>
                                )}
                                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${internship.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {internship.status}
                                </span>
                            </div>

                            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 uppercase tracking-tight">
                                {internship.title}
                            </h1>

                            <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Location</p>
                                        <p className="font-semibold">{internship.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Duration</p>
                                        <p className="font-semibold">{internship.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Deadline</p>
                                        <p className="font-semibold">{new Date(internship.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {internship.is_paid && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <DollarSign size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Stipend</p>
                                            <p className="font-semibold">₱{internship.stipend?.toLocaleString()}/month</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="prose prose-blue max-w-none">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Building2 size={20} className="text-blue-600" /> Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {internship.description}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ListChecks size={20} className="text-blue-600" /> Requirements
                                </h3>
                                <ul className="space-y-3">
                                    {internship.requirements?.length > 0 ? (
                                        internship.requirements.map((req, i) => (
                                            <li key={i} className="flex gap-3 text-gray-600">
                                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{req}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-400 italic">No specific requirements listed.</li>
                                    )}
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ListChecks size={20} className="text-blue-600" /> Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {internship.required_skills?.length > 0 ? (
                                        internship.required_skills.map((skill, i) => (
                                            <span key={i} className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">No specific skills required.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Interested?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Make sure your profile is complete before applying for the best chance of matching!
                            </p>
                            <Button
                                variant="primary"
                                className="w-full py-3 h-auto text-lg"
                                onClick={() => setShowApplyModal(true)}
                                disabled={internship.status !== 'open'}
                            >
                                Apply Now
                            </Button>
                            {internship.status !== 'open' && (
                                <p className="mt-2 text-xs text-red-500 font-medium">This internship is currently {internship.status}.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Apply for {internship.title}</h2>
                        <p className="text-gray-500 text-sm mb-6 font-medium">Briefly explain why you are interested in this position.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Cover Letter / Introduction</label>
                                <textarea
                                    className="w-full h-32 rounded-xl border border-gray-300 p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-inner bg-gray-50"
                                    placeholder="Write something about your skills and interest..."
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => setShowApplyModal(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={handleApply}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default InternshipDetailsPage;
