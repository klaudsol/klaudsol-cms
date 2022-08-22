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

class CertificateTemplate {
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
     * Display all the certificates of the tenant
     */
    const db = new DB();
    const session_data = await Session.getSession(session);
    const sme_tenant_id = session_data.sme_tenant_id;
    const sql = `SELECT app_certificate_recipients.id, app_certificate_templates.id as template_id, 
                  app_certificate_recipients.certificate_id,
                  app_certificate_recipients.certificate_name, app_certificate_templates.title 
                  from app_certificate_recipients
                  LEFT JOIN app_certificate_templates ON
                  app_certificate_recipients.template_id = app_certificate_templates.id 
                  WHERE app_certificate_templates.sme_tenant_id = :sme_tenant_id`;
    const availableCertificates = await db.exectuteStatement(sql, [
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
    ]);

    if (availableCertificates.records.length === 0) {
      return null;
    }

    return availableCertificates.records.map(
      ([
        { longValue: id },
        { longValue: template_id },
        { stringValue: certificate_id },
        { stringValue: certificate_name },
        { stringValue: title },
      ]) => ({
        id,
        template_id,
        certificate_id,
        certificate_name,
        title,
      })
    );
  }
  static async find(certificate_id) {
    /**
     * display the selected certificate by the user, requires
     * the recipient_id to fetch the attributes and values
     * of that certificate
     */
    console.log("GET CERTIFICATE BY ID >>>");
    console.log(certificate_id);
    const db = new DB();

    const sql = `SELECT template_id, title, company_name, company_address,
      body, logo_img, bg_img, color1, color2, certificate._key, certificate._value from
      (SELECT template.id as template_id, recipient.certificate_name as certificate_name, 
      property._key as _key, property._value as _value,
      template.title as title, template.company_name as company_name,
      template.company_address as company_address,
      template.body as body, template.logo_img as logo_img,
      template.bg_img as bg_img, template.color1 as color1,
      template.color2 as color2
      FROM
      app_certificate_templates template,
      app_certificate_recipients recipient,
      app_certificate_recipient_properties property
      where (template.id = recipient.template_id)
      and (recipient.id = property.recipient_id)
      and (recipient.certificate_id = :certificate_id)
      ORDER BY recipient.id, property.id)certificate;`;
    const selectedCertificate = await db.exectuteStatement(sql, [
      { name: "certificate_id", value: { stringValue: certificate_id } },
    ]);

    if (selectedCertificate.records.length === 0) {
      return null;
    }

    return selectedCertificate.records.map(
      ([
        { longValue: template_id },
        { stringValue: title },
        { stringValue: company_name },
        { stringValue: company_address },
        { stringValue: body },
        { stringValue: logo_img },
        { stringValue: bg_img },
        { stringValue: color1 },
        { stringValue: color2 },
        { stringValue: _key },
        { stringValue: _value },
      ]) => ({
        template_id,
        title,
        company_name,
        company_address,
        body,
        logo_img,
        bg_img,
        color1,
        color2,
        _key,
        _value,
      }) //returning multiple key value pairs from the tables selected
    );
  }

  static async getProperties(session, id) {
    /**
     * display the selected certificate by the user, requires
     * the recipient_id to fetch the attributes and values
     * of that certificate
     */

    const db = new DB();
    const session_data = await Session.getSession(session);
    const sme_tenant_id = session_data.sme_tenant_id;
    const _id = id;
    const sql = `SELECT template_id, certificate._key, certificate._value from
      (SELECT template.id as template_id, recipient.certificate_name, 
      property._key as _key, property._value as _value from
      app_certificate_templates template,
      app_certificate_recipients recipient,
      app_certificate_recipient_properties property
      where (template.id = recipient.template_id)
      and (recipient.id = property.recipient_id)
      and (recipient.id = :id)
      and (template.sme_tenant_id = :sme_tenant_id)
      ORDER BY recipient.id, property.id)certificate;`;
    const selectedCertificate = await db.exectuteStatement(sql, [
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
      { name: "id", value: { longValue: id } },
    ]);

    if (selectedCertificate.records.length === 0) {
      return null;
    }

    return selectedCertificate.records.map(
      ([
        { longValue: template_id },
        { stringValue: _key },
        { stringValue: _value },
      ]) => ({
        template_id,
        _key,
        _value,
      })
    );
  }

  static async update({
    session,
    selectedRecipientID,
    selectedTemplateID,
    selectedName,
    selectedCertificate,
  }) {
    /**
     * edits the certificates of the recipients
     * change certificate name and template type
     * change the key-value pairs
     */

    // edits template id and certificate name of certificate
    const db = new DB();
    const session_data = await Session.getSession(session);
    const sme_tenant_id = session_data.sme_tenant_id;

    const sql = `UPDATE app_certificate_recipients SET certificate_name = :selectedName
      WHERE id = :selectedRecipientID;
      `;
    let executeStatementParam = [
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
      {
        name: "selectedRecipientID",
        value: { longValue: selectedRecipientID },
      },
      { name: "selectedName", value: { stringValue: selectedName } },
    ];
    const data = await db.exectuteStatement(sql, executeStatementParam);

    //edits the template of the certificate
    const sql_1 = `UPDATE app_certificate_recipients SET template_id = :selectedTemplateID
      WHERE id = :selectedRecipientID;`;
    let executeStatementParam_1 = [
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
      {
        name: "selectedRecipientID",
        value: { longValue: selectedRecipientID },
      },
      { name: "selectedTemplateID", value: { longValue: selectedTemplateID } },
    ];

    const data_1 = await db.exectuteStatement(sql_1, executeStatementParam_1);

    //delete all the properties on the table
    const sql_2 = `DELETE from app_certificate_recipient_properties where recipient_id = :selectedRecipientID
     and app_certificate_recipient_properties.sme_tenant_id = :sme_tenant_id`;
    let executeStatementParam_2 = [
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
      {
        name: "selectedRecipientID",
        value: { longValue: selectedRecipientID },
      },
    ];

    const data_2 = await db.exectuteStatement(sql_2, executeStatementParam_2);

    //will insert the properties on the table
    if (selectedCertificate != 0) {
      var query = `INSERT INTO app_certificate_recipient_properties (sme_tenant_id, recipient_id, _key, _value) VALUES ${selectedCertificate
        .map(
          (certificate, index) =>
            `(${sme_tenant_id}, ${selectedRecipientID}, "${certificate._key}", "${certificate._value}")`
        )
        .join(",")} `;

      let executeStatementParam = selectedCertificate.reduce(
        (collector, certificate, index) => {
          return [
            ...collector,
            ...[
              {
                name: `sme_tenant_id_${index}`,
                value: { longValue: sme_tenant_id },
              },
              {
                name: `recipient_id_${index}`,
                value: { longValue: selectedRecipientID },
              },
              {
                name: `key_${index}`,
                value: { stringValue: certificate._key },
              },
              {
                name: `value_${index}`,
                value: { stringValue: certificate._value },
              },
            ],
          ];
        },
        []
      );
      const data_3 = await db.exectuteStatement(query, executeStatementParam);
    }

    return true;
  }

  static async create({
    session,
    template_id,
    certificate_name,
    certificate_id,
    certificate_properties,
  }) {
    /**
     * add the a recipient certificate to the database
     */
    const db = new DB();
    const session_data = await Session.getSession(session);
    const sme_tenant_id = session_data.sme_tenant_id;
    const sql = `INSERT into app_certificate_recipients
      (certificate_name, sme_tenant_id, template_id, certificate_id) 
      VALUES (:certificate_name, :sme_tenant_id, :template_id, :certificate_id);`;

    let executeStatementParam = [
      { name: "certificate_name", value: { stringValue: certificate_name } },
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
      { name: "template_id", value: { longValue: template_id } },
      { name: "certificate_id", value: { stringValue: certificate_id } },
    ];

    const data = await db.exectuteStatement(sql, executeStatementParam);

    if (certificate_properties.length != 0) {
      var selectedRecipientID = data.generatedFields[0].longValue; //get the ID of the newly inserted certificate
      var query = `INSERT INTO app_certificate_recipient_properties (sme_tenant_id, recipient_id, _key, _value) VALUES ${certificate_properties
        .map(
          (certificate, index) =>
            `(${sme_tenant_id}, ${selectedRecipientID}, "${certificate._key}", "${certificate._value}")`
        )
        .join(",")} `;

      let executeStatementParam = certificate_properties.reduce(
        (collector, certificate, index) => {
          return [
            ...collector,
            ...[
              {
                name: `sme_tenant_id_${index}`,
                value: { longValue: sme_tenant_id },
              },
              {
                name: `recipient_id_${index}`,
                value: { longValue: selectedRecipientID },
              },
              {
                name: `key_${index}`,
                value: { stringValue: certificate._key },
              },
              {
                name: `value_${index}`,
                value: { stringValue: certificate._value },
              },
            ],
          ];
        },
        []
      );
      const data_3 = await db.exectuteStatement(query, executeStatementParam);
    }

    return true;
  }

  static async delete(session, id) {
    /**
     * deletes a recipient certificate with all its properties
     * remove a recipient
     * remove all the properties connected to that recipient
     */

    //delete the properties first
    const db = new DB();
    const session_data = await Session.getSession(session); // gets people_id and sme_tenant_id based on session
    const sme_tenant_id = session_data.sme_tenant_id;
    const sql = `DELETE from app_certificate_recipient_properties
      where recipient_id = :id and sme_tenant_id = :sme_tenant_id`;
    const data = await db.exectuteStatement(sql, [
      { name: "id", value: { longValue: id } },
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
    ]);

    //then delete the recipient
    const sql_1 = `DELETE from app_certificate_recipients where id = :id
      and sme_tenant_id = :sme_tenant_id`;
    const data_1 = await db.exectuteStatement(sql_1, [
      { name: "id", value: { longValue: id } },
      { name: "sme_tenant_id", value: { longValue: sme_tenant_id } },
    ]);

    return true;
  }

  constructor(rawData) {
    Object.assign(this, sanitizeData(rawData, CertificateTemplate.fields()));
  }

  getIDValue() {
    return `${this.template_id}`;
  }
}

export default CertificateTemplate;
