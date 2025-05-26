"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface InterviewResult {
  id: number;
  email: string;
  job_id: number | null;
  candidate_name: string;
  position: string;
  overall_score: number;
  technical_score: number;
  communication_score: number;
  final_feedback: string;
  recommendation: 'Hire' | 'Consider' | 'Reject';
  total_questions: number;
  questions_answered: number;
  created_at: string;
}

interface DetailedAnalysis {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  recommendation: 'Hire' | 'Consider' | 'Reject';
  finalFeedback: string;
  detailedFeedback: {
    strengths: string[];
    weaknesses: string[];
    technicalAnalysis: string;
    communicationAnalysis: string;
    culturalFit: string;
    specificInsights: string[];
  };
  scoreBreakdown: {
    technical: number;
    communication: number;
    problemSolving: number;
    experience: number;
  };
  nextSteps: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<InterviewResult | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<DetailedAnalysis | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.email) {
      fetchInterviewResults(session.user.email);
    } else if (status === 'authenticated') {
      // Fallback to localStorage if session doesn't have email
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        fetchInterviewResults(userEmail);
      } else {
        setError('No email found. Please login again.');
        setLoading(false);
      }
    }
  }, [status, session, router]);

  const fetchInterviewResults = async (email: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getAnalyze?email=${email}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch interview results');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setInterviewResults(data.data);
      } else {
        throw new Error(data.error || 'Failed to load interview results');
      }
    } catch (error) {
      console.error('Error fetching interview results:', error);
      setError('Failed to load your interview results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Check localStorage for detailed analysis of the selected interview
  const loadDetailedAnalysis = (result: InterviewResult) => {
    setSelectedResult(result);
    
    // Try to load from localStorage - in a real app, you might fetch from API if available
    const storedAnalysis = localStorage.getItem('interviewAnalysis');
    if (storedAnalysis) {
      try {
        setDetailedAnalysis(JSON.parse(storedAnalysis));
      } catch (e) {
        console.error('Failed to parse analysis:', e);
        setDetailedAnalysis(null);
      }
    } else {
      setDetailedAnalysis(null);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Hire':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Consider':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Reject':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <div className="mt-4">
            <Link 
              href="/openings"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Job Openings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (interviewResults.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Interview Results Found</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">You haven't completed any interviews yet.</p>
          <Link 
            href="/openings"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Job Openings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="w-4/5 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Interview Results</h1>
          <Link 
            href="/openings"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Jobs
          </Link>
        </div>
        
        {selectedResult ? (
          <div>
            <button
              onClick={() => setSelectedResult(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to All Results
            </button>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedResult.position} Interview Results
                  </h2>
                  <span className="text-white text-sm">
                    {formatDate(selectedResult.created_at)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {/* Overall Score Section */}
                <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {selectedResult.overall_score}/100
                    </div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Overall Performance
                    </div>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      getRecommendationColor(selectedResult.recommendation)
                    }`}>
                      Recommendation: {selectedResult.recommendation}
                    </div>
                  </div>
                  
                  {/* Score Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(selectedResult.technical_score * 10)}`}>
                        {selectedResult.technical_score}/10
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Technical Skills
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(selectedResult.communication_score * 10)}`}>
                        {selectedResult.communication_score}/10
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Communication
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedResult.questions_answered}/{selectedResult.total_questions}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Questions Answered
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Summary */}
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Feedback Summary</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedResult.final_feedback}</p>
                </div>

                {/* Detailed Analysis Section - Only shown if available */}
                {detailedAnalysis && (
                  <div className="space-y-6">
                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Key Strengths
                        </h3>
                        <ul className="space-y-2">
                          {detailedAnalysis.detailedFeedback?.strengths?.map((strength, index) => (
                            <li key={index} className="text-green-700 dark:text-green-300 flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Areas for Improvement */}
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.19 2.5 1.732 2.5z" />
                          </svg>
                          Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                          {detailedAnalysis.detailedFeedback?.weaknesses?.map((weakness, index) => (
                            <li key={index} className="text-orange-700 dark:text-orange-300 flex items-start">
                              <span className="text-orange-500 mr-2">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Detailed Feedback Sections */}
                    <div className="space-y-6">
                      {detailedAnalysis.detailedFeedback?.technicalAnalysis && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Technical Assessment</h3>
                          <p className="text-blue-700 dark:text-blue-300">{detailedAnalysis.detailedFeedback.technicalAnalysis}</p>
                        </div>
                      )}

                      {detailedAnalysis.detailedFeedback?.communicationAnalysis && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Communication Skills</h3>
                          <p className="text-purple-700 dark:text-purple-300">{detailedAnalysis.detailedFeedback.communicationAnalysis}</p>
                        </div>
                      )}

                      {detailedAnalysis.detailedFeedback?.culturalFit && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl">
                          <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Cultural Fit</h3>
                          <p className="text-indigo-700 dark:text-indigo-300">{detailedAnalysis.detailedFeedback.culturalFit}</p>
                        </div>
                      )}
                    </div>

                    {/* Next Steps */}
                    {detailedAnalysis.nextSteps && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Next Steps</h3>
                        <p className="text-gray-700 dark:text-gray-300">{detailedAnalysis.nextSteps}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviewResults.map((result, index) => (
              <div 
                key={index}
                onClick={() => loadDetailedAnalysis(result)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {result.position}
                      </h2>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {result.candidate_name}
                      </p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(result.recommendation)}`}>
                        {result.recommendation}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mr-2">Overall Score:</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            result.overall_score >= 80 ? 'bg-green-600' : 
                            result.overall_score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${result.overall_score}%` }}
                        ></div>
                      </div>
                      <div className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {result.overall_score}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Technical</div>
                        <div className={`text-lg font-semibold ${getScoreColor(result.technical_score * 10)}`}>
                          {result.technical_score}/10
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Communication</div>
                        <div className={`text-lg font-semibold ${getScoreColor(result.communication_score * 10)}`}>
                          {result.communication_score}/10
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(result.created_at)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {result.questions_answered}/{result.total_questions} questions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}