'use client';

import React, { useEffect, useState } from 'react';
import { generatePassword, PasswordOptions } from '../../utils/passGen';

interface VaultItem {
  _id: string;
  appName: string;
  pass: string;
}

const Page = () => {
  const [appName, setAppName] = useState('');
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);

  const [generatedPass, setGeneratedPass] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { fetchVault(); }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchVault = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vault', { cache: 'no-store' });
      const data = await res.json();
      setVault(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setVault([]);
      showToast('Failed to fetch vault items', 'error');
    } finally { setLoading(false); }
  };

  const createVaultItem = async () => {
    if (!appName || !generatedPass) return showToast("App Name and Password required", 'error');

    try {
      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName, pass: generatedPass })
      });
      if (!res.ok) throw new Error('Failed to save');
      const newItem = await res.json();
      setVault([newItem, ...vault]);
      setAppName('');
      setGeneratedPass('');
      showToast('Saved to vault!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save item', 'error');
    }
  };

  const deleteVaultItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/vault?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setVault(vault.filter(item => item._id !== id));
      showToast('Item deleted!');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete item', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('✅ Password copied!'))
      .catch(() => showToast('Failed to copy', 'error'));
  };

  const handleGenerate = () => {
    const options: PasswordOptions = { length, includeNumbers, includeSymbols, includeUppercase, excludeSimilar };
    const pass = generatePassword(options);
    setGeneratedPass(pass);
  };

  const toggleShowPassword = (id: string) => setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen w-full bg-black text-white px-4 md:px-12 py-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg ${toast.type==='error'?'bg-red-600':'bg-green-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Navbar */}
      <div className="flex justify-between items-center">
        <a href='/' className="text-[1.93vw] md:text-2xl font-semibold">PassGen</a>
        <a className="border border-zinc-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg" href="https://www.anujbelsare.tech/">About Us</a>
      </div>

      {/* Generate & Save */}
      <div className='w-full mt-6 flex items-center justify-center'>
        <div className='border-[0.8px] border-zinc-700 rounded-xl p-4 md:px-6 md:py-6 md:w-[60%] space-y-4'>
          <h4 className='font-semibold'>⚙️ Generate Password & Save:</h4>

          <div className='flex flex-col gap-2'>
            <label>App Name:</label>
            <input type="text" placeholder='e.g. Github' value={appName} onChange={e => setAppName(e.target.value)}
              className='p-2 rounded-md border-[0.2px] border-zinc-700' />
          </div>

          <div className='flex flex-col gap-2'>
            <label>Password Length: {length}</label>
            <input type="range" min={8} max={32} value={length} onChange={e => setLength(Number(e.target.value))} className='w-full' />
            <div className='flex flex-wrap gap-2'>
              <label><input type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} /> Numbers</label>
              <label><input type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} /> Symbols</label>
              <label><input type="checkbox" checked={includeUppercase} onChange={e => setIncludeUppercase(e.target.checked)} /> Uppercase</label>
              <label><input type="checkbox" checked={excludeSimilar} onChange={e => setExcludeSimilar(e.target.checked)} /> Exclude Similar</label>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <input type="text" readOnly placeholder="Generated password" value={generatedPass} className='flex-1 p-2 rounded-md border-[0.2px] border-zinc-700' />
            <button onClick={handleGenerate} className='border-[0.2px] px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer border-zinc-700'>Generate</button>
          </div>

          <button onClick={createVaultItem} className='bg-green-600 w-full py-2 rounded-md hover:bg-green-700'>Save to Vault</button>
        </div>
      </div>

      <div className='mt-8 w-full flex justify-center'>
        <a href='/store' className="px-6 py-4 border-[0.4px] rounded-lg border-zinc-700">Show saved passwords</a>
      </div>
    </div>
  );
};

export default Page;
