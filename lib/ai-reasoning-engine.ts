/**
 * AI Reasoning Engine
 * Classifies problems, selects solving strategies, and coordinates multi-method solutions
 * JEE Advanced + Engineering Problem Solver
 */

export type ProblemTopic =
  | 'permutation_combination'
  | 'probability'
  | 'calculus'
  | 'algebra'
  | 'coordinate_geometry'
  | 'vectors'
  | '3d_geometry'
  | 'trigonometry'
  | 'matrices'
  | 'statistics'
  | 'differential_equations'
  | 'complex_numbers'
  | 'inequalities'
  | 'number_theory'
  | 'unknown'

export type SolutionMethod =
  | 'algebraic'
  | 'geometric'
  | 'graphical'
  | 'calculus_based'
  | 'combinatorial'
  | 'numerical'
  | 'symmetry'
  | 'substitution'

export interface ProblemAnalysis {
  topic: ProblemTopic
  subtopic: string
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'jee_advanced'
  givenValues: { [key: string]: any }
  requiredResult: string
  jeeTrapPatterns: string[]
  suggestedMethods: SolutionMethod[]
  keywords: string[]
}

export interface SolutionStrategy {
  primaryMethod: SolutionMethod
  alternateMethods: SolutionMethod[]
  requiresVisualization: boolean
  visualizationType?: '2d_graph' | '3d_plot' | 'diagram' | 'tree' | 'distribution'
  jeeTrick?: string
}

export class AIReasoningEngine {
  /**
   * Analyze problem and classify it
   */
  analyzeProblem(problemText: string): ProblemAnalysis {
    const text = problemText.toLowerCase()
    const keywords = this.extractKeywords(text)
    
    // Topic detection
    const topic = this.detectTopic(text, keywords)
    const subtopic = this.detectSubtopic(text, topic)
    const difficulty = this.assessDifficulty(text, topic)
    
    // Extract given values
    const givenValues = this.extractGivenValues(text)
    
    // Detect JEE trap patterns
    const jeeTrapPatterns = this.detectJEETraps(text, topic)
    
    // Suggest solution methods
    const suggestedMethods = this.suggestMethods(topic, subtopic, difficulty)
    
    return {
      topic,
      subtopic,
      difficulty,
      givenValues,
      requiredResult: this.extractRequiredResult(text),
      jeeTrapPatterns,
      suggestedMethods,
      keywords,
    }
  }

  /**
   * Generate solution strategy with multiple methods
   */
  generateStrategy(analysis: ProblemAnalysis): SolutionStrategy {
    const primaryMethod = analysis.suggestedMethods[0] || 'algebraic'
    const alternateMethods = analysis.suggestedMethods.slice(1)
    
    const requiresVisualization = this.requiresVisualization(analysis.topic)
    const visualizationType = requiresVisualization
      ? this.getVisualizationType(analysis.topic, analysis.subtopic)
      : undefined
    
    const jeeTrick = this.identifyJEETrick(analysis)

    return {
      primaryMethod,
      alternateMethods,
      requiresVisualization,
      visualizationType,
      jeeTrick,
    }
  }

  private extractKeywords(text: string): string[] {
    const mathKeywords = [
      'permutation', 'combination', 'arrange', 'select', 'choose',
      'probability', 'chance', 'likely', 'expected',
      'derivative', 'integral', 'differentiate', 'integrate', 'limit',
      'solve', 'find', 'calculate', 'compute', 'evaluate',
      'equation', 'inequality', 'polynomial',
      'circle', 'ellipse', 'parabola', 'hyperbola', 'tangent', 'normal',
      'vector', 'dot product', 'cross product', 'magnitude',
      'matrix', 'determinant', 'inverse',
      'triangle', 'angle', 'sine', 'cosine', 'tangent',
    ]
    
    return mathKeywords.filter(keyword => text.includes(keyword))
  }

  private detectTopic(text: string, keywords: string[]): ProblemTopic {
    // P&C detection
    if (
      text.includes('permutation') ||
      text.includes('combination') ||
      text.includes('arrange') ||
      text.includes('select') ||
      text.includes('choose') ||
      keywords.some(k => ['permutation', 'combination'].includes(k))
    ) {
      return 'permutation_combination'
    }

    // Probability detection
    if (
      text.includes('probability') ||
      text.includes('chance') ||
      text.includes('likely') ||
      text.includes('expected value')
    ) {
      return 'probability'
    }

    // Calculus detection
    if (
      text.includes('derivative') ||
      text.includes('integral') ||
      text.includes('differentiate') ||
      text.includes('integrate') ||
      text.includes('limit')
    ) {
      return 'calculus'
    }

    // Coordinate geometry
    if (
      text.includes('circle') ||
      text.includes('ellipse') ||
      text.includes('parabola') ||
      text.includes('hyperbola') ||
      text.includes('tangent') ||
      text.includes('normal') ||
      text.includes('locus')
    ) {
      return 'coordinate_geometry'
    }

    // Vectors
    if (
      text.includes('vector') ||
      text.includes('dot product') ||
      text.includes('cross product') ||
      text.includes('magnitude')
    ) {
      return 'vectors'
    }

    // Matrices
    if (
      text.includes('matrix') ||
      text.includes('determinant') ||
      text.includes('inverse')
    ) {
      return 'matrices'
    }

    // Algebra
    if (
      text.includes('equation') ||
      text.includes('polynomial') ||
      text.includes('root') ||
      text.includes('factor')
    ) {
      return 'algebra'
    }

    return 'unknown'
  }

  private detectSubtopic(text: string, topic: ProblemTopic): string {
    const subtopicMap: { [key in ProblemTopic]: string[] } = {
      permutation_combination: [
        'with repetition',
        'without repetition',
        'circular arrangement',
        'restricted arrangement',
      ],
      probability: [
        'conditional probability',
        'bayes theorem',
        'binomial distribution',
        'geometric distribution',
      ],
      calculus: [
        'definite integral',
        'indefinite integral',
        'limit evaluation',
        'derivative application',
      ],
      coordinate_geometry: [
        'circle',
        'conic sections',
        'tangent and normal',
        'chord properties',
      ],
      vectors: ['dot product', 'cross product', 'triple product', 'vector equation'],
      matrices: ['matrix multiplication', 'determinant', 'inverse', 'eigenvalues'],
      algebra: ['quadratic', 'polynomial', 'system of equations', 'inequalities'],
      trigonometry: ['identities', 'equations', 'inverse functions'],
      statistics: ['mean', 'variance', 'distribution'],
      differential_equations: ['first order', 'second order', 'homogeneous'],
      complex_numbers: ['modulus', 'argument', 'roots'],
      inequalities: ['am-gm', 'cauchy-schwarz', 'jensen'],
      number_theory: ['divisibility', 'gcd', 'lcm', 'prime'],
      unknown: ['general'],
      '3d_geometry': ['plane', 'line', 'sphere'],
    }

    const possibleSubtopic = subtopicMap[topic] || []
    for (const sub of possibleSubtopic) {
      if (text.includes(sub.toLowerCase())) {
        return sub
      }
    }

    return 'general'
  }

  private assessDifficulty(
    text: string,
    topic: ProblemTopic
  ): 'basic' | 'intermediate' | 'advanced' | 'jee_advanced' {
    const advancedIndicators = [
      'jee',
      'advanced',
      'olympiad',
      'complex',
      'multiple',
      'constraint',
      'maximum',
      'minimum',
      'optimization',
    ]

    const hasAdvanced = advancedIndicators.some(indicator =>
      text.includes(indicator)
    )

    if (hasAdvanced) {
      return 'jee_advanced'
    }

    // Heuristic: longer problems with multiple steps are more difficult
    const wordCount = text.split(/\s+/).length
    if (wordCount > 50) {
      return 'advanced'
    }
    if (wordCount > 20) {
      return 'intermediate'
    }

    return 'basic'
  }

  private extractGivenValues(text: string): { [key: string]: any } {
    const values: { [key: string]: any } = {}

    // Extract numbers
    const numberPattern = /(\d+\.?\d*)/g
    const numbers = text.match(numberPattern) || []
    if (numbers.length > 0) {
      values.numbers = numbers.map(Number)
    }

    // Extract variables
    const variablePattern = /\b([a-z])\s*=\s*(\d+\.?\d*)/gi
    const variables = text.match(variablePattern) || []
    variables.forEach((match) => {
      const [, varName, value] = match.match(/([a-z])\s*=\s*(\d+\.?\d*)/i) || []
      if (varName && value) {
        values[varName] = Number(value)
      }
    })

    return values
  }

  private extractRequiredResult(text: string): string {
    const findPatterns = [
      /find\s+(.+?)(?:\.|$)/i,
      /calculate\s+(.+?)(?:\.|$)/i,
      /determine\s+(.+?)(?:\.|$)/i,
      /solve\s+for\s+(.+?)(?:\.|$)/i,
    ]

    for (const pattern of findPatterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }

    return 'unknown'
  }

  private detectJEETraps(text: string, topic: ProblemTopic): string[] {
    const traps: string[] = []

    // Common JEE traps
    if (topic === 'permutation_combination') {
      if (text.includes('arrange') && !text.includes('order')) {
        traps.push('Ordered vs unordered selection ambiguity')
      }
      if (text.includes('repetition') || text.includes('replace')) {
        traps.push('With/without repetition confusion')
      }
    }

    if (topic === 'probability') {
      if (text.includes('given') || text.includes('conditional')) {
        traps.push('Conditional probability vs joint probability')
      }
      if (text.includes('at least') || text.includes('at most')) {
        traps.push('Cumulative probability calculation')
      }
    }

    if (topic === 'calculus') {
      if (text.includes('limit') && text.includes('0/0')) {
        traps.push('L\'Hospital\'s rule application')
      }
      if (text.includes('integral') && text.includes('improper')) {
        traps.push('Improper integral convergence')
      }
    }

    return traps
  }

  private suggestMethods(
    topic: ProblemTopic,
    subtopic: string,
    difficulty: string
  ): SolutionMethod[] {
    const methodMap: { [key in ProblemTopic]: SolutionMethod[] } = {
      permutation_combination: ['combinatorial', 'algebraic', 'symmetry'],
      probability: ['algebraic', 'combinatorial', 'graphical'],
      calculus: ['calculus_based', 'algebraic', 'numerical'],
      coordinate_geometry: ['geometric', 'algebraic', 'graphical'],
      vectors: ['algebraic', 'geometric', 'graphical'],
      matrices: ['algebraic', 'numerical'],
      algebra: ['algebraic', 'substitution', 'graphical'],
      trigonometry: ['algebraic', 'geometric'],
      statistics: ['algebraic', 'numerical', 'graphical'],
      differential_equations: ['calculus_based', 'numerical'],
      complex_numbers: ['algebraic', 'geometric'],
      inequalities: ['algebraic', 'geometric', 'substitution'],
      number_theory: ['algebraic', 'combinatorial'],
      unknown: ['algebraic', 'numerical'],
      '3d_geometry': ['geometric', 'algebraic', 'graphical'],
    }

    return methodMap[topic] || ['algebraic', 'numerical']
  }

  private requiresVisualization(topic: ProblemTopic): boolean {
    const visualTopics: ProblemTopic[] = [
      'coordinate_geometry',
      'vectors',
      '3d_geometry',
      'calculus',
      'probability',
    ]
    return visualTopics.includes(topic)
  }

  private getVisualizationType(
    topic: ProblemTopic,
    subtopic: string
  ): '2d_graph' | '3d_plot' | 'diagram' | 'tree' | 'distribution' {
    if (topic === '3d_geometry' || topic === 'vectors') {
      return '3d_plot'
    }
    if (topic === 'probability' && subtopic.includes('tree')) {
      return 'tree'
    }
    if (topic === 'probability' && subtopic.includes('distribution')) {
      return 'distribution'
    }
    if (topic === 'coordinate_geometry' || topic === 'calculus') {
      return '2d_graph'
    }
    return 'diagram'
  }

  private identifyJEETrick(analysis: ProblemAnalysis): string | undefined {
    if (analysis.difficulty !== 'jee_advanced') {
      return undefined
    }

    const tricks: { [key in ProblemTopic]?: string } = {
      permutation_combination:
        'Use symmetry or complementary counting to reduce computation',
      probability:
        'Apply conditional probability or use total probability theorem',
      calculus:
        'Use substitution or symmetry to simplify integration',
      coordinate_geometry:
        'Use parametric form or transformation to simplify equations',
    }

    return tricks[analysis.topic]
  }
}

export const aiReasoningEngine = new AIReasoningEngine()
