import mongoose from "mongoose";

const persons = [
  {
    name: "Juan Pérez",
    department: {
      id: new mongoose.Types.ObjectId(),
      name: "Recursos Humanos",
    },
    position: "Analista de RRHH",
    manager: {
      id: new mongoose.Types.ObjectId(),
      name: "María Gómez",
    },
    bussinesUnit: {
      id: new mongoose.Types.ObjectId(),
      name: "Administración",
    },
  },
  {
    name: "Carlos López",
    department: {
      id: new mongoose.Types.ObjectId(),
      name: "Tecnología",
    },
    position: "Desarrollador Full Stack",
    manager: {
      id: new mongoose.Types.ObjectId(),
      name: "Ana Martínez",
    },
    bussinesUnit: {
      id: new mongoose.Types.ObjectId(),
      name: "Innovación",
    },
  },
  {
    name: "Laura Méndez",
    department: {
      id: new mongoose.Types.ObjectId(),
      name: "Finanzas",
    },
    position: "Contadora",
    manager: {
      id: new mongoose.Types.ObjectId(),
      name: "Pedro Sánchez",
    },
    bussinesUnit: {
      id: new mongoose.Types.ObjectId(),
      name: "Planeación Financiera",
    },
  },
  {
    name: "Sofía Ramírez",
    department: {
      id: new mongoose.Types.ObjectId(),
      name: "Marketing",
    },
    position: "Especialista en Marketing Digital",
    manager: {
      id: new mongoose.Types.ObjectId(),
      name: "José Rodríguez",
    },
    bussinesUnit: {
      id: new mongoose.Types.ObjectId(),
      name: "Estrategia Comercial",
    },
  },
];

export default persons;
