const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



// ### Search ###
/**
 * Get recipes list of lenth 15 from spooncular response (serach)
 * @param {*} dish_Name 
 */
 async function searchRecipeInformation(dish_Name,cuisine,diet, intolerance){
    console.log(dish_Name);
    console.log(cuisine);
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

   // console.log(recipe_info.data.results);
   // let recipe_id_list = recipe_info.data.results.map(({id}) => id)

  //  let {id, title} = recipe_info.data.results[0];
   // return {
   //     id: id,
     //   title: title,
   // }
}

// ### Random ###
/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
 async function get3RandomRecipes(){
     console.log("random3");
    return await axios.get(`${api_domain}/random`, {
        params: {
            number: 2,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

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
//  async function getRandomRecipes(){
//     const response = await axios.get(`${api_domain}/random`,{
//         params:{
//             Number: 10,
//             apiKey: process.env.spooncular_apiKey
//         }
//     });
//     return response;
// }
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
    console.log("************");
    console.log("recipe_id: "+ recipe_id);
    console.log("************");
    let recipe_info = await getRecipeInformation(recipe_id);
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
    }
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


exports.getRecipesPreview = getRecipesPreview;
exports.getRandomThreeRecipes = getRandomThreeRecipes;
exports.searchRecipes = searchRecipes;
exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes = getRandomRecipes;
exports.getRecipeDetailsBulk = getRecipeDetailsBulk;



