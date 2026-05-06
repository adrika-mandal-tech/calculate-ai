/**
 * Test Cases for Math Engine
 * Validates P&C, probability, and numeric accuracy
 */

import { mathEngine } from '../math-engine'
import { probabilityEngine } from '../probability-engine'
import { ValidationLayer } from '../validation-layer'

describe('Math Engine - P&C Validation', () => {
  test('Permutation returns numeric value, not symbolic', () => {
    const result = mathEngine.permutation(10, 3)
    expect(result.error).toBeUndefined()
    expect(result.result).toBeDefined()
    
    // CRITICAL: Result must be numeric, not "P(10,3)" or similar
    const validation = ValidationLayer.validateAndConvert(result.result)
    expect(validation.isValid).toBe(true)
    expect(validation.numericValue).toBe(720) // 10P3 = 720
    expect(validation.wasSymbolic).toBe(false)
  })

  test('Combination returns numeric value, not symbolic', () => {
    const result = mathEngine.combination(10, 3)
    expect(result.error).toBeUndefined()
    expect(result.result).toBeDefined()
    
    // CRITICAL: Result must be numeric, not "C(10,3)" or similar
    const validation = ValidationLayer.validateAndConvert(result.result)
    expect(validation.isValid).toBe(true)
    expect(validation.numericValue).toBe(120) // 10C3 = 120
    expect(validation.wasSymbolic).toBe(false)
  })

  test('Large factorial permutation (prevents overflow)', () => {
    const result = mathEngine.permutation(200, 5)
    expect(result.error).toBeUndefined()
    
    const validation = ValidationLayer.validateAndConvert(result.result)
    expect(validation.isValid).toBe(true)
    expect(validation.numericValue).toBeGreaterThan(0)
    expect(Number.isFinite(validation.numericValue)).toBe(true)
  })

  test('Large factorial combination (prevents overflow)', () => {
    const result = mathEngine.combination(200, 5)
    expect(result.error).toBeUndefined()
    
    const validation = ValidationLayer.validateAndConvert(result.result)
    expect(validation.isValid).toBe(true)
    expect(validation.numericValue).toBeGreaterThan(0)
    expect(Number.isFinite(validation.numericValue)).toBe(true)
  })

  test('Invalid permutation parameters', () => {
    const result = mathEngine.permutation(5, 10) // n < r
    expect(result.error).toBeDefined()
    expect(result.result).toBe('')
  })

  test('Invalid combination parameters', () => {
    const result = mathEngine.combination(-5, 3) // negative n
    expect(result.error).toBeDefined()
    expect(result.result).toBe('')
  })
})

describe('Probability Engine', () => {
  test('Binomial probability calculation', () => {
    const result = probabilityEngine.binomialProbability(10, 3, 0.5)
    expect(result.error).toBeUndefined()
    expect(result.result).toBeGreaterThan(0)
    expect(result.result).toBeLessThanOrEqual(1)
    expect(Number.isFinite(result.result)).toBe(true)
  })

  test('Conditional probability', () => {
    const result = probabilityEngine.conditionalProbability(0.3, 0.5)
    expect(result.error).toBeUndefined()
    expect(result.result).toBe(0.6) // 0.3 / 0.5 = 0.6
    expect(Number.isFinite(result.result)).toBe(true)
  })

  test('Expected value calculation', () => {
    const values = [1, 2, 3, 4, 5, 6]
    const probabilities = [1/6, 1/6, 1/6, 1/6, 1/6, 1/6] // Fair die
    const result = probabilityEngine.expectedValue(values, probabilities)
    expect(result.error).toBeUndefined()
    expect(result.result).toBeCloseTo(3.5, 5) // E[X] for fair die = 3.5
  })
})

describe('Validation Layer', () => {
  test('Detects symbolic output', () => {
    expect(ValidationLayer.isSymbolic('P(10,3)')).toBe(true)
    expect(ValidationLayer.isSymbolic('C(5,2)')).toBe(true)
    expect(ValidationLayer.isSymbolic('factorial(10)')).toBe(true)
    expect(ValidationLayer.isSymbolic('120')).toBe(false)
    expect(ValidationLayer.isSymbolic('720')).toBe(false)
  })

  test('Enforces numeric conversion', () => {
    const numeric = ValidationLayer.enforceNumeric('120')
    expect(numeric).toBe(120)
    
    expect(() => {
      ValidationLayer.enforceNumeric('P(10,3)')
    }).toThrow()
  })
})

// Test cases matching Casio fx-991 results
describe('Casio fx-991 Compatibility Tests', () => {
  test('10P3 = 720', () => {
    const result = mathEngine.permutation(10, 3)
    const validation = ValidationLayer.validateAndConvert(result.result)
    expect(validation.numericValue).toBe(720)
  })

  test('10C3 = 120', () => {
    const result = mathEngine.combination(10, 3)
    const validation = ValidationLayer.validateAndConvert(result.result)
    expect(validation.numericValue).toBe(120)
  })

  test('5P2 = 20', () => {
    const result = mathEngine.permutation(5, 2)
    const validation = ValidationLayer.validateAndConvert(result.result)
    expect(validation.numericValue).toBe(20)
  })

  test('5C2 = 10', () => {
    const result = mathEngine.combination(5, 2)
    const validation = ValidationLayer.validateAndConvert(result.result)
    expect(validation.numericValue).toBe(10)
  })
})
