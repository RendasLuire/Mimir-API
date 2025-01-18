import moment from "moment";
import mongoose from "mongoose";

moment.locale("es-mx");

const deviceSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, "Brand is required"],
  },
  model: {
    type: String,
    required: [true, "Model is required"],
  },
  serialNumber: {
    type: String,
    required: [true, "Serial number is required"],
    set: (value) => value?.toLowerCase() ?? "",
    unique: true,
  },
  hostname: {
    type: String,
    unique: true,
    required: [true, "Hostname is required"],
    set: (value) => value?.toLowerCase() ?? "",
  },
  details: {
    type: String,
    default: "",
  },
  status: {
    value: {
      type: String,
      default: "en_resguardo",
      set: (value) => value?.toLowerCase() ?? "en_resguardo",
    },
    label: {
      type: String,
      default: "En resguardo",
      set: (value) => value?.toLowerCase() ?? "En resguardo",
    },
  },
  annexed: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Annexed",
    },
    number: {
      type: String,
      default: "",
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
  network: {
    ip: {
      type: String,
      default: "000.000.000.000",
    },
    macEthernet: {
      type: String,
      default: "00:00:00:00:00:00",
    },
    macWifi: {
      type: String,
      default: "00:00:00:00:00:00",
    },
  },
  office: {
    officeVersion: {
      type: String,
      default: "",
    },
    officeKey: {
      type: String,
      default: "",
    },
  },
  person: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
    },
    name: {
      type: String,
      default: "",
    },
  },
  lastPerson: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
    },
    name: {
      type: String,
      default: "",
    },
  },
  custom: {
    type: Boolean,
    default: false,
  },
  bussinesUnit: {
    type: String,
    default: "",
  },
  lastChange: {
    type: Date,
    default: moment(),
  },
  departament: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    name: {
      type: String,
      default: "",
    },
  },
  monitor: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
    serialNumber: {
      type: String,
      default: "",
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
      category: {
        type: String,
        default: "Comment",
      },
      content: {
        type: String,
        required: [true, "Content is required"],
      },
    },
  ],
  headphones: {
    assigned: {
      type: Boolean,
      default: false,
    },
    date_assigned: {
      type: Date,
      default: moment(),
    },
  },
  adaptVGA: {
    assigned: {
      type: Boolean,
      default: false,
    },
    date_assigned: {
      type: Date,
      default: moment(),
    },
  },
  mouse: {
    assigned: {
      type: Boolean,
      default: false,
    },
    date_assigned: {
      type: Date,
      default: moment(),
    },
  },
});

deviceSchema.pre("save", function (next) {
  if (this.serialNumber) {
    this.serialNumber = this.serialNumber.toLowerCase();
  }
  if (this.hostname) {
    this.hostname = this.hostname.toLowerCase();
  }
  if (this.status.value) {
    this.status = this.status.value.toLowerCase();
  }
  if (this.status.label) {
    this.status = this.status.label.toLowerCase();
  }
  if (this.typeDevice) {
    this.typeDevice = this.typeDevice.toLowerCase();
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
