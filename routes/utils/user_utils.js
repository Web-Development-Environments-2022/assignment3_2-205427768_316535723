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

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsViewed = markAsViewed;
exports.getLastViewsRecipes = getLastViewsRecipes;
