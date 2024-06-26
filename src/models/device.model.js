import moment from "moment";
import mongoose from "mongoose";

moment.locale("es-mx");

const deviceSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, "Brand is required"],
    set: (value) => value?.toLowerCase() ?? "",
  },
  model: {
    type: String,
    required: [true, "Model is required"],
    set: (value) => value?.toLowerCase() ?? "",
  },
  serialNumber: {
    type: String,
    required: [true, "Serial number is required"],
    set: (value) => value?.toLowerCase() ?? "",
  },
  hostname: {
    type: String,
    required: [true, "Hostname is required"],
    set: (value) => value?.toLowerCase() ?? "",
  },
  details: {
    type: String,
    default: "",
    set: (value) => value?.toLowerCase() ?? "",
  },
  status: {
    value: {
      type: String,
      default: "disponible",
      set: (value) => value?.toLowerCase() ?? "disponible",
    },
    label: {
      type: String,
      default: "disponible",
      set: (value) => value?.toLowerCase() ?? "disponible",
    },
  },
  annexed: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Annexed",
    },
    number: {
      type: String,
      default: "disponible",
      set: (value) => value?.toLowerCase() ?? "disponible",
    },
  },
  ubication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Storage",
  },
  phisicRef: {
    type: String,
    default: "",
  },
  typeDevice: {
    type: String,
    required: [true, "Type of device is required"],
    set: (value) => value?.toLowerCase() ?? "",
  },
  ip: {
    type: String,
    default: "",
    set: (value) => value?.toLowerCase() ?? "",
  },
  mac: {
    type: String,
    default: "",
    set: (value) => value?.toLowerCase() ?? "",
  },
  person: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
    },
    name: {
      type: String,
      default: "disponible",
      set: (value) => value?.toLowerCase() ?? "disponible",
    },
  },
  custom: {
    type: Boolean,
    default: false,
  },
  bussinesUnit: {
    type: String,
    default: "disponible",
    set: (value) => value?.toLowerCase() ?? "disponible",
  },
  departament: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    name: {
      type: String,
      default: "disponible",
      set: (value) => value?.toLowerCase() ?? "disponible",
    },
  },
  monitor: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
    serialNumber: {
      type: String,
      default: "disponible",
      set: (value) => value?.toLowerCase() ?? "disponible",
    },
  },
  comments: [
    {
      idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      nameUser: {
        type: String,
        required: [true, "User name is required"],
        set: (value) => value?.toLowerCase() ?? "",
      },
      dateCreation: {
        type: Date,
        default: moment(),
      },
      content: {
        type: String,
        required: [true, "Content is required"],
      },
    },
  ],
  movements: [
    {
      idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      typeMovement: {
        type: String,
        required: [true, "Type of movement is required"],
      },
      dateCreation: {
        type: Date,
        default: moment(),
      },
      description: {
        type: String,
        required: [true, "Description is required"],
      },
    },
  ],
  headphones: {
    type: Boolean,
    default: false,
  },
  adaptVGA: {
    type: Boolean,
    default: false,
  },
  mouse: {
    type: Boolean,
    default: false,
  },
});

deviceSchema.pre("save", function (next) {
  if (this.brand) {
    this.brand = this.brand.toLowerCase();
  }
  if (this.model) {
    this.model = this.model.toLowerCase();
  }
  if (this.serialNumber) {
    this.serialNumber = this.serialNumber.toLowerCase();
  }
  if (this.hostname) {
    this.hostname = this.hostname.toLowerCase();
  }
  if (this.details !== undefined) {
    this.details = this.details.toLowerCase();
  }
  if (this.status.value) {
    this.status = this.status.value.toLowerCase();
  }
  if (this.status.label) {
    this.status = this.status.label.toLowerCase();
  }
  if (this.annexed.number) {
    this.annexed.number = this.annexed.number.toLowerCase();
  }
  if (this.typeDevice) {
    this.typeDevice = this.typeDevice.toLowerCase();
  }
  if (this.ip) {
    this.ip = this.ip.toLowerCase();
  }
  if (this.mac) {
    this.mac = this.mac.toLowerCase();
  }
  if (this.person.name) {
    this.person.name = this.person.name.toLowerCase();
  }
  if (this.bussinesUnit) {
    this.bussinesUnit = this.bussinesUnit.toLowerCase();
  }
  if (this.departament.name) {
    this.departament.name = this.departament.name.toLowerCase();
  }
  if (this.monitor.serialNumber) {
    this.monitor.serialNumber = this.monitor.serialNumber.toLowerCase();
  }

  if (this.comments && this.comments.length > 0) {
    this.comments.forEach((comment) => {
      if (comment.nameUser) {
        comment.nameUser = comment.nameUser.toLowerCase();
      }
    });
  }

  next();
});

export default mongoose.model("Device", deviceSchema);
