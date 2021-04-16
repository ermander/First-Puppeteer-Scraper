// Importing puppeteer
const puppeteer = require('puppeteer');
// Importing setup files
const lenversLinks = require("./lenvers/links")
const blueVerdLinks = require("./blu_verd/links")
// Importing functions for Lenvers
const { lenversProductLinksScraper, lenversProductInfoesScraper } = require("./lenvers/scrapers")
const { blueVerdProductLinksScraper, blueVerdProductInfoesScraper } = require("./blu_verd/scrapers")
// Importing function for check allowed materials and for generating cvs files
const { checkMaterials, createCVS } = require("./tools/tools")
/* Main function. Here we will:
  - scrape all the items we want;
  - check if those items are made with the materials we accepts
  - create a cvs file with all the products information
*/ 
const main = async () => {
  try {
      // Creating an instance of puppeteer browser, soo we can pass it throw the scraping functions
      const browser = await puppeteer.launch({headless: true});
      const page = await browser.newPage()
      // Disabling JavaScript, CSS and Images to speed up the scraper      
      await page.setJavaScriptEnabled(true)
      await page.setRequestInterception(true)
      page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort()
        }
        else {
            req.continue()
        }
      })      
      /*
        LENVERS
      */
      console.log("Launcing the scraper")
      const lenversProductsLinks = await lenversProductLinksScraper(lenversLinks.productListUrl, page)
      const lenversProductsInfo = await lenversProductInfoesScraper(lenversProductsLinks, page)
      /* 
        Blue Verd
      */
      const blueVerdProductsLink = await blueVerdProductLinksScraper(blueVerdLinks, page)
      const bluVerdProductsInfo = await blueVerdProductInfoesScraper(blueVerdProductsLink, page)
      // Merging all the products infoes togheter
      const rawAllProducts = lenversProductsInfo.concat(bluVerdProductsInfo)
      const allProducts = [...lenversProductsInfo, ...bluVerdProductsInfo]
      console.log(allProducts)
      // Checking if the products are made of materials we want
      const checkedProducts = checkMaterials(allProducts)
      // Generating the CVS file with all the products information
      createCVS(checkedProducts)
      // Closing the Chromnium page
      page.close()
      // Closing the Chromnium Browser
      browser.close()    
  } catch (error) {
    console.log(error)
  }
}

main()
