import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Application {
    status: string;
    resume?: string;
    appliedAt: Time;
    applicantId: Principal;
    expectedSalary?: bigint;
    jobId: number;
    coverLetter?: string;
}
export type Time = bigint;
export interface Availability {
    preferredStartDate?: Time;
    isAvailable: boolean;
    weeklyHours?: bigint;
}
export interface CompiledCV {
    references: Array<Reference>;
    education: Array<EducationEntry>;
    summary: string;
    experiences: Array<ExperienceEntry>;
    certifications: Array<Certification>;
    personalInfo: CandidateProfile;
    skills: Array<string>;
}
export type JobId = number;
export interface JobPosting {
    id: JobId;
    applicationDeadline: Time;
    experienceLevel: string;
    title: string;
    skillsRequired: Array<string>;
    description: string;
    isActive: boolean;
    employmentType: string;
    company: string;
    employerId: Principal;
    benefits: Array<string>;
    salaryRange: {
        max: bigint;
        min: bigint;
    };
    educationLevel: string;
    location: string;
}
export interface FilterCriteria {
    experienceLevel: string;
    employmentType: string;
    salaryRange: {
        max: bigint;
        min: bigint;
    };
    skills: Array<string>;
    educationLevel: string;
    location: string;
}
export interface ExperienceEntry {
    title: string;
    endDate?: Time;
    description: string;
    company: string;
    location: string;
    startDate: Time;
}
export interface EducationEntry {
    endDate?: Time;
    institution: string;
    description: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Time;
}
export interface Certification {
    issueDate: Time;
    name: string;
    expirationDate?: Time;
    issuingOrganization: string;
    credentialId: string;
    credentialUrl: string;
}
export interface CandidateProfile {
    references: Array<string>;
    preferredJobTypes: Array<JobType>;
    userId: Principal;
    headline: string;
    hourlyRate?: bigint;
    education: Array<EducationEntry>;
    email: string;
    experience: Array<ExperienceEntry>;
    availability: Availability;
    summary: string;
    portfolioLinks: Array<string>;
    certifications: Array<Certification>;
    lastName: string;
    skills: Array<string>;
    location: string;
    resumeUrl?: string;
    firstName: string;
}
export interface Reference {
    contactInfo: string;
    relationship: string;
    fullName: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum JobType {
    internship = "internship",
    contract = "contract",
    partTime = "partTime",
    fullTime = "fullTime",
    freelance = "freelance"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyToJob(jobId: JobId, expectedSalary: bigint | null, coverLetter: string | null, resume: string | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createJobPosting(title: string, description: string, company: string, location: string, employmentType: string, salaryRange: {
        max: bigint;
        min: bigint;
    }, skillsRequired: Array<string>, experienceLevel: string, educationLevel: string, benefits: Array<string>, isActive: boolean, applicationDeadline: Time): Promise<JobId>;
    cvFind(): Promise<CompiledCV>;
    deleteJobPosting(jobId: JobId): Promise<void>;
    filterCandidates(skills: Array<string>, minExperience: bigint): Promise<Array<CandidateProfile>>;
    getCallerCandidateProfile(): Promise<CandidateProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCandidateProfile(userId: Principal): Promise<CandidateProfile | null>;
    getFilteredJobPostings(criteria: FilterCriteria): Promise<Array<JobPosting>>;
    getJobApplications(jobId: JobId): Promise<Array<Application>>;
    getJobPostings(): Promise<Array<JobPosting>>;
    getUserApplications(userId: Principal): Promise<Array<Application>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCandidateProfile(firstName: string, lastName: string, email: string, headline: string, summary: string, skills: Array<string>, experience: Array<ExperienceEntry>, education: Array<EducationEntry>, portfolioLinks: Array<string>, hourlyRate: bigint | null, availability: Availability, location: string, resumeUrl: string | null, certifications: Array<Certification>, preferredJobTypes: Array<JobType>, references: Array<string>): Promise<void>;
    updateApplicationStatus(jobId: JobId, applicantId: Principal, newStatus: string): Promise<void>;
    updateJobPosting(jobId: JobId, title: string, description: string, company: string, location: string, employmentType: string, salaryRange: {
        max: bigint;
        min: bigint;
    }, skillsRequired: Array<string>, experienceLevel: string, educationLevel: string, benefits: Array<string>, isActive: boolean, applicationDeadline: Time): Promise<void>;
}
