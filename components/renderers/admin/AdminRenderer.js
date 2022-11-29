import { CMS_TYPES } from '@/components/cmsTypes';
import TextRenderer from './TextRenderer';
import TextAreaRenderer from './TextAreaRenderer';
import FloatRenderer from './FloatRenderer';

export default function AdminRenderer({type, ...params}) {
  switch(type) {
    case CMS_TYPES.TEXT:
    case CMS_TYPES.LINK:
    case CMS_TYPES.IMAGE:
      return <TextRenderer {...params} />;
    case CMS_TYPES.TEXT_AREA:
      return <TextAreaRenderer {...params} />;
    case CMS_TYPES.FLOAT:
      return <FloatRenderer {...params} />;
    default: 
      return null;
  } 
};