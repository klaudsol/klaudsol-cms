import Certificate from "@backend/models/apps/certificate/Certificate";
import RecordNotFound from "@/components/errors/RecordNotFound";
import { withSession } from "@/lib/Session";
import { defaultErrorHandler } from "@/lib/ErrorHandler";
import { INTERNAL_SERVER_ERROR } from "@/lib/HttpStatuses";

export default withSession(fetchCertificate);

async function fetchCertificate(req, res) {
  const {
    template_id = null,
    certificate_name = null,
    certificate_id = null,
    certificate_properties = null,
  } = req.body;

  //Fetching User info
  try {
    //Restful API working.
    switch (req.method) {
      case "POST":
        return addCertificate(req, res);
      case "GET":
        if (req.query.id) {
          return viewCertificateProperties(req, res);
        } else if (req.query.certificate_id) {
          return viewCertificateByID(req, res);
        } else {
          return viewCertificates(req, res);
        }
      case "PUT":
        return editCertificate(req, res);
      case "DELETE":
        return deleteCertificate(req, res);
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  } catch (error) {
    await defaultErrorHandler(error, req, res);
  }

  async function addCertificate(req, res) {
    try {
      const { session_token: session } = req.session;
      await Certificate.create({
        session,
        template_id,
        certificate_name,
        certificate_id,
        certificate_properties,
      });
      res
        .status(200)
        .json({ message: "Certificate has been added successfully!" });
    } catch (error) {
      if (error instanceof RecordNotFound) {
        res
          .status(INTERNAL_SERVER_ERROR)
          .json({ message: "Error adding certificate" });
        return;
      } else {
        await defaultErrorHandler(error, req, res);
      }
    }
  }

  async function viewCertificates(req, res) {
    try {
      const { session_token } = req.session;
      const available_certificates = await Certificate.all(session_token);
      if (available_certificates == null) {
        res.status(200).json([]);
      } else {
        res.status(200).json(available_certificates);
      }
    } catch (ex) {
      await log(ex.stack);
      res.status(COMMUNICATION_LINKS_FAILURE).json({ message: ex });
    }
  }

  async function viewCertificateByID(req, res) {
    try {
      console.log("Handler >>>");
      const { certificate_id: certificateID = null } = req.query;
      //console.log(id);
      const selected_certificate = await Certificate.find(certificateID);
      if (selected_certificate == null) {
        res.status(200).json([]);
      } else {
        res.status(200).json(selected_certificate);
      }
    } catch (ex) {
      await log(ex.stack);
      res.status(COMMUNICATION_LINKS_FAILURE).json({ message: ex });
    }
  }

  async function viewCertificateProperties(req, res) {
    try {
      const { session_token } = req.session;

      const { id: id = null } = req.query;
      const selected_certificate = await Certificate.getProperties(
        session_token,
        id
      );
      if (selected_certificate == null) {
        res.status(200).json([]);
      } else {
        res.status(200).json(selected_certificate);
      }
    } catch (ex) {
      await log(ex.stack);
      res.status(COMMUNICATION_LINKS_FAILURE).json({ message: ex });
    }
  }

  async function editCertificate(req, res) {
    const {
      selectedRecipientID = null,
      selectedTemplateID = null,
      selectedName = null,
      selectedCertificate = null,
    } = req.body;

    try {
      const { session_token: session } = req.session;
      await Certificate.update({
        session,
        selectedRecipientID,
        selectedTemplateID,
        selectedName,
        selectedCertificate,
      });
      res
        .status(200)
        .json({ message: "Certificate has been updated successfully!" });
    } catch (error) {
      if (error instanceof RecordNotFound) {
        res
          .status(INTERNAL_SERVER_ERROR)
          .json({ message: "Error changing certificate values" });
        return;
      } else {
        await defaultErrorHandler(error, req, res);
      }
    }
  }

  async function deleteCertificate(req, res) {
    const { id = null } = req.body;
    try {
      const { session_token } = req.session;
      const isCertificateDeleted = await Certificate.delete(session_token, id);
      if (isCertificateDeleted) {
        res
          .status(200)
          .json({ message: "Certificate has been deleted successfully." });
      } else {
        res.status(400).json({ message: "No session found." });
      }
    } catch (error) {
      await defaultErrorHandler(error, req, res);
    }
  }
}
