import { CMS_TYPES } from "@/components/cmsTypes";
import TextRenderer from "./TextRenderer";
import TextAreaRenderer from "./TextAreaRenderer";
import FloatRenderer from "./FloatRenderer";

const AdminRenderer = ({ type, ...params }) => {
  switch (type) {
    case CMS_TYPES.TEXT:
    case CMS_TYPES.LINK:
    case CMS_TYPES.IMAGE:
      return <TextRenderer type={type} {...params} />;
    case CMS_TYPES.TEXT_AREA:
      return <TextAreaRenderer type={type} {...params} />;
    case CMS_TYPES.FLOAT:
      return <FloatRenderer type={type} {...params} />;
    default:
      return null;
  }
};
export default AdminRenderer;
