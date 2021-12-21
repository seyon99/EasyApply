type Joblisting = {
  listing_id: number;
  employer_id: String;
  job_description: String;
  job_location: String;
  job_title: String;
  date_posted: Date;
  contact_name: String;
  contact_title: String;
  contact_address: String;
  number_applied: number;
  metadata: Array<any>;
};
export default Joblisting;
