# AdvMATH.ai - Math Problem Solver

A comprehensive AI-powered web platform that solves engineering problem with step-by-step solutions, automatic visualization, and multi-method validation. Combines the reliability of Casio ClassWiz, intelligence of Mathway, and precision of MATLAB.

## Features

### 🧮 Calculator Capabilities

- **Basic & Scientific Operations**
  - Arithmetic operations (+, -, ×, ÷)
  - Powers and roots (√, ⁿ√)
  - Logarithms (log, ln, logₙ)
  - Trigonometry (sin, cos, tan) with inverse functions
  - Degree/Radian mode switching
  - Percentage calculations (%)

- **Advanced Mathematics**
  - **Calculus**: Limits, Differentiation, Integration (definite & indefinite)
  - **Matrix Operations**: Addition, subtraction, multiplication, division, determinant, inverse, transpose
  - **Probability & Statistics**: 
    - Comprehensive statistics (mean, median, mode, variance, std dev, skewness, kurtosis, quartiles)
    - Permutations & Combinations (✅ **FIXED**: Always returns numeric values)
    - Binomial probability distributions
    - Conditional probability
    - Expected value and variance
  - **Combinatorics**: 
    - nPr (Permutation) - **Guaranteed numeric output**
    - nCr (Combination) - **Guaranteed numeric output**
    - Large factorial support (logarithmic approach)
  - **LCM**: Least Common Multiple calculation
  - **Algebra**: Equation solving, polynomial operations, simplification

### 🔒 Validation & Accuracy

- **Validation Layer**: Ensures all results are numeric, never symbolic
- **Overflow Protection**: Logarithmic factorials for large numbers (n > 170)
- **Input Validation**: Comprehensive error checking
- **Casio Compatibility**: Results match Casio fx-991 calculator
- **Engineering Precision**: 12 significant digits for accuracy

### 🎨 User Interface

- **Landing Page**: Premium, animated design with math visuals
- **Calculator Interface**: Casio-inspired layout with intuitive keypad
- **Problem Solver**: JEE Advanced problem solver with step-by-step solutions
- **History Sidebar**: Persistent calculation history with timestamps
- **Image Upload**: Upload handwritten or printed math questions for AI-powered solving

### 🧠 AI-Powered Problem Solving

- **Multi-Layer Architecture**: 
  - Problem understanding (AI analysis)
  - Strategy selection (multiple methods)
  - Mathematical computation
  - Result validation
- **JEE Advanced Mode**: Enhanced analysis with JEE-specific tricks and patterns
- **Step-by-Step Solutions**: Exam-oriented explanations with formulas and calculations
- **Multi-Method Validation**: Verify answers using alternate approaches
- **Automatic Visualization**: Graphs, diagrams, and visual intuition (coming soon)

### ⌨️ Input Features

- Full physical keyboard support
- On-screen calculator keypad
- Smart input parsing
- LaTeX-quality math rendering
- Error handling with friendly messages

### 🚀 Technical Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Animations**: Framer Motion
- **Math Engine**: mathjs for calculations
- **Math Rendering**: KaTeX for LaTeX-quality output
- **State Management**: Zustand for history storage
- **Styling**: Tailwind CSS with custom gradients and animations

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with tabs
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── calculator-interface.tsx
│   ├── landing-page.tsx
│   ├── history-sidebar.tsx
│   ├── image-upload-dialog.tsx
│   ├── statistics-dialog.tsx
│   └── matrix-dialog.tsx
├── lib/
│   ├── math-engine.ts      # Core math calculation engine
│   ├── validation-layer.ts # ✅ CRITICAL: Validates numeric results
│   ├── probability-engine.ts # Probability & statistics engine
│   ├── utils.ts            # Utility functions
│   └── __tests__/          # Test cases
│       └── math-engine.test.ts
└── store/
    └── history-store.ts    # History state management
```

## 🚨 Critical Fixes

### P&C Bug Fix (CRITICAL)
- **Problem**: Permutation and Combination were potentially returning symbolic expressions
- **Solution**: Validation layer ensures all results are numeric
- **Result**: P(10,3) = 720 (numeric), C(10,3) = 120 (numeric)
- See [CRITICAL_FIXES.md](./CRITICAL_FIXES.md) for details

## Usage

### Basic Calculations

1. Click on the calculator buttons or use your keyboard
2. Enter your expression
3. Press `=` or `Enter` to calculate
4. View results with LaTeX rendering

### Advanced Operations

- **Differentiation**: Click "Differentiation" in the Advanced Operations panel
- **Integration**: Click "Integration" and provide limits
- **Limits**: Click "Limit" and provide the variable and approach value
- **Statistics**: Click "Statistics" and enter comma-separated numbers

### History

- Click the "History" button to open the sidebar
- View all previous calculations
- Click on any history entry to reload it
- Clear history with the trash icon

### Image Upload

1. Click "Upload" button
2. Select an image file (JPG, PNG, or PDF)
3. Click "Solve Question"
4. View step-by-step solution
5. Use the result in the calculator

## Customization

### Adding AI Integration

The image upload feature currently uses a mock response. To integrate with a real OCR/AI service:

1. Update `components/image-upload-dialog.tsx`
2. Replace the mock API call with your service endpoint
3. Handle the response format from your service

### Extending Math Operations

Add new operations in `lib/math-engine.ts`:

```typescript
newOperation(expression: string): CalculationResult {
  // Your implementation
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
