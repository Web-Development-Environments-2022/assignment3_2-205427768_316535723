var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns 3 random preview recipes
 */
router.get("/random", async (req, res, next) =>{
  try{
    let random_3_recipes = await recipes_utils.getRandomThreeRecipes();
    console.log(random_3_recipes);
    res.send(random_3_recipes);
  }
  catch(error){
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
 router.get("/complexSearch/:dishName", async (req, res, next) => {
  try {
    const Recipes_search_15 = await recipes_utils.searchRecipes(req.params.dishName);
    res.send(Recipes_search_15);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
