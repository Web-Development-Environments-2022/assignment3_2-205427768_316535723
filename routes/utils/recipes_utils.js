const axios = require("axios");
//const { exports } = require("mssql/lib/base");
const api_domain = "https://api.spoonacular.com/recipes";

// ### Search ###

/**
 * Get recipes list of lenth 15 from spooncular response (serach)
 * @param {*} dish_Name 
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

async function searchRecipes(dish_Name, cuisine, diet, intolerance){
    let recipe_info = await searchRecipeInformation(dish_Name,cuisine, diet, intolerance);
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
        };

    });

}

// ### Random ###
async function getRandomRecipes() {
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
    return getRecipesPreview(random_ids_array);
}

async function get3RandomRecipes(){
    console.log("random3");
    console.log(await axios.get(`${api_domain}/random`, {
        params: {
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    }));
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

// ## Information: list of id ###
async function getRecipesPreview(recipe_ids_list){
    let promises = [];
    recipe_ids_list.map((id) =>{
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);

    info_res.map((recp)=>{console.log(recp.data)}); // ??? 
    return extractPreviewRecipeDetails(info_res);
}

function extractPreviewRecipeDetails(recipe_info){
    return recipe_info.map((recipe_info) =>{
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