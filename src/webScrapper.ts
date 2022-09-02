import puppeteer from "puppeteer";

const SYNONYMS_QUERY = "#meanings > div.css-ixatld.e15rdun50 > ul > li > a";
const ANTONYMS_QUERY = "#antonyms > div.css-ixatld.e15rdun50 > ul > li > a";

export const scrape = async (word: string, doSearchSynonym: boolean) => {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.thesaurus.com/browse/${word}`);

    const element = await page.waitForSelector(
      doSearchSynonym ? SYNONYMS_QUERY : ANTONYMS_QUERY
    );

    const relatedWord = await page.evaluate(
      (targetedElement) => targetedElement.textContent,
      element
    );

    if (!relatedWord)
      return {
        success: false,
        msg: `(Web Scraper) No ${
          doSearchSynonym ? "synonym" : "antonym"
        } for ${word}.`,
      };

    return { success: true, msg: relatedWord };
  } catch (error) {
    return { success: false, msg: `(Web Scraper) ${error}` };
  } finally {
    await browser.close();
  }
};
