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
 async function searchRecipeInformation(dish_Name,cuisine,diet, intolerance, num){

    const response = await axios.get(`${api_domain}/complexSearch`,{
        params:{
            number: num,
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

async function searchRecipes(dish_Name, cuisine, diet, intolerance, user_id, num){
    if(num > 15){
        num = 15;
    }
         
    let recipe_info = await searchRecipeInformation(dish_Name,cuisine, diet, intolerance, num);
   
    return  Promise.all(
        recipe_info.data.results.map(async(search_res) => {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, analyzedInstructions} = search_res;
            //check if user viewed the recipe+ if it is in his favorites
            let is_viewed = false;
            let is_favorite = false;
            if(user_id != undefined){
                is_viewed = await user_utils.isViewed(id, user_id);
                is_favorite = await user_utils.isFavorite(id, user_id);
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
                instructions: analyzedInstructions,
                view: is_viewed,
                favorite: is_favorite,
            };
    
        })
    
    ) 
}

// ### Random ###
/*async function getRandomRecipes(user_id) {
    console.log("get3RandomRecipes start");
    let recipe_info = await get3RandomRecipes();
    console.log("get3RandomRecipes end");
    console.log();

    console.log(await recipe_info.data['recipes'][0]['id']);
    random_ids_array = []
    for(i = 0 ; i < 3; i++)
    {
        random_ids_array.push(recipe_info.data['recipes'][i]['id']);
    }
    console.log(await random_ids_array);
    return getRecipesPreview(random_ids_array, user_id);
}*/
async function getRandomRecipes(user_id) {
    console.log("get3RandomRecipes start");
    let recipe_info = await get3RandomRecipes();
    console.log("get3RandomRecipes end");
    console.log(recipe_info.data);

    return  Promise.all(
        recipe_info.data.recipes.map(async(random_res) => {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree} = random_res;
            //check if user viewed the recipe+ if it is in his favorites
            let is_viewed = false;
            let is_favorite = false;
            if(user_id != undefined){
                is_viewed = await user_utils.isViewed(id, user_id);
                is_favorite = await user_utils.isFavorite(id, user_id);
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
                
                //ingredients: extendedIngredients,
                //instructions: analyzedInstructions,
                view: is_viewed,
                favorite: is_favorite,
            };
    
        })
    
    ) 
}




 

async function get3RandomRecipes(){
   return await axios.get(`${api_domain}/random`, {
       params: {
           number: 3,
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
        ingredients: extendedIngredients,
        instructions: instructions,
        servings: servings,
        view: is_viewed,
        favorite: is_favorite,
    }
}

// ## Information: list of id ###
async function getRecipesPreview(recipe_ids_list, user_id){
    let promises = [];
    recipe_ids_list.map(async(id) =>{
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
exports.get3RandomRecipes = get3RandomRecipes;
exports.searchRecipes = searchRecipes;
exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes = getRandomRecipes;
exports.getRecipeDetailsBulk = getRecipeDetailsBulk;