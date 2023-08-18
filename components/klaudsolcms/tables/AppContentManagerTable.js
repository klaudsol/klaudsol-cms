import { slugTooltipText } from "constants";
import { RiQuestionLine } from "react-icons/ri";
import Link from "next/link";
import GeneralHoverTooltip from "components/elements/tooltips/GeneralHoverTooltip";
import { useCapabilities } from '@/components/hooks';
import { readContents } from "@/lib/Constants";
import { useEffect } from 'react';
import AttributeTypeFactory from '@/components/attribute_types/AttributeTypeFactory';

const ValueComponent = ({entry, attribute, metadata}) => {


  const attributeMetadata = metadata.attributes?.[attribute];
  const attributeTypeInstance = AttributeTypeFactory.create({data: entry[attribute], metadata: attributeMetadata});

  if(attributeTypeInstance) {
    //new AttributeType mechanism
    const Component = attributeTypeInstance.readOnlyComponent();
    return (<Component {...attributeTypeInstance.props()} />);

  } 
}

const AppContentManagerTable = ({ columns, entries, entity_type_slug, data, metadata }) => {

  const capabilities = useCapabilities();
  
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
                  href={`/admin/content-manager/${entity_type_slug}/${entry.slug}`}
                  passHref
                  legacyBehavior
                  key={index}
                  disabled={!capabilities.includes(readContents)}
                >
                  <td key={index}><ValueComponent entry={entry} attribute={col.accessor} metadata={metadata}/></td>
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
