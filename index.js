require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect");
const { Recipe } = require("./models/recipe.model");
const { default: mongoose } = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

initializeDatabase();

//get all recipes
app.get("/recipes", async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json({ recipes});
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipes." });
    }
});
//add recipe
app.post("/recipes", async (req, res) => {
    const { name, cuisineType, imageLink, ingredients, instructions } = req.body;
    try {
        const newRecipe = new Recipe({
            name,
            cuisineType,
            imageLink,
            ingredients,
            instructions
        });
        await newRecipe.save();
        res.status(201).json({ recipe: newRecipe } );
    } catch (error) {
        res.status(500).json({ error: "Failed to add recipe." });
    }
});

//get recipe by id
app.get("/recipes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found." });
        }
        res.json({ recipe });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipe." });
    }
});
//update
app.put("/recipes/:id", async (req, res) => {
    const { id } = req.params;
    const { name, cuisineType, imageLink, ingredients, instructions } = req.body;

    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { name, cuisineType, imageLink, ingredients, instructions },
            { new: true, runValidators: true }
        );

        if (!updatedRecipe) {
            return res.status(404).json({ error: "Recipe not found." });
        }

        res.json({recipe: updatedRecipe });
    } catch (error) {
        res.status(500).json({ error: "Failed to update recipe." });
    }
});
//delete
app.delete("/recipes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).json({ error: "Recipe not found." });
        }
        res.json({  message: "Recipe deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete recipe." });
    }
});



const PORT = 4001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
