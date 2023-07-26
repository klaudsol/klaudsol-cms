import AttributeType from '@/components/attribute_types/AttributeType';
import TextAttributeType from "@/components/attribute_types/TextAttributeType";
import TextareaAttributeType from "@/components/attribute_types/TextareaAttributeType";
import LegacyAttributeType from '@/components/attribute_types/LegacyAttributeType';
import { plugin } from '@/components/plugin/plugin';
import RichTextAttributeType from '@/components/attribute_types/RichTextAttributeType';
import FileAtrributeType from './FileAttributeType';

export default class AttributeTypeFactory {
  static create({data, metadata}) {
    switch(metadata?.type) {
      case AttributeType.TEXT_CMS_TYPE:
        return new TextAttributeType({data, metadata});
      case AttributeType.TEXTAREA_CMS_TYPE:
        return new TextareaAttributeType({data, metadata});
      case AttributeType.RICH_TEXT_CMS_TYPE:
        return new RichTextAttributeType({data, metadata});
      case AttributeType.FILE_CMS_TYPE:
        return new FileAtrributeType({data, metadata});
      case AttributeType.CUSTOM:
        const CustomAttributeType = plugin(metadata.custom_name);
        return new CustomAttributeType({data, metadata});
      default:
        return new LegacyAttributeType({data, metadata});;
    }
  }
}