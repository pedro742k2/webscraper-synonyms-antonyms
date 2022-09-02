import { Request } from "express";

export interface IReq extends Request {
  query: {
    word: string;
    relation: "s" | "a";
  };
}
