import React, { useEffect, useState } from "react";
import Section from "./Section";

/**
 * Summary section of profile page
 *
 * @returns JSX.Element content to be displayed
 */
const Summary = (props) => {
  const [summary, setSummary] = useState("");

  useEffect(() => setSummary(props.summary), [props.summary]);

  return (
    <Section
      name="Summary"
      content={<p>{summary}</p>}
      openEditModal={props.openEditModal}
    />
  );
};

export default Summary;
