"use client"

import { motion } from "framer-motion"

interface GaugeChartProps {
    score: number // 0 to 100
    label: string
    color?: string
}

export default function GaugeChart({ score, label, color = "stroke-primary" }: GaugeChartProps) {
    const radius = 45
    const circumference = Math.PI * radius // Half circle
    const strokeDashoffset = circumference - (score / 100) * circumference

    // Calculate needle rotation: -90deg is start (0%), +90deg is end (100%)
    const needleRotation = (score / 100) * 180 - 90

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-40 h-24 flex items-end justify-center overflow-hidden">
                <svg className="w-40 h-40 transform" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f43f5e" /> {/* Rose 500 */}
                            <stop offset="50%" stopColor="#f59e0b" /> {/* Amber 500 */}
                            <stop offset="100%" stopColor="#3b82f6" /> {/* Blue 500 */}
                        </linearGradient>
                    </defs>
                    
                    {/* Background track */}
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        className="stroke-muted/30"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />
                    
                    {/* Progress track */}
                    <motion.path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* Needle */}
                    <motion.g
                        initial={{ rotate: -90 }}
                        animate={{ rotate: needleRotation }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        style={{ originX: "50px", originY: "50px" }}
                    >
                        <line 
                            x1="50" y1="50" x2="50" y2="15" 
                            className="stroke-foreground" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                        />
                        <circle cx="50" cy="50" r="3" className="fill-foreground" />
                    </motion.g>
                </svg>

                <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-center pb-2">
                    <motion.span 
                        className="text-2xl font-black text-foreground"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        {score}%
                    </motion.span>
                </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">
                {label}
            </span>
        </div>
    )
}
