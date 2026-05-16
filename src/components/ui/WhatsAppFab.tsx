'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '16722723264'; // s real number
const INITIAL_MESSAGE = 'Hola, me interesa migrar profesionalmente a Canadá. ¿Podrían ayudarme con mi perfil?'

export default function WhatsAppFab() {
    const handleClick = () => {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(INITIAL_MESSAGE)}`
        window.open(url, '_blank')
    }

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: 'spring' }}
            className="fixed bottom-24 right-6 z-50 md:bottom-8"
        >
            {/* Tooltip / Label */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3 }}
                className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden md:block"
            >
                <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-full shadow-lg border border-slate-200 text-sm font-medium whitespace-nowrap">
                    ¿Dudas? Habla con un Experto 🇨🇦
                </div>
            </motion.div>

            {/* Main Button */}
            <button
                onClick={handleClick}
                className="relative group"
            >
                {/* Pulse Effect */}
                <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping group-hover:animate-none" />
                
                <div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8" />
                    
                    {/* Notification dot */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
                </div>
            </button>
        </motion.div>
    )
}

