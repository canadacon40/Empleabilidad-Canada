"use client"

import { motion } from "framer-motion"

interface GaugeChartProps {
    score: number // 0 to 100
    label?: string
    color?: string
    size?: number
    hideLabel?: boolean
}

export default function GaugeChart({ score, label, color, size = 200, hideLabel = false }: GaugeChartProps) {
    const radius = 42
    const circumference = Math.PI * radius // Half circle
    const strokeDashoffset = circumference - (score / 100) * circumference

    // Calculate needle rotation: -90deg is start (0%), +90deg is end (100%)
    const needleRotation = (score / 100) * 180 - 90

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.7 }}>
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" style={{ transform: 'translateY(-10%)' }}>
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f43f5e" /> {/* Rose 500 */}
                            <stop offset="40%" stopColor="#f59e0b" /> {/* Amber 500 */}
                            <stop offset="80%" stopColor="#3b82f6" /> {/* Blue 500 */}
                            <stop offset="100%" stopColor="#2563eb" /> {/* Blue 600 */}
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    
                    {/* Background track */}
                        d="M 15 55 A 35 35 0 0 1 85 55"
                        fill="none"
                        className="stroke-slate-100"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    
                    {/* Progress track with glow */}
                    <motion.path
                        d="M 15 55 A 35 35 0 0 1 85 55"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        filter="url(#glow)"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: strokeDashoffset }}
                        transition={{ duration: 2, ease: "circOut" }}
                    />

                    {/* Needle with sophisticated design */}
                    <motion.g
                        initial={{ rotate: -90 }}
                        animate={{ rotate: needleRotation }}
                        transition={{ type: "spring", stiffness: 60, damping: 10, delay: 0.3 }}
                        style={{ originX: "50px", originY: "55px" }}
                    >
                        <line 
                            x1="50" y1="55" x2="50" y2="25" 
                            className="stroke-slate-900" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                        />
                        <circle cx="50" cy="55" r="5" className="fill-slate-900 shadow-xl" />
                        <circle cx="50" cy="55" r="2" className="fill-primary" />
                    </motion.g>
                </svg>

                <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-center pb-2">
                    <motion.div 
                        className="text-4xl sm:text-5xl font-black text-slate-900 flex items-baseline gap-1"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.6, type: "spring" }}
                    >
                        {score}<span className="text-xl opacity-40">%</span>
                    </motion.div>
                </div>
            </div>
            {!hideLabel && (
                <div className="space-y-2 text-center pb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block">
                        Probabilidad de Éxito
                    </span>
                    {label && (
                        <span className={`text-xs font-black uppercase tracking-[0.2em] px-5 py-1.5 rounded-full border-2 shadow-sm ${
                            score < 40 ? "text-rose-600 border-rose-100 bg-rose-50" : 
                            score < 70 ? "text-orange-600 border-orange-100 bg-orange-50" : 
                            "text-blue-600 border-blue-100 bg-blue-50"
                        }`}>
                            {label}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
