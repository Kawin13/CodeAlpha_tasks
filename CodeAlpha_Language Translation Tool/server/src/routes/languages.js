const { Router } = require("express");
const translationService = require("../services/translation.service");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const languages = await translationService.getLanguages();
    res.json(languages);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
