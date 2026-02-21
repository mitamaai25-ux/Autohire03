import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, DollarSign, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      if (userProfile.role === 'employer') {
        navigate({ to: '/employer/dashboard' });
      } else if (userProfile.role === 'candidate') {
        navigate({ to: '/candidate/dashboard' });
      }
    }
  }, [isAuthenticated, userProfile, navigate]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                Welcome to Autohire
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Connect Talent with Opportunity
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Whether you're hiring top talent or seeking your next career move, Autohire makes it simple, fast, and effective.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate({ to: '/jobs' })} className="gap-2">
                  Browse Jobs <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/freelance' })}>
                  Explore Freelance
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/generated/hero-autohire.dim_1200x600.png" 
                alt="Autohire Platform" 
                className="rounded-lg shadow-soft w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Autohire?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed for both employers and job seekers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Full-Time Positions</h3>
                <p className="text-muted-foreground text-sm">
                  Browse thousands of full-time opportunities across all industries
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Freelance Work</h3>
                <p className="text-muted-foreground text-sm">
                  Find contract and freelance projects that match your skills
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Talent Discovery</h3>
                <p className="text-muted-foreground text-sm">
                  Employers can search and filter qualified candidates easily
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Smart Matching</h3>
                <p className="text-muted-foreground text-sm">
                  Get personalized job recommendations based on your profile
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="font-semibold text-xl">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and build your professional profile or company page
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="font-semibold text-xl">Browse & Connect</h3>
              <p className="text-muted-foreground">
                Search for jobs or candidates that match your criteria
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary">
                3
              </div>
              <h3 className="font-semibold text-xl">Start Hiring</h3>
              <p className="text-muted-foreground">
                Apply to positions or review applications and make offers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals and companies using Autohire to build their future
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate({ to: '/jobs' })}>
              Find Your Next Job
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              Post a Job
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
