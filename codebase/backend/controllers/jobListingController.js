import express from 'express';
import mongoose from 'mongoose'
import Joblisting from '../models/Joblisting';
import { v4 as uuid } from 'uuid';

// mongoose.connect(process.env.MONGO_URI);
// const db = mongoose.connection;

export const createJobListing = async (req, res, db) => {
    const { employer_id, job_title, job_location, job_description } = req.body;

    let currUser = res.locals.authData;
    const job_id = uuid();
    const date_posted = new Date().toISOString().slice(0, 10);  
    const contact_name = `${currUser.firstName} ${currUser.lastName}`;
    const contact_address = `${currUser.email}`;
    const number_applied = 0;
    const newJobListing = new Joblisting({ job_id, employer_id, job_description, job_location, job_title, date_posted, contact_name, contact_address, number_applied }, { collection: "joblistings" });

    // TODO: uncomment once recruiter profile is set up
    var recruiterProfiles = db.collection("recruiterprofiles");
    recruiterProfiles.updateOne({"email": contact_address}, {$push: { "jobsPosted": job_id }});

    try {
        await newJobListing.save();
        res.status(201).json(newJobListing);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const getJobListings = async (req, res, db) => {
    try {
        var jobListings = [];
        jobListings.concat(db.getCollection("joblistings").find());
        //const jobListings = await Joblisting.find();
        res.status(200).json(jobListings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getJobListing = async (req, res, db) => {
    const { _id } = req.params;

    try {
        var jobListingColl = db.collection("joblistings");
        const jobListing = await jobListingColl.findById(_id);
        //const jobListing = await Joblisting.findById(_id);
        res.status(200).json(jobListing);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}