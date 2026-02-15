import { defineConfig } from '@slidev/types'

export default defineConfig({
  katex: {
    // KaTeX configuration options
    macros: {
      // Custom macros can be defined here
      "\\RR": "\\mathbb{R}",
      "\\NN": "\\mathbb{N}",
      "\\ZZ": "\\mathbb{Z}",
      "\\QQ": "\\mathbb{Q}",
      "\\EE": "\\mathbb{E}",
      "\\Var": "\\operatorname{Var}",
      "\\Cov": "\\operatorname{Cov}",
      "\\argmin": "\\mathop{\\arg\\min}",
      "\\argmax": "\\mathop{\\arg\\max}"
    },
    // Additional KaTeX options
    throwOnError: false,
    strict: "warn",
    trust: false
  },
  info: `
    ✅ KaTeX module configured and ready!
    
    🔢 Features enabled:
    - Lightning-fast math rendering
    - Full LaTeX syntax support
    - Custom macros support
    - Automatic equation numbering
    - Cross-references between equations
    - Mathematical symbols and operators
    
    📝 Usage in slides:
    
    <!-- Inline math -->
    The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.
    
    <!-- Display math -->
    $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$
    
    <!-- Aligned equations -->
    \$\$
    \\begin{aligned}
    a^2 + b^2 &= c^2 \\
    \\frac{d}{dx}\\sin(x) &= \\cos(x)
    \\end{aligned}
    \$\$ 
    
    🎯 Mathematical content:
    - Basic arithmetic and algebra
    - Calculus and derivatives
    - Linear algebra and matrices
    - Statistics and probability
    - Physics formulas
    - Chemical equations
    
    ⚙️ Configuration:
    - macros: Define custom LaTeX commands
    - throwOnError: Continue rendering on errors
    - strict: Warning level for deprecated features
    - trust: Enable trusted mode for security
  `
})