import React from 'react';
import { Bell, Calendar, BrainCircuit } from 'lucide-react';

interface UpdateLogProps {
    timeLeft?: number;
}

export const UpdateLog: React.FC<UpdateLogProps> = ({ timeLeft = 0 }) => {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="animate-fade-in space-y-4">
             <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 p-6 rounded-2xl border border-white/10 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                     <BrainCircuit size={120} />
                 </div>
                 
                 <div className="inline-block bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2 animate-pulse">
                     NEXT UPDATE
                 </div>
                 <h2 className="text-3xl font-game font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
                     THE BRAINROT UPDATE
                 </h2>
                 <p className="text-gray-300 text-sm mb-6 max-w-xs mx-auto">
                     New Brainrot pets, Skibidi Toilet boss, and Sigma Rizz leaderboards coming soon.
                 </p>

                 <div className="flex justify-center gap-4 font-mono">
                     <div className="bg-black/40 p-3 rounded-lg border border-white/10">
                         <div className="text-2xl font-bold text-white">{hours.toString().padStart(2, '0')}</div>
                         <div className="text-[10px] text-gray-500">HOURS</div>
                     </div>
                     <div className="bg-black/40 p-3 rounded-lg border border-white/10">
                         <div className="text-2xl font-bold text-white">{mins.toString().padStart(2, '0')}</div>
                         <div className="text-[10px] text-gray-500">MINS</div>
                     </div>
                     <div className="bg-black/40 p-3 rounded-lg border border-white/10">
                         <div className="text-2xl font-bold text-white">{secs.toString().padStart(2, '0')}</div>
                         <div className="text-[10px] text-gray-500">SECS</div>
                     </div>
                 </div>
             </div>

             <div className="space-y-2">
                 <h3 className="text-xs font-bold text-gray-500 uppercase ml-1">Previous Updates</h3>
                 <div className="bg-white/5 p-3 rounded-lg border-l-4 border-cyan-500">
                     <div className="flex justify-between items-start">
                        <div className="font-bold text-sm text-cyan-200">Winter Wonderland</div>
                        <span className="text-[10px] text-gray-500">V1.7</span>
                     </div>
                     <ul className="text-xs text-gray-400 mt-1 list-disc list-inside">
                         <li>Added Winter Egg</li>
                         <li>Added Snow effect</li>
                         <li>New Boss: Yeti</li>
                     </ul>
                 </div>
             </div>
        </div>
    );
};