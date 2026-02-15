import { defineConfig } from '@slidev/types'

export default defineConfig({
  mermaid: {
    // Mermaid configuration
    theme: 'default',
    securityLevel: 'loose',
    startOnLoad: false,
    flowchart: {
      defaultRenderer: 'elk',
      nodeSpacing: 50,    // Дистанция между узлами
      rankSpacing: 50     // Дистанция между "строками"
    },
    themeVariables: {
      primaryColor: '#3b82f6',
      primaryTextColor: '#1f2937',
      primaryBorderColor: '#2563eb',
      lineColor: '#6b7280',
      secondaryColor: '#f3f4f6',
      tertiaryColor: '#f9fafb'
    }
  }
})