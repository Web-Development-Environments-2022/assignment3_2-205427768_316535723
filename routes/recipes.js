var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");

router.get("/", (req, res) => res.send("im here"));

// ### Search ###
  router.get("/search", async (req, res, next) => {
    try {
      const dishName =req.query.dishName;
      const cuisine = req.query.cuisine;
      const diet = req.query.diet;
      const intolerance = req.query.intolerance;
      const num = req.query.number;
      const user_id = req.session.user_id;
      // save the last seach
      req.session.dishName = dishName;
      req.session.diet = diet;
      req.session.cuisine = cuisine;
      req.session.intolerance = intolerance; //??

      const Recipes_search_15 = await recipes_utils.searchRecipes(dishName, cuisine, diet, intolerance, user_id, num);
      if (Recipes_search_15.length==0) {
        throw { status: 204, message: "No results"};
      }
     // res.status(200).send({ message: "search succeeded", success: true });
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
    const user_id = req.session.user_id;
    const recipe = await recipes_utils.getRandomRecipes(user_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


// ## Information: single id ###
/**
 * This path returns a full details of a recipe by its id
 */
router.get("/recipe", async (req, res, next) => {

  try {
    const user_id = req.session.user_id;
    const recipe_id = req.query.recipeId;
    try{
      const recipe = await recipes_utils.getRecipeDetails(recipe_id,user_id);
      if(user_id !=undefined){
        //if(!user_id){
           console.log(user_id);
           await user_utils.markAsViewed(user_id,recipe_id);
        }
        res.send(recipe);
    }
    catch (error) {
      throw { status: 404, message: "recipe not found"};
    }
    
    
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





