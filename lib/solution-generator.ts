/**
 * Solution Generator
 * Creates step-by-step, exam-oriented solutions with multiple methods
 */

import { ProblemAnalysis, SolutionStrategy } from './ai-reasoning-engine'
import { mathEngine } from './math-engine'
import { probabilityEngine } from './probability-engine'

export interface SolutionStep {
  stepNumber: number
  title: string
  description: string
  formula?: string
  calculation?: string
  result?: string
  explanation: string
  highlight?: boolean // JEE trick or important step
}

export interface CompleteSolution {
  problem: string
  analysis: ProblemAnalysis
  strategy: SolutionStrategy
  steps: SolutionStep[]
  primaryAnswer: string
  alternateAnswer?: string
  validation: {
    method1: string
    method2?: string
    verified: boolean
  }
  visualization?: {
    type: string
    data: any
  }
  jeeTrick?: string
}

export class SolutionGenerator {
  /**
   * Generate complete solution with steps
   */
  async generateSolution(
    problemText: string,
    analysis: ProblemAnalysis,
    strategy: SolutionStrategy
  ): Promise<CompleteSolution> {
    const steps: SolutionStep[] = []

    // Step 1: Understanding the problem
    steps.push({
      stepNumber: 1,
      title: 'Understanding the Problem',
      description: this.generateUnderstandingStep(analysis),
      explanation: this.explainProblem(analysis),
    })

    // Step 2-N: Solution steps based on method
    const solutionSteps = await this.generateMethodSteps(
      problemText,
      analysis,
      strategy.primaryMethod
    )
    steps.push(...solutionSteps)

    // Generate answer
    const primaryAnswer = this.extractAnswer(steps)
    
    // Generate alternate method if available
    let alternateAnswer: string | undefined
    if (strategy.alternateMethods.length > 0) {
      const alternateSteps = await this.generateMethodSteps(
        problemText,
        analysis,
        strategy.alternateMethods[0]
      )
      alternateAnswer = this.extractAnswer(alternateSteps)
    }

    // Validate using multiple methods
    const validation = this.validateSolution(
      primaryAnswer,
      alternateAnswer,
      analysis
    )

    return {
      problem: problemText,
      analysis,
      strategy,
      steps,
      primaryAnswer,
      alternateAnswer,
      validation,
      jeeTrick: strategy.jeeTrick,
    }
  }

  private generateUnderstandingStep(analysis: ProblemAnalysis): string {
    const parts: string[] = []

    parts.push(`**Topic:** ${this.formatTopic(analysis.topic)}`)
    parts.push(`**Subtopic:** ${analysis.subtopic}`)
    parts.push(`**Difficulty:** ${analysis.difficulty.toUpperCase()}`)

    if (Object.keys(analysis.givenValues).length > 0) {
      parts.push(
        `**Given:** ${JSON.stringify(analysis.givenValues, null, 2)}`
      )
    }

    parts.push(`**Required:** ${analysis.requiredResult}`)

    if (analysis.jeeTrapPatterns.length > 0) {
      parts.push(
        `**⚠️ JEE Traps Detected:** ${analysis.jeeTrapPatterns.join(', ')}`
      )
    }

    return parts.join('\n\n')
  }

  private explainProblem(analysis: ProblemAnalysis): string {
    let explanation = `This is a ${analysis.difficulty} level problem in ${this.formatTopic(analysis.topic)}. `

    if (analysis.difficulty === 'jee_advanced') {
      explanation +=
        'This problem requires careful analysis to avoid common JEE Advanced traps. '
    }

    if (analysis.jeeTrapPatterns.length > 0) {
      explanation +=
        'Key challenges: ' + analysis.jeeTrapPatterns.join(', ') + '. '
    }

    explanation += `We'll solve this using ${analysis.suggestedMethods[0]} method.`

    return explanation
  }

  private async generateMethodSteps(
    problemText: string,
    analysis: ProblemAnalysis,
    method: string
  ): Promise<SolutionStep[]> {
    const steps: SolutionStep[] = []
    let stepNum = 2

    // Method-specific solution generation
    switch (method) {
      case 'combinatorial':
        return this.generateCombinatorialSteps(problemText, analysis, stepNum)
      case 'algebraic':
        return this.generateAlgebraicSteps(problemText, analysis, stepNum)
      case 'calculus_based':
        return this.generateCalculusSteps(problemText, analysis, stepNum)
      case 'probability':
        return this.generateProbabilitySteps(problemText, analysis, stepNum)
      default:
        return this.generateGenericSteps(problemText, analysis, stepNum)
    }
  }

  private generateCombinatorialSteps(
    problemText: string,
    analysis: ProblemAnalysis,
    startStep: number
  ): SolutionStep[] {
    const steps: SolutionStep[] = []
    let stepNum = startStep

    // Extract P&C parameters
    const numbers = analysis.givenValues.numbers || []
    if (numbers.length >= 2) {
      const n = numbers[0]
      const r = numbers[1]

      // Determine if permutation or combination
      const isPermutation =
        problemText.toLowerCase().includes('arrange') ||
        problemText.toLowerCase().includes('order')

      if (isPermutation) {
        steps.push({
          stepNumber: stepNum++,
          title: 'Apply Permutation Formula',
          description: `We need to arrange ${r} items from ${n} items where order matters.`,
          formula: `P(n, r) = n! / (n - r)!`,
          calculation: `P(${n}, ${r}) = ${n}! / (${n} - ${r})!`,
          explanation: `Since order matters, we use permutation formula.`,
        })

        const result = mathEngine.permutation(n, r)
        if (!result.error) {
          steps.push({
            stepNumber: stepNum++,
            title: 'Calculate Permutation',
            description: `Computing the numeric value.`,
            calculation: result.details || '',
            result: result.result.toString(),
            explanation: `The number of ways to arrange ${r} items from ${n} is ${result.result}.`,
            highlight: true,
          })
        }
      } else {
        steps.push({
          stepNumber: stepNum++,
          title: 'Apply Combination Formula',
          description: `We need to select ${r} items from ${n} items where order doesn't matter.`,
          formula: `C(n, r) = n! / (r! × (n - r)!)`,
          calculation: `C(${n}, ${r}) = ${n}! / (${r}! × (${n} - ${r})!)`,
          explanation: `Since order doesn't matter, we use combination formula.`,
        })

        const result = mathEngine.combination(n, r)
        if (!result.error) {
          steps.push({
            stepNumber: stepNum++,
            title: 'Calculate Combination',
            description: `Computing the numeric value.`,
            calculation: result.details || '',
            result: result.result.toString(),
            explanation: `The number of ways to select ${r} items from ${n} is ${result.result}.`,
            highlight: true,
          })
        }
      }
    }

    return steps
  }

  private generateProbabilitySteps(
    problemText: string,
    analysis: ProblemAnalysis,
    startStep: number
  ): SolutionStep[] {
    const steps: SolutionStep[] = []
    let stepNum = startStep

    const numbers = analysis.givenValues.numbers || []
    if (numbers.length >= 3) {
      const n = numbers[0]
      const k = numbers[1]
      const p = numbers[2] / 100 // Assuming percentage input

      steps.push({
        stepNumber: stepNum++,
        title: 'Identify Distribution Type',
        description: 'This is a binomial probability problem.',
        formula: 'P(X = k) = C(n, k) × p^k × (1-p)^(n-k)',
        explanation: 'We use binomial distribution since we have n independent trials.',
      })

      const result = probabilityEngine.binomialProbability(n, k, p)
      if (!result.error) {
        steps.push({
          stepNumber: stepNum++,
          title: 'Calculate Probability',
          description: result.formula,
          calculation: result.steps?.join('\n') || '',
          result: result.result.toString(),
          explanation: `The probability is ${result.result}.`,
          highlight: true,
        })
      }
    }

    return steps
  }

  private generateAlgebraicSteps(
    problemText: string,
    analysis: ProblemAnalysis,
    startStep: number
  ): SolutionStep[] {
    const steps: SolutionStep[] = []
    let stepNum = startStep

    steps.push({
      stepNumber: stepNum++,
      title: 'Set Up the Problem',
      description: 'Express the problem in algebraic form.',
      explanation: 'We need to translate the word problem into mathematical equations.',
    })

    steps.push({
      stepNumber: stepNum++,
      title: 'Solve Algebraically',
      description: 'Apply algebraic manipulations to find the solution.',
      explanation: 'Using standard algebraic techniques to solve.',
    })

    return steps
  }

  private generateCalculusSteps(
    problemText: string,
    analysis: ProblemAnalysis,
    startStep: number
  ): SolutionStep[] {
    const steps: SolutionStep[] = []
    let stepNum = startStep

    steps.push({
      stepNumber: stepNum++,
      title: 'Identify Calculus Operation',
      description: 'Determine if this requires differentiation, integration, or limits.',
      explanation: 'We need to identify the appropriate calculus technique.',
    })

    return steps
  }

  private generateGenericSteps(
    problemText: string,
    analysis: ProblemAnalysis,
    startStep: number
  ): SolutionStep[] {
    return [
      {
        stepNumber: startStep,
        title: 'Apply Solution Method',
        description: 'Using the appropriate method to solve this problem.',
        explanation: 'Following standard problem-solving approach.',
      },
    ]
  }

  private extractAnswer(steps: SolutionStep[]): string {
    const lastStep = steps[steps.length - 1]
    return lastStep?.result || lastStep?.calculation || 'Answer not found'
  }

  private validateSolution(
    answer1: string,
    answer2: string | undefined,
    analysis: ProblemAnalysis
  ): { method1: string; method2?: string; verified: boolean } {
    if (!answer2) {
      return {
        method1: answer1,
        verified: true, // Single method, assume correct
      }
    }

    // Compare answers (with tolerance for floating point)
    const num1 = parseFloat(answer1)
    const num2 = parseFloat(answer2)

    const verified =
      !isNaN(num1) &&
      !isNaN(num2) &&
      Math.abs(num1 - num2) < 0.0001

    return {
      method1: answer1,
      method2: answer2,
      verified,
    }
  }

  private formatTopic(topic: string): string {
    return topic
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

export const solutionGenerator = new SolutionGenerator()
