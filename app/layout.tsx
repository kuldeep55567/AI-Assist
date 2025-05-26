import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/providers/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HireX | Revolutionize Your Hiring Process',
  description: 'Automate candidate sourcing, assessment, and evaluation with our AI-powered HR platform',
  keywords: 'HR automation, hiring, recruitment, candidate assessment, AI hiring',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    shortcut: { url: '/favicon.ico' },
    apple: { url: '/favicon.png' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 mx-auto w-[80%]">{children}</main>
              <footer className="py-4 border-t bg-muted/30">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
                  <p>© 2025 HireX. All rights reserved.</p>
                  <div className="flex items-center space-x-6 mt-2 md:mt-0">
                    <a href="#" className="hover:text-primary transition-colors duration-200">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors duration-200">Terms</a>
                    <a href="mailto:kuldeep@levelsupermind.com" className="hover:text-primary transition-colors duration-200">kuldeep@levelsupermind.com</a>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}