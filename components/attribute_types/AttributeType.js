//This is the base class of all attribute types.


//All attribute types must inherit from this class.
export default class AttributeType {

    constructor(params) {
      this.data = params?.data;
      this.metadata = params?.metadata;
    }

    static TEXT_CMS_TYPE = 'text';
    static TEXTAREA_CMS_TYPE = 'textarea';
    static RICH_TEXT_CMS_TYPE = 'rich-text';
    static DATETIME_CMS_TYPE = 'date-time';
    static CUSTOM = 'custom';


    //By default, Grid View render and Icon View render is the same
    readOnlyComponent() {

    }

    //Render this value in a Grid View
    //This returns a React component.
    renderGridView() {
      this.readOnlyComponent();
    }

    //Render this value in Icon View
    //This returns a React component.
    renderIconView() {
      this.readOnlyComponent();
    }

    //Render this value in the Admin
    //This returns a React component.
    editableComponent() {

    }

    //Output as part of the final API response
    //This returns an object
    toApi() {

    }

    //serialize / commit to database, via EAV or other means.
    //returns boolean, true if the data has been successfully commited.
    save() {

    }

    //This is the props of the relevant components of this attribute type
    props() {
        const text = this.data;
        return {text}
    }

};