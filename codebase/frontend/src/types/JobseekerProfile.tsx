type JobseekerProfile = {
  user: any;
  profile_picture: string;
  email: string,
  firstName: string,
  lastName: string;
  socials: Array<string>;
  resumeUrl: string;
  summary: string;
  address: string;
  workExperience: Array<any>;
  education: Object;
  skills: Array<string>;
  metadata: Array<any>;
};

export default JobseekerProfile;
