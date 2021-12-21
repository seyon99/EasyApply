import React, { useEffect, useState } from "react";
import PillButton from "../components/PillButton";
import Section from "./Section";

/**
 * Skills section in profile page
 *
 * @returns JSX.Element content to be displayed
 */
const Skills = (props) => {
  const [skills, setSkills] = useState([]);

  useEffect(() => setSkills(props.skills), [props.skills]);

  const skillsDisplay = (
    <div className="flex flex-row w-full flex-wrap py-4">
      {skills &&
        skills.map((skill) => (
          <div key={skill} className="mx-4 mb-4">
            <PillButton
              children={skill}
              type="button"
              disabled={true}
              className="bg-tiffany-blue opacity-75"
            />
          </div>
        ))}
    </div>
  );

  return (
    <Section
      name="Skills"
      content={skillsDisplay}
      openEditModal={props.openEditModal}
    />
  );
};

export default Skills;
