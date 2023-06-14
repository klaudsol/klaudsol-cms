import AttributeType from '@/components/attribute_types/AttributeType';

const MAX_STRING_LENGTH = 50;

const truncate = (string)  => {
return (string?.length && string.length > MAX_STRING_LENGTH) ? `${string.slice(0, MAX_STRING_LENGTH)}...` : string;   
}

const TextareaAttributeReadOnlyComponent = ({text}) => {
    return (
        <>{truncate(text)}</>
    );
}

export default class TextareaAttributeType extends AttributeType {
    readOnlyComponent() {
        return TextareaAttributeReadOnlyComponent;
    }
}