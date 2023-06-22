//This is not an actual attribute type,
//but this is where we put legacy code before we can refactor them in 
//the future

import AttributeType from '@/components/attribute_types/AttributeType';

const LegacyAttributeReadOnlyComponent = ({text}) => {
    return (
        <>{text}</>
    );
}
  //TODO: Refactor
  const formatSpecialDataTypes = (data) => {
    if (Array.isArray(data)) return `${data.length} item/s`; // Checks if its an attribute w/ multiple values
    else if (typeof data === "object" && data?.link) return data?.name; // Checks if its an image
    else if (typeof data === "object") return JSON.stringify(data); //Unsupported object. Will need to do this until the OOP solution becomes available.
    else if (typeof data === "boolean") return data ? "Yes" : "No"

    return data;
  };

export default class LegacyAttributeType extends AttributeType {
    readOnlyComponent() {
        return LegacyAttributeReadOnlyComponent;
    }

    props() {
        const text = formatSpecialDataTypes(this.data);
        return {text: text ?? null}
    }

}