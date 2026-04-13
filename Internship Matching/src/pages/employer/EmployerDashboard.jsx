import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import internshipService from '../../services/internshipService';
import applicationService from '../../services/applicationService';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Briefcase, Clock, MapPin, Users, Plus, FileText,
    CheckCircle2, XCircle, ArrowRight, Building2,
    TrendingUp, Eye, ClipboardList
} from 'lucide-react';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [listings, setListings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profileData, listingsData, appsData] = await Promise.all([
                userService.getMyProfile().catch(() => null),
                internshipService.getMyPostings().catch(() => []),
                applicationService.getApplications().catch(() => [])
            ]);
            setProfile(profileData);
            setListings(listingsData || []);
            setApplications(appsData || []);
        } catch (err) {
            console.error('Dashboard load error', err);
        } finally {
            setLoading(false);
        }
    };

    // Stat calculations
    const activeListings = listings.filter(l => l.status === 'open').length;
    const totalApplicants = applications.length;
    const pendingReviews = applications.filter(a => a.status === 'pending').length;

    const getInitials = () => {
        if (profile) return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
        return user?.email?.[0]?.toUpperCase() || 'E';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Accepted</Badge>;
            case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
            case 'withdrawn': return <Badge variant="outline">Withdrawn</Badge>;
            default: return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
        }
    };

    if (loading) {
        return (
            <PageLayout>
                <div className="space-y-8 pb-8">
                    <Card className="border-0 shadow-xl">
                        <CardContent className="pt-2">
                            <div className="flex items-center gap-6">
                                <Skeleton className="h-20 w-20 rounded-full" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-8 w-64" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <Card key={i}><CardContent className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-8 w-12" /></div>
                            </CardContent></Card>
                        ))}
                    </div>
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
                <Card className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white border-0 shadow-xl">
                    <CardContent className="pt-2">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <Avatar className="h-20 w-20 border-4 border-white/10 text-2xl shadow-lg">
                                <AvatarFallback className="bg-white/10 text-white text-2xl font-bold">
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl font-extrabold tracking-tight">
                                        {profile?.employer_profile?.company_name || `Welcome, ${profile?.first_name || 'Employer'}!`}
                                    </h1>
                                    <Badge className="bg-white/15 text-white border-white/30 hover:bg-white/25">
                                        <Building2 className="size-3 mr-1" /> Employer
                                    </Badge>
                                </div>
                                <p className="text-slate-300 text-sm">
                                    {profile?.employer_profile?.industry
                                        ? `${profile.employer_profile.industry} • ${profile.employer_profile.company_description?.slice(0, 80) || 'Manage your internships and review applicants.'}`
                                        : 'Manage your internships and review applicants.'}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
                                <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-md">
                                    <Link to="/employer/post-internship">
                                        <Plus className="size-4 mr-2" /> Post Internship
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" size="lg" className="text-white border border-white/20 hover:bg-white/10">
                                    <Link to="/employer/manage-listings">
                                        <ClipboardList className="size-4 mr-2" /> Manage Listings
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ─── Stats Row ─── */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                <Briefcase className="size-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Active Listings</p>
                                <p className="text-3xl font-extrabold tracking-tight">{activeListings}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                                <Users className="size-6 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Total Applicants</p>
                                <p className="text-3xl font-extrabold tracking-tight">{totalApplicants}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                <Clock className="size-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Pending Reviews</p>
                                <p className="text-3xl font-extrabold tracking-tight">{pendingReviews}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ─── Main Content Grid ─── */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {/* Recent Applicants */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="size-5 text-primary" />
                                Recent Applicants
                            </CardTitle>
                            <CardDescription>Latest applications to your internships</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {applications.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="mx-auto size-10 mb-3 opacity-30" />
                                    <p className="font-medium">No applicants yet</p>
                                    <p className="text-sm">Applications will appear here once students apply.</p>
                                </div>
                            ) : (
                                applications.slice(0, 4).map((app) => (
                                    <div key={app.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <Avatar className="h-9 w-9 shrink-0">
                                                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                                    {app.student_name ? app.student_name.split(' ').map(n => n[0]).join('') : '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm truncate">
                                                    {app.student_name || `Student #${app.student_id}`}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Applied {new Date(app.applied_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {getStatusBadge(app.status)}
                                    </div>
                                ))
                            )}
                        </CardContent>
                        {applications.length > 0 && (
                            <CardFooter>
                                <Button asChild variant="ghost" size="sm" className="w-full">
                                    <Link to="/employer/manage-listings">
                                        View All Applicants <ArrowRight className="size-4 ml-2" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    {/* My Active Listings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="size-5 text-blue-600" />
                                My Active Listings
                            </CardTitle>
                            <CardDescription>Your currently open internship positions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {listings.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Briefcase className="mx-auto size-10 mb-3 opacity-30" />
                                    <p className="font-medium">No listings yet</p>
                                    <p className="text-sm">Post your first internship to get started!</p>
                                </div>
                            ) : (
                                listings.slice(0, 4).map((item) => (
                                    <div key={item.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-sm truncate">{item.title}</p>
                                                <Badge variant={item.status === 'open' ? 'default' : 'outline'} className={item.status === 'open' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><MapPin className="size-3" />{item.location}</span>
                                                <span className="flex items-center gap-1"><Users className="size-3" />{item.slots} slots</span>
                                            </div>
                                        </div>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link to={`/employer/internship/${item.id}/applicants`}>
                                                <Eye className="size-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                        {listings.length > 0 && (
                            <CardFooter>
                                <Button asChild variant="ghost" size="sm" className="w-full">
                                    <Link to="/employer/manage-listings">
                                        Manage All Listings <ArrowRight className="size-4 ml-2" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </PageLayout>
    );
};

export default EmployerDashboard;
