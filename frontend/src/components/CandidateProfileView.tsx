import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, DollarSign, ExternalLink, CheckCircle } from 'lucide-react';
import type { CandidateProfile } from '../backend';

interface CandidateProfileViewProps {
  profile: CandidateProfile;
}

export default function CandidateProfileView({ profile }: CandidateProfileViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">
                {profile.firstName} {profile.lastName}
              </CardTitle>
              <p className="text-xl text-muted-foreground">{profile.headline}</p>
            </div>
            {profile.availability.isAvailable && (
              <Badge className="bg-success">
                <CheckCircle className="h-3 w-3 mr-1" />
                Available
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {profile.email}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </div>
            {profile.hourlyRate && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                ${Number(profile.hourlyRate)}/hour
              </div>
            )}
          </div>

          {profile.summary && (
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{profile.summary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {profile.preferredJobTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preferred Job Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.preferredJobTypes.map((type, idx) => (
                <Badge key={idx} variant="outline">
                  {type.toString()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {profile.portfolioLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio & Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile.portfolioLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {link}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {profile.resumeUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              View Resume
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
