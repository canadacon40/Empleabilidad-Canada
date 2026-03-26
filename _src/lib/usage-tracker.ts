"use client"

const MAX_TRANSFORMS = 10
const MAX_STRATEGY_ACTIONS = 40 // shared pool: customize + cover letter + interview
const STORAGE_KEY = "cv_tool_usage"

interface UsageData {
    sessionId: string
    email: string
    usesRemaining: number // transform uses
    totalUsed: number
    strategyActionsRemaining: number
    strategyActionsUsed: number
    chatMessagesRemaining: number
    onboardingCompleted: boolean
    history: { action: string; date: string }[]
}

export function getUsage(): UsageData | null {
    if (typeof window === "undefined") return null
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const data = JSON.parse(raw) as UsageData
        // Migration: add new fields if missing
        if (data.chatMessagesRemaining === undefined) {
            data.chatMessagesRemaining = 15 // Default limit
            data.onboardingCompleted = false
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
        return data
    } catch {
        return null
    }
}

export function initUsage(sessionId: string, email: string): UsageData {
    const existing = getUsage()
    // If already initialized for this session, return existing
    if (existing && existing.sessionId === sessionId) return existing

    const data: UsageData = {
        sessionId,
        email,
        usesRemaining: MAX_TRANSFORMS,
        totalUsed: 0,
        strategyActionsRemaining: MAX_STRATEGY_ACTIONS,
        strategyActionsUsed: 0,
        chatMessagesRemaining: 15,
        onboardingCompleted: false,
        history: [],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
}

export function initUsageWithCode(code: string): UsageData {
    const existing = getUsage()
    if (existing && existing.sessionId === code) return existing

    const data: UsageData = {
        sessionId: code,
        email: "",
        usesRemaining: MAX_TRANSFORMS,
        totalUsed: 0,
        strategyActionsRemaining: MAX_STRATEGY_ACTIONS,
        strategyActionsUsed: 0,
        chatMessagesRemaining: 15,
        onboardingCompleted: false,
        history: [],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
}

export function consumeUse(action: string): { allowed: boolean; remaining: number } {
    const data = getUsage()
    if (!data) return { allowed: false, remaining: 0 }
    if (data.usesRemaining <= 0) return { allowed: false, remaining: 0 }

    data.usesRemaining -= 1
    data.totalUsed += 1
    data.history.push({ action, date: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

    return { allowed: true, remaining: data.usesRemaining }
}

export function consumeStrategyAction(action: string): { allowed: boolean; remaining: number } {
    const data = getUsage()
    if (!data) return { allowed: false, remaining: 0 }
    if (data.strategyActionsRemaining <= 0) return { allowed: false, remaining: 0 }

    data.strategyActionsRemaining -= 1
    data.strategyActionsUsed += 1
    data.history.push({ action: `strategy_${action}`, date: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

    return { allowed: true, remaining: data.strategyActionsRemaining }
}

export function hasUsesRemaining(): boolean {
    const data = getUsage()
    if (!data) return false
    return data.usesRemaining > 0
}

export function hasStrategyActionsRemaining(): boolean {
    const data = getUsage()
    if (!data) return false
    return data.strategyActionsRemaining > 0
}

export function getRemaining(): number {
    const data = getUsage()
    return data?.usesRemaining ?? 0
}

export function getStrategyRemaining(): number {
    const data = getUsage()
    return data?.strategyActionsRemaining ?? 0
}

export function getTotalActions(): { transforms: number; strategy: number; total: number } {
    const data = getUsage()
    return {
        transforms: data?.usesRemaining ?? 0,
        strategy: data?.strategyActionsRemaining ?? 0,
        total: (data?.usesRemaining ?? 0) + (data?.strategyActionsRemaining ?? 0),
    }
}

export function completeOnboarding(): void {
    const data = getUsage()
    if (!data) return
    data.onboardingCompleted = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function isOnboardingCompleted(): boolean {
    const data = getUsage()
    return data?.onboardingCompleted ?? false
}

export function consumeChatMessage(): { allowed: boolean; remaining: number } {
    const data = getUsage()
    if (!data) return { allowed: true, remaining: 15 } // Fallback for uninitialized
    if (data.chatMessagesRemaining <= 0) return { allowed: false, remaining: 0 }

    data.chatMessagesRemaining -= 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return { allowed: true, remaining: data.chatMessagesRemaining }
}

export function getChatRemaining(): number {
    const data = getUsage()
    return data?.chatMessagesRemaining ?? 15
}

export function clearUsage(): void {
    localStorage.removeItem(STORAGE_KEY)
}

// Session persistence for CV data
const SESSION_DATA_KEY = "cv_tool_session_data"

interface SessionData {
    cvText: string
    language: "en" | "es" | "fr"
    cvData: unknown | null
    analysisResult: unknown | null
    phase: string
}

export function saveSession(data: SessionData): void {
    if (typeof window === "undefined") return
    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(data))
}

export function loadSession(): SessionData | null {
    if (typeof window === "undefined") return null
    try {
        const raw = localStorage.getItem(SESSION_DATA_KEY)
        if (!raw) return null
        return JSON.parse(raw) as SessionData
    } catch {
        return null
    }
}

export function clearSession(): void {
    localStorage.removeItem(SESSION_DATA_KEY)
}
