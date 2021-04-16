// Importing setup files
const lenversLinks = require("./links");

const lenversProductLinksScraper = async (url, page) => {
  const products = [];
  // Iterating for every link present on the url
  for (let i = 0; i < url.length; i++) {
    /* 
      Initializing an integer number thet will be used for scraping all the product link (to solve the pagination
      of the web page)
    */
    let pageNumber = 1;
    // While the condition is true, the scraper will continue scraping the elements
    while (true) {
      // Going to the specified url
      await page.goto(url + pageNumber);
      console.log(`Currently scraping page: ${url + pageNumber}`);
      // Scraping the <a> tag and extracting the href links, then saving them into an array
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a.proFeaturedImage")).map((a) =>
          a.getAttribute("href")
        )
      );
      // If the scraper do not get any of the elements searched, the cicle will end
      if (links.length < 1) {
        let productsLinks = [].concat.apply([], products);
        return productsLinks;
      } else {
        // The element found will be pushed to the products array
        products.push(links);
        /* 
          Incrementing the page number, soo the scraper will be able to go check if in the next page 
          is present something we want to scraper-
        */
        pageNumber = pageNumber + 1;
      }
    }
  }
};

const lenversProductInfoesScraper = async (links, page) => {
  try {
    const infoes = [];
    for (let i = 0; i < links.length; i++) {
      console.log(
        `Currently scraping page ${lenversLinks.homepage + links[i]}`
      );
      // Going to the specified url
      await page.goto(lenversLinks.homepage + links[i]);
      const [titleText] = await page.$x(
        '//*[@id="shopify-section-vela-template-product"]/div[1]/div/div[1]/div[2]/h1'
      );
      const [materialText] = await page.$x(
        '//*[@id="shopify-section-vela-template-product"]/div[1]/div/div[1]/div[2]/div[1]'
      );
      /* 
        Sometimes the functions that get the innerText of the elements return undefined because the xpath it's not correct.
        That's because some products are different from the others (and they are not important for our investigation).
        Soo this if checks if the evaluation returns undefined. If soo, we skip those products and we continue to get the information of the others.
      */
      if (titleText !== undefined || materialText !== undefined) {
        // Getting title (product name) and material innerText
        const getTitle = await page.evaluate(
          (text) => text.innerText,
          titleText
        );
        const getMaterial = await page.evaluate(
          (text) => text.innerText,
          materialText
        );
        // Fixing problems with string to have a clean format saved
        const rawMaterial = getMaterial.split("-")[0].trim();
        const material = rawMaterial.toLowerCase();
        // Creating the product info object
        const productInfo = {
          name: getTitle,
          material: material,
        };
        // Saving the object into the infoes array
        infoes.push(productInfo);
      }
    }
    // Return the array with all the products infoes
    return infoes;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { lenversProductLinksScraper, lenversProductInfoesScraper };
