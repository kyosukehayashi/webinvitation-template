'use client'

import { createContext, useContext } from 'react'
import type { WeddingConfig } from '@/config'

const ConfigContext = createContext<WeddingConfig | null>(null)

export function useConfig() {
    const context = useContext(ConfigContext)
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider')
    }
    return context
}

export default function ConfigProvider({
    children,
    initialConfig,
}: {
    children: React.ReactNode
    initialConfig: WeddingConfig
}) {
    return (
        <ConfigContext.Provider value={initialConfig}>
            {children}
        </ConfigContext.Provider>
    )
}
