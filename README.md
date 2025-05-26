# AI-Assist: AI-Powered Interview Platform

AI-Assist is an innovative job application platform featuring AI-driven interviews, real-time transcription, and comprehensive candidate analysis.

## Features

- **AI Interview System**: Conduct automated interviews with real-time video capture and speech-to-text transcription
- **Job Management**: Browse openings, track applications, and manage candidate profiles
- **Automated Analysis**: AI-powered assessment of candidate responses with detailed scoring and feedback
- **User Dashboard**: Track interview performance and application status

## Tech Stack

- **Frontend**: Next.js 13.5 with React 18
- **Styling**: TailwindCSS with shadcn/ui components
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MySQL
- **AI Integration**: Anthropic Claude API

## File Structure

```
├── app/                    # Next.js app directory
│   ├── ai-interview/       # AI interview feature
│   ├── api/                # API routes
│   │   ├── analyze/        # Interview analysis
│   │   ├── appliedJobs/    # Job applications
│   │   ├── auth/           # Authentication
│   │   ├── getAnalyze/     # Retrieve analysis
│   │   ├── openings/       # Job listings
│   │   └── userQuestions/  # Interview questions
│   ├── dashboard/          # User dashboard
│   ├── login/              # Authentication pages
│   ├── openings/           # Job listings page
│   └── types/              # TypeScript interfaces
├── components/             # Reusable UI components
│   ├── layout/             # Layout components
│   ├── providers/          # Context providers
│   ├── theme/              # Theme components
│   └── ui/                 # UI components
├── db/                     # Database configuration
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
└── types/                  # Global TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- MySQL database
- Google OAuth credentials (for authentication)
- Anthropic API key (for AI interview analysis)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
JWT_SECRET=your_jwt_secret

# Database
HOST=your_db_host
PASSWORD=your_db_password
DB_USERNAME=your_db_username
DATABASE=your_db_name

# API Keys
CLAUDE_API_KEY=your_anthropic_api_key

# App Configuration
NEXT_PUBLIC_HOST=http://localhost:3000
```

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/AI-Assist.git
   cd AI-Assist
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Create a MySQL database
   - Update the `.env.local` file with your database credentials

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```
npm run build
npm run start
```

## Key Features Explained

### AI Interview System

The AI interview system captures video and audio from candidates, transcribes their responses in real-time, and analyzes their performance using AI. The system:

- Manages camera and microphone access
- Presents questions selected based on job requirements
- Transcribes spoken responses
- Provides comprehensive analysis with scoring and feedback

### Job Application Flow

1. Users browse available job openings
2. Apply for positions with their profile information
3. Schedule and complete AI interviews
4. Receive detailed analysis and feedback
5. Track application status through the dashboard

## Best Practices

### Code Organization

- **Component-Based Architecture**: Modular components for reusability
- **API Route Separation**: Organized by feature/domain
- **TypeScript Interfaces**: Strong typing for all data structures
- **Utility Functions**: Common operations abstracted into utilities

### Security

- **NextAuth.js**: Secure authentication with OAuth providers
- **JWT Tokens**: Secure session management
- **Environment Variables**: Protected credentials and secrets

### Performance

- **Server Components**: Next.js server components for improved loading
- **Optimized Video Processing**: Efficient video handling
- **Lazy Loading**: Components loaded only when needed

### Accessibility

- **ARIA Attributes**: Proper accessibility markup
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG-compliant color schemes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.