import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import applicationService from '../../services/applicationService';
import internshipService from '../../services/internshipService';
import toast from 'react-hot-toast';
import { Loader2, Calendar, Clock, MapPin, Briefcase, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [internships, setInternships] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const apps = await applicationService.getApplications();
            setApplications(apps);

            // Fetch internship details for each application to show titles
            const internshipData = {};
            for (const app of apps) {
                if (!internshipData[app.internship_id]) {
                    const detail = await internshipService.getInternship(app.internship_id);
                    internshipData[app.internship_id] = detail;
                }
            }
            setInternships(internshipData);
        } catch (error) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
                return <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-md">✓ Accepted</Badge>;
            case 'rejected':
                return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md">✗ Rejected</Badge>;
            case 'withdrawn':
                return <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-md">Withdrawn</Badge>;
            default:
                return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">⏳ Pending</Badge>;
        }
    };

    if (loading) {
        return (
            <PageLayout title="My Applications">
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Track My Applications">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">My Applications</h2>
                            <p className="text-gray-600">You have <span className="font-bold text-blue-600">{applications.length}</span> active applications</p>
                        </div>
                        <Briefcase className="size-12 text-blue-500 opacity-50" />
                    </div>
                </motion.div>

                <div className="space-y-6">
                    {applications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                            </motion.div>
                            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">No applications yet</h3>
                            <p className="text-gray-500 mt-2 font-medium mb-6">Start browsing internships to find your perfect match!</p>
                            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                                <Link to="/student/browse">
                                    <Briefcase className="size-5 mr-2" />
                                    Browse Internships
                                    <ArrowRight className="size-4 ml-2" />
                                </Link>
                            </Button>
                        </motion.div>
                    ) : (
                        applications.map((app, index) => {
                            const internship = internships[app.internship_id];
                            return (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.01, y: -2 }}
                                >
                                    <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl overflow-hidden">
                                        <CardContent className="p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                                        {getStatusBadge(app.status)}
                                                        <span className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                                                            <Calendar size={14} />
                                                            Applied {new Date(app.applied_at).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                                                        {internship?.title || 'Loading...'}
                                                    </h3>

                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                                            <MapPin size={16} className="text-blue-500" />
                                                            <span className="font-medium">{internship?.location || '...'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                                            <Clock size={16} className="text-amber-500" />
                                                            <span className="font-medium">{internship?.duration || '...'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <FileText size={16} className="text-blue-600" />
                                                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Your Cover Letter</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 line-clamp-3 italic leading-relaxed">
                                                            "{app.cover_letter}"
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end md:justify-center">
                                                    <Button
                                                        asChild
                                                        size="lg"
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md group"
                                                    >
                                                        <Link to={`/student/internship/${app.internship_id}`}>
                                                            View Details
                                                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default MyApplicationsPage;
