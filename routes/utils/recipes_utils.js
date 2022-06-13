const axios = require("axios");
//const { exports } = require("mssql/lib/base");
const api_domain = "https://api.spoonacular.com/recipes";
const user_utils = require("./user_utils");

// ### Search ###

/**
 * Get recipes list of lenth 15 from spooncular response (serach)
 * @param {*} dish_Name the name of the recipe
 * @param {*} cuisine the cuisine of the recipe
 * @param {*} diet the diet of the recipe
 * @param {*} intolerance the intolerance of the recipe
 */
 async function searchRecipeInformation(dish_Name,cuisine,diet, intolerance){

    const response = await axios.get(`${api_domain}/complexSearch`,{
        params:{
            number: 15,
            query: dish_Name,
            apiKey: process.env.spooncular_apiKey,
            addRecipeInformation: true,
            instructionsRequired: true,
            cuisine: cuisine,
            diet: diet,
            intolerance: intolerance,
        }
    });
    //console.log(response)
    return response;
}

async function searchRecipes(dish_Name, cuisine, diet, intolerance, user_id, recipe_id ){
    let recipe_info = await searchRecipeInformation(dish_Name,cuisine, diet, intolerance);
    //check if user viewed the recipe+ if it is in his favorites
    let is_viewed = false;
    let is_favorite = false;
    if(user_id != undefined){
        is_viewed = await user_utils.isViewed(recipe_id, user_id);
        is_favorite = await user_utils.isFavorite(recipe_id, user_id);
    }
    return  recipe_info.data.results.map((search_res) => {
        let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, analyzedInstructions} = search_res;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            instructions: analyzedInstructions,
            view: is_viewed,
            favorite: is_favorite,
        };

    });

}

// ### Random ###
async function getRandomRecipes() {
    console.log("get3RandomRecipes start");
    let recipe_info = await get3RandomRecipes();
    console.log("get3RandomRecipes end");
    console.log();
    console.log(await recipe_info["recipes"]);
    //console.log(await recipe_info[1]['id']);
    // for(i = 0 ; i < 3; i++)
    // {
    //    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
    // }
    // //let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    // return {
    //     id: id,
    //     title: title,
    //     readyInMinutes: readyInMinutes,
    //     image: image,
    //     popularity: aggregateLikes,
    //     vegan: vegan,
    //     vegetarian: vegetarian,
    //     glutenFree: glutenFree,  
    // }
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

async function get3RandomRecipes(){
    console.log("random3");
   return await axios.get(`${api_domain}/random`, {
       params: {
           number: 2,
           apiKey: process.env.spooncular_apiKey
       }
   });
}

// ## Information: single id ###
async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}
async function getRecipeDetails(recipe_id, user_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, instructions, servings} = recipe_info.data;
    //check if user viewed the recipe+ if it is in his favorites
    let is_viewed = false;
    let is_favorite = false;
    if(user_id != undefined){
        is_viewed = await user_utils.isViewed(recipe_id, user_id);
        is_favorite = await user_utils.isFavorite(recipe_id, user_id);
    }
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
        view: is_viewed,
        favorite: is_favorite,
    }
}


// ## Information: list of id ###
async function getRecipesPreview(recipe_ids_list, user_id){
    let promises = [];
    recipe_ids_list.map((id) =>{
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);

    info_res.map((recp)=>{console.log(recp.data)}); // ??? 
    return extractPreviewRecipeDetails(info_res, user_id);
}

async function extractPreviewRecipeDetails(recipe_info, user_id){
    
    //return recipe_info.map((recipe_info) =>{
    const res= recipe_info.map(async(recipe_info) =>{
        let data = recipe_info;
        //if(recipe_info.data!= null){
        if(recipe_info.data){
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
        //check if user viewed the recipe+ if it is in his favorites
        let is_viewed = false;
        let is_favorite = false;
        if(user_id != undefined){
            is_viewed  = await user_utils.isViewed(id, user_id);
            is_favorite =await user_utils.isFavorite(id, user_id);
        }

        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            view: is_viewed,
            favorite: is_favorite,
        }
    }) 
    const resolved = await Promise.all(res);
    return resolved;
}

async function getRecipeDetailsBulk(recipe_ids) {
    console.log("recipe_ids: "+ recipe_ids);
    recipe_ids = recipe_ids[0];// + ',' + recipe_ids[1];
    console.log("recipe_ids: "+ recipe_ids);
    // console.log("getRecipeDetailsBulk: 1-"+ recipe_ids[0].data);
    // console.log("getRecipeDetailsBulk: 2- "+ recipe_ids[1].data);
    return await axios.get(`${api_domain}/informationBulk`, {
        params: {
            includeNutrition: true,
            apiKey: process.env.spooncular_apiKey,
            ids: recipe_ids
        }
    });
}

exports.getRecipesPreview = getRecipesPreview;
exports.getRandomThreeRecipes = getRandomThreeRecipes;
exports.searchRecipes = searchRecipes;
exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes = getRandomRecipes;
exports.getRecipeDetailsBulk = getRecipeDetailsBulk;