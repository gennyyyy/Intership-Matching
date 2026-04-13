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
import { Loader2, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import Particles from '@/components/magicui/particles';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);
            toast.success('Successfully logged in!');
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
            {/* Animated background particles */}
            <Particles className="absolute inset-0 opacity-30" quantity={100} color="#3b82f6" size={2} />

            {/* Floating gradient orbs */}
            <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl animate-pulse delay-700" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md space-y-8"
            >
                {/* Logo & Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex flex-col items-center gap-4"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50" />
                        <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl">
                            IM
                        </div>
                    </motion.div>

                    <div className="text-center space-y-2">
                        <AnimatedGradientText>
                            <h1 className="text-4xl font-extrabold tracking-tight">Welcome Back</h1>
                        </AnimatedGradientText>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-muted-foreground"
                        >
                            Sign in to discover amazing internship opportunities
                        </motion.p>
                    </div>
                </motion.div>

                {/* Login Card */}
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
                                className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent skew-x-12"
                            />
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-5 pt-8 pb-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="email" className="text-sm font-semibold">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register('email', { required: 'Email is required' })}
                                        className={`h-11 transition-all duration-200 ${
                                            errors.email
                                                ? 'border-destructive focus:ring-destructive'
                                                : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    />
                                    {errors.email && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-destructive font-medium"
                                        >
                                            {errors.email.message}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password', { required: 'Password is required' })}
                                        className={`h-11 transition-all duration-200 ${
                                            errors.password
                                                ? 'border-destructive focus:ring-destructive'
                                                : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    />
                                    {errors.password && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-destructive font-medium"
                                        >
                                            {errors.password.message}
                                        </motion.p>
                                    )}
                                </motion.div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-5 pb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="w-full"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                                        size="lg"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="size-5 animate-spin" />
                                                    Signing in...
                                                </>
                                            ) : (
                                                <>
                                                    <LogIn className="size-5" />
                                                    Sign in
                                                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>

                                        {/* Button hover effect */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                                            initial={{ x: "100%" }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </Button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex items-center gap-2 text-sm text-center text-muted-foreground"
                                >
                                    <Sparkles className="size-4 text-yellow-500" />
                                    <span>
                                        Don't have an account?{' '}
                                        <Link
                                            to="/register"
                                            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                                        >
                                            Sign up today
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
                    transition={{ delay: 0.7 }}
                    className="text-center text-xs text-muted-foreground"
                >
                    Secured by industry-leading encryption
                </motion.p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
