const blueVerdProductLinksScraper = async (url, page) => {
    const products = []
    // Iterating for every link present on the url
    for(let i = 0; i < url.length; i++){
        /* 
            Initializing an integer number thet will be used for scraping all the product link (to solve the pagination
            of the web page)
        */
        let pageNumber = 1
        // While the condition is true, the scraper will continue scraping the elements
        while(true){
            // Going to the specified url
            await page.goto(url[i] + "page/" + pageNumber + "/")    
            console.log(`Currently scraping page: ${url[i] + "/page" + pageNumber + "/"}`)
            // Scraping the <a> tag and extracting the href links, then saving them into an array
            const links = await page.evaluate(() => 
            Array.from(
                document.querySelectorAll("div.top-product-section a.product-category"))
                .map((a) => a.getAttribute("href"))
            )
            // If the scraper do not get any of the elements searched, the cicle will end
            if(links.length < 1){
                break
            }else{
                // The element found will be pushed to the products array
                products.push(links)
                /* 
                    Incrementing the page number, soo the scraper will be able to go check if in the next page 
                    is present something we want to scraper-
                */
                pageNumber = pageNumber + 1  
            }
        }
    }
    // Creating the "merged" array. This is the value the function will return
    let productsLinks = [].concat.apply([], products)
    return productsLinks
}

const blueVerdProductInfoesScraper = async(links, page) => {
    try {
        const infoes = []
        for(let i = 95; i < links.length; i++){
            console.log(`Currently scraping page ${links[i]}`)
            // Going to the specified url
            await page.goto(links[i])
            // Checks if the material is not null (if is not present on the page)
            const checkMaterial = await page.evaluate(
                () => document.querySelector("div.woocommerce-product-details__short-description p")
            )
            // If the material is not present, it will be setted to null info the info object
            if(checkMaterial === null){
                // Get the title text
                const getTitle = await page.evaluate(
                    () => document.querySelector("h1.product_title.entry-title").innerText
                )
                const title = getTitle
                const productInfo = {
                    name: title,
                    material: null
                }    
                infoes.push(productInfo)
            }else{
                // Get the title text
                const getTitle = await page.evaluate(
                    () => document.querySelector("h1.product_title.entry-title").innerText
                )
                // Get the material text
                const getMaterial = await page.evaluate(
                    () => document.querySelector("div.woocommerce-product-details__short-description p").innerText
                )
                const title = getTitle
                // Removing uselles text
                const rawMaterial = getMaterial.split("%")[1].trim()
                const material = rawMaterial.toLowerCase()
                const productInfo = {
                    name: title,
                    material: material
                }    
                infoes.push(productInfo)
            }
        }
        // Return the products infoes
        return infoes
    } catch (error) {
        console.log(error)
    }
}

module.exports = { blueVerdProductLinksScraper, blueVerdProductInfoesScraper }