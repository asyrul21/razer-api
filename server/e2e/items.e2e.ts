import request from "supertest";
import app from "../server";
import ItemModel from "../models/Item.model";
import { loginOrSignUpAsAdmin } from "./utils";

const sampleItem1 = {
  name: "Sword",
  description: "Used to slay monsters and pirates",
  price: 8500,
};
const sampleItem2 = {
  name: "Shield",
  description: "Used to protect from melee blows",
  price: 1000,
};

const sampleItem3 = {
  name: "Bow and Arrow",
  description: "Used to attack enemies from a range",
  price: 1000,
};

describe("Items E2E Tests", () => {
  beforeEach(async () => {
    await ItemModel.deleteMany();
  });

  it("should return status 403 when user not logged in", async () => {
    const res = await request(app)
      .post("/api/items")
      .send(sampleItem1)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(401);
  });

  it("should add new item and get them correctly", async () => {
    const token = await loginOrSignUpAsAdmin();

    const res1 = await request(app)
      .post("/api/items")
      .send(sampleItem1)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res1.statusCode).toBe(201);

    const res2 = await request(app)
      .post("/api/items")
      .send(sampleItem2)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res2.statusCode).toBe(201);

    const expected = [sampleItem1, sampleItem2];
    const res3 = await request(app).get("/api/items");
    const resCategories = res3.body;
    resCategories.forEach((c: any, idx: number) => {
      expect(c).toMatchObject(expected[idx]);
    });
  });

  it("should add new items, edit one of it, and get them correctly", async () => {
    const token = await loginOrSignUpAsAdmin();

    const res1 = await request(app)
      .post("/api/items")
      .send(sampleItem1)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res1.statusCode).toBe(201);

    const res2 = await request(app)
      .post("/api/items")
      .send(sampleItem2)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res2.statusCode).toBe(201);

    const res3 = await request(app)
      .post("/api/items")
      .send(sampleItem3)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res3.statusCode).toBe(201);

    const toEdit: string = res2.body[1]._id;
    const editRes = await request(app)
      .put(`/api/items/${toEdit}`)
      .send({ name: "Metal Shield" })
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(editRes.statusCode).toBe(200);

    const getRes = await request(app).get("/api/items");
    const resCategories = getRes.body;
    const edited = resCategories.filter((c) => c._id === toEdit)[0];

    expect(edited.name).toBe("Metal Shield");
    expect(edited.description).toBe(sampleItem2.description);
    expect(edited.price).toBe(sampleItem2.price);
  });

  it("should add new categories, delete one of it, and get them correctly", async () => {
    const token = await loginOrSignUpAsAdmin();

    const res1 = await request(app)
      .post("/api/items")
      .send(sampleItem1)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res1.statusCode).toBe(201);

    const res2 = await request(app)
      .post("/api/items")
      .send(sampleItem2)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res2.statusCode).toBe(201);

    const res3 = await request(app)
      .post("/api/items")
      .send(sampleItem3)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res3.statusCode).toBe(201);

    const toDelete: string = res2.body[0]._id;
    const editRes = await request(app)
      .delete(`/api/items/${toDelete}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(editRes.statusCode).toBe(200);

    const getRes = await request(app).get("/api/items");
    const resCategories = getRes.body;
    const deleted = resCategories.filter((c: any) => c._id === toDelete);

    expect(deleted.length).toBe(0);
  });
});
