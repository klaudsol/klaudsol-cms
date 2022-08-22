import Template from "@backend/models/apps/certificate/Template";
import RecordNotFound from "@/components/errors/RecordNotFound";
import { withSession } from "@/lib/Session";
import { defaultErrorHandler } from "@/lib/ErrorHandler";
import { INTERNAL_SERVER_ERROR } from "@/lib/HttpStatuses";

export default withSession(fetchTemplate);

async function fetchTemplate(req, res) {
  const {
    logo_location = null,
    bg_location = null,
    title = null,
    company_name = null,
    company_address = null,
    body = null,
    color1 = null,
    color2 = null,
  } = req.body;

  //Fetching User info
  try {
    //Restful API working.
    switch (req.method) {
      case "POST":
        return addTemplate(req, res);
      case "GET":
        if (req.query.id) {
          return viewTemplateByID(req, res);
        } else {
          return viewTemplates(req, res);
        }
      case "PUT":
        return editTemplate(req, res);
      case "DELETE":
        return deleteTemplate(req, res);
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }
  //posting certificate

  async function addTemplate(req, res) {
    try {
      const { session_token: session } = req.session;
      await Template.create({
        session,
        logo_location,
        bg_location,
        title,
        company_name,
        company_address,
        body,
        color1,
        color2,
      });
      res
        .status(200)
        .json({ message: "Template has been added successfully!" });
    } catch (error) {
      if (error instanceof RecordNotFound) {
        res
          .status(INTERNAL_SERVER_ERROR)
          .json({ message: "Error adding template" });
        return;
      } else {
        await defaultErrorHandler(error, req, res);
      }
    }
  }
  async function viewTemplates(req, res) {
    try {
      const { session_token } = req.session;
      const available_templates = await Template.all(session_token);
      if (available_templates == null) {
        res.status(200).json([]);
      } else {
        res.status(200).json(available_templates);
      }
    } catch (ex) {
      res.status(COMMUNICATION_LINKS_FAILURE).json({ message: ex });
    }
  }
  async function viewTemplateByID(req, res) {
    try {
      console.log("Handler >>>");
      const { session_token } = req.session;
      const { id: id = null } = req.query;
      const data = await Template.find(session_token, id);
      if (data == null) {
        res.status(200).json([]);
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      await defaultErrorHandler(error, req, res);
    }
  }
  async function editTemplate(req, res) {
    const {
      id = null,
      title = null,
      company_name = null,
      company_address = null,
      body = null,
      logo_location = null,
      bg_location = null,
      color1 = null,
      color2 = null,
    } = req.body;

    try {
      console.log("edit handler >>>");
      const { session_token: session } = req.session;
      await Template.update({
        session,
        id,
        title,
        company_name,
        company_address,
        body,
        logo_location,
        bg_location,
        color1,
        color2,
      });
      res
        .status(200)
        .json({ message: "Template has been updated successfully!" });
    } catch (error) {
      if (error instanceof RecordNotFound) {
        res
          .status(INTERNAL_SERVER_ERROR)
          .json({ message: "Error changing template values" });
        return;
      } else {
        await defaultErrorHandler(error, req, res);
      }
    }
  }
  async function deleteTemplate(req, res) {
    const { id = null } = req.body;
    try {
      const { session_token } = req.session;
      const isCertificateDeleted = await Template.delete(session_token, id);
      if (isCertificateDeleted) {
        res
          .status(200)
          .json({ message: "Template has been deleted successfully." });
      } else {
        res.status(400).json({ message: "No session found." });
      }
    } catch (error) {
      await defaultErrorHandler(error, req, res);
    }
  }
}
