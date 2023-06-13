import AttributeType from '@/components/attribute_types/AttributeType';
import TextAttributeType from "@/components/attribute_types/TextAttributeType";
import TextareaAttributeType from "@/components/attribute_types/TextareaAttributeType";
import LegacyAttributeType from '@/components/attribute_types/LegacyAttributeType';

export default class AttributeTypeFactory {

    static create({data, metadata}) {

      const { type } = metadata;
      switch(type) {

        case AttributeType.TEXT_CMS_TYPE:
          return new TextAttributeType({data, metadata});
        case AttributeType.TEXTAREA_CMS_TYPE:
          return new TextareaAttributeType({data, metadata});
        default:
          return new LegacyAttributeType({data, metadata});;

      }
    }
}