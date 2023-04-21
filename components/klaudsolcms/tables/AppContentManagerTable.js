import { slugTooltipText } from "constants";
import { RiQuestionLine } from "react-icons/ri";
import Link from "next/link";
import GeneralHoverTooltip from "components/elements/tooltips/GeneralHoverTooltip";
import { useCapabilities } from '@/components/hooks';
import { readContents } from "@/lib/Constants";

const AppContentManagerTable = ({ columns, entries, entity_type_slug }) => {

  const MAX_STRING_LENGTH = 50;
  const capabilities = useCapabilities();
  // If entry is an object, chances are its a file uploaded to S3.
  // Files uploaded to S3 should have an originalname property

  const checkEntryIfObject = (entry, accessor) => {
    if (typeof entry[accessor] === "object") return entry[accessor]?.name;
    return entry[accessor];
  };

  const truncate = (string)  => {
    return (string?.length && string.length > MAX_STRING_LENGTH) ? `${string.slice(0, MAX_STRING_LENGTH)}...` : string;   
  }

  return (
    <div id="table_general_main">
      <table id="table_general">
        {/*table head*/}
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>
                {col.displayName === 'SLUG' ?  
                <>
                {col.displayName}
                <GeneralHoverTooltip 
                  icon={<RiQuestionLine className="general-tooltip-icon"/>}
                  className="general-table-header-slug"
                  tooltipText={slugTooltipText}
                  position="top"
                /> 
                </> : col.displayName}
              </th>
            ))}
          </tr>
        </thead>
        {/*table body*/}
        <tbody>
          {entries.map((entry, i) => (
            <tr key={i}>
              {columns.map((col, index) => (
                <Link
                  href={`/admin/content-manager/${entity_type_slug}/${entry.id}`}
                  passHref
                  legacyBehavior
                  key={index}
                  disabled={!capabilities.includes(readContents)}
                >
                  <td key={index}>{truncate(checkEntryIfObject(entry, col.accessor))}</td>
                </Link>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppContentManagerTable;
