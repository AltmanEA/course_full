import { defineConfig } from '@slidev/types'

export default defineConfig({
  mermaid: {
    // Mermaid configuration
    theme: 'default',
    securityLevel: 'loose',
    startOnLoad: false,
    themeVariables: {
      primaryColor: '#3b82f6',
      primaryTextColor: '#1f2937',
      primaryBorderColor: '#2563eb',
      lineColor: '#6b7280',
      secondaryColor: '#f3f4f6',
      tertiaryColor: '#f9fafb'
    }
  },
  info: `
    ✅ Mermaid module configured and ready!
    
    📊 Features enabled:
    - Flowcharts and process diagrams
    - Sequence diagrams
    - State diagrams
    - Class diagrams
    - Entity-relationship diagrams
    - User journey diagrams
    - Git graphs
    - Gantt charts
    - Pie charts
    
    📝 Usage in slides:
    
    <!-- Flowchart -->
    ```mermaid
    graph TD
        A[Start] --> B{Decision}
        B -->|Yes| C[Action 1]
        B -->|No| D[Action 2]
        C --> E[End]
        D --> E
    ```
    
    <!-- Sequence Diagram -->
    ```mermaid
    sequenceDiagram
        participant A as Alice
        participant B as Bob
        A->>B: Hello Bob
        B-->>A: Hello Alice
    ```
    
    <!-- Class Diagram -->
    ```mermaid
    classDiagram
        class User {
            +String id
            +String name
            +login()
        }
        class Course {
            +String title
            +addStudent()
        }
        User ||--o{ Course : enrolls
    ```
    
    🎨 Diagram Types:
    - **graph**: Flowcharts, mind maps, network diagrams
    - **sequence**: Communication between participants
    - **class**: Object-oriented class structures
    - **state**: State machine diagrams
    - **entity**: Database ER diagrams
    - **journey**: User experience flows
    - **git**: Version control timelines
    - **gantt**: Project timelines
    - **pie**: Data visualization
    
    ⚙️ Configuration:
    - theme: 'default', 'neutral', 'dark', 'forest'
    - securityLevel: 'strict', 'loose', 'antiscript'
    - startOnLoad: Auto-render on page load
    - themeVariables: Custom color scheme
    
    🔧 Advanced Features:
    - Custom styling with CSS classes
    - Interactive diagrams with click handlers
    - Subgraphs for complex structures
    - Links between diagrams
    - Dynamic content generation
  `
})