import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useGetCallerCandidateProfile } from '../hooks/useCandidateProfile';
import AuthGuard from '../components/AuthGuard';
import CandidateProfileForm from '../components/CandidateProfileForm';
import CandidateProfileView from '../components/CandidateProfileView';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

export default function CandidateProfile() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: candidateProfile, isLoading } = useGetCallerCandidateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const hasProfile = !!candidateProfile;

  return (
    <AuthGuard requireRole="candidate" userRole={userProfile?.role}>
      <div className="container py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              {hasProfile ? 'Manage your professional profile' : 'Create your professional profile'}
            </p>
          </div>
          {hasProfile && !isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading profile...</div>
        ) : isEditing || !hasProfile ? (
          <CandidateProfileForm 
            profile={candidateProfile} 
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <CandidateProfileView profile={candidateProfile} />
        )}
      </div>
    </AuthGuard>
  );
}
