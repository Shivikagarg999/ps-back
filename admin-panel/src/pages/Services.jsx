import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, IndianRupee, Clock, Layers, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceModal = ({ isOpen, onClose, onSave, service = null, categories = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        gstAmount: 0,
        duration: '',
        category: '',
        description: '',
        isIncluded: ['', '', '', '', ''],
        image: null
    });

    useEffect(() => {
        if (service) {
            let includedPoints = ['', '', '', '', ''];
            if (service.isIncluded) {
                try {
                    const parsed = typeof service.isIncluded === 'string'
                        ? JSON.parse(service.isIncluded)
                        : service.isIncluded;
                    if (Array.isArray(parsed)) {
                        includedPoints = parsed;
                    }
                } catch (e) {
                    console.error("Error parsing isIncluded", e);
                }
            }
            // Ensure exactly 5 inputs
            while (includedPoints.length < 5) includedPoints.push('');

            setFormData({
                name: service.name || '',
                price: service.price || '',
                gstAmount: service.gstAmount || 0,
                duration: service.duration || '',
                category: service.category?._id || service.category || '',
                description: service.description || '',
                isIncluded: includedPoints.slice(0, 5),
                image: null
            });
        } else {
            setFormData({
                name: '',
                price: '',
                gstAmount: 0,
                duration: '',
                category: '',
                description: '',
                isIncluded: ['', '', '', '', ''],
                image: null
            });
        }
    }, [service, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image') {
                if (formData[key]) data.append('image', formData[key]);
            } else if (key === 'isIncluded') {
                data.append('isIncluded', JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        });
        onSave(data, service?._id);
    };

    const handlePointChange = (index, value) => {
        const newPoints = [...formData.isIncluded];
        newPoints[index] = value;
        setFormData({ ...formData, isIncluded: newPoints });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">{service ? 'Edit Service' : 'Add New Service'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Service Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Category</label>
                            <select
                                required
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none color-scheme-dark"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Price (₹)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">GST %</label>
                            <input
                                type="number"
                                value={formData.gstAmount}
                                onChange={e => setFormData({ ...formData, gstAmount: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Duration (min)</label>
                            <input
                                type="number"
                                required
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Description</label>
                        <textarea
                            required
                            rows="3"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-400">Key Features (5 points)</label>
                        <div className="grid grid-cols-1 gap-3">
                            {formData.isIncluded.map((point, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    placeholder={`Point ${index + 1}`}
                                    value={point}
                                    onChange={e => handlePointChange(index, e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Service Image</label>
                        <div className="flex items-center gap-4">
                            <label className="flex-1 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-4 cursor-pointer transition-all flex items-center justify-center gap-2 group">
                                <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                                <span className="text-sm text-slate-400 group-hover:text-blue-400">
                                    {formData.image ? formData.image.name : 'Upload new image'}
                                </span>
                                <input type="file" className="hidden" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                            </label>
                            {((service?.imageUrl || service?.image?.url || service?.image) && !formData.image) && (
                                <img src={service.imageUrl || service.image?.url || service.image} className="w-20 h-20 object-cover rounded-xl" alt="Current" />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all text-white">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 text-white">
                            {service ? 'Update Service' : 'Create Service'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [serviceRes, catRes] = await Promise.all([
                api.get('/services/get'),
                api.get('/categories')
            ]);
            console.log('Services Data:', serviceRes.data);
            setServices(serviceRes.data.data || []);
            setCategories(catRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async (data, id) => {
        try {
            if (id) {
                await api.put(`/services/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/services', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchData();
            setIsModalOpen(false);
        } catch (err) {
            alert('Error saving service: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await api.delete(`/services/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting service');
        }
    };

    const filteredServices = Array.isArray(services) ? services.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.category?.name?.toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent transition-all duration-300">Service Catalog</h2>
                    <p className="text-slate-400 mt-1">Manage your beauty treatments and pricing.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingService(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        New Service
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-400 animate-pulse">Loading service catalog...</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-800">
                                <th className="px-8 py-5 font-semibold">Service Details</th>
                                <th className="px-8 py-5 font-semibold text-center">Price</th>
                                <th className="px-8 py-5 font-semibold text-center">Duration</th>
                                <th className="px-8 py-5 font-semibold text-center">GST %</th>
                                <th className="px-8 py-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredServices.map((service, i) => (
                                <motion.tr
                                    key={service._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-slate-800/30 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                                                {(service.imageUrl || service.image?.url || service.image) ? (
                                                    <img src={service.imageUrl || service.image?.url || service.image} className="w-full h-full object-cover" alt={service.name} />
                                                ) : (
                                                    <ImageIcon className="w-8 h-8 text-slate-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{service.name}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium bg-slate-800/50 w-fit px-2 py-0.5 rounded-md">
                                                    <Layers className="w-3 h-3 text-indigo-400" /> {service.category?.name || 'General'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-500/10">
                                            <IndianRupee className="w-3 h-3" /> {service.price}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center text-sm font-medium text-slate-400">
                                        <span className="flex items-center justify-center gap-1 whitespace-nowrap">
                                            <Clock className="w-4 h-4 text-indigo-400" /> {service.duration} min
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center text-sm font-medium text-slate-400">
                                        {service.gstAmount > 0 ? (
                                            <span className="text-blue-400 font-bold">{service.gstAmount}%</span>
                                        ) : (
                                            <span className="text-slate-600">Exempt</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                                            <button
                                                onClick={() => { setEditingService(service); setIsModalOpen(true); }}
                                                className="p-2 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-lg"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service._id)}
                                                className="p-2 bg-slate-800 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && filteredServices.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-700">
                            <Plus className="w-8 h-8 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-300">No services found</p>
                            <p className="text-slate-500 mt-1">Try adjusting your search or add a new service.</p>
                        </div>
                    </div>
                )}
            </div>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                service={editingService}
                categories={categories}
            />
        </div>
    );
};

export default Services;
