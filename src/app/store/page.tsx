'use client'

import React, { useState, useEffect, FormEvent } from 'react';

interface VaultItem {
    _id: string;
    appName: string;
    pass: string;
    userId: string;
}

const VaultPage = () => {
    const [vault, setVault] = useState<VaultItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
    const [newItem, setNewItem] = useState({ appName: '', pass: '' });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchVaultItems = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/vault', { method: 'GET', credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch vault items');
            const data = await res.json();
            setVault(data);
        } catch (err: any) {
            console.error(err);
            setVault([]);
            showNotification(err.message || 'Error fetching vault', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaultItems();
    }, []);

    const toggleShowPassword = (id: string) => {
        setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (password: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Password copied!');
        } catch {
            showNotification('Failed to copy password', 'error');
        }
        document.body.removeChild(textArea);
    };

    const deleteVaultItem = async (id: string) => {
        if (!confirm("Delete this item?")) return;
        try {
            const res = await fetch(`/api/vault?id=${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to delete item');
            setVault(vault.filter(item => item._id !== id));
            showNotification('Item deleted!');
        } catch (err: any) {
            console.error(err);
            showNotification(err.message || 'Failed to delete item', 'error');
        }
    };


    const handleAddItem = async (e: FormEvent) => {
        e.preventDefault();
        if (!newItem.appName || !newItem.pass) {
            showNotification('Both fields are required', 'error');
            return;
        }

        try {
            const res = await fetch('/api/vault', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appName: newItem.appName, pass: newItem.pass }),
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to add item');

            setNewItem({ appName: '', pass: '' });
            fetchVaultItems();
            showNotification('New item added!');
        } catch (err: any) {
            console.error(err);
            showNotification(err.message || 'Failed to add item', 'error');
        }
    };


    return (
        <>
            {/* Notification */}
            {notification && (
                <div className={`fixed top-5 right-5 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-down ${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
                    {notification.message}
                </div>
            )}

            <div className='w-full px-4 md:px-12 py-4 flex flex-col items-center gap-8'>
                {/* Navbar */}
                <div className="w-full flex justify-between items-center">
                    <a href='/' className="text-[1.93vw] md:text-2xl font-semibold">PassGen</a>
                    <a className="border border-zinc-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg" href="/">About Us</a>
                </div>
                {/* Form to Add New Item */}
                <div className='border-[0.8px] border-zinc-700 rounded-xl p-4 md:px-6 md:py-6 w-full max-w-2xl'>
                    <h4 className='font-semibold mb-4 text-lg'>➕ Add to Vault:</h4>
                    <form onSubmit={handleAddItem} className='flex flex-col md:flex-row gap-4'>
                        <input
                            type="text"
                            placeholder="Application Name (e.g., Google)"
                            value={newItem.appName}
                            onChange={(e) => setNewItem({ ...newItem, appName: e.target.value })}
                            className='bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newItem.pass}
                            onChange={(e) => setNewItem({ ...newItem, pass: e.target.value })}
                            className='bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button type="submit" className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors'>
                            ➕ Add
                        </button>
                    </form>
                </div>

                {/* Vault Display */}
                <div className='border-[0.8px] border-zinc-700 rounded-xl p-4 md:px-6 md:py-6 w-full max-w-2xl'>
                    <h4 className='font-semibold mb-4 text-lg'>🔐 Your Vault:</h4>
                    {loading ? (
                        <p className='text-gray-400'>Loading your secrets...</p>
                    ) : vault.length === 0 ? (
                        <p className='text-gray-400'>No passwords saved yet. Use the form above to add one!</p>
                    ) : (
                        <div className='space-y-4'>
                            {vault.map((item) => (
                                <div key={item._id} className='bg-zinc-900 px-4 py-3 rounded-xl flex justify-between items-center transition-all hover:bg-zinc-800'>
                                    <div>
                                        <h6 className='font-medium text-white'>{item.appName}</h6>
                                        <p className='text-gray-400 font-mono'>
                                            {showPasswords[item._id] ? item.pass : '••••••••••••'}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <button onClick={() => toggleShowPassword(item._id)}
                                            className='text-gray-400 hover:text-white hover:bg-zinc-700 p-2 rounded-lg transition-colors'
                                            aria-label={showPasswords[item._id] ? 'Hide password' : 'Show password'}>
                                            {showPasswords[item._id] ? '🙈' : '👁️'}
                                        </button>
                                        <button onClick={() => copyToClipboard(item.pass)}
                                            className='text-gray-400 hover:text-white hover:bg-zinc-700 p-2 rounded-lg transition-colors'
                                            aria-label="Copy password">
                                            📋
                                        </button>
                                        <button onClick={() => deleteVaultItem(item._id)}
                                            className='text-red-500 hover:text-white hover:bg-red-600 p-2 rounded-lg transition-colors'
                                            aria-label="Delete item">
                                            ❌
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default VaultPage;
