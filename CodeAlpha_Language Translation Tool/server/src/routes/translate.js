const { Router } = require("express");
const { validateTranslate } = require("../middleware/validate");
const translationService = require("../services/translation.service");

const router = Router();

router.post("/", validateTranslate, async (req, res, next) => {
  try {
    const { text, source, target } = req.body;
    const result = await translationService.translate({ text, source, target });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
