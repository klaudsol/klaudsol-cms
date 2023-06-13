//This is the base class of all attribute types.


//All attribute types must inherit from this class.
export default class AttributeType {

    constructor({data, metadata}) {
      this.data = data;
      this.metadata = metadata;
    }

    static TEXT_CMS_TYPE = 'text';
    static TEXTAREA_CMS_TYPE = 'textarea';


    //By default, Grid View render and Icon View render is the same
    renderReadOnly() {

    }

    //Render this value in a Grid View
    //This returns a React component.
    renderGridView() {
      this.renderReadOnly();
    }

    //Render this value in Icon View
    //This returns a React component.
    renderIconView() {
      this.renderReadOnly();
    }

    //Render this value in the Admin
    //This returns a React component.
    renderAdmin() {

    }

    //Output as part of the final API response
    //This returns an object
    toApi() {

    }

    //serialize / commit to database, via EAV or other means.
    //returns boolean, true if the data has been successfully commited.
    save() {

    }

    props() {

    }

};