import React, { useState } from 'react';
import { User, ArrowRight, Lock, Mail, KeyRound } from 'lucide-react';

interface UsernameModalProps {
  onSubmit: (name: string, pass: string, email?: string) => void;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Invalid email address');
      return;
    }
    // Simulate sending code
    setShowVerification(true);
    setError('');
    alert(`(Simulation) Verification code sent to ${email}: 1234`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Username cannot be empty');
      return;
    }
    if (name.length > 15) {
      setError('Username too long (max 15 chars)');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 chars');
      return;
    }

    if (showVerification) {
        if (verificationCode !== '1234') {
            setError('Invalid Verification Code');
            return;
        }
    }

    onSubmit(name.trim(), password.trim(), email.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border-2 border-white/10 p-8 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,100,255,0.2)] animate-bounce-click max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600/20 p-4 rounded-full border border-blue-500/50">
             <User size={48} className="text-blue-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-game font-bold text-center text-white mb-2">Welcome Player!</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Login or Register to save your stats.</p>

        <form className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username <span className="text-red-500">*</span></label>
            <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                  }}
                  placeholder="CoolGamer123"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 pl-10 text-white font-game focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 transition-all text-lg"
                />
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password <span className="text-red-500">*</span></label>
            <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 pl-10 text-white font-game focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 transition-all text-lg"
                />
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Email Section */}
          <div className="border-t border-white/10 pt-2">
             <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex justify-between">
                <span>Email (Optional)</span>
                {showVerification && <span className="text-green-400">Code Sent!</span>}
             </label>
             <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                    }}
                    disabled={showVerification}
                    placeholder="user@example.com"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 pl-10 text-white font-game focus:outline-none focus:border-blue-500 transition-all text-sm"
                    />
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                {!showVerification && email.length > 0 && (
                    <button onClick={handleSendCode} className="bg-blue-600 px-3 rounded-xl font-bold text-xs">Verify</button>
                )}
             </div>
          </div>

          {showVerification && (
              <div className="animate-fade-in">
                <label className="text-xs font-bold text-yellow-500 uppercase ml-1">Verification Code</label>
                <div className="relative">
                    <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter Code (1234)"
                    className="w-full bg-yellow-900/20 border border-yellow-500/50 rounded-xl px-4 py-3 pl-10 text-white font-game focus:outline-none focus:border-yellow-500 transition-all text-lg tracking-widest"
                    />
                    <KeyRound size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500" />
                </div>
              </div>
          )}
          
          {error && <p className="text-red-400 text-xs mt-2 text-center font-bold">{error}</p>}

          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-game font-bold py-3 rounded-xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-4"
          >
            PLAY NOW <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};