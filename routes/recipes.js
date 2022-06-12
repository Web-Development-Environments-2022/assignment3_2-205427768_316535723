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
router.get("/recipe", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.query.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
 router.get("/complexSearch", async (req, res, next) => {
  try {
    console.log("here");
   /* const dishName =req.query['dishName'];
    const cuisine = req.query['cuisine'];
    const diet = req.query['diet'];
    const intolerance = req.query['intolerance'];*/
    const dishName =req.query.dishName;
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerance = req.query.intolerance;
    console.log(dishName);
    console.log(cuisine);
    console.log(diet);
    console.log(intolerance);
    //req.params.dishName
    const Recipes_search_15 = await recipes_utils.searchRecipes(dishName, cuisine, diet, intolerance);
    res.send(Recipes_search_15);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
