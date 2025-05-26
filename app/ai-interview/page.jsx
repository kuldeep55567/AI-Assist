'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Audio Recording Hook
const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to start recording: ' + err.message);
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    if (!audioBlob) return null;
    
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const response = await fetch('https://clownfish-app-2-g7syt.ondigitalocean.app/api/transcribe/audio', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Transcription failed');
      }
      
      const data = await response.json();
      return data.transcription;
    } catch (err) {
      setError('Transcription failed: ' + err.message);
      throw err;
    } finally {
      setIsTranscribing(false);
    }
  };

  const cleanup = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  return {
    isRecording,
    audioBlob,
    error,
    isTranscribing,
    startRecording,
    stopRecording,
    transcribeAudio,
    cleanup,
    setAudioBlob: (blob) => setAudioBlob(blob)
  };
};

// Results Modal Component with AI Analysis
const ResultsModal = ({ isOpen, onClose, questions, responses, candidateInfo }) => {
  const [analysis, setAnalysis] = useState(null);
  
  useEffect(() => {
    if (isOpen) {
      // Load analysis from localStorage
      const storedAnalysis = localStorage.getItem('interviewAnalysis');
      if (storedAnalysis) {
        try {
          setAnalysis(JSON.parse(storedAnalysis));
        } catch (e) {
          console.error('Failed to parse analysis:', e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Interview Results & Analysis</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {analysis ? (
            <>
              {/* Overall Score Section */}
              <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {analysis.overallScore}/100
                  </div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Overall Performance
                  </div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    analysis.recommendation === 'Hire' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    analysis.recommendation === 'Consider' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    Recommendation: {analysis.recommendation}
                  </div>
                </div>
                
                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysis.scoreBreakdown || {}).map(([key, score]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {score}/10
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Strengths */}
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.detailedFeedback?.strengths?.map((strength, index) => (
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
                    {analysis.detailedFeedback?.weaknesses?.map((weakness, index) => (
                      <li key={index} className="text-orange-700 dark:text-orange-300 flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Detailed Analysis Sections */}
              <div className="space-y-6 mb-8">
                {analysis.detailedFeedback?.technicalAnalysis && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Technical Assessment</h3>
                    <p className="text-blue-700 dark:text-blue-300">{analysis.detailedFeedback.technicalAnalysis}</p>
                  </div>
                )}

                {analysis.detailedFeedback?.communicationAnalysis && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">Communication Skills</h3>
                    <p className="text-purple-700 dark:text-purple-300">{analysis.detailedFeedback.communicationAnalysis}</p>
                  </div>
                )}

                {analysis.detailedFeedback?.culturalFit && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Cultural Fit</h3>
                    <p className="text-indigo-700 dark:text-indigo-300">{analysis.detailedFeedback.culturalFit}</p>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              {analysis.nextSteps && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Next Steps</h3>
                  <p className="text-gray-700 dark:text-gray-300">{analysis.nextSteps}</p>
                </div>
              )}
            </>
          ) : (
            // Fallback to basic Q&A display if no analysis
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Interview Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Position:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{candidateInfo?.position}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{questions.length}</span>
                  </div>
                </div>
              </div>

              {questions.map((question, index) => {
                const response = responses.find(r => r.questionId === question.id);
                return (
                  <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Question:</h4>
                      <p className="text-gray-700 dark:text-gray-300">{question.question}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Answer:</h4>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">
                          {response ? response.response : 'No answer provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AIInterview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const jobId = searchParams.get('jobId');

  // Audio recording
  const {
    isRecording,
    audioBlob,
    error: recordingError,
    isTranscribing,
    startRecording,
    stopRecording,
    transcribeAudio,
    cleanup,
    setAudioBlob
  } = useAudioRecording();

  // Video refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Refs
  const speechSynthesisRef = useRef(null);

  // Initialize video stream
  useEffect(() => {
    const initializeVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setVideoReady(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Unable to access camera. Please ensure camera permissions are granted.');
      }
    };

    initializeVideo();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Fetch interview questions
  useEffect(() => {
    fetchInterviewQuestions();
  }, [email]);

  const fetchInterviewQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/userQuestions?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch interview questions');
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setQuestions(data.data.questions || []);
        setCandidateInfo({
          name: data.data.candidateName,
          position: data.data.position,
          experienceLevel: data.data.experienceLevel,
          totalDuration: data.data.totalDuration,
        });
      } else {
        throw new Error(data.error || 'No questions found');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setIsAISpeaking(true);
        utterance.onend = () => {
          setIsAISpeaking(false);
          resolve();
        };
        utterance.onerror = () => {
          setIsAISpeaking(false);
          resolve();
        };
        
        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const startInterview = async () => {
    if (!videoReady) {
      setError('Please ensure your camera is ready before starting the interview.');
      return;
    }

    setInterviewStarted(true);
    
    const welcomeMessage = `Hello ${candidateInfo?.name || 'candidate'}! Welcome to your ${candidateInfo?.position || 'position'} interview. I'll be asking you ${questions.length} questions. Please speak clearly and use the record button to capture your responses. Let's begin with the first question.`;
    
    await speakText(welcomeMessage);
    
    if (questions.length > 0) {
      askCurrentQuestion(0);
    }
  };

  const askCurrentQuestion = async (questionIndex = null) => {
    const index = questionIndex !== null ? questionIndex : currentQuestionIndex;
    if (index < questions.length) {
      const question = questions[index];
      const questionText = `Question ${index + 1}: ${question.question}`;
      
      await speakText(questionText);
    }
  };

  const handleStartRecording = () => {
    setCurrentResponse('');
    setAudioBlob(null);
    startRecording();
  };

  const handleStopRecording = async () => {
    stopRecording();
  };

  // Handle audio blob changes (when recording stops)
  useEffect(() => {
    if (audioBlob && !isRecording) {
      handleTranscription();
    }
  }, [audioBlob, isRecording]);

  const handleTranscription = async () => {
    try {
      const transcription = await transcribeAudio(audioBlob);
      if (transcription) {
        setCurrentResponse(transcription);
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError('Failed to transcribe audio. Please try again.');
    }
  };

  const submitCurrentResponse = async () => {
    if (currentResponse.trim()) {
      const responseData = {
        questionId: questions[currentQuestionIndex].id,
        question: questions[currentQuestionIndex].question,
        response: currentResponse.trim(),
        timestamp: new Date().toISOString(),
      };
      
      const updatedResponses = [...userResponses, responseData];
      setUserResponses(updatedResponses);
      
      if (currentQuestionIndex < questions.length - 1) {
        const nextQuestionIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextQuestionIndex);
        setCurrentResponse('');
        setAudioBlob(null);
        
        setTimeout(async () => {
          await speakText("Thank you for your response. Let's move to the next question.");
          setTimeout(() => {
            askCurrentQuestion(nextQuestionIndex);
          }, 1000);
        }, 1000);
      } else {
        finishInterview(updatedResponses);
      }
    }
  };

  const finishInterview = async (responses) => {
    setInterviewCompleted(true);
    
    await speakText("Thank you for completing the interview. Your responses are being analyzed. Please wait a moment for your results.");
    
    try {
      // Analyze interview with AI
      const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          jobId,
          candidateInfo,
          questions,
          responses
        })
      });

      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        if (analysisData.success) {
          // Store detailed analysis for the results modal
          localStorage.setItem('interviewAnalysis', JSON.stringify(analysisData.data.detailedAnalysis));
          await speakText("Your interview has been analyzed successfully. Click 'View Results' to see your detailed feedback and score.");
        } else {
          throw new Error(analysisData.error);
        }
      } else {
        throw new Error('Failed to analyze interview');
      }

      // Also save basic interview data as backup
      const interviewResults = {
        email,
        jobId,
        candidateInfo,
        questions,
        responses,
        completedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        totalResponses: responses.length,
      };
      
      localStorage.setItem('interviewResults', JSON.stringify(interviewResults));
    } catch (e) {
      console.warn('Analysis failed, saving basic results:', e);
      await speakText("Interview completed successfully. Your responses have been recorded.");
      
      // Save basic results even if analysis fails
      const interviewResults = {
        email,
        jobId,
        candidateInfo,
        questions,
        responses,
        completedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        totalResponses: responses.length,
      };
      
      localStorage.setItem('interviewResults', JSON.stringify(interviewResults));
    }
  };

  const skipQuestion = () => {
    // Save empty response or current partial response
    const responseData = {
      questionId: questions[currentQuestionIndex].id,
      question: questions[currentQuestionIndex].question,
      response: currentResponse.trim() || "[Skipped]",
      timestamp: new Date().toISOString(),
    };
    
    const updatedResponses = [...userResponses, responseData];
    setUserResponses(updatedResponses);
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      setCurrentResponse('');
      setAudioBlob(null);
      
      setTimeout(async () => {
        await speakText("Moving to the next question.");
        setTimeout(() => {
          askCurrentQuestion(nextQuestionIndex);
        }, 1000);
      }, 500);
    } else {
      finishInterview(updatedResponses);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      cleanup();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Preparing Your Interview</h2>
          <p className="text-gray-600 dark:text-gray-400">Loading questions and setting up the environment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Setup Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (interviewCompleted) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-2xl w-full mx-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Interview Completed!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Thank you for completing the interview. Your responses have been recorded and will be reviewed by our team.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userResponses.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Questions Answered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{questions.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{candidateInfo?.position}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Position</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowResultsModal(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  View Results
                </button>
                <button
                  onClick={() => router.push('/openings')}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Back to Jobs
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <ResultsModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          questions={questions}
          responses={userResponses}
          candidateInfo={candidateInfo}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!interviewStarted ? (
          /* Pre-interview setup screen */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h1 className="text-3xl font-bold text-white">AI Interview Setup</h1>
                <p className="text-blue-100 mt-2">Get ready for your interview with {candidateInfo?.position}</p>
              </div>

              <div className="p-8">
                {/* Video Preview Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Camera Preview</h2>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      style={{ maxHeight: '300px' }}
                    />
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {videoReady ? 'Camera is ready ✓' : 'Setting up camera...'}
                    </p>
                  </div>
                </div>

                {/* Interview Details */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interview Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0H8m0 0v.01M8 6v.01" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Position</div>
                        <div className="text-gray-600 dark:text-gray-400">{candidateInfo?.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Questions</div>
                        <div className="text-gray-600 dark:text-gray-400">{questions.length} total</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Experience Level</div>
                        <div className="text-gray-600 dark:text-gray-400">{candidateInfo?.experienceLevel}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Duration</div>
                        <div className="text-gray-600 dark:text-gray-400">{candidateInfo?.totalDuration} minutes</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6 rounded-xl mb-8">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">Important Instructions</h4>
                      <ul className="space-y-2 text-amber-700 dark:text-amber-300">
                        <li>• Ensure your camera and microphone are working properly</li>
                        <li>• Use the record button to start and stop recording your answers</li>
                        <li>• Speak clearly and at a normal pace</li>
                        <li>• Review your transcribed answer before submitting</li>
                        <li>• You can skip questions if needed</li>
                        <li>• Choose a quiet environment with good lighting</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <button
                    onClick={startInterview}
                    disabled={!videoReady}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indiago-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                  >
                    {!videoReady ? 'Setting up camera...' : 'Start Interview'}
                  </button>
                  {recordingError && (
                    <p className="text-red-600 dark:text-red-400 mt-2 text-sm">{recordingError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Interview in progress */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-screen">
            {/* Left Column - AI Interviewer */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Interviewer</h3>
                  <div className="flex items-center justify-center mt-2">
                    {isAISpeaking ? (
                      <div className="flex items-center text-blue-600 dark:text-blue-400">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2"></div>
                        <span className="text-sm">Speaking...</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Listening</span>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{currentQuestionIndex + 1} / {questions.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Question */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{currentQuestionIndex + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          questions[currentQuestionIndex]?.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          questions[currentQuestionIndex]?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {questions[currentQuestionIndex]?.difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                          {questions[currentQuestionIndex]?.category}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {questions[currentQuestionIndex]?.question}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Candidate Video & Response */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Candidate Video */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {candidateInfo?.name || 'Candidate'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
                  </div>
                </div>
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full rounded-xl shadow-lg"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                  {isRecording && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                      Recording
                    </div>
                  )}
                </div>
              </div>

              {/* Response Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Response</h3>
                  <div className="flex items-center space-x-3">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        disabled={isAISpeaking || isTranscribing}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRecording}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        </svg>
                        <span>Stop Recording</span>
                      </button>
                    )}
                    
                    {currentResponse && !isRecording && (
                      <button
                        onClick={submitCurrentResponse}
                        disabled={isTranscribing}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Submit Answer</span>
                      </button>
                    )}
                    
                    <button
                      onClick={skipQuestion}
                      disabled={isRecording}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 min-h-[200px] flex-1">
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      {isTranscribing ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-600 dark:text-gray-400">Please wait...</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {currentResponse || (isRecording ? 'Recording... Speak now.' : 'Click "Start Recording" to record your answer')}
                        </p>
                      )}
                    </div>
                    {currentResponse && !isRecording && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Response ready for submission
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}