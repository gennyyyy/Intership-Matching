import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Loader2, Plus, X } from 'lucide-react';

const StudentProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getMyProfile();
            setProfile(data);
            setSkills(data.student_profile?.skills || []);
            reset({
                first_name: data.first_name,
                last_name: data.last_name,
                university: data.student_profile?.university || '',
                course: data.student_profile?.course || '',
                year_level: data.student_profile?.year_level || '',
                gpa: data.student_profile?.gpa || '',
                preferred_location: data.student_profile?.preferred_location || '',
                preferred_field: data.student_profile?.preferred_field || '',
            });
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const profileData = {
                first_name: data.first_name,
                last_name: data.last_name,
                student_profile: {
                    university: data.university,
                    course: data.course,
                    year_level: parseInt(data.year_level),
                    gpa: parseFloat(data.gpa),
                    preferred_location: data.preferred_location,
                    preferred_field: data.preferred_field,
                    skills: skills,
                }
            };
            await userService.updateMyProfile(profileData);
            toast.success('Profile updated successfully');
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
            <PageLayout title="My Profile">
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="My Profile">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex justify-end">
                    <Button
                        variant={isEditing ? 'secondary' : 'primary'}
                        onClick={() => {
                            setIsEditing(!isEditing);
                            if (!isEditing) fetchProfile(); // Restore state
                        }}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information */}
                    <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-4 text-lg font-semibold border-b pb-2">Basic Information</h3>
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

                    {/* Education Background */}
                    <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-4 text-lg font-semibold border-b pb-2">Education Background</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input
                                label="Current University/School"
                                disabled={!isEditing}
                                {...register('university')}
                            />
                            <Input
                                label="Course / Program"
                                disabled={!isEditing}
                                {...register('course')}
                            />
                            <Input
                                label="Year Level"
                                type="number"
                                disabled={!isEditing}
                                {...register('year_level')}
                            />
                            <Input
                                label="Current GPA"
                                type="number"
                                step="0.01"
                                disabled={!isEditing}
                                {...register('gpa')}
                            />
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-4 text-lg font-semibold border-b pb-2">Professional Details</h3>

                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input
                                label="Preferred Field"
                                disabled={!isEditing}
                                placeholder="e.g. Software Engineering, Marketing"
                                {...register('preferred_field')}
                            />
                            <Input
                                label="Preferred Location"
                                disabled={!isEditing}
                                placeholder="e.g. Manila, Remote"
                                {...register('preferred_location')}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Skill Sets</label>
                            {isEditing && (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a skill (e.g. React, Python)"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <Button type="button" onClick={addSkill}>
                                        <Plus size={18} />
                                    </Button>
                                </div>
                            )}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {skills.length === 0 && !isEditing && (
                                    <p className="text-gray-400 italic text-sm">No skills added yet.</p>
                                )}
                                {skills.map((skill, index) => (
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
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </PageLayout>
    );
};

export default StudentProfilePage;
