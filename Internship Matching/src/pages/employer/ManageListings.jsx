import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import internshipService from '../../services/internshipService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Loader2, Edit, Trash2, Users, MapPin, Calendar, Clock, Plus, Briefcase as BriefcaseIcon } from 'lucide-react';

// Briefcase icon fallback or custom component
const Briefcase = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const ManageListingsPage = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyPostings();
    }, []);

    const fetchMyPostings = async () => {
        try {
            const data = await internshipService.getMyPostings();
            setInternships(data || []);
        } catch (error) {
            toast.error('Failed to load your postings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this internship posting?')) {
            try {
                await internshipService.deleteInternship(id);
                toast.success('Internship deleted');
                setInternships(internships.filter(i => i.id !== id));
            } catch (error) {
                toast.error('Failed to delete internship');
            }
        }
    };

    if (loading) {
        return (
            <PageLayout title="Manage Listings">
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Manage My Internships">
            <div className="mb-6 flex justify-between items-center text-sm">
                <p className="text-gray-500">You have {internships.length} active postings</p>
                <Link to="/employer/post-internship">
                    <Button variant="primary" className="flex items-center gap-2">
                        <Plus size={18} />
                        Post New
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {internships.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No internships posted yet</h3>
                        <p className="text-gray-500 mt-1">Get started by creating your first internship opportunity.</p>
                        <Link to="/employer/post-internship" className="mt-6 inline-block">
                            <Button variant="primary">Post Internship</Button>
                        </Link>
                    </div>
                ) : (
                    internships.map((internship) => (
                        <div key={internship.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-gray-900">{internship.title}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${internship.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {internship.status}
                                    </span>
                                </div>
                                <p className="text-blue-600 font-medium mb-4">{internship.field}</p>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        {internship.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        {internship.duration}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-gray-400" />
                                        {internship.slots} Slots
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        Deadline: {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col gap-2 justify-end">
                                <Link to={`/employer/internship/${internship.id}/applicants`}>
                                    <Button variant="primary" className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm">
                                        <Users size={16} /> Applicants
                                    </Button>
                                </Link>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm bg-gray-50">
                                        <Edit size={16} /> Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleDelete(internship.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PageLayout>
    );
};

export default ManageListingsPage;
