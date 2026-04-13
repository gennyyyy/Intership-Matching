import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import internshipService from '../../services/internshipService';
import toast from 'react-hot-toast';
import { Loader2, Search, MapPin, Clock, DollarSign, ArrowRight, Filter, Briefcase, Sparkles, TrendingUp } from 'lucide-react';

const BrowseInternshipsPage = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        field: '',
        location: '',
    });

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        setLoading(true);
        try {
            const data = await internshipService.getInternships(filters);
            setInternships(data);
        } catch (error) {
            toast.error('Failed to load internships');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchInternships();
    };

    return (
        <PageLayout title="Browse Internships">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <Card className="sticky top-6 border-2 hover:border-blue-200 transition-colors shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                                    <Filter size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                            </div>

                            <form onSubmit={handleSearch} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="field" className="text-sm font-semibold flex items-center gap-1">
                                        <Briefcase className="size-3" />
                                        Field
                                    </Label>
                                    <Input
                                        id="field"
                                        placeholder="e.g. Technology"
                                        value={filters.field}
                                        onChange={(e) => setFilters({ ...filters, field: e.target.value })}
                                        className="h-11 border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm font-semibold flex items-center gap-1">
                                        <MapPin className="size-3" />
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g. Manila, Remote"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                        className="h-11 border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full mt-6 h-11 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-xl transition-all group"
                                >
                                    <Search className="size-4 mr-2" />
                                    Update Results
                                    <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Listings Area */}
                <div className="lg:col-span-3 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100"
                    >
                        <div className="flex items-center gap-2">
                            <TrendingUp className="size-5 text-blue-600" />
                            <p className="font-semibold text-gray-900">
                                Showing <span className="text-blue-600">{internships.length}</span> opportunities
                            </p>
                        </div>
                        <Sparkles className="size-5 text-amber-500" />
                    </motion.div>

                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex h-96 items-center justify-center"
                        >
                            <div className="text-center">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">Loading amazing opportunities...</p>
                            </div>
                        </motion.div>
                    ) : internships.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                            </motion.div>
                            <p className="text-gray-700 font-bold text-lg mb-2">No internships found</p>
                            <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                            <Button
                                onClick={() => { setFilters({ field: '', location: '' }); fetchInternships(); }}
                                variant="outline"
                                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                            >
                                <ArrowRight className="size-4 mr-2" />
                                Clear all filters
                            </Button>
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {internships.map((internship, index) => (
                                <motion.div
                                    key={internship.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="relative overflow-hidden border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl group">
                                        {/* Animated gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <CardContent className="relative p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold uppercase px-3 py-1 shadow-md">
                                                            {internship.field}
                                                        </Badge>
                                                        {internship.is_paid && (
                                                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold uppercase px-3 py-1 shadow-md">
                                                                <DollarSign size={12} className="mr-1" /> Paid
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                                                        {internship.title}
                                                    </h3>

                                                    <p className="text-gray-600 text-base leading-relaxed mb-4 line-clamp-2">
                                                        {internship.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-200">
                                                            <MapPin size={16} className="text-blue-500" />
                                                            <span className="font-medium">{internship.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-200">
                                                            <Clock size={16} className="text-amber-500" />
                                                            <span className="font-medium">{internship.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 min-w-[160px]">
                                                    <div className="text-left md:text-right">
                                                        <p className="text-xs text-gray-500 font-semibold mb-1">Deadline</p>
                                                        <p className="text-base font-bold text-gray-900">
                                                            {new Date(internship.deadline).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    <Button
                                                        asChild
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all group/btn font-semibold"
                                                        size="lg"
                                                    >
                                                        <Link to={`/student/internship/${internship.id}`}>
                                                            View Details
                                                            <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default BrowseInternshipsPage;
