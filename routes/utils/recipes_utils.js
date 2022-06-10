const axios = require("axios");
//const { exports } = require("mssql/lib/base");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipesPreview(recipe_ids_list){
    let promises = [];
    recipe_ids_list.map((id) =>{
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    return extractPreviewRecipeDetails(info_res);
}
/**
 * Get recipes list of lenth 15 from spooncular response (serach)
 * @param {*} dish_Name 
 */
async function searchRecipeInformation(dish_Name){
    console.log(dish_Name)
    const response = await axios.get(`${api_domain}/complexSearch`,{
        params:{
            number: 15,
            query: dish_Name,
            apiKey: process.env.spooncular_apiKey
        }
    });
    console.log(response)
    return response;
}



/**
 * Get random recipes list of length 10 from spooncular
 * @param {*} 
 */
async function getRandomRecipes(){
    const response = await axios.get(`${api_domain}/random`,{
        params:{
            Number: 10,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}

function extractPreviewRecipeDetails(recipe_info){
  /*  console.log(recipe_info)
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }*/
    return recipe_info.map((recipe_info) =>{
        let data = recipe_info;
        if(recipe_info.data!= null){
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
    
        }
    }) 
}

/*async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,  } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}*/
async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, instructions, servings} = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        instructions: instructions,
        servings: servings,
    }
}

async function searchRecipes(dish_Name){
    let recipe_info = await searchRecipeInformation(dish_Name);
    console.log(recipe_info.lenth);




  /*  const response = await axios.get(`${api_domain}/informationBulk`,{
        params:{
            ids: [recipe_info.data.results[0], recipe_info.data.results[1], recipe_info.data.results[2]],
            apiKey: process.env.spooncular_apiKey
        }
    });
    console.log(response);*/
    /*let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, instructions, servings} = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        instructions: instructions,
        servings: servings,
    }*/

    /*let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, instructions, servings} = response.data[0];

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        instructions: instructions,
        servings: servings,
    }*/


    let {id, title} = recipe_info.data.results[0];
    return {
        id: id,
        title: title,
    }
}

async function getRandomThreeRecipes(){
    let random_pool = await getRandomRecipes();
    console.log("length of pool");
    let filtered_random_pool = random_pool.data.recipes.filter((random) =>(random.instructions != "") && (random.image && random.instructions)) //??
    if(filtered_random_pool.lenth < 3){
        return getRandomThreeRecipes();
    }
    console.log(filtered_random_pool[0])
    return extractPreviewRecipeDetails([filtered_random_pool[0], filtered_random_pool[1], filtered_random_pool[2]]);
}
exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.getRandomThreeRecipes = getRandomThreeRecipes;
exports.searchRecipes = searchRecipes;

