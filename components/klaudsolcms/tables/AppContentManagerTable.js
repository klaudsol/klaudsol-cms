import { slugTooltipText } from "constants";
import { RiQuestionLine } from "react-icons/ri";
import Link from "next/link";
import GeneralHoverTooltip from "components/elements/tooltips/GeneralHoverTooltip";
import { useCapabilities } from '@/components/hooks';
import { readContents } from "@/lib/Constants";

const AppContentManagerTable = ({ columns, entries, entity_type_slug }) => {

  const MAX_STRING_LENGTH = 50;
  const capabilities = useCapabilities();

  const formatSpecialDataTypes = (entry, accessor) => {
    if (Array.isArray(entry[accessor])) return `${entry[accessor].length} item/s`; // Checks if its an attribute w/ multiple values
    else if (typeof entry[accessor] === "object" && entry[accessor]?.link) return entry[accessor]?.name; // Checks if its an image

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
                  <td key={index}>{truncate(formatSpecialDataTypes(entry, col.accessor))}</td>
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
