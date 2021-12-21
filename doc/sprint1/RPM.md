# Release Planning Meeting

## Features to Implement
In this first release of the app, we are hoping to satisfy the following user stories for job seekers:

1. As a job-seeker, I want to be able to make an account and see an overview of what's new, etc.

2. As a job-seeker, I want to be able to list/modify my skills and personal information.

3. As a job-seeker, I want to be able to upload or remove my resume. 

4. As a job-seeker, I want to be able to see a list of jobs that are near me. 

5. As a job-seeker, I want to be able to see a list of jobs that require my skills. 

## Release Goals
In this first release of the app we will be mainly focused on setting up the various pages of our app.
Our goal for this release is as follows:

1. Created a working authentification page (Andrew)
    * This would satisfies some of the requirements for user story #1
    * Users will be allowed/denied access to their profile upon entering their username and password for their accounts
    * For those who are new, they will also be able to register for an account
    * Upon logging in, users will be directed to the profile page

2. Set up the database so it stores information like username, password, profile page related aspects like user skills + resume, as well as job listings. (Everyone)
    * All the user stories for this sprint requires this feature to be completed
    * An API will be created for database queries

3. Create a user profile page (Daniel + Seyon)
    * This would satisfy user story #1 and #2
    * Refer to sprint0/ui_ux.md for the profile page design
    * This will require the database needing to store information about a user like skills, as well as and uploaded files like a resume.
    * They will also be able to edit their profile page as wanted (this would require updating the information stored on the database)

4. View job listings as well as searching for nearest jobs from a location or jobs that met your skill set (Michael + Kiryl)
    * This would satisfy user story #4 and #5
    * Refer to sprint0/ui_ux.md for the job posting page design
    * This will require the database needing to store information about job postings like job summary, qualifications, location, pay, etc
    * Upon navigating to the job posting page, users will be able to scroll through and view a list of job postings
    * Users would be able to do a refined search based on their interests as described above 
