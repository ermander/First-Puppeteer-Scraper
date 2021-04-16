const alowedMaterial = require("../materials/materials")
const ObjectsToCsv = require('objects-to-csv')

const checkMaterials = (products) => {
    /*  
        Mapping throw the products array. Here the function is checking if the material of the product
        is made of a material present on the allowed material list.
        If soo, the map function return the same element, otherwise it returns the element modify
        on element.material = null
    */
    const checkMaterials = products.map((element) => {
        if(element.material = alowedMaterial[element.material]){
            return({
                ...element,
            })
        }else{
            return({
                ...element,
                material: null
            })
        }
    })
    return checkMaterials
}
  
const createCVS = async (list) => {
    const csv = new ObjectsToCsv(list)
    await csv.toDisk('./list.csv')
}

module.exports = { checkMaterials, createCVS }