class App {
  fields = [
    "name",
    "icon_type",
    "icon_class_name",
    "icon_color",
    "icon",
    "code_ready",
  ];

  constructor(rawObject) {
    const sanitizedObject = Object.fromEntries(
      Object.entries(rawObject).filter(([key, value]) =>
        this.fields.includes(key)
      )
    );
    Object.assign(this, sanitizedObject);
  }

  //Convention over configuration
  appPath() {
    return `app/${this.name?.toLowerCase()}`;
  }

  componentPath() {
    return this.name?.toLowerCase();
  }

  iconObject() {
    return this._toIconObject(this.icon);
  }

  _toIconObject(iconString) {
    return "";
  }

  static sampleApps() {
    //Refactor to database
    const rawApps = [
      {
        name: "Payroll",
        icon_type: "coreui",
        icon_class_name: "bg-info",
        icon_color: null,
        Icon: null,
        code_ready: false,
      },
      {
        name: "Inventory",
        icon_type: "coreui",
        icon_class_name: "bg-warning",
        icon_color: null,
        Icon: null,
        code_ready: false,
      },
      {
        name: "eCommerce",
        icon_type: "coreui",
        icon_class_name: "bg-success",
        icon_color: null,
        Icon: null,
        code_ready: false,
      },
      {
        name: "Customers",
        icon_type: "coreui",
        icon_class_name: "",
        icon_color: "#BA0F30",
        Icon: null,
        code_ready: false,
      },
      {
        name: "Settings",
        icon_type: "coreui",
        icon_class_name: "",
        icon_color: "#A8BBB0",
        Icon: null,
        code_ready: false,
      },
      {
        name: "Trucking",
        icon_type: "coreui",
        icon_class_name: "",
        icon_color: "#324b4e",
        Icon: null,
        code_ready: true,
      },
      {
        name: "Timetracking",
        icon_type: "coreui",
        icon_class_name: "",
        icon_color: "#F76583",
        Icon: null,
        code_ready: true,
      },
      {
        name: "Surveyform",
        icon_type: "coreui",
        icon_class_name: "",
        icon_color: "#A155b9",
        Icon: null,
        code_ready: true,
      },
    ];

    const apps = rawApps.map((raw) => new App(raw));

    return apps;
  }
}

export default App;
