import { MongoClient } from "mongodb";
import { ISynonym } from "./Types/Synonym";
import dotenv from "dotenv";
import { scrape } from "./webScrapper";

// Add every environment variables from the ".env" file
dotenv.config();

declare var process: {
  env: {
    MONGO_URI: string;
  };
};

const { MONGO_URI } = process.env;

const getSearchType = (doSearchSynonym: boolean) =>
  doSearchSynonym ? "synonym" : "antonym";

export const getSynonym = async (word: string, doSearchSynonym: boolean) => {
  const mongoClient = new MongoClient(MONGO_URI);

  try {
    const db = mongoClient.db("words");
    const storedRelatedWords = db.collection(
      doSearchSynonym ? "synonyms" : "antonyms"
    );

    const synonym = (await storedRelatedWords.findOne({ word })) as ISynonym;

    if (!synonym) {
      const { success, msg } = await scrape(word, doSearchSynonym);

      if (!success)
        return {
          success: false,
          msg,
        };

      try {
        await storedRelatedWords.insertOne({
          word,
          synonym: msg,
          addedAt: new Date().toISOString(),
        });

        return {
          success: true,
          origin: "Web Scraper",
          word,
          msg,
          type: getSearchType(doSearchSynonym),
        };
      } catch (error) {
        return {
          success: false,
          msg: `(MongoDB) ${error}`,
        };
      }
    }

    return {
      success: true,
      origin: "MongoDB",
      word,
      msg: synonym?.synonym,
      type: getSearchType(doSearchSynonym),
      addedAt: synonym?.addedAt,
    };
  } catch (error) {
    return { success: false, msg: `(MongoDB) ${error}` };
  } finally {
    mongoClient.close();
  }
};
