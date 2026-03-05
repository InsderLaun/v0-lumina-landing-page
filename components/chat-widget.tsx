"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    text: string;
}

const WELCOME_MESSAGE: Message = {
    role: "assistant",
    text: "¡Hola! Soy **Lumi**, tu asistente de Lumina 🌟\n\n¿Sos Productor Asesor de Seguros (PAS) y querés conocer nuestros beneficios? Preguntame lo que quieras: comisiones, planes, cómo sumarte... ¡Estoy para ayudarte!",
};

function parseMarkdown(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br />");
}

export function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [viewportHeight, setViewportHeight] = useState<number | null>(null);
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !window.visualViewport) return;

        const onVisualViewportChange = () => {
            const vv = window.visualViewport!;
            const offset = window.innerHeight - vv.height;
            setViewportHeight(vv.height);
            setKeyboardOffset(offset > 50 ? offset : 0);
        };

        window.visualViewport.addEventListener("resize", onVisualViewportChange);
        window.visualViewport.addEventListener("scroll", onVisualViewportChange);
        onVisualViewportChange();

        return () => {
            window.visualViewport?.removeEventListener("resize", onVisualViewportChange);
            window.visualViewport?.removeEventListener("scroll", onVisualViewportChange);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function sendMessage() {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMsg: Message = { role: "user", text: trimmed };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const history = messages.map((m) => ({ role: m.role, text: m.text }));
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed, history }),
            });

            const data = await res.json();
            const reply = data.reply || "Lo siento, no pude procesar tu pregunta. ¿Querés intentarlo de nuevo?";
            setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: "Hubo un problema de conexión. Intentá de nuevo en un momento." },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <>
            {/* FAB Button */}
            <motion.button
                onClick={() => setOpen((v) => !v)}
                className="fixed right-6 z-[100] flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50"
                style={{
                    bottom: keyboardOffset > 0 ? `${keyboardOffset + 12}px` : "24px"
                }}
                whileTap={{ scale: 0.95 }}
                aria-label="Abrir chat con Lumi"
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2"
                        >
                            <X className="h-5 w-5 text-primary-foreground" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground">
                                Cerrar
                            </span>
                        </motion.span>
                    ) : (
                        <motion.span
                            key="open"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2"
                        >
                            <MessageCircle className="h-5 w-5 text-primary-foreground" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground">
                                Consultá Aquí
                            </span>
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-6 z-[99] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d14]/98 shadow-2xl shadow-black/50 backdrop-blur-2xl transition-[bottom,height] duration-300 ease-out"
                        style={{
                            bottom: keyboardOffset > 0 ? `${keyboardOffset + 80}px` : "92px",
                            height: keyboardOffset > 0
                                ? `calc(${viewportHeight}px - 100px)`
                                : "520px",
                            maxHeight: "85vh",
                            width: "calc(100vw - 48px)",
                            maxWidth: "380px"
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-white/10 bg-primary/10 px-4 py-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">Lumi</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                                    <p className="text-xs text-muted-foreground">Asistente Lumina · En línea</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                            ? "rounded-br-sm bg-primary text-primary-foreground"
                                            : "rounded-bl-sm border border-white/[0.08] bg-white/[0.05] text-foreground"
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                                    />
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-white/[0.08] bg-white/[0.05] px-4 py-3">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                                        <span className="text-xs text-muted-foreground">Lumi está escribiendo...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="border-t border-white/10 p-3">
                            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Preguntame sobre Lumina..."
                                    rows={1}
                                    className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                    style={{ maxHeight: "80px" }}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || loading}
                                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:opacity-30"
                                    aria-label="Enviar mensaje"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <p className="mt-1.5 text-center text-[10px] text-muted-foreground/60">
                                Powered by Lumina IA · Gemini
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
