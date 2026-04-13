import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import internshipService from '../../services/internshipService';
import applicationService from '../../services/applicationService';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import NumberTicker from '@/components/magicui/number-ticker';
import {
    Briefcase, Clock, MapPin, Send, FileText,
    CheckCircle2, ArrowRight, Sparkles,
    GraduationCap, TrendingUp, Eye, Zap, Target
} from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileData, appsData, internshipsData] = await Promise.all([
                userService.getMyProfile().catch(() => null),
                applicationService.getApplications().catch(() => []),
                internshipService.getInternships({ status: 'open' }).catch(() => [])
            ]);
            setProfile(profileData);
            setApplications(appsData || []);
            setInternships(internshipsData || []);
        } catch (err) {
            console.error('Dashboard load error', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate profile completeness
    const getProfileCompleteness = () => {
        if (!profile?.student_profile) return 0;
        const p = profile.student_profile;
        let filled = 0;
        const fields = ['university', 'course', 'year_level', 'skills', 'gpa', 'preferred_location', 'preferred_field'];
        fields.forEach(f => {
            if (f === 'skills') {
                if (p[f] && p[f].length > 0) filled++;
            } else if (p[f]) filled++;
        });
        return Math.round((filled / fields.length) * 100);
    };

    // Stat calculations
    const totalApps = applications.length;
    const pendingApps = applications.filter(a => a.status === 'pending').length;
    const acceptedApps = applications.filter(a => a.status === 'accepted').length;
    const profileComplete = getProfileCompleteness();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Accepted</Badge>;
            case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
            case 'withdrawn': return <Badge variant="outline">Withdrawn</Badge>;
            default: return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
        }
    };

    const getInitials = () => {
        if (profile) return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
        return user?.email?.[0]?.toUpperCase() || 'S';
    };

    if (loading) {
        return (
            <PageLayout>
                <div className="space-y-8 pb-8">
                    {/* Skeleton Hero */}
                    <Card className="border-0 shadow-xl">
                        <CardContent className="pt-2">
                            <div className="flex items-center gap-6">
                                <Skeleton className="h-20 w-20 rounded-full" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-8 w-64" />
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-2 w-80 mt-4" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Skeleton Stats */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <Card key={i}><CardContent className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-8 w-12" /></div>
                            </CardContent></Card>
                        ))}
                    </div>
                    {/* Skeleton Panels */}
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {[1, 2].map(i => (
                            <Card key={i}><CardHeader><Skeleton className="h-5 w-48" /><Skeleton className="h-3 w-32" /></CardHeader>
                                <CardContent className="space-y-3">
                                    {[1, 2, 3].map(j => <Skeleton key={j} className="h-14 w-full rounded-lg" />)}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="space-y-8 pb-8">
                {/* ─── Welcome Hero ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white border-0 shadow-2xl">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />
                        </div>

                        <CardContent className="relative pt-8 pb-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                                    <Avatar className="h-24 w-24 border-4 border-white/30 text-2xl shadow-2xl ring-4 ring-white/20">
                                        <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm text-white text-3xl font-bold">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                </motion.div>

                                <div className="flex-1 space-y-3">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex flex-wrap items-center gap-3"
                                    >
                                        <h1 className="text-4xl font-extrabold tracking-tight">
                                            Welcome back, {profile?.first_name || 'Student'}!
                                        </h1>
                                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 shadow-lg">
                                            <GraduationCap className="size-3 mr-1" /> Student
                                        </Badge>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-blue-100 text-base max-w-lg flex items-center gap-2"
                                    >
                                        <Sparkles className="size-4" />
                                        {profile?.student_profile?.university
                                            ? `${profile.student_profile.course || 'Student'} at ${profile.student_profile.university}`
                                            : 'Complete your profile to get better internship matches.'}
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="pt-2 space-y-2 max-w-md"
                                    >
                                        <div className="flex justify-between text-sm font-semibold">
                                            <span className="text-blue-100 flex items-center gap-2">
                                                <Target className="size-4" />
                                                Profile Completeness
                                            </span>
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.7, type: "spring" }}
                                                className="text-white font-bold text-lg"
                                            >
                                                {profileComplete}%
                                            </motion.span>
                                        </div>
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.6, duration: 0.8 }}
                                            className="origin-left"
                                        >
                                            <Progress
                                                value={profileComplete}
                                                className="h-3 bg-white/20 backdrop-blur-sm shadow-inner [&>div]:bg-gradient-to-r [&>div]:from-white [&>div]:to-blue-100 [&>div]:shadow-lg"
                                            />
                                        </motion.div>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex flex-col gap-3 mt-2 md:mt-0 w-full md:w-auto"
                                >
                                    <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                        <Link to="/student/browse">
                                            <Briefcase className="size-5 mr-2" />
                                            Browse Internships
                                            <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="ghost" size="lg" className="text-white border-2 border-white/40 hover:bg-white/20 hover:border-white backdrop-blur-sm font-semibold shadow-lg">
                                        <Link to="/student/applications">
                                            <FileText className="size-5 mr-2" /> My Applications
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* ─── Stats Row ─── */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="relative overflow-hidden border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="relative flex items-center gap-5 py-6">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.8, type: "spring" }}
                                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl transition-shadow"
                                >
                                    <Send className="size-7 text-white" />
                                </motion.div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-semibold mb-1">Total Applications</p>
                                    <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        <NumberTicker value={totalApps} delay={0.8} />
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="relative overflow-hidden border-2 hover:border-amber-300 transition-all duration-300 hover:shadow-xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="relative flex items-center gap-5 py-6">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.9, type: "spring" }}
                                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl transition-shadow"
                                >
                                    <Clock className="size-7 text-white" />
                                </motion.div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-semibold mb-1">Pending Review</p>
                                    <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                        <NumberTicker value={pendingApps} delay={0.9} />
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="relative overflow-hidden border-2 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="relative flex items-center gap-5 py-6">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 1.0, type: "spring" }}
                                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl transition-shadow"
                                >
                                    <CheckCircle2 className="size-7 text-white" />
                                </motion.div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-semibold mb-1">Accepted</p>
                                    <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                        <NumberTicker value={acceptedApps} delay={1.0} />
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* ─── Main Content Grid ─── */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {/* Recent Applications */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                    >
                        <Card className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg h-full">
                            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                                        <FileText className="size-5" />
                                    </div>
                                    Recent Applications
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <Zap className="size-3" />
                                    Your latest submissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-6">
                                {applications.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12 text-muted-foreground"
                                    >
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <Send className="mx-auto size-12 mb-4 opacity-30" />
                                        </motion.div>
                                        <p className="font-semibold text-lg">No applications yet</p>
                                        <p className="text-sm mt-1">Start browsing internships to find your match!</p>
                                    </motion.div>
                                ) : (
                                    applications.slice(0, 4).map((app, index) => (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.1 + index * 0.1 }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-100/70 hover:to-indigo-100/70 transition-all duration-300 border border-blue-100"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate text-blue-900">
                                                    Internship #{app.internship_id}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                    <Clock className="size-3" />
                                                    Applied {new Date(app.applied_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {getStatusBadge(app.status)}
                                        </motion.div>
                                    ))
                                )}
                            </CardContent>
                            {applications.length > 0 && (
                                <CardFooter className="border-t bg-gray-50/50">
                                    <Button asChild variant="ghost" size="sm" className="w-full group hover:bg-blue-50">
                                        <Link to="/student/applications">
                                            View All Applications
                                            <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </motion.div>

                    {/* Recommended Internships */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                    >
                        <Card className="border-2 hover:border-amber-200 transition-all duration-300 hover:shadow-lg h-full">
                            <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                                        <Sparkles className="size-5" />
                                    </div>
                                    Recommended Internships
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <TrendingUp className="size-3" />
                                    Open positions matching your profile
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-6">
                                {internships.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12 text-muted-foreground"
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <Briefcase className="mx-auto size-12 mb-4 opacity-30" />
                                        </motion.div>
                                        <p className="font-semibold text-lg">No internships available</p>
                                        <p className="text-sm mt-1">Check back soon for new opportunities!</p>
                                    </motion.div>
                                ) : (
                                    internships.slice(0, 4).map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.1 + index * 0.1 }}
                                            whileHover={{ scale: 1.02, x: -5 }}
                                            className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 hover:from-amber-100/70 hover:to-orange-100/70 transition-all duration-300 border border-amber-100"
                                        >
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <p className="font-bold text-sm text-amber-900">{item.title}</p>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="size-3" />
                                                        {item.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="size-3" />
                                                        {item.duration}
                                                    </span>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] bg-white/50 border-amber-200">
                                                    {item.field}
                                                </Badge>
                                            </div>
                                            <Button
                                                asChild
                                                size="sm"
                                                className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                                            >
                                                <Link to={`/student/internship/${item.id}`}>
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    ))
                                )}
                            </CardContent>
                            {internships.length > 0 && (
                                <CardFooter className="border-t bg-gray-50/50">
                                    <Button asChild variant="ghost" size="sm" className="w-full group hover:bg-amber-50">
                                        <Link to="/student/browse">
                                            Browse All Internships
                                            <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
        </PageLayout>
    );
};

export default StudentDashboard;
