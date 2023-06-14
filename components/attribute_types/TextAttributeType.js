import AttributeType from '@/components/attribute_types/AttributeType';

const TextAttributeReadOnlyComponent = ({text}) => {
    return (
        <>{text}</>
    );
}

export default class TextAttributeType extends AttributeType {
    readOnlyComponent() {
        return TextAttributeReadOnlyComponent;
    }
}