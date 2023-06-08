import { CMS_TYPES } from "@/components/cmsTypes";
import TextRenderer from "./TextRenderer";
import TextAreaRenderer from "./TextAreaRenderer";
import FloatRenderer from "./FloatRenderer";
import UploadRenderer from "./UploadRenderer.js";
import GalleryRenderer from "./GalleryRenderer.js";
import PasswordRenderer from "./PasswordRenderer";
import CheckboxRenderer from "./CheckboxRenderer";
import { validImageTypes, validVideoTypes } from "@/lib/Constants";
import VideoRenderer from "./VideoRenderer";

const AdminRenderer = ({ type, ...params }) => {
  switch (type) {
    case CMS_TYPES.LINK:
    case CMS_TYPES.TEXT:
      return <TextRenderer type={type} {...params} />;
    case CMS_TYPES.PASSWORD:
      return <PasswordRenderer type={type} {...params} />;
    case CMS_TYPES.CHECKBOX:
      return <CheckboxRenderer type={type} {...params} />;
    case CMS_TYPES.IMAGE:
      return <UploadRenderer accept={validImageTypes} {...params} />;
    case CMS_TYPES.GALLERY:
      return <GalleryRenderer accept={validImageTypes} {...params} />;
    case CMS_TYPES.TEXT_AREA:
      return <TextAreaRenderer type={type} {...params} />;
    case CMS_TYPES.FLOAT:
      return <FloatRenderer type={type} {...params} />;
    case CMS_TYPES.VIDEO:
      return <VideoRenderer accept={validVideoTypes} {...params} />;
    default:
      return null;
  }
};

export default AdminRenderer;
