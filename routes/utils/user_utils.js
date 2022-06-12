const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}','${recipe_id}')`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function markAsViewed(user_id, recipe_id){
    await DButils.execQuery(`insert into recipesviews values ('${user_id}','${recipe_id}', now())`);
}

async function getLastWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from recipesviews where user_id='${user_id}' AND recipe_id = (select recipe_id from recipesviews as alt WHERE alt.recipe_id = recipesviews.recipe_id ORDER BY date DESC LIMIT 1) ORDER BY date DESC LIMIT 3`);
    return recipes_id;
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
exports.getLastWatchedRecipes = getLastWatchedRecipes;