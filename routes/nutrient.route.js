const express = require("express");
const adminauth = require("../middlewares/adminauth.middleware");
const NutrientModel = require("../models/nutrient.model");

const nutriRouter = express.Router();

// to get the all data
nutriRouter.get("/list", async (req, res) => {
  const {
    name,
    energy,
    fat,
    carbs,
    protein,
    servingsize,
    filter,
    q,
    limit,
    page,
  } = req.query;
  const query = {};
  if (name) {
    query.name = RegExp(name, "i");
  }
  if (energy) {
    query.energy = RegExp(energy, "i");
  }
  if (fat) {
    query.fat = RegExp(fat, "i");
  }
  if (carbs) {
    query.carbs = RegExp(carbs, "i");
  }
  if (protein) {
    query.protein = RegExp(protein, "i");
  }
  if (servingsize) {
    query.servingsize = RegExp(servingsize, "i");
  }
  if (filter) {
    query.filter = RegExp(filter, "i");
  }
  if (q) {
    query.name = RegExp(q, "i");
  }

  const pageNumber = page || 1;
  const pageLimit = limit || 10;
  const pagination = pageNumber * pageLimit - pageLimit || 0;

  try {
    const nutrient = await NutrientModel.find(query)
      .skip(pagination)
      .limit(pageLimit);
    res.status(200).send({ data: nutrient });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// to add new nutrient data only by authorized (admin)
nutriRouter.post("/add", adminauth, async (req, res) => {
  const payload = req.body;
  try {
    const nutrient = new NutrientModel(payload);
    await nutrient.save();
    res.status(200).send({ message: "New nutrient data has been added" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// to update nutrien only by authorized (admin)
nutriRouter.patch("/update/:id", adminauth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const result = await NutrientModel.findByIdAndUpdate({ _id: id }, payload);
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "No matching documents found" });
    }
    res.status(200).send({
      message: `Documents have been updated`,
      data: payload,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// to delete nutrient only by authorized (admin)
nutriRouter.delete("/delete/:id", adminauth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await NutrientModel.findByIdAndDelete({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "No matching documents found" });
    }
    res
      .status(200)
      .send({ message: `${result.deletedCount} documents have been deleted` });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = nutriRouter;
