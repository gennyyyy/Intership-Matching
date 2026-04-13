import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import internshipService from '../../services/internshipService';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Briefcase } from 'lucide-react';

const PostInternshipPage = () => {
    const [loading, setLoading] = useState(false);
    const [requirements, setRequirements] = useState([]);
    const [skills, setSkills] = useState([]);
    const [newRequirement, setNewRequirement] = useState('');
    const [newSkill, setNewSkill] = useState('');

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            is_paid: false,
            slots: 1
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const internshipData = {
                ...data,
                slots: parseInt(data.slots),
                stipend: data.is_paid ? parseFloat(data.stipend) : null,
                requirements,
                required_skills: skills
            };
            await internshipService.createInternship(internshipData);
            toast.success('Internship posted successfully!');
            navigate('/employer');
        } catch (error) {
            toast.error('Failed to post internship');
        } finally {
            setLoading(false);
        }
    };

    const addItem = (list, setList, item, setItem) => {
        if (item.trim() && !list.includes(item.trim())) {
            setList([...list, item.trim()]);
            setItem('');
        }
    };

    const removeItem = (list, setList, index) => {
        setList(list.filter((_, i) => i !== index));
    };

    return (
        <PageLayout title="Post New Internship">
            <div className="mx-auto max-w-3xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Job Details */}
                    <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <Briefcase className="text-blue-600" size={20} />
                            <h3 className="text-lg font-semibold">Job Details</h3>
                        </div>
                        <div className="space-y-4">
                            <Input
                                label="Internship Title"
                                placeholder="e.g. Software Engineering Intern"
                                {...register('title', { required: 'Title is required' })}
                                error={errors.title?.message}
                            />
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Input
                                    label="Field / Category"
                                    placeholder="e.g. Technology"
                                    {...register('field', { required: 'Field is required' })}
                                    error={errors.field?.message}
                                />
                                <Input
                                    label="Location"
                                    placeholder="e.g. Remote, Manila"
                                    {...register('location', { required: 'Location is required' })}
                                    error={errors.location?.message}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    {...register('description', { required: 'Description is required' })}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Describe the role and responsibilities..."
                                />
                                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Practical Info */}
                    <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-4 text-lg font-semibold border-b pb-2">Practical Information</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input
                                label="Duration"
                                placeholder="e.g. 3 Months, 480 Hours"
                                {...register('duration', { required: 'Duration is required' })}
                                error={errors.duration?.message}
                            />
                            <Input
                                label="Available Slots"
                                type="number"
                                {...register('slots', { required: 'Required' })}
                                error={errors.slots?.message}
                            />
                            <div className="flex items-center gap-2 pt-8">
                                <input
                                    type="checkbox"
                                    id="is_paid"
                                    {...register('is_paid')}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="is_paid" className="text-sm font-medium text-gray-700">This is a paid internship</label>
                            </div>
                            <Input
                                label="Monthly Stipend (Optional)"
                                type="number"
                                placeholder="0.00"
                                {...register('stipend')}
                            />
                        </div>
                    </section>

                    {/* Dynamic Lists */}
                    <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-4 text-lg font-semibold border-b pb-2">Requirements & Skills</h3>

                        {/* Requirements */}
                        <div className="space-y-2 mb-6">
                            <label className="block text-sm font-medium text-gray-700">General Requirements</label>
                            <div className="flex gap-2">
                                <Input
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    placeholder="e.g. Must be a 4th year student"
                                />
                                <Button type="button" onClick={() => addItem(requirements, setRequirements, newRequirement, setNewRequirement)}>
                                    <Plus size={18} />
                                </Button>
                            </div>
                            <ul className="mt-2 space-y-1">
                                {requirements.map((item, i) => (
                                    <li key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded text-sm group">
                                        <span>• {item}</span>
                                        <X size={14} className="text-gray-400 cursor-pointer hover:text-red-500" onClick={() => removeItem(requirements, setRequirements, i)} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="e.g. React, UI/UX, Documentation"
                                />
                                <Button type="button" onClick={() => addItem(skills, setSkills, newSkill, setNewSkill)}>
                                    <Plus size={18} />
                                </Button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                        {skill}
                                        <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeItem(skills, setSkills, i)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-3 pb-8">
                        <Button variant="secondary" onClick={() => navigate('/employer')}>Discard</Button>
                        <Button type="submit" disabled={loading} className="min-w-[150px]">
                            {loading ? 'Posting...' : 'Post Internship'}
                        </Button>
                    </div>
                </form>
            </div>
        </PageLayout>
    );
};

export default PostInternshipPage;
