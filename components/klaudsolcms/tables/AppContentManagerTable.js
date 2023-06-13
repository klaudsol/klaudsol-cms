import { slugTooltipText } from "constants";
import { RiQuestionLine } from "react-icons/ri";
import Link from "next/link";
import GeneralHoverTooltip from "components/elements/tooltips/GeneralHoverTooltip";
import { useCapabilities } from '@/components/hooks';
import { readContents } from "@/lib/Constants";
import { useEffect } from 'react';
import AttributeTypeFactory from '@/components/attribute_types/AttributeTypeFactory';

const AppContentManagerTable = ({ columns, entries, entity_type_slug, data, metadata }) => {

  const MAX_STRING_LENGTH = 50;
  const capabilities = useCapabilities();

  const displayReadOnly = (entry, attribute) => {

    //System attributes
    if(attribute === 'id' || attribute === 'slug') {
      return entry[attribute];
    }

    const type = metadata.attributes?.[attribute]?.type;
    const attributeTypeInstance = AttributeTypeFactory.create({data: entry[attribute], metadata: {type}});

    if(attributeTypeInstance) {
      //new AttributeType mechanism
      const Component = attributeTypeInstance.renderReadOnly();
      return (<Component {...attributeTypeInstance.props()} />);

    } else {
      //fallback to old mechanism
      //until this can be removed completely
      return truncate(formatSpecialDataTypes(entry, attribute));
    }

  }

  const formatSpecialDataTypes = (entry, accessor) => {
    //TODO: Create a more object-oriented solution for this
    if (Array.isArray(entry[accessor])) return `${entry[accessor].length} item/s`; // Checks if its an attribute w/ multiple values
    else if (typeof entry[accessor] === "object" && entry[accessor]?.link) return entry[accessor]?.name; // Checks if its an image
    else if (typeof entry[accessor] === "object") return ""; //Unsupported object. Will need to do this until the OOP solution becomes available.
    else if (typeof entry[accessor] === "boolean") return entry[accessor] ? "Yes" : "No"

    return entry[accessor];
  };

  const truncate = (string)  => {
    return (string?.length && string.length > MAX_STRING_LENGTH) ? `${string.slice(0, MAX_STRING_LENGTH)}...` : string;   
  }

  useEffect(() => {

  }, []);

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
                  <td key={index}>{displayReadOnly(entry, col.accessor)}</td>
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
