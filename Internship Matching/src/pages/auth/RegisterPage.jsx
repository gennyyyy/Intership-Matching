import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, GraduationCap, Building2, Sparkles, ArrowRight, Check } from 'lucide-react';
import Particles from '@/components/magicui/particles';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({ defaultValues: { role: 'student' } });
    const { register: registerUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const selectedRole = watch('role');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const userData = {
                email: data.email,
                password: data.password,
                first_name: data.firstName,
                last_name: data.lastName,
                role: data.role
            };
            await registerUser(userData);
            toast.success('Account created successfully!');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4 py-12">
            {/* Animated background particles */}
            <Particles className="absolute inset-0 opacity-30" quantity={80} color="#a855f7" size={2} />

            {/* Floating gradient orbs */}
            <div className="absolute top-10 right-10 h-96 w-96 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 blur-3xl animate-pulse delay-700" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-lg space-y-8"
            >
                {/* Logo & Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex flex-col items-center gap-4"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: -5 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50" />
                        <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl">
                            IM
                        </div>
                    </motion.div>

                    <div className="text-center space-y-2">
                        <AnimatedGradientText>
                            <h1 className="text-4xl font-extrabold tracking-tight">Create Account</h1>
                        </AnimatedGradientText>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-muted-foreground"
                        >
                            Start your journey to amazing internships
                        </motion.p>
                    </div>
                </motion.div>

                {/* Register Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Card className="relative overflow-hidden border-2 shadow-2xl backdrop-blur-sm bg-white/90">
                        {/* Animated beam effect */}
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "200%" }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="h-full w-1/3 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent skew-x-12"
                            />
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-5 pt-8 pb-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-sm font-semibold">First name</Label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            {...register('firstName', { required: 'Required' })}
                                            className={`h-11 transition-all duration-200 ${
                                                errors.firstName ? 'border-destructive' : 'focus:ring-2 focus:ring-purple-500'
                                            }`}
                                        />
                                        {errors.firstName && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive font-medium">{errors.firstName.message}</motion.p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-sm font-semibold">Last name</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            {...register('lastName', { required: 'Required' })}
                                            className={`h-11 transition-all duration-200 ${
                                                errors.lastName ? 'border-destructive' : 'focus:ring-2 focus:ring-purple-500'
                                            }`}
                                        />
                                        {errors.lastName && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive font-medium">{errors.lastName.message}</motion.p>}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="email" className="text-sm font-semibold">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register('email', { required: 'Email is required' })}
                                        className={`h-11 transition-all duration-200 ${
                                            errors.email ? 'border-destructive' : 'focus:ring-2 focus:ring-purple-500'
                                        }`}
                                    />
                                    {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive font-medium">{errors.email.message}</motion.p>}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                                        className={`h-11 transition-all duration-200 ${
                                            errors.password ? 'border-destructive' : 'focus:ring-2 focus:ring-purple-500'
                                        }`}
                                    />
                                    {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive font-medium">{errors.password.message}</motion.p>}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="space-y-3"
                                >
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Sparkles className="size-4 text-amber-500" />
                                        I am a...
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.label
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                                selectedRole === 'student'
                                                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg'
                                                    : 'border-border hover:border-purple-300 bg-white'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                value="student"
                                                {...register('role', { required: 'Please select a role' })}
                                                className="sr-only"
                                            />
                                            {selectedRole === 'student' && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1"
                                                >
                                                    <Check className="size-3" />
                                                </motion.div>
                                            )}
                                            <div className={`p-3 rounded-2xl ${selectedRole === 'student' ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg' : 'bg-muted text-muted-foreground'}`}>
                                                <GraduationCap className="size-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold">Student</p>
                                                <p className="text-xs text-muted-foreground">Find internships</p>
                                            </div>
                                        </motion.label>

                                        <motion.label
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                                selectedRole === 'employer'
                                                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                                                    : 'border-border hover:border-purple-300 bg-white'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                value="employer"
                                                {...register('role', { required: 'Please select a role' })}
                                                className="sr-only"
                                            />
                                            {selectedRole === 'employer' && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1"
                                                >
                                                    <Check className="size-3" />
                                                </motion.div>
                                            )}
                                            <div className={`p-3 rounded-2xl ${selectedRole === 'employer' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-muted text-muted-foreground'}`}>
                                                <Building2 className="size-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold">Employer</p>
                                                <p className="text-xs text-muted-foreground">Post internships</p>
                                            </div>
                                        </motion.label>
                                    </div>
                                    {errors.role && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive font-medium">{errors.role.message}</motion.p>}
                                </motion.div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-5 pb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="w-full"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                                        size="lg"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="size-5 animate-spin" />
                                                    Creating account...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="size-5" />
                                                    Create account
                                                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>

                                        {/* Button hover effect */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                                            initial={{ x: "100%" }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </Button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex items-center gap-2 text-sm text-center text-muted-foreground"
                                >
                                    <span>
                                        Already have an account?{' '}
                                        <Link
                                            to="/login"
                                            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
                                        >
                                            Sign in
                                        </Link>
                                    </span>
                                </motion.div>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>

                {/* Footer text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center text-xs text-muted-foreground"
                >
                    By signing up, you agree to our Terms and Privacy Policy
                </motion.p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
