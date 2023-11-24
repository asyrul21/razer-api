import { NextFunction, Request, Response } from "express";
import { catchControllerError } from "../utils/error";
import { HydratedDocument } from "mongoose";
import ItemModel, { ItemDocument } from "../models/Item.model";
import { validateRequestBody } from "../utils/validateRequestBody";
import { CreateItemDto } from "./dtos/Create-Item.dto";
import { UpdateItemDto } from "./dtos/Update-Item.dto";

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await ItemModel.find();
    return res.status(200).json(items);
  } catch (error) {
    catchControllerError({
      operation: "getItems",
      statusCode: 400,
      error: error,
      response: res,
      errorMessagePrefix: "Get items failed",
      next,
    });
  }
};

export const createItem = async (
  req: Request<object, unknown, ItemDocument>,
  res: Response,
  next: NextFunction
) => {
  try {
    const CreateItemData = await validateRequestBody<ItemDocument>(
      CreateItemDto,
      req.body
    );
    const { name, description, price } = CreateItemData;
    const CreatedItem: HydratedDocument<ItemDocument> = new ItemModel({
      name,
      description,
      price,
    });
    await CreatedItem.save();
    const items = await ItemModel.find();
    return res.status(201).json(items);
  } catch (error) {
    catchControllerError({
      operation: "createItem",
      statusCode: 400,
      error: error,
      response: res,
      errorMessagePrefix: "Create item failed",
      next,
    });
  }
};

export const updateItem = async (
  req: Request<{ id: string }, unknown, ItemDocument>,
  res: Response,
  next: NextFunction
) => {
  const itemId = req.params.id;
  try {
    const UpdateItemData = await validateRequestBody<ItemDocument>(
      UpdateItemDto,
      req.body
    );
    const { name, description, price } = UpdateItemData;

    const foundItem: HydratedDocument<ItemDocument> = await ItemModel.findById(
      itemId
    );
    if (!foundItem) {
      throw new Error("Item not found");
    }

    if (typeof name === "string") {
      foundItem.name = name;
    }
    if (typeof description === "string") {
      foundItem.description = description;
    }
    if (price !== null && price !== undefined) {
      foundItem.price = price;
    }

    await foundItem.save();
    const items = await ItemModel.find();
    return res.status(200).json(items);
  } catch (error) {
    catchControllerError({
      operation: "updateItem",
      statusCode: 400,
      error: error,
      response: res,
      errorMessagePrefix: "Update item failed",
      next,
    });
  }
};

export const deleteItem = async (
  req: Request<{ id?: string }, unknown, ItemDocument>,
  res: Response,
  next: NextFunction
) => {
  const itemId: null | string = req.params.id;
  try {
    if (typeof itemId !== "string") {
      throw new Error("Require request parameter field [id]");
    }

    const foundItem: HydratedDocument<ItemDocument> = await ItemModel.findById(
      itemId
    );
    if (!foundItem) {
      throw new Error("Item not found");
    }
    await foundItem.deleteOne();
    const items = await ItemModel.find();
    return res.status(200).json(items);
  } catch (error) {
    catchControllerError({
      operation: "deleteItem",
      statusCode: 400,
      error: error,
      response: res,
      errorMessagePrefix: "Delete item failed",
      next,
    });
  }
};
