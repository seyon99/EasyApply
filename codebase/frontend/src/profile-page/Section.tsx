import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { isMobile } from "react-device-detect";
/**
 *
 * @param props SectionRequirements to specify some useful styling
 * @returns JSX.Element content to be displayed
 */
const Section = (props) => {
  const [showEditButton, setShowEditButton] = useState(false);
  return (
    <div
      className="relative mb-16 border-2 border-gray-100 grid"
      onMouseOver={() => setShowEditButton(true)}
      onMouseLeave={() => setShowEditButton(false)}
    >
      <div className="bg-tiffany-blue opacity-75 w-full py-2 pl-4 text-white text-2xl">
        {(showEditButton || isMobile) && (
          <FaPencilAlt
            className="inline m-0 absolute right-5 cursor-pointer"
            onClick={() => props.openEditModal()}
          />
        )}
        <p>{props.name}</p>
      </div>
      <div className="p-4">{props.content}</div>
    </div>
  );
};

export default Section;
