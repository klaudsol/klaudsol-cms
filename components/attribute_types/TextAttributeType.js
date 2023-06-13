import AttributeType from '@/components/attribute_types/AttributeType';

const TextAttributeReadOnlyComponent = ({text}) => {
    return (
        <>{text}</>
    );
}

export default class TextAttributeType extends AttributeType {
    renderReadOnly() {
        return TextAttributeReadOnlyComponent;
    }

    props() {
        const text = this.data;
        return {text}
    }

}