import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import LoginButton from './LoginButton';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, FileText, DollarSign, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export default function Navigation() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isEmployer = userProfile?.role === 'employer';
  const isCandidate = userProfile?.role === 'candidate';

  const NavLinks = () => (
    <>
      {isAuthenticated && isEmployer && (
        <>
          <Link
            to="/employer/dashboard"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/employer/jobs"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            My Jobs
          </Link>
          <Link
            to="/jobs"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Users className="h-4 w-4" />
            Find Candidates
          </Link>
        </>
      )}
      {isAuthenticated && isCandidate && (
        <>
          <Link
            to="/candidate/dashboard"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/jobs"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Briefcase className="h-4 w-4" />
            Browse Jobs
          </Link>
          <Link
            to="/freelance"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <DollarSign className="h-4 w-4" />
            Freelance
          </Link>
          <Link
            to="/my-applications"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FileText className="h-4 w-4" />
            My Applications
          </Link>
          <Link
            to="/profile"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
        </>
      )}
      {!isAuthenticated && (
        <>
          <Link
            to="/jobs"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse Jobs
          </Link>
          <Link
            to="/freelance"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Freelance
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Autohire</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <LoginButton />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
