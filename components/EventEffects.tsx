import React, { useMemo } from 'react';
import { GameEvent } from '../types';
import { Gem, Biohazard } from 'lucide-react';

interface EventEffectsProps {
    activeEvents: GameEvent[];
}

export const EventEffects: React.FC<EventEffectsProps> = ({ activeEvents }) => {
    const hasEvent = (namePart: string) => activeEvents.some(e => e.name.toLowerCase().includes(namePart.toLowerCase()));

    const showGemRain = hasEvent('GEM RAIN');
    const showRadioactive = hasEvent('RADIOACTIVE') || hasEvent('Mutation');
    const showHalloween = hasEvent('HALLOWEEN') || hasEvent('Ghost');
    const showBoss = hasEvent('BOSS');
    const showGodLuck = hasEvent('GOD Luck');
    const showWinter = hasEvent('WINTER') || hasEvent('Santa');

    // Gem Rain Particles
    const gemParticles = useMemo(() => {
        if (!showGemRain) return [];
        return Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 2
        }));
    }, [showGemRain]);

    // Radioactive Particles
    const toxicParticles = useMemo(() => {
        if (!showRadioactive) return [];
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            size: 24 + Math.random() * 48
        }));
    }, [showRadioactive]);

    // Halloween Particles
    const halloweenParticles = useMemo(() => {
        if (!showHalloween) return [];
        return Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            type: Math.random() > 0.6 ? 'ghost' : 'pumpkin'
        }));
    }, [showHalloween]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            
            {/* BOSS EFFECT: Red Pulse & Border */}
            {showBoss && (
                <div className="absolute inset-0 bg-red-900/10 animate-pulse border-[10px] md:border-[20px] border-red-600/30 shadow-[inset_0_0_100px_rgba(220,38,38,0.5)] z-[10]"></div>
            )}

            {/* GOD LUCK EFFECT: Gold Tint */}
            {showGodLuck && (
                <div className="absolute inset-0 bg-yellow-400/10 mix-blend-overlay border-[5px] border-yellow-400/30 z-[10]"></div>
            )}

            {/* WINTER EFFECT EXTRA: White Tint if Winter event active specifically */}
            {showWinter && (
                <div className="absolute inset-0 bg-blue-200/5 mix-blend-screen pointer-events-none"></div>
            )}

            {/* GEM RAIN */}
            {gemParticles.map((p) => (
                <div
                    key={p.id}
                    className="absolute top-[-50px] text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] z-[20]"
                    style={{
                        left: `${p.left}%`,
                        animation: `fall ${p.duration}s linear infinite`,
                        animationDelay: `-${p.delay}s`,
                    }}
                >
                    <Gem size={28} fill="currentColor" fillOpacity={0.3} />
                </div>
            ))}

            {/* RADIOACTIVE ATMOSPHERE */}
            {showRadioactive && (
                <div className="absolute inset-0 bg-green-900/20 mix-blend-color-dodge z-[5] animate-pulse"></div>
            )}
            {toxicParticles.map((p) => (
                <div
                    key={p.id}
                    className="absolute bottom-[-100px] text-green-500 opacity-60 z-[6]"
                    style={{
                        left: `${p.left}%`,
                        animation: `float ${6 + Math.random() * 4}s linear infinite`,
                        animationDelay: `-${p.delay}s`,
                    }}
                >
                    <Biohazard size={p.size} />
                </div>
            ))}

             {/* HALLOWEEN FLOATING ICONS */}
             {halloweenParticles.map((p) => (
                <div
                    key={p.id}
                    className="absolute bottom-[-100px] text-5xl opacity-80 z-[6]"
                    style={{
                        left: `${p.left}%`,
                        animation: `float-slow ${8 + Math.random() * 5}s linear infinite`,
                        animationDelay: `-${p.delay}s`,
                    }}
                >
                    {p.type === 'ghost' ? '👻' : '🎃'}
                </div>
             ))}
        </div>
    );
};