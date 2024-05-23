import request from "supertest";
import app from "../app.js";
import { inicializeDataBaseTest } from "../helpers/inicialize.dev.js";

let token = "";

beforeAll(async () => {
  await inicializeDataBaseTest();

  const res = await request(app)
    .post("/api/user/login")
    .send({ nickname: "admin", password: "admin" });
  token = res.body.token;
});

describe("GET /api/device/", () => {
  it("shoult response 200 with a list of devices", async () => {
    const statusExpected = 200;
    const page = 1;
    const limit = 10;

    const res = await request(app)
      .get(`/api/device?page=${page}&limit=${limit}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("shoult response a error if there not a token", async () => {
    const statusExpected = 401;
    const page = 1;
    const limit = 10;

    const res = await request(app).get(
      `/api/device?page=${page}&limit=${limit}`
    );

    expect(res.status).toBe(statusExpected);
  });
});
describe("POST /api/device/", () => {
  it("should return 201 if all is correct", async () => {
    const statusExpected = 201;
    const newDevice = {
      brand: "HP",
      serialNumber: "22224222",
      model: "Boca de la NASA",
      hostname: "Skynet-4",
      details: "Vamos a la dominacion mundial.",
      status: "Activo",
      annexed: {
        id: "664273c15f54ca6fde19d5c7",
        number: "Propio",
      },
      typeDevice: "Computadora",
      ip: "N/A",
      person: {
        id: "664273fd41d5e9eee8345724",
        name: "Sara Conor",
      },
      userTI: "664f9386bc497ea1293420ca",
    };

    const res = await request(app)
      .post(`/api/device/`)
      .send(newDevice)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
    expect(res.body).toHaveProperty("data");
  });

  it("should return 400 for missing required fields", async () => {
    const statusExpected = 400;
    const newDevice = {
      brand: "HP",
      model: "Boca de la NASA",
      hostname: "Skynet-4",
      details: "Vamos a la dominacion mundial.",
      status: "Activo",
      annexed: {
        id: "664273c15f54ca6fde19d5c7",
        number: "Propio",
      },
      typeDevice: "Computadora",
      ip: "N/A",
      person: {
        id: "664273fd41d5e9eee8345724",
        name: "Sara Conor",
      },
      userTI: "664f9386bc497ea1293420ca",
    };

    const res = await request(app)
      .post(`/api/device/`)
      .send(newDevice)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("should return 400 for missing required fields", async () => {
    const statusExpected = 400;
    const newDevice = {
      brand: "HP",
      model: "Boca de la NASA",
      hostname: "Skynet-4",
      details: "Vamos a la dominacion mundial.",
      status: "Activo",
      annexed: {
        id: "664273c15f54ca6fde19d5c7",
        number: "Propio",
      },
      typeDevice: "Computadora",
      ip: "N/A",
      person: {
        id: "664273fd41d5e9eee8345724",
        name: "Sara Conor",
      },
      userTI: "invalidUserId",
    };

    const res = await request(app)
      .post(`/api/device/`)
      .send(newDevice)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });
});
describe("GET /api/device/:id", () => {
  it("should return a specific device", async () => {
    const validDeviceId = "664fa59e8bfe052015d23235";
    const statusExpected = 200;

    const res = await request(app)
      .get(`/api/device/${validDeviceId}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
    expect(res.body).toHaveProperty("data");
  });

  it("should return 404 for invalid ID format", async () => {
    const invalidDeviceId = "1111111";
    const statusExpected = 404;

    const res = await request(app)
      .get(`/api/device/${invalidDeviceId}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });
});
describe("PATCH /api/device/:id", () => {});
describe("PATCH /api/device/assing/:id", () => {});
describe("PATCH /api/device/assing/:id", () => {});
