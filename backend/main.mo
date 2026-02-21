import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import List "mo:core/List";
import Nat32 "mo:core/Nat32";
import Nat "mo:core/Nat";
import Option "mo:core/Option";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type JobId = Nat32;

  public type CandidateProfile = {
    userId : Principal;
    firstName : Text;
    lastName : Text;
    email : Text;
    headline : Text;
    summary : Text;
    skills : [Text];
    experience : [ExperienceEntry];
    education : [EducationEntry];
    portfolioLinks : [Text];
    hourlyRate : ?Nat;
    availability : Availability;
    location : Text;
    resumeUrl : ?Text;
    certifications : [Certification];
    preferredJobTypes : [JobType];
    references : [Text];
  };

  type Reference = {
    fullName : Text;
    contactInfo : Text;
    relationship : Text;
  };

  type Certification = {
    name : Text;
    issuingOrganization : Text;
    issueDate : Time.Time;
    expirationDate : ?Time.Time;
    credentialId : Text;
    credentialUrl : Text;
  };

  public type ExperienceEntry = {
    title : Text;
    company : Text;
    location : Text;
    startDate : Time.Time;
    endDate : ?Time.Time;
    description : Text;
  };

  public type EducationEntry = {
    institution : Text;
    degree : Text;
    fieldOfStudy : Text;
    startDate : Time.Time;
    endDate : ?Time.Time;
    description : Text;
  };

  public type Availability = {
    isAvailable : Bool;
    preferredStartDate : ?Time.Time;
    weeklyHours : ?Nat;
  };

  public type CompiledCV = {
    personalInfo : CandidateProfile;
    experiences : [ExperienceEntry];
    education : [EducationEntry];
    skills : [Text];
    certifications : [Certification];
    references : [Reference];
    summary : Text;
  };

  public type JobPosting = {
    id : JobId;
    employerId : Principal;
    title : Text;
    description : Text;
    company : Text;
    location : Text;
    employmentType : Text;
    salaryRange : { min : Nat; max : Nat };
    skillsRequired : [Text];
    experienceLevel : Text;
    educationLevel : Text;
    benefits : [Text];
    isActive : Bool;
    applicationDeadline : Time.Time;
  };

  public type FilterCriteria = {
    skills : [Text];
    experienceLevel : Text;
    educationLevel : Text;
    salaryRange : {
      min : Nat;
      max : Nat;
    };
    location : Text;
    employmentType : Text;
  };

  public type JobType = {
    #fullTime;
    #partTime;
    #contract;
    #internship;
    #freelance;
  };

  public type Application = {
    jobId : Nat32;
    applicantId : Principal;
    status : Text;
    appliedAt : Time.Time;
    expectedSalary : ?Nat;
    coverLetter : ?Text;
    resume : ?Text;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  // Initialize state
  let jobPostings = Map.empty<JobId, JobPosting>();
  let candidates = Map.empty<Principal, CandidateProfile>();
  let applications = List.empty<Application>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextJobId : Nat32 = 0;

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Candidate Profile Management
  public shared ({ caller }) func saveCandidateProfile(
    firstName : Text,
    lastName : Text,
    email : Text,
    headline : Text,
    summary : Text,
    skills : [Text],
    experience : [ExperienceEntry],
    education : [EducationEntry],
    portfolioLinks : [Text],
    hourlyRate : ?Nat,
    availability : Availability,
    location : Text,
    resumeUrl : ?Text,
    certifications : [Certification],
    preferredJobTypes : [JobType],
    references : [Text]
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save candidate profiles");
    };

    let profile : CandidateProfile = {
      userId = caller;
      firstName;
      lastName;
      email;
      headline;
      summary;
      skills;
      experience;
      education;
      portfolioLinks;
      hourlyRate;
      availability;
      location;
      resumeUrl;
      certifications;
      preferredJobTypes;
      references;
    };

    candidates.add(caller, profile);
  };

  public query ({ caller }) func getCallerCandidateProfile() : async ?CandidateProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access candidate profiles");
    };
    candidates.get(caller);
  };

  public query ({ caller }) func getCandidateProfile(userId : Principal) : async ?CandidateProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view candidate profiles");
    };
    candidates.get(userId);
  };

  // Job Posting Management
  public shared ({ caller }) func createJobPosting(
    title : Text,
    description : Text,
    company : Text,
    location : Text,
    employmentType : Text,
    salaryRange : { min : Nat; max : Nat },
    skillsRequired : [Text],
    experienceLevel : Text,
    educationLevel : Text,
    benefits : [Text],
    isActive : Bool,
    applicationDeadline : Time.Time
  ) : async JobId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create job postings");
    };

    let jobId = nextJobId;
    nextJobId += 1;

    let jobPosting : JobPosting = {
      id = jobId;
      employerId = caller;
      title;
      description;
      company;
      location;
      employmentType;
      salaryRange;
      skillsRequired;
      experienceLevel;
      educationLevel;
      benefits;
      isActive;
      applicationDeadline;
    };

    jobPostings.add(jobId, jobPosting);

    jobId;
  };

  public shared ({ caller }) func updateJobPosting(
    jobId : JobId,
    title : Text,
    description : Text,
    company : Text,
    location : Text,
    employmentType : Text,
    salaryRange : { min : Nat; max : Nat },
    skillsRequired : [Text],
    experienceLevel : Text,
    educationLevel : Text,
    benefits : [Text],
    isActive : Bool,
    applicationDeadline : Time.Time
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update job postings");
    };

    switch (jobPostings.get(jobId)) {
      case (?existingJob) {
        if (existingJob.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the job owner or admin can update this job posting");
        };

        let updatedJob : JobPosting = {
          existingJob with
          title;
          description;
          company;
          location;
          employmentType;
          salaryRange;
          skillsRequired;
          experienceLevel;
          educationLevel;
          benefits;
          isActive;
          applicationDeadline;
        };

        jobPostings.add(jobId, updatedJob);
      };
      case (null) {
        Runtime.trap("Job not found");
      };
    };
  };

  public shared ({ caller }) func deleteJobPosting(jobId : JobId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete job postings");
    };

    switch (jobPostings.get(jobId)) {
      case (?job) {
        if (job.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the job owner or admin can delete this job posting");
        };

        if (not job.isActive) {
          Runtime.trap("Already marked as inactive");
        } else {
          let deletedJob = { job with isActive = false };
          jobPostings.add(jobId, deletedJob);
        };
      };
      case (null) {
        Runtime.trap("Job not found");
      };
    };
  };

  public query ({ caller }) func getJobPostings() : async [JobPosting] {
    jobPostings.values().toArray();
  };

  // Candidate Filtering
  public query ({ caller }) func filterCandidates(
    skills : [Text],
    minExperience : Nat
  ) : async [CandidateProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can filter candidates");
    };

    let filteredCandidates = candidates.values().toArray().filter(
      func(candidate) {
        let skillsMatch = skills.filter(
          func(skill) {
            switch (candidate.skills.find(func(candidateSkill) { Text.equal(candidateSkill, skill) })) {
              case (null) { true };
              case (_) { false };
            };
          }
        ).size() == 0;

        skillsMatch and candidate.experience.size() >= minExperience
      }
    );

    filteredCandidates;
  };

  // Application Management
  public shared ({ caller }) func applyToJob(
    jobId : JobId,
    expectedSalary : ?Nat,
    coverLetter : ?Text,
    resume : ?Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply to jobs");
    };

    switch (candidates.get(caller)) {
      case (null) {
        Runtime.trap("Candidate profile not found. Please create a profile first");
      };
      case (?_) {
        switch (jobPostings.get(jobId)) {
          case (null) {
            Runtime.trap("Job posting not found");
          };
          case (?job) {
            if (not job.isActive) {
              Runtime.trap("Job posting is not active");
            };

            let newApplication : Application = {
              jobId;
              applicantId = caller;
              status = "pending";
              appliedAt = Time.now();
              expectedSalary;
              coverLetter;
              resume;
            };

            applications.add(newApplication);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateApplicationStatus(jobId : JobId, applicantId : Principal, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update application status");
    };

    switch (jobPostings.get(jobId)) {
      case (null) {
        Runtime.trap("Job posting not found");
      };
      case (?job) {
        if (job.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the job owner or admin can update application status");
        };

        let updatedApplications = List.empty<Application>();
        for (app in applications.values()) {
          if (app.jobId == jobId and app.applicantId == applicantId) {
            updatedApplications.add({ app with status = newStatus });
          } else {
            updatedApplications.add(app);
          };
        };
        applications.clear();
        for (item in updatedApplications.values()) {
          applications.add(item);
        };
      };
    };
  };

  public query ({ caller }) func getUserApplications(userId : Principal) : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view applications");
    };

    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own applications");
    };

    applications.toArray().filter(
      func(app) {
        app.applicantId == userId;
      }
    );
  };

  public query ({ caller }) func getJobApplications(jobId : JobId) : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view job applications");
    };

    switch (jobPostings.get(jobId)) {
      case (null) {
        Runtime.trap("Job posting not found");
      };
      case (?job) {
        if (job.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the job owner or admin can view applications for this job");
        };

        applications.toArray().filter(
          func(app) {
            app.jobId == jobId;
          }
        );
      };
    };
  };

  public query ({ caller }) func getFilteredJobPostings(criteria : FilterCriteria) : async [JobPosting] {
    jobPostings.values().toArray().filter(
      func(job) {
        let skillsMatch = criteria.skills.filter(
          func(skill) {
            switch (job.skillsRequired.find(func(requiredSkill) { Text.equal(requiredSkill, skill) })) {
              case (null) { true };
              case (_) { false };
            };
          }
        ).size() == 0;

        skillsMatch and job.experienceLevel == criteria.experienceLevel
        and job.educationLevel == criteria.educationLevel
        and job.salaryRange.min >= criteria.salaryRange.min
        and job.salaryRange.max <= criteria.salaryRange.max
        and job.location == criteria.location
        and job.employmentType == criteria.employmentType
      }
    );
  };

  public query ({ caller }) func cvFind() : async CompiledCV {
    Runtime.trap("Not implemented");
  };
};
