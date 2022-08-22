import DB, {
  fieldsForSelect,
  fieldsForInsert,
  fieldsForUpdate,
  fieldParametersForInsert,
  executeStatementParamsForInsert,
  executeStatementParamsForUpdate,
  fromAurora,
  fromInsertAurora,
  fromDeleteAurora,
  sanitizeData,
  AURORA_TYPE,
} from "@backend/data_access/DB";
import Session from "@backend/models/core/Session";

class Template {
  //for adding, editing, and deleting certificate values
  /**
   * app_certificate_recipients
   * app_certificate_recipient_properties
   * app_certificate_templates
   *
   */
  static fields() {
    return {
      template_id: {
        auroraType: AURORA_TYPE.LONG,
        allowOnCreate: false,
        allowOnUpdate: false,
      },
      title: { auroraType: AURORA_TYPE.STRING, allowOnCreate: true },
      company_name: { auroraType: AURORA_TYPE.STRING, allowOnCreate: true },
      company_address: { auroraType: AURORA_TYPE.STRING, allowOnCreate: true },
      body: { auroraType: AURORA_TYPE.STRING, allowOnCreate: true },
      properties: { auroraType: JSON, allowOnCreate: true },
      sme_people_id: {
        auroraType: AURORA_TYPE.LONG,
        allowOnCreate: true,
        allowOnUpdate: true,
      },
      sme_tenant_id: {
        auroraType: AURORA_TYPE.LONG,
        allowOnCreate: true,
        allowOnUpdate: true,
      },
    };
  }

  static async all(session) {
    /**
     * display all the available templates for the tenant
     */
    console.log("Display Available Templated DB >>>>");
    const db = new DB();
    const session_data = await Session.getSession(session);
    const sme_tenant_id = session_data.sme_tenant_id;
    console.log(sme_tenant_id);
    const sql = `SELECT template.id, template.title, COUNT(recipient.template_id) as "certificate_count"
    from app_certificate_templates template LEFT JOIN  app_certificate_recipients recipient
    ON recipient.template_id = template.id
    WHERE template.sme_tenant_id = :sme_tenant_id
    group by template.id, template.title`;
    const availableTemplates = await db.exectuteStatement(sql, [
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
    ]);

    if (availableTemplates.records.length === 0) {
      return null;
    }

    return availableTemplates.records.map(
      ([
        { longValue: id },
        { stringValue: title },
        { longValue: certificate_count },
      ]) => ({
        id,
        title,
        certificate_count,
      })
    );
  }

  static async find(session, id) {
    /**
     * display the selected certificate by the user, requires
     * the recipient_id to fetch the attributes and values
     * of that certificate
     */

    const db = new DB();
    const session_data = await Session.getSession(session);
    const sme_tenant_id = session_data.sme_tenant_id;
    const _id = id;
    const sql = `SELECT id, sme_tenant_id, title, company_name, company_address, 
    body, logo_img, bg_img, color1, color2 FROM
    app_certificate_templates WHERE id = :id and sme_tenant_id = :sme_tenant_id ;`;
    const selectedTemplate = await db.exectuteStatement(sql, [
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
      { name: "id", value: { longValue: id } },
    ]);

    if (selectedTemplate.records.length === 0) {
      return null;
    }

    return selectedTemplate.records.map(
      ([
        { longValue: id },
        { longValue: sme_tenant_id },
        { stringValue: title },
        { stringValue: company_name },
        { stringValue: company_address },
        { stringValue: body },
        { stringValue: logo_img },
        { stringValue: bg_img },
        { stringValue: color1 },
        { stringValue: color2 },
      ]) => ({
        id,
        sme_tenant_id,
        title,
        company_name,
        company_address,
        body,
        logo_img,
        bg_img,
        color1,
        color2,
      })
    );
  }

  static async update({
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
  }) {
    /**
     * edits the template on the database
     * overwrites all values with upcoming changes
     */

    const db = new DB();
    const session_data = await Session.getSession(session);
    const sme_tenant_id = session_data.sme_tenant_id;
    console.log("ON EDIT TEMPLATE DB");
    const sql = `UPDATE app_certificate_templates 
    SET title = :title,
    company_name = :company_name,
    company_address = :company_address, 
    body = :body, 
    color1 = :color1,
    color2 = :color2,
    logo_img = :logo_location,
    bg_img = :bg_location
    WHERE id = :id and
    sme_tenant_id = :sme_tenant_id`;

    let executeStatementParam = [
      { name: "id", value: { longValue: id } },
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
      { name: "title", value: { stringValue: title } },
      { name: "company_name", value: { stringValue: company_name } },
      { name: "company_address", value: { stringValue: company_address } },
      { name: "body", value: { stringValue: body } },
      { name: "color1", value: { stringValue: color1 } },
      { name: "color2", value: { stringValue: color2 } },
      { name: "logo_location", value: { stringValue: logo_location } },
      { name: "bg_location", value: { stringValue: bg_location } },
    ];
    const data = await db.exectuteStatement(sql, executeStatementParam);

    return true;
  }

  static async create({
    session,
    logo_location,
    bg_location,
    title,
    company_name,
    company_address,
    body,
    color1,
    color2,
  }) {
    /**
     * add the a recipient certificate to the database
     */
    console.log("TEMPLATES addTemplate >>>");
    const db = new DB();
    const session_data = await Session.getSession(session);
    const sme_tenant_id = session_data.sme_tenant_id;
    const sql = `INSERT into app_certificate_templates
    (sme_tenant_id, logo_img, bg_img, title, company_name, company_address, body, color1, color2) VALUES
    (:sme_tenant_id, :logo_location, :bg_location, :title, :company_name, :company_address, :body, :color1, :color2);`;

    let executeStatementParam = [
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
      { name: "logo_location", value: { stringValue: logo_location } },
      { name: "bg_location", value: { stringValue: bg_location } },
      { name: "title", value: { stringValue: title } },
      { name: "company_name", value: { stringValue: company_name } },
      { name: "company_address", value: { stringValue: company_address } },
      { name: "body", value: { stringValue: body } },
      { name: "color1", value: { stringValue: color1 } },
      { name: "color2", value: { stringValue: color2 } },
    ];

    const data = await db.exectuteStatement(sql, executeStatementParam);

    return true;
  }

  static async delete(session, id) {
    /**
     * deletes a template from the database
     * does not delete if the template contains certificates/recipients
     */

    //delete the properties first
    const db = new DB();
    const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
    const sme_tenant_id = session_data.sme_tenant_id;
    const sql = `DELETE from app_certificate_templates WHERE 
    id = :id and sme_tenant_id = :sme_tenant_id`;

    const data = await db.exectuteStatement(sql, [
      { name: "id", value: { longValue: id } },
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
    ]);

    return true;
  }


  constructor(rawData) {
    Object.assign(this, sanitizeData(rawData, Template.fields()));
  }

  getIDValue() {
    return `${this.template_id}`;
  }
}

export default Template;
