var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");

router.get("/", (req, res) => res.send("im here"));


// ### Search ###
  router.get("/complexSearch", async (req, res, next) => {
    try {
      const dishName =req.query.dishName;
      const cuisine = req.query.cuisine;
      const diet = req.query.diet;
      const intolerance = req.query.intolerance;
      const Recipes_search_15 = await recipes_utils.searchRecipes(dishName, cuisine, diet, intolerance);
      res.send(Recipes_search_15);
    } catch (error) {
      next(error);
    }
  });
  
// ### Random ###
/**
 * This path returns Random Recipes
 */
 router.get("/random", async (req, res,next) => {
  console.log("START: random");
  try {
    const recipe = await recipes_utils.getRandomRecipes();
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

// /**
//  * This path returns 3 random preview recipes
//  */
//  router.get("/random", async (req, res, next) =>{
//   try{
//     let random_3_recipes = await recipes_utils.getRandomThreeRecipes();
//     console.log(random_3_recipes);
//     res.send(random_3_recipes);
//   }
//   catch(error){
//     next(error);
//   }
// });



// ## Information: single id ###
/**
 * This path returns a full details of a recipe by its id
 */
 router.get("/recipe", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.query.recipeId);
    const user_id = req.session.user_id;
    const recipe_id = req.query.recipeId;
    
    if(user_id !='undefined'){
       console.log(user_id);
       await user_utils.markAsViewed(user_id,recipe_id);
    }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

// ### Information: list of id ###
/**
 * This path returns a full details of a recipe by its id
 */
//  router.get("/:recipeIds", async (req, res, next) => {
//   // console.log("/:recipeIds");
//   // console.log("---req.params.recipeIds:" + req.params.recipeIds);
//   try {
//     const recipe = await recipes_utils.getRecipeDetailsBulk(req.params.recipeIds);
//     res.send(recipe);
//   } catch (error) {
//     next(error);
//   }
// });


module.exports = router;





