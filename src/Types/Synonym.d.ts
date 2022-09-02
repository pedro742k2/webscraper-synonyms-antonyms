import { ObjectId } from "mongodb";

interface ISynonym {
  _id: ObjectId;
  word: string;
  synonym: string;
  addedAt: string;
}
