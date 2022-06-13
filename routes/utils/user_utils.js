const DButils = require("./DButils");



async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}','${recipe_id}')`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getLastViewsRecipes(user_id){
    //const recipes_id = await DButils.execQuery(`select recipeID from views where userID='${user_id}' order by `);
    const recipes_id = await DButils.execQuery(`SELECT DISTINCT recipeID FROM views where userID='${user_id}' order by ViewingDate asc LIMIT 3 `);
    return await recipes_id;
}

async function markAsViewed(user_id, recipe_id){
    await DButils.execQuery(`insert into recipesviews values ('${user_id}','${recipe_id}', now())`);
}


async function getLastWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select DISTINCT recipe_id from recipesviews where user_id='${user_id}' AND recipe_id = (select recipe_id from recipesviews as alt WHERE alt.recipe_id = recipesviews.recipe_id ORDER BY date DESC LIMIT 1) ORDER BY date DESC LIMIT 3`);
    return recipes_id;
}

async function isViewed (recipe_id, user_id){
    const  views= await DButils.execQuery(`SELECT recipe_id from recipesviews where user_id='${user_id}' AND recipe_id='${recipe_id}'`);
    let is_viewed = false;
    let recipes_id_array = [];
    views.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    if(recipes_id_array.length != 0){
        is_viewed = true;
    }
    return is_viewed;
}
async function isFavorite (recipe_id, user_id){
    const  favorites= await DButils.execQuery(`SELECT recipe_id from favoriterecipes where user_id='${user_id}' AND recipe_id='${recipe_id}'`);
    let is_favorite = false;
    let recipes_id_array_favorites = [];
    favorites.map((element) => recipes_id_array_favorites.push(element.recipe_id)); //extracting the recipe ids into array
    if(recipes_id_array_favorites.length != 0){
        is_favorite = true;
    }
    return is_favorite;
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.isViewed = isViewed;
exports.isFavorite = isFavorite;