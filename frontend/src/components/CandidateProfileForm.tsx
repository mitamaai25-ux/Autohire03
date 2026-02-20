import { useState, useEffect } from 'react';
import { useSaveCandidateProfile } from '../hooks/useCandidateProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import type { CandidateProfile, JobType } from '../backend';

interface CandidateProfileFormProps {
  profile?: CandidateProfile | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CandidateProfileForm({ profile, onSuccess, onCancel }: CandidateProfileFormProps) {
  const saveProfile = useSaveCandidateProfile();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    headline: '',
    summary: '',
    skills: '',
    location: '',
    hourlyRate: '',
    portfolioLinks: '',
    resumeUrl: '',
    isAvailable: true,
    preferredJobTypes: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        headline: profile.headline,
        summary: profile.summary,
        skills: profile.skills.join(', '),
        location: profile.location,
        hourlyRate: profile.hourlyRate ? profile.hourlyRate.toString() : '',
        portfolioLinks: profile.portfolioLinks.join(', '),
        resumeUrl: profile.resumeUrl || '',
        isAvailable: profile.availability.isAvailable,
        preferredJobTypes: profile.preferredJobTypes.map(t => t.toString()),
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        headline: formData.headline,
        summary: formData.summary,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        experience: [],
        education: [],
        portfolioLinks: formData.portfolioLinks.split(',').map(s => s.trim()).filter(Boolean),
        hourlyRate: formData.hourlyRate ? BigInt(formData.hourlyRate) : null,
        availability: {
          isAvailable: formData.isAvailable,
          preferredStartDate: undefined,
          weeklyHours: undefined,
        },
        location: formData.location,
        resumeUrl: formData.resumeUrl || null,
        certifications: [],
        preferredJobTypes: formData.preferredJobTypes.map(t => ({ [t]: null } as any)),
        references: [],
      });
      toast.success('Profile saved successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const toggleJobType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      preferredJobTypes: prev.preferredJobTypes.includes(type)
        ? prev.preferredJobTypes.filter(t => t !== type)
        : [...prev.preferredJobTypes, type]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Professional Headline</Label>
        <Input
          id="headline"
          value={formData.headline}
          onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
          placeholder="e.g. Senior Full-Stack Developer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          placeholder="Tell employers about your experience and expertise..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="e.g. JavaScript, React, Node.js"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate (for freelance)</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
            placeholder="e.g. 75"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioLinks">Portfolio Links (comma-separated)</Label>
        <Input
          id="portfolioLinks"
          value={formData.portfolioLinks}
          onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })}
          placeholder="https://github.com/username, https://portfolio.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resumeUrl">Resume URL</Label>
        <Input
          id="resumeUrl"
          type="url"
          value={formData.resumeUrl}
          onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
          placeholder="https://example.com/resume.pdf"
        />
      </div>

      <div className="space-y-3">
        <Label>Preferred Job Types</Label>
        <div className="space-y-2">
          {['fullTime', 'partTime', 'contract', 'freelance'].map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={formData.preferredJobTypes.includes(type)}
                onCheckedChange={() => toggleJobType(type)}
              />
              <Label htmlFor={type} className="font-normal cursor-pointer">
                {type === 'fullTime' ? 'Full-Time' : 
                 type === 'partTime' ? 'Part-Time' : 
                 type === 'contract' ? 'Contract' : 'Freelance'}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isAvailable"
          checked={formData.isAvailable}
          onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked as boolean })}
        />
        <Label htmlFor="isAvailable" className="font-normal cursor-pointer">
          I am currently available for work
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={saveProfile.isPending}>
          {saveProfile.isPending ? 'Saving...' : 'Save Profile'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
