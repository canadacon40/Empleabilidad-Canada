"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
    role: "user" | "assistant"
    content: string
}

export default function AiChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [showBubble, setShowBubble] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [hasOpenedOnce, setHasOpenedOnce] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-open logic (delayed and non-intrusive)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasOpenedOnce && !isOpen) {
                setShowBubble(true)
                setHasOpenedOnce(true)
                // Initial greeting from Pierre
                if (messages.length === 0) {
                   setMessages([{ role: "assistant", content: "Hola. Soy Pierre. He ayudado a muchos profesionales a dejar de aplicar a ciegas y empezar a navegar el mercado canadiense con estrategia. ¿Sientes que tu búsqueda está estancada o no sabes por dónde empezar?" }])
                }
            }
        }, 45000) // 45 seconds
        return () => clearTimeout(timer)
    }, [hasOpenedOnce, isOpen, messages.length])

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isLoading])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        // --- NEW: Check usage limits ---
        const { consumeChatMessage } = await import("@/lib/usage-tracker");
        const usage = consumeChatMessage();
        
        if (!usage.allowed) {
            setMessages([...messages, { 
                role: "assistant", 
                content: "Has alcanzado el límite de mensajes gratuitos por hoy. Pierre está disponible para sesiones 1-a-1 si necesitas una asesoría profunda. ¡Éxito!" 
            }])
            return
        }

        const userMsg: Message = { role: "user", content: input.trim() }
        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        // Get saved email for personalization
        const email = localStorage.getItem("lead_email")

        try {
            const res = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: newMessages,
                    email: email
                })
            })
            const data = await res.json()
            console.log("Chat API response:", data);
            
            if (data.message) {
                setMessages([...newMessages, data.message])
            } else if (data.error) {
                console.error("Chat API error:", data.error);
                setMessages([...newMessages, { 
                    role: "assistant", 
                    content: data.message?.content || "Pierre está procesando mucha información ahora mismo. ¿Podrías repetirme eso?" 
                }])
            }
        } catch (error) {
            console.error("Chat error:", error)
            setMessages([...newMessages, { role: "assistant", content: "Lo siento, tuve un pequeño error de conexión. ¿Podrías intentar de nuevo?" }])
        } finally {
            setIsLoading(false)
        }
    }

    const renderMessage = (content: string, role: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(urlRegex);
        
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a 
                        key={i} 
                        href={part} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`underline font-bold break-all ${
                            role === "user" ? "text-white hover:text-blue-100" : "text-primary hover:text-primary/80"
                        }`}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    }

    return (
        <div className="fixed bottom-6 right-6 z-[200] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[360px] sm:w-[400px] h-[550px] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-[#0f172a] p-5 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 ring-2 ring-primary/10">
                                    <img 
                                        src="/images/pierre-avatar.png" 
                                        alt="Digital Pierre"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Digital Pierre</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">En línea para ayudarte</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <Minus className="w-5 h-5 text-slate-400" />
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 scroll-smooth custom-scrollbar"
                        >
                            {messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        msg.role === "user" 
                                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                                    }`}>
                                        {renderMessage(msg.content, msg.role)}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start animate-pulse">
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-xs text-slate-400 font-medium italic">Pierre está escribiendo...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2 bg-slate-100/50 p-2 rounded-[1.5rem] border border-slate-200 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all"
                            >
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Escribe tu mensaje..."
                                    className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-slate-800 placeholder:text-slate-400"
                                />
                                <Button 
                                    type="submit"
                                    size="icon" 
                                    disabled={!input.trim() || isLoading}
                                    className="rounded-xl w-10 h-10 shadow-lg shadow-primary/20"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                            <p className="text-center text-[9px] text-slate-400 mt-3 flex items-center justify-center gap-1 uppercase tracking-tighter">
                                <Sparkles className="w-2.5 h-2.5" /> IA entrenada para el éxito canadiense
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button & Speech Bubble */}
            <div className="relative flex flex-col items-end">
                <AnimatePresence>
                    {showBubble && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            className="absolute bottom-20 right-0 mb-2 w-[220px] bg-white p-4 rounded-2xl rounded-br-none shadow-xl border border-slate-200 text-slate-700 text-xs font-medium leading-relaxed"
                            onClick={() => {
                                setIsOpen(true)
                                setShowBubble(false)
                            }}
                        >
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBubble(false);
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            Si quieres hacerme alguna pregunta, estoy aquí para ayudarte. 👋
                            <div className="absolute bottom-[-10px] right-4 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setIsOpen(!isOpen)
                        setHasOpenedOnce(true)
                        setShowBubble(false)
                    }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative group overflow-hidden ${
                        isOpen ? 'bg-white text-slate-900 border border-slate-200' : 'bg-primary text-white'
                    }`}
                >
                    {/* Background pulse effect */}
                    {!isOpen && (
                        <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping pointer-events-none" />
                    )}
                    
                    {isOpen ? <X className="w-7 h-7" /> : (
                        <div className="w-full h-full relative">
                            <img 
                                src="/images/pierre-avatar.png" 
                                alt="Chat with Pierre"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                             <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                        </div>
                    )}
                    
                    {/* Unread indicator with bubble sync */}
                    {(showBubble || (!hasOpenedOnce && !isOpen)) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                            <span className="text-[10px] font-bold text-white">1</span>
                        </div>
                    )}
                </motion.button>
            </div>
        </div>
    )
}
