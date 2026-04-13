import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    LogOut, User as UserIcon, LayoutDashboard, Briefcase,
    FileText, Plus, ClipboardList, Search, Menu, ChevronDown,
    GraduationCap, Building2, Settings
} from 'lucide-react';

const navLinks = {
    student: [
        { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/student/profile', label: 'Profile', icon: UserIcon },
        { to: '/student/browse', label: 'Browse Internships', icon: Search },
        { to: '/student/applications', label: 'My Applications', icon: FileText },
    ],
    employer: [
        { to: '/employer', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/employer/profile', label: 'Profile', icon: UserIcon },
        { to: '/employer/post-internship', label: 'Post Internship', icon: Plus },
        { to: '/employer/manage-listings', label: 'Manage Listings', icon: ClipboardList },
    ],
};

export const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = user ? navLinks[user.role] || [] : [];

    const isActive = (path) => location.pathname === path;

    const getInitials = () => {
        return user?.email?.[0]?.toUpperCase() || '?';
    };

    const RoleIcon = user?.role === 'employer' ? Building2 : GraduationCap;

    return (
        <TooltipProvider delayDuration={300}>
            <nav className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left: Logo + Desktop Nav */}
                        <div className="flex items-center gap-1 h-full">
                            {/* Mobile hamburger */}
                            {user && (
                                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="md:hidden mr-2">
                                            <Menu className="size-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-72 pt-10">
                                        <SheetHeader className="text-left mb-6">
                                            <SheetTitle className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                                                    IM
                                                </div>
                                                Internship Match
                                            </SheetTitle>
                                        </SheetHeader>
                                        <nav className="flex flex-col gap-1">
                                            {links.map(({ to, label, icon: Icon }) => (
                                                <Link
                                                    key={to}
                                                    to={to}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(to)
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                        }`}
                                                >
                                                    <Icon className="size-4" />
                                                    {label}
                                                </Link>
                                            ))}
                                        </nav>
                                    </SheetContent>
                                </Sheet>
                            )}

                            {/* Logo */}
                            <Link to={user ? `/${user.role}` : '/'} className="flex items-center gap-2 mr-6">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                                    IM
                                </div>
                                <span className="font-bold text-lg text-foreground hidden sm:block">
                                    Internship Match
                                </span>
                            </Link>

                            {/* Desktop Nav Links */}
                            {user && (
                                <div className="hidden md:flex items-center h-full gap-1">
                                    {links.map(({ to, label, icon: Icon }) => (
                                        <Tooltip key={to}>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    to={to}
                                                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive(to)
                                                            ? 'text-primary bg-primary/5'
                                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                                        }`}
                                                >
                                                    <Icon className="size-4" />
                                                    <span className="hidden lg:inline">{label}</span>
                                                    {isActive(to) && (
                                                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                                                    )}
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent className="lg:hidden">
                                                <p>{label}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: User Menu */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto hover:bg-muted rounded-xl">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                    {getInitials()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="hidden sm:flex flex-col items-start">
                                                <span className="text-xs font-semibold text-foreground leading-none">
                                                    {user.email?.split('@')[0]}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground leading-none mt-0.5 uppercase font-bold tracking-wider">
                                                    {user.role}
                                                </span>
                                            </div>
                                            <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel className="flex items-center gap-3 py-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {getInitials()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{user.email?.split('@')[0]}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link to={`/${user.role}`} className="flex items-center gap-2 cursor-pointer">
                                                    <LayoutDashboard className="size-4" /> Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to={`/${user.role}/profile`} className="flex items-center gap-2 cursor-pointer">
                                                    <UserIcon className="size-4" /> My Profile
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            {user.role === 'student' && (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <Link to="/student/browse" className="flex items-center gap-2 cursor-pointer">
                                                            <Search className="size-4" /> Browse Internships
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link to="/student/applications" className="flex items-center gap-2 cursor-pointer">
                                                            <FileText className="size-4" /> My Applications
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            {user.role === 'employer' && (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <Link to="/employer/post-internship" className="flex items-center gap-2 cursor-pointer">
                                                            <Plus className="size-4" /> Post Internship
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link to="/employer/manage-listings" className="flex items-center gap-2 cursor-pointer">
                                                            <ClipboardList className="size-4" /> Manage Listings
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={logout}
                                            className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                                        >
                                            <LogOut className="size-4" /> Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link to="/login">Sign in</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link to="/register">Create account</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </TooltipProvider>
    );
};

export default Navbar;
