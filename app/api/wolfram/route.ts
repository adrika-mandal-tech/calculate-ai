import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const WOLFRAM_API_KEY = process.env.WOLFRAM_API_KEY

    if (!WOLFRAM_API_KEY) {
      return NextResponse.json(
        { error: "Missing WOLFRAM_API_KEY" },
        { status: 500 }
      )
    }

    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    console.log('Wolfram API Query:', query)

    const wolframUrl = `https://api.wolframalpha.com/v2/query?input=${encodeURIComponent(query)}&output=JSON&appid=${WOLFRAM_API_KEY}&format=plaintext,image&podtitle=true&scantimeout=5&reinterpret=true&assumption=*C.*-.*CalculatorFunction-&excludepopupid=Result&includepodid=Result&includepodid=StepByStepSolution&includepodid=Input&includepodid=IndefiniteIntegral&includepodid=Derivative&includepodid=Limit&includepodid=SeriesExpansion&includepodid=DecimalApproximation`

    console.log('Wolfram URL:', wolframUrl)

    const response = await fetch(wolframUrl)

    if (!response.ok) {
      throw new Error(`Wolfram API failed with status ${response.status}`)
    }

    const data = await response.json()

    console.log('Wolfram Response:', JSON.stringify(data, null, 2))

    if (data.queryresult?.error) {
      console.error('Wolfram API Error:', data.queryresult.error)
      return NextResponse.json(
        { error: 'Wolfram API error', details: data.queryresult.error },
        { status: 500 }
      )
    }

    if (!data.queryresult?.success) {
      console.error('Wolfram API No Success:', data.queryresult)
      return NextResponse.json(
        { error: 'No results found', details: data.queryresult },
        { status: 404 }
      )
    }

    const pods = data.queryresult.pods || []
    console.log('Number of pods:', pods.length)

    let mainResult = ''
    let stepByStepSteps: string[] = []
    let confidence = 0.95

    const isDerivative = query.toLowerCase().includes('derivative') || query.toLowerCase().includes('differentiate') || query.toLowerCase().includes('d/dx')
    const isIntegral = query.toLowerCase().includes('integral') || query.toLowerCase().includes('integrate') || query.toLowerCase().includes('∫')
    const isLimit = query.toLowerCase().includes('limit') || query.toLowerCase().includes('lim')
    const isSeries = query.toLowerCase().includes('series') || query.toLowerCase().includes('taylor')
    const isSolve = query.toLowerCase().includes('solve') || query.toLowerCase().includes('equation')
    const isFactor = query.toLowerCase().includes('factor') || query.toLowerCase().includes('factorize')
    const isMatrix = query.toLowerCase().includes('matrix') || query.toLowerCase().includes('determinant') || query.toLowerCase().includes('inverse')
    const isPlot = query.toLowerCase().includes('plot') || query.toLowerCase().includes('graph')

    let method = 'Mathematical Analysis'
    if (isDerivative) method = 'Differentiation'
    else if (isIntegral) method = 'Integration'
    else if (isLimit) method = 'Limit Evaluation'
    else if (isSeries) method = 'Series Expansion'
    else if (isSolve) method = 'Equation Solving'
    else if (isFactor) method = 'Factorization'
    else if (isMatrix) method = 'Matrix Operations'
    else if (isPlot) method = 'Graphing'
    else method = 'Wolfram Alpha Analysis'

    const parsedPods = pods.map((pod: any) => {
      const podData = {
        title: pod.title,
        id: pod.id,
        subpods: pod.subpods?.map((subpod: any) => ({
          title: subpod.title,
          plaintext: subpod.plaintext,
          img: subpod.img?.src,
          primary: subpod.primary || false
        })) || []
      }

      if (pod.id === 'Result' && pod.subpods?.[0]?.plaintext) {
        mainResult = pod.subpods[0].plaintext
      } else if (pod.id === 'Input' && pod.subpods?.[0]?.plaintext && !mainResult) {
        mainResult = pod.subpods[0].plaintext
      } else if (pod.id === 'Derivative' && pod.subpods?.[0]?.plaintext && isDerivative) {
        mainResult = pod.subpods[0].plaintext
      } else if (pod.id === 'IndefiniteIntegral' && pod.subpods?.[0]?.plaintext && isIntegral) {
        mainResult = pod.subpods[0].plaintext
      } else if (pod.id === 'DefiniteIntegral' && pod.subpods?.[0]?.plaintext && isIntegral) {
        mainResult = pod.subpods[0].plaintext
      } else if (pod.id === 'Limit' && pod.subpods?.[0]?.plaintext && isLimit) {
        mainResult = pod.subpods[0].plaintext
      }

      if (pod.id === 'StepByStepSolution' && pod.subpods?.[0]?.plaintext) {
        const stepsText = pod.subpods[0].plaintext
        stepByStepSteps = stepsText.split('\n').filter((step: string) => step.trim())
      }

      return podData
    })

    if (stepByStepSteps.length === 0 && mainResult) {
      stepByStepSteps = [
        `1. Input: ${query}`,
        `2. Processing: Analyzing mathematical expression`,
        `3. Method: ${method}`,
        `4. Result: ${mainResult}`
      ]
    }

    console.log('Main Result:', mainResult)
    console.log('Steps:', stepByStepSteps)
    console.log('Method:', method)

    if (parsedPods.length === 0) {
      console.log('No pods found, trying fallback...')
      const fallbackUrl = `https://api.wolframalpha.com/v2/query?input=${encodeURIComponent(query)}&output=JSON&appid=${WOLFRAM_API_KEY}&format=plaintext&podtitle=true&scantimeout=10`
      
      const fallbackResponse = await fetch(fallbackUrl)

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API failed: ${fallbackResponse.status}`)
      }

      const fallbackData = await fallbackResponse.json()
      
      console.log('Fallback Response:', JSON.stringify(fallbackData, null, 2))
      
      if (fallbackData.queryresult?.success && fallbackData.queryresult.pods) {
        const fallbackPods = fallbackData.queryresult.pods.map((pod: any) => ({
          title: pod.title,
          id: pod.id,
          subpods: pod.subpods?.map((subpod: any) => ({
            title: subpod.title,
            plaintext: subpod.plaintext,
            img: subpod.img?.src,
            primary: subpod.primary || false
          })) || []
        }))
        
        return NextResponse.json({
          success: true,
          pods: fallbackPods,
          assumptions: fallbackData.queryresult.assumptions || [],
          warnings: fallbackData.queryresult.warnings || []
        })
      }
    }

    return NextResponse.json({
      result: mainResult || 'No result available',
      pods: parsedPods,
      success: true,
      confidence: confidence,
      method: method,
      steps: stepByStepSteps,
      query: query,
      debug: {
        totalPods: parsedPods.length,
        hasSteps: stepByStepSteps.length > 0,
        apiResponse: data.queryresult
      }
    })

  } catch (error) {
    console.error('Wolfram API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        stack: error instanceof Error ? error.stack : 'No stack trace'
      }
    }, { status: 500 })
  }
}
