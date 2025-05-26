import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Brain, Video, BarChart3, Zap, Cpu, Target, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  // Define the AI interview workflow steps
  const steps = [
    {
      number: 1,
      title: "AI Interview Setup",
      description: "Configure your AI interviewer with role-specific questions, evaluation criteria, and personality traits."
    },
    {
      number: 2,
      title: "Candidate Onboarding",
      description: "Candidates receive personalized AI interview invitations with preparation materials and scheduling options."
    },
    {
      number: 3,
      title: "Interactive AI Sessions",
      description: "Advanced AI conducts natural conversations, asking follow-up questions and adapting in real-time."
    },
    {
      number: 4,
      title: "Multi-Modal Assessment",
      description: "AI analyzes verbal responses, body language, coding skills, and problem-solving approaches simultaneously."
    },
    {
      number: 5,
      title: "Intelligent Insights",
      description: "Receive comprehensive candidate profiles with AI-generated insights, strengths, and recommendations."
    },
    {
      number: 6,
      title: "Human-AI Collaboration",
      description: "Make final decisions with AI recommendations, ensuring the perfect blend of technology and human judgment."
    }
  ];
  
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Welcome to the AI Interview Future
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Experience next-generation interviews powered by advanced AI that understands, adapts, and evaluates like never before.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="group">
                  <Link href="/login">
                    Try AI Interview <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#how-it-works">
                    See How It Works
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative lg:pl-6">
              <div className="relative mx-auto aspect-video overflow-hidden rounded-xl border shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="AI-powered interview technology"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Revolutionary AI Features
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Cutting-edge AI technology that transforms how interviews are conducted and evaluated
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pt-12">
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <Brain className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Adaptive AI Interviewer</CardTitle>
                <CardDescription>
                  Intelligent AI that adapts conversation flow based on candidate responses and expertise level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI interviewer learns from each interaction, asking more relevant follow-up questions and diving deeper into areas of strength.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <Video className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Real-Time Analysis</CardTitle>
                <CardDescription>
                  Advanced computer vision and NLP analyze verbal and non-verbal communication patterns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor confidence levels, communication skills, and emotional intelligence through sophisticated AI-powered analysis.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <Cpu className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Technical Assessments</CardTitle>
                <CardDescription>
                  AI-powered coding challenges and technical problem-solving in real interview environments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Candidates code live while AI evaluates their approach, debugging skills, and technical reasoning in real-time.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <Zap className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Instant Feedback</CardTitle>
                <CardDescription>
                  Immediate post-interview insights and candidate performance summaries.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get comprehensive evaluation reports within minutes, not days, accelerating your decision-making process.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <BarChart3 className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>
                  AI predicts candidate success and cultural fit based on interview performance data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Leverage machine learning models trained on thousands of successful hires to predict long-term performance.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <Target className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Bias-Free Evaluation</CardTitle>
                <CardDescription>
                  Objective assessment algorithms that eliminate human bias from the interview process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ensure fair and consistent evaluation for all candidates through standardized AI assessment criteria.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              The AI Interview Experience
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Discover how our AI-powered interview platform creates the future of talent assessment
            </p>
          </div>
        </div>
        
        {/* Mobile view - stacked cards */}
        <div className="md:hidden space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        
        {/* Desktop view - zigzag layout with connecting dots */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Vertical line in the middle */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-dotted-line z-0 border-l-2 border-dashed border-primary/30"></div>
            
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={step.number} 
                  className={`relative z-10 flex items-center mb-20 ${isEven ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Connecting dot */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/60"></div>
                  
                  {/* Content card */}
                  <div className={`w-5/12 bg-card rounded-lg p-6 shadow-md border ${isEven ? 'mr-auto' : 'ml-auto'}`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  
                  {/* Horizontal line connecting to the center */}
                  <div 
                    className={`absolute top-1/2 h-0.5 bg-primary/30 ${
                      isEven ? 'left-[calc(5/12*100%)] right-1/2' : 'right-[calc(5/12*100%)] left-1/2'
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Leading the AI Interview Revolution
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Organizations worldwide are embracing the future of AI-powered interviews
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 pt-12">
            <div className="flex flex-col p-6 bg-background rounded-xl shadow-sm border">
              <p className="text-lg mb-4">
                "The AI interview experience was incredibly natural and insightful. It asked questions I didn't expect and really understood my technical background. This is definitely the future of interviews."
              </p>
              <div className="flex items-center mt-auto">
                <div className="rounded-full bg-primary/20 p-1 mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Alex Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Senior Developer, NextGen AI</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col p-6 bg-background rounded-xl shadow-sm border">
              <p className="text-lg mb-4">
                "Our AI interview system has transformed how we assess talent. The insights we get are incredibly detailed, and candidates actually enjoy the experience. It's efficient and engaging."
              </p>
              <div className="flex items-center mt-auto">
                <div className="rounded-full bg-primary/20 p-1 mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Dr. Emily Watson</p>
                  <p className="text-sm text-muted-foreground">Chief People Officer, FutureTech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Experience the Future?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Join the AI interview revolution and discover a smarter, fairer, and more effective way to connect talent with opportunity.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="group">
                <Link href="/login">
                  Start AI Interview <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">
                  Explore AI Features
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}