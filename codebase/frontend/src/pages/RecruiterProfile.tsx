import axios from "axios";
 import { useEffect, useState } from "react";
 import {
     FaRegEnvelope,
     FaUserCircle,
     FaCog,
     FaMapMarkerAlt,
     FaFileAlt,
     FaLink
 } from "react-icons/fa";

 import Modal from "react-modal";
 import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
 import "react-tabs/style/react-tabs.css";

 /**
  * Basic profile and contact information on profile page
  *
  * @returns JSX.Element content to be displayed
  */
 const RecruiterProfile = (props) => {
     /**
      * Shows the editing modal for profile and contact information changes
      */
     const [show_editing_modal, set_show_editing_modal] = useState(false);

     /**
      * Functions to update the various contact information iterms
      */
     const [email, set_email] = useState("");
     const [companyName, set_company] = useState("");
     const [phone, set_phone] = useState("");
     const [city, set_city] = useState("");
     const [province, set_province] = useState("");
     const [zip, set_zip] = useState("");

     useEffect(() => {
         /**
          * Gets user profile from database
          *
          * @returns Promise
          */
         const get_profile = async () => {
             return axios
                 .get(`${process.env.REACT_APP_API_URL}/api/recruiter/profile`, {
                     params: { email: props.email },
                 })
                 .then((res) => {
                     const profile = res.data[0];
                     set_email(profile.email);
                     set_company(profile.companyName);
                     set_phone(profile.phone);
                     set_city(profile.city);
                     set_province(profile.province);
                     set_zip(profile.zip);
                 });
         };
         get_profile();
     }, [props.email]);

     /**
      * Updates the users contact information based on the input provided by the editing modal
      *
      * @param event Form input from the editing modal
      */
     const update_general_profile = async (event) => {
         event.preventDefault();
         const profile = {
             email: event.target.email.value,
             company: event.target.companyName.value,
             phone: event.target.phone.value,
             city: event.target.city.value,
             province: event.target.city.value,
             zip: event.target.zip.value,
         };
         return axios
             .request({
                 url: `${process.env.REACT_APP_API_URL}/api/recruiter/updateprofile`,
                 method: "POST",
                 headers: { Authorization: props.authToken },
                 data: { profile },
             })
             .then(() => {

                 set_email(profile.email);

                 event.target.reset();
                 set_show_editing_modal(false);
             });
     };

     const customStyles = {
         content: {
             top: "50%",
             left: "50%",
             width: "50vw",
             marginRight: "-50%",
             transform: "translate(-50%, -50%)",
         },
     };

     const textinput = (name, defaultValue) => (
         <input
             type="text"
             name={name}
             defaultValue={defaultValue}
             className="mx-4 mb-4 flex-auto"
         />
     );

     const general_contact = (
         <form onSubmit={update_general_profile}>
             <div className="flex gap-8">
                 <div className="w-full flex flex-col">
                     <div className="flex flex-col">
                         <label htmlFor="email" className="mb-4 flex-1">
                             Email {textinput("email", email)}
                         </label>
                         <label htmlFor="companyName" className="mb-4 flex-1">
                             Company Name {textinput("companyName", companyName)}
                         </label>
                         <label htmlFor="phone" className="mb-4 flex-1">
                             Phone {textinput("phone", phone)}
                         </label>
                         <label htmlFor="city" className="mb-4 flex-1">
                             City {textinput("city", city)}
                         </label>
                         <label htmlFor="province" className="flex-1">
                             Province {textinput("province", province)}
                             <input type="file" name="resume" className="mx-4 flex-1" />
                         </label>
                         <label htmlFor="zip" className="flex-1">
                             Zip {textinput("zip", zip)}
                             <input type="file" name="resume" className="mx-4 flex-1" />
                         </label>
                     </div>
                 </div>
             </div>
             <input
                 type="submit"
                 value="Enter"
                 className="bg-gray-300 px-4 mt-4 w-20"
             />
         </form>
     );

     const modal = (
         <Modal
           isOpen={show_editing_modal}
           onRequestClose={() => set_show_editing_modal(false)}
           style={customStyles}
         >
           <Tabs>
             <TabList>
               <Tab>General Contact</Tab>
             </TabList>
             <TabPanel>{general_contact}</TabPanel>
           </Tabs>
         </Modal>
       );

     return (
         <div>
           {modal}
           <div className="grid justify-items-center mt-16">
             <div className="absolute top-24 rounded-full bg-white w-32 h-32"></div>
             <FaUserCircle className="absolute p-2 top-24 rounded-full bg-white w-32 h-32" />
             <div className="mb-4">
               <FaCog
                 className="inline mx-2 cursor-pointer"
                 onClick={() => set_show_editing_modal(true)}
               />
             </div>
             <div>
               <p>
                 <FaRegEnvelope className="inline mr-4" />
                 {email}
               </p>
               <p>
                 <FaMapMarkerAlt className="inline mr-4" />
                 {companyName}
               </p>
               <p>
                 <FaMapMarkerAlt className="inline mr-4" />
                 {phone}
               </p>
               <p>
                 <FaMapMarkerAlt className="inline mr-4" />
                 {city}
               </p>
               <p>
                 <FaMapMarkerAlt className="inline mr-4" />
                 {province}
               </p>
               <p>
                 <FaMapMarkerAlt className="inline mr-4" />
                 {zip}
               </p>
             </div>
             <hr className="w-1/3 mt-4" />
           </div>
         </div>
       );
 };

 export { RecruiterProfile };