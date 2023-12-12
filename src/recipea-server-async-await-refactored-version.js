const express = require("express");
const fs = require("fs").promises;

const app = express();

app.listen(3000, () => {
  console.log("Server listening on port 3000.");
})

app.use(express.json());

const getRecipes = async () => {
  const recipes = await fs.readFile("../data/recipea-data.json", "utf8");

  return recipes;
};

const getRecipe = async (id) => {
  const data = await fs.readFile("../data/recipea-data.json", "utf8");

  return JSON.parse(data)[id];
};

const deleteRecipe = async (id) => {
  const data = await fs.readFile("../data/recipea-data.json", "utf8");
  const recipes = JSON.parse(data).filter((recipe, i) => i !== id);
  const jsonRecipes = JSON.stringify(recipes, null, 2);
  await fs.writeFile("../data/recipea-data.json", jsonRecipes);
};

const updateRecipe = async (id, updatedRecipe) => {
  const data = await fs.readFile("../data/recipea-data.json", "utf8");
  const recipes = JSON.parse(data).map((recipe, i) => {
    return i === id ? updatedRecipe : recipe;
  });

  const jsonVersion = JSON.stringify(recipes, null, 2);
  await fs.writeFile("../data/recipea-data.json", jsonVersion, "utf8");
};

const createRecipe = async (newRecipe) => {
  const data = await fs.readFile("../data/recipea-data.json", "utf8");
  const recipes = [...JSON.parse(data), newRecipe];
  const jsonVersion = JSON.stringify(recipes, null, 2);
  await fs.writeFile("../data/data.json", jsonVersion, "utf8");
};

app.get("/find-recipes", async (req, res) => {
  const recipes = await getRecipes();
  res.send(recipes);
});

app.get("/find-recipe/:id", async (req, res) => {
  const id = Number(req.params.id);
  const recipe = await getRecipe(id);
  const jsonRecipe = JSON.stringify(recipe, null, 2);
  res.send(jsonRecipe);
});

app.get("/trash-recipe/:id", async (req, res) => {
  const id = Number(req.params.id);
  await deleteRecipe(id);
  res.send("Recipe with " + id + " has been deleted.");
});

app.get("/update-recipe/:id", async (req, res) => {
  const updatedRecipe = {
    title: req.body.title,
    text: req.body.text,
  };

  await updateRecipe(Number(req.params.id), updatedRecipe);
  res.send(updatedRecipe);
});

app.get("/create-recipe", async (req, res) => {
  await createRecipe({title: req.body.title, text: req.body.text});
  res.send("Recipe successfully written to the file!");
});