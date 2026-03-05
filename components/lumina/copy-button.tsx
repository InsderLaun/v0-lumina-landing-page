"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CopyButtonProps {
    text: string
    className?: string
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1 text-xs text-lumina-muted hover:text-lumina-cyan transition-colors ${className}`}
            title="Copy to clipboard"
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5 text-lumina-green" />
                    <span className="text-lumina-green">Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                </>
            )}
        </button>
    )
}

// Inline copy for contract addresses
interface CopyAddressProps {
    address: string
    short?: boolean
}

export function CopyAddress({ address, short = true }: CopyAddressProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const display = short
        ? `${address.slice(0, 6)}...${address.slice(-5)}`
        : address

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-lumina-muted hover:text-lumina-cyan transition-colors group"
            title="Click to copy"
        >
            <span>{display}</span>
            {copied ? (
                <Check className="w-3 h-3 text-lumina-green" />
            ) : (
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </button>
    )
}
