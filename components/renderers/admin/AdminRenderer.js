import { CMS_TYPES } from "@/components/cmsTypes";
import TextRenderer from "./TextRenderer";
import TextAreaRenderer from "./TextAreaRenderer";
import FloatRenderer from "./FloatRenderer";
import CheckboxRenderer from "./CheckboxRenderer";
import UploadRenderer from "./UploadRenderer.js";
import RadioRenderer from "./RadioRenderer";
import PasswordRenderer from "./PasswordRenderer";
import { validImageTypes } from "@/lib/Constants";

const AdminRenderer = ({ type, ...params }) => {
  switch (type) {
    case CMS_TYPES.LINK:
    case CMS_TYPES.TEXT:
      return <TextRenderer type={type} {...params} />;
    case CMS_TYPES.PASSWORD:
      return <PasswordRenderer type={type} {...params} />;
    case CMS_TYPES.CHECKBOX:
      return <CheckboxRenderer type={type} {...params} />;
    case CMS_TYPES.RADIO:
      return <RadioRenderer type={type} {...params} />;
    case CMS_TYPES.IMAGE:
      return <UploadRenderer accept={validImageTypes} {...params} />;
    case CMS_TYPES.TEXT_AREA:
      return <TextAreaRenderer type={type} {...params} />;
    case CMS_TYPES.FLOAT:
      return <FloatRenderer type={type} {...params} />;
    default:
      return null;
  }
};

export default AdminRenderer;
