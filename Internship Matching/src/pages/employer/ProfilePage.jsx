import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Loader2, Plus, X, Building2 } from 'lucide-react';

const EmployerProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [targetSkills, setTargetSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getMyProfile();
            setProfile(data);
            // We'll store what they look for in an array within the employer_profile JSON
            setTargetSkills(data.employer_profile?.looking_for || []);
            reset({
                first_name: data.first_name,
                last_name: data.last_name,
                company_name: data.employer_profile?.company_name || '',
                industry: data.employer_profile?.industry || '',
                website: data.employer_profile?.website || '',
                company_description: data.employer_profile?.company_description || '',
            });
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !targetSkills.includes(newSkill.trim())) {
            setTargetSkills([...targetSkills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setTargetSkills(targetSkills.filter(s => s !== skillToRemove));
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const profileData = {
                first_name: data.first_name,
                last_name: data.last_name,
                employer_profile: {
                    company_name: data.company_name,
                    industry: data.industry,
                    website: data.website,
                    company_description: data.company_description,
                    looking_for: targetSkills,
                }
            };
            await userService.updateMyProfile(profileData);
            toast.success('Company profile updated');
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <PageLayout title="Company Profile">
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Company Profile">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex justify-end">
                    <Button
                        variant={isEditing ? 'secondary' : 'primary'}
                        onClick={() => {
                            setIsEditing(!isEditing);
                            if (!isEditing) fetchProfile();
                        }}
                    >
                        {isEditing ? 'Cancel' : 'Edit Company Info'}
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Company Details */}
                    <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 border-b pb-2">
                            <Building2 className="text-blue-600" />
                            <h3 className="text-lg font-semibold">Business Information</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input
                                label="Company Name"
                                disabled={!isEditing}
                                {...register('company_name', { required: 'Required' })}
                                error={errors.company_name?.message}
                            />
                            <Input
                                label="Industry"
                                disabled={!isEditing}
                                placeholder="e.g. Technology, Finance"
                                {...register('industry')}
                            />
                            <div className="sm:col-span-2">
                                <Input
                                    label="Official Website"
                                    disabled={!isEditing}
                                    placeholder="https://example.com"
                                    {...register('website')}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                                <textarea
                                    disabled={!isEditing}
                                    rows={4}
                                    {...register('company_description')}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50"
                                    placeholder="Tell us about your company and what you do..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* HR Contact */}
                    <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-4 text-lg font-semibold border-b pb-2">HR Contact Person</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input
                                label="First Name"
                                disabled={!isEditing}
                                {...register('first_name', { required: 'Required' })}
                                error={errors.first_name?.message}
                            />
                            <Input
                                label="Last Name"
                                disabled={!isEditing}
                                {...register('last_name', { required: 'Required' })}
                                error={errors.last_name?.message}
                            />
                        </div>
                    </section>

                    {/* Desired Skills */}
                    <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-4 text-lg font-semibold border-b pb-2">Wanted Skill Sets</h3>
                        <p className="text-sm text-gray-500 mb-4">Add skills you typically look for in interns.</p>

                        <div className="space-y-4">
                            {isEditing && (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. Graphic Design, SQL, Communication"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <Button type="button" onClick={addSkill}>
                                        <Plus size={18} />
                                    </Button>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {targetSkills.length === 0 && !isEditing && (
                                    <p className="text-gray-400 italic text-sm">No specific skills listed yet.</p>
                                )}
                                {targetSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                                    >
                                        {skill}
                                        {isEditing && (
                                            <X
                                                size={14}
                                                className="cursor-pointer hover:text-red-500"
                                                onClick={() => removeSkill(skill)}
                                            />
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {isEditing && (
                        <div className="flex justify-center pt-4">
                            <Button type="submit" disabled={loading} className="w-full max-w-xs">
                                {loading ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </PageLayout>
    );
};

export default EmployerProfilePage;
