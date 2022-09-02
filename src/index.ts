import { getSynonym } from "./getFromDb";
import express, { Response } from "express";
import { IReq } from "./Types/Request.d";
import cors from "cors";
import path from "path";

const PORT = 4000;

const app = express();

app.use(cors());

app.get("/", (_, res: Response) => {
  return res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/get-related-word", async (req: IReq, res: Response) => {
  const { word, relation } = req.query;

  const formattedWord = word.toLowerCase().trim();
  const formatedRelation =
    (relation.toLowerCase().trim() || "s") === "s" ? true : false;

  if (!formattedWord)
    return res.status(400).json({ error: "No word was sent." });

  let data;

  try {
    data = await getSynonym(formattedWord, formatedRelation);
  } catch (error) {
    return res.status(500).json({ error });
  }

  return res.json(data);
});

app.listen(PORT, () =>
  console.log(
    `Listenning on port ${PORT}.\nOpen in browser: http://localhost:4000`
  )
);
