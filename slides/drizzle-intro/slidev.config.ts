import { defineConfig } from '@slidev/types'

export default defineConfig({
  monaco: true,
  // Monaco Editor configuration
  monacoOptions: {
    theme: 'vs-dark',
    fontSize: 14,
    lineNumbers: 'on',
    minimap: { enabled: false },
    automaticLayout: true
  }
  // Monaco will automatically detect and load supported languages
  // from code blocks in your presentation
  shiki: {
    themes: {
      dark: 'github-dark',
      light: 'github-light',
    }
  },
  katex: {
    // KaTeX configuration options
    macros: {
      // Custom macros can be defined here
      "\\RR": "\\mathbb{R}"
    }
  },
  mermaid: {
    // Mermaid configuration
    theme: 'default',
    securityLevel: 'loose'
  },
})
