import mongoose from "mongoose";

const devices = [
  ...Array(5)
    .fill(null)
    .flatMap((_, i) => {
      const desktopId = new mongoose.Types.ObjectId();
      const monitorId = new mongoose.Types.ObjectId();
      return [
        {
          brand: "Dell",
          model: `OptiPlex 70${i}`,
          serialNumber: `desktop-serial-${i}`,
          hostname: `desktop-${i}`,
          details: "PC de oficina",
          status: {
            value: "en_resguardo",
            label: "En resguardo",
          },
          annexed: {
            id: null,
            number: "",
          },
          ubication: null,
          phisicRef: `Escritorio ${i + 1}`,
          typeDevice: "desktop",
          network: {
            ip: `192.168.1.1${i}`,
            macEthernet: `AA:BB:CC:DD:EE:F${i}`,
            macWifi: "",
          },
          office: {
            officeVersion: "Office 2021",
            officeKey: "YYYYY-YYYYY-YYYYY-YYYYY-YYYYY",
          },
          person: {
            id: null,
            name: "",
          },
          lastPerson: {
            id: null,
            name: "",
          },
          custom: false,
          bussinesUnit: "Administración",
          lastChange: new Date(),
          departament: {
            id: null,
            name: "Finanzas",
          },
          monitor: {
            id: null,
            serialNumber: "",
          },
          comments: [],
          headphones: {
            assigned: false,
            date_assigned: new Date(),
          },
          adaptVGA: {
            assigned: true,
            date_assigned: new Date(),
          },
          mouse: {
            assigned: true,
            date_assigned: new Date(),
          },
        },
        {
          brand: "LG",
          model: `UltraWide 29WK60${i}`,
          serialNumber: `monitor-serial-${i}`,
          hostname: `monitor-${i}`,
          details: "Monitor disponible",
          status: {
            value: "en_resguardo",
            label: "En resguardo",
          },
          annexed: {
            id: null,
            number: "",
          },
          ubication: null,
          phisicRef: `Escritorio ${i + 1}`,
          typeDevice: "monitor",
          network: {
            ip: "",
            macEthernet: "",
            macWifi: "",
          },
          office: {
            officeVersion: "",
            officeKey: "",
          },
          person: {
            id: null,
            name: "",
          },
          lastPerson: {
            id: null,
            name: "",
          },
          custom: false,
          bussinesUnit: "Administración",
          lastChange: new Date(),
          departament: {
            id: null,
            name: "Finanzas",
          },
          monitor: {
            id: null,
            serialNumber: "",
          },
          comments: [],
          headphones: {
            assigned: false,
            date_assigned: new Date(),
          },
          adaptVGA: {
            assigned: false,
            date_assigned: new Date(),
          },
          mouse: {
            assigned: false,
            date_assigned: new Date(),
          },
        },
      ];
    }),
];

export default devices;
