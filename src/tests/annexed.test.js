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

describe("GET /api/annexeds/", () => {
  it("should return a error if there not a token", async () => {
    const statusExpected = 401;

    const res = await request(app).get("/api/annexeds?page=1&limit=10");

    expect(res.status).toBe(statusExpected);
  });

  it("should return a page of annexeds", async () => {
    const statusExpected = 200;
    const propertyExpected1 = "data";
    const propertyExpected2 = "pagination";

    const res = await request(app)
      .get("/api/annexeds?page=1&limit=10")
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
    expect(res.body).toHaveProperty(propertyExpected1);
    expect(res.body).toHaveProperty(propertyExpected2);
  });
});

describe("POST /api/annexeds/", () => {
  it("should register a new annexed", async () => {
    const newAnnexed = {
      number: "1234",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      bill: "100",
      userTI: "66427240408251f1eeecf939",
    };
    const statusExpected = 201;

    const res = await request(app)
      .post("/api/annexeds")
      .send(newAnnexed)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
    expect(res.body).toHaveProperty("data");
  });

  it("should return 400 for missing required fields", async () => {
    const newAnnexed = {
      number: "12345",
    };
    const statusExpected = 400;

    const res = await request(app)
      .post("/api/annexeds")
      .send(newAnnexed)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("should return 404 for invalid user ID", async () => {
    const newAnnexed = {
      number: "12345",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      bill: "1000",
      userTI: "invalidUserId",
    };
    const statusExpected = 404;

    const res = await request(app)
      .post("/api/annexeds")
      .send(newAnnexed)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });
});

describe("GET /api/annexeds/:id", () => {
  it("should return a specific annexed", async () => {
    const validAnnexedId = "664273c15f54ca6fde19d5c7";
    const statusExpected = 200;

    const res = await request(app)
      .get(`/api/annexeds/${validAnnexedId}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
    expect(res.body).toHaveProperty("data");
  });

  it("should return 404 for invalid ID format", async () => {
    const invalidAnnexed = "1111111";
    const statusExpected = 404;

    const res = await request(app)
      .get(`/api/annexeds/${invalidAnnexed}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("should return 404 if annexed not found", async () => {
    const nonExistentId = "664273c15f54ca6fde19d5c8";
    const statusExpected = 404;

    const res = await request(app)
      .get(`/api/annexeds/${nonExistentId}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });
});

describe("GET /api/annexeds/group/:id", () => {
  it("should return grouped devices for a specific annexed", async () => {
    const validAnnexedId = "664273c15f54ca6fde19d5c7";
    const statusExpected = 200;

    const res = await request(app)
      .get(`/api/annexeds/group/${validAnnexedId}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
    expect(res.body).toHaveProperty("data");
  });

  it("should return 404 for invalid ID format", async () => {
    const invalidId = "1111111";
    const statusExpected = 404;

    const res = await request(app)
      .get(`/api/annexeds/group/${invalidId}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("should return 404 if annexed not found", async () => {
    const nonExistentId = "664273c15f54ca6fde19d5c8";
    const statusExpected = 404;

    const res = await request(app)
      .get(`/api/annexeds/group/${nonExistentId}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("should return 204 if no devices are found", async () => {
    const annexedIdWithNoDevices = "664273c15f54ca6fde19d5c9";
    const statusExpected = 204;

    const res = await request(app)
      .get(`/api/annexeds/group/${annexedIdWithNoDevices}`)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });
});

describe("POST /annexeds/:id/devices", () => {
  it("should register or update devices in bulk", async () => {
    const res = await request(app)
      .post(`/annexeds/${validAnnexedId}/devices`)
      .send({
        userTI: validUserId,
        brand: "Brand",
        model: "Model",
        description: "Description",
        typeDevice: "Type",
        serialNumber: "SN1, SN2",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  it("should return 401 for missing required fields", async () => {
    const res = await request(app)
      .post(`/annexeds/${validAnnexedId}/devices`)
      .send({
        userTI: validUserId,
      });
    expect(res.status).toBe(401);
  });

  it("should return 404 for invalid ID format", async () => {
    const res = await request(app).post("/annexeds/invalidId/devices").send({
      userTI: validUserId,
      brand: "Brand",
      model: "Model",
      description: "Description",
      typeDevice: "Type",
      serialNumber: "SN1, SN2",
    });
    expect(res.status).toBe(404);
  });
});
