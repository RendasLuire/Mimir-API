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

describe("PATCH /api/annexeds/:id", () => {
  it("shoult return a 200 when annexed get updated", async () => {
    const newData = {
      number: "666",
      userTI: "66427240408251f1eeecf939",
    };
    const statusExpected = 200;
    const annexedId = "664273c15f54ca6fde19d5c9";

    const res = await request(app)
      .patch(`/api/annexeds/${annexedId}`)
      .send(newData)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("should return 400 when data is empty", async () => {
    const newData = {
      userTI: "66427240408251f1eeecf939",
    };
    const statusExpected = 400;
    const annexedId = "664273c15f54ca6fde19d5c9";

    const res = await request(app)
      .patch(`/api/annexeds/${annexedId}`)
      .send(newData)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("should return 404 when annexed not found", async () => {
    const newData = {
      number: "666",
      userTI: "66427240408251f1eeecf939",
    };
    const statusExpected = 404;
    const annexedId = "664273c15f54ca6fde19d5c6";

    const res = await request(app)
      .patch(`/api/annexeds/${annexedId}`)
      .send(newData)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("should return 404 when id is invalid", async () => {
    const newData = {
      number: "666",
      userTI: "66427240408251f1eeecf939",
    };
    const statusExpected = 404;
    const annexedId = "11111";

    const res = await request(app)
      .patch(`/api/annexeds/${annexedId}`)
      .send(newData)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });
});

describe("PATCH /api/annexeds/masive/:id", () => {
  it("should return 200 when data was charged", async () => {
    const statusExpected = 200;
    const annexedId = "664273c15f54ca6fde19d5c9";
    const newDevices = {
      userTI: "66427240408251f1eeecf939",
      brand: "HP",
      model: "algo",
      description: "tiene mucho",
      typeDevice: "computadora",
      serialNumber: "aaaaa1111, bbb22222",
    };

    const res = await request(app)
      .patch(`/api/annexeds/masive/${annexedId}`)
      .send(newDevices)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("should return 401 when data is not complete", async () => {
    const statusExpected = 401;
    const annexedId = "664273c15f54ca6fde19d5c9";
    const newDevices = {
      userTI: "66427240408251f1eeecf939",
      brand: "HP",
      model: "algo",
      description: "tiene mucho",
      typeDevice: "computadora",
    };

    const res = await request(app)
      .patch(`/api/annexeds/masive/${annexedId}`)
      .send(newDevices)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("sould return 404 when id is not valid", async () => {
    const statusExpected = 404;
    const annexedId = "11111";
    const newDevices = {
      userTI: "66427240408251f1eeecf939",
      brand: "HP",
      model: "algo",
      description: "tiene mucho",
      typeDevice: "computadora",
      serialNumber: "aaaaa1111, bbb22222",
    };

    const res = await request(app)
      .patch(`/api/annexeds/masive/${annexedId}`)
      .send(newDevices)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });

  it("sould return 400 when userTI not found", async () => {
    const statusExpected = 400;
    const annexedId = "664273c15f54ca6fde19d5c9";
    const newDevices = {
      userTI: "66427240408251f1eeecf938",
      brand: "HP",
      model: "algo",
      description: "tiene mucho",
      typeDevice: "computadora",
      serialNumber: "aaaaa1111, bbb22222",
    };

    const res = await request(app)
      .patch(`/api/annexeds/masive/${annexedId}`)
      .send(newDevices)
      .set("Authorization", token);

    expect(res.status).toBe(statusExpected);
  });
});
