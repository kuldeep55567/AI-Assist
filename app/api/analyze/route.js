import { NextResponse } from 'next/server';
import executeQuery from '@/db/sql.config';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const { 
            email, 
            jobId, 
            candidateInfo, 
            questions, 
            responses 
        } = body;

        // Validate required fields
        if (!email || !questions || !responses) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Prepare the analysis prompt
        const analysisPrompt = createAnalysisPrompt(candidateInfo, questions, responses);

        // Call Claude for analysis
        const aiResponse = await anthropic.messages.create({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 4000,
            temperature: 0.3,
            system: `You are an expert technical interviewer and hiring manager. Analyze the candidate's interview responses and provide comprehensive feedback with scores and recommendations.
IMPORTANT: Respond ONLY with valid JSON in the exact format specified. Do not include any text before or after the JSON.`,
            messages: [
                {
                    "role": "user",
                    "content": analysisPrompt
                }
            ]
        });

        // Parse AI response
        const aiContent = aiResponse.content[0].text.trim();
        const analysis = JSON.parse(aiContent);

        // Save brief results to database
        const dbResult = await executeQuery({
            query:`INSERT INTO interview_results 
            (email, job_id, candidate_name, position, overall_score, technical_score, 
             communication_score, final_feedback, recommendation, total_questions, questions_answered) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            values:[
                email,
                jobId || null,
                candidateInfo?.name || 'Unknown',
                candidateInfo?.position || 'Unknown',
                analysis.overallScore,
                analysis.technicalScore,
                analysis.communicationScore,
                analysis.finalFeedback,
                analysis.recommendation,
                questions.length,
                responses.length
            ]
        });

        // Return detailed analysis (shown once, not stored)
        return NextResponse.json({
            success: true,
            data: {
                // Detailed feedback (shown once only)
                detailedAnalysis: analysis,
                // Database record info
                analysisId: dbResult.insertId,
                savedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error analyzing interview:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to analyze interview: ' + error.message },
            { status: 500 }
        );
    }
}

function createAnalysisPrompt(candidateInfo, questions, responses) {
    const qaData = questions.map((question, index) => {
        const response = responses.find(r => r.questionId === question.id);
        return {
            question: question.question,
            category: question.category,
            difficulty: question.difficulty,
            answer: response ? response.response : '[No answer provided]'
        };
    });

    return `
Analyze this interview for ${candidateInfo?.position || 'the position'} candidate:

**CANDIDATE INFO:**
- Name: ${candidateInfo?.name || 'Not provided'}
- Position: ${candidateInfo?.position || 'Not specified'}
- Experience Level: ${candidateInfo?.experienceLevel || 'Not specified'}

**INTERVIEW DATA:**
${qaData.map((qa, index) => `
Question ${index + 1} (${qa.category} - ${qa.difficulty}):
${qa.question}

Answer: ${qa.answer}
`).join('\n')}

**ANALYSIS REQUIREMENTS:**
Provide a JSON response with the following exact structure:

{
  "overallScore": 75.5,
  "technicalScore": 8.2,
  "communicationScore": 7.8,
  "recommendation": "Hire",
  "finalFeedback": "Brief summary for database storage (2-3 sentences)",
  "detailedFeedback": {
    "strengths": ["List of 3-5 key strengths"],
    "weaknesses": ["List of 2-4 areas for improvement"],
    "technicalAnalysis": "Detailed technical assessment",
    "communicationAnalysis": "Communication skills assessment",
    "culturalFit": "Cultural fit assessment",
    "specificInsights": ["Question-specific insights"]
  },
  "scoreBreakdown": {
    "technical": 8.2,
    "communication": 7.8,
    "problemSolving": 7.5,
    "experience": 8.0
  },
  "nextSteps": "Recommended next steps in hiring process"
}

**SCORING CRITERIA:**
- Overall Score: 0-100 (weighted average)
- Individual Scores: 0-10 scale
- Recommendation: "Hire", "Consider", or "Reject"

Be fair but thorough in your assessment. Focus on answer quality, relevance, depth, and communication clarity.
`;
}

