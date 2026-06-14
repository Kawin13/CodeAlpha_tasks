const LANG_RE = /^[a-z]{2,7}$/;
const MAX_CHARS = 2000;

function validateTranslate(req, res, next) {
  const { text, source, target } = req.body;

  if (!text || typeof text !== "string") {
    const err = new Error("text is required.");
    err.status = 400;
    err.code = "VALIDATION_ERROR";
    return next(err);
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    const err = new Error("text cannot be empty.");
    err.status = 400;
    err.code = "VALIDATION_ERROR";
    return next(err);
  }

  if (trimmed.length > MAX_CHARS) {
    const err = new Error(`Text must be ${MAX_CHARS.toLocaleString()} characters or less.`);
    err.status = 400;
    err.code = "VALIDATION_ERROR";
    return next(err);
  }

  if (!source || (source !== "auto" && !LANG_RE.test(source))) {
    const err = new Error("Invalid source language code.");
    err.status = 400;
    err.code = "VALIDATION_ERROR";
    return next(err);
  }

  if (!target || !LANG_RE.test(target)) {
    const err = new Error("Invalid target language code.");
    err.status = 400;
    err.code = "VALIDATION_ERROR";
    return next(err);
  }

  if (source !== "auto" && source === target) {
    const err = new Error("Source and target languages must be different.");
    err.status = 400;
    err.code = "VALIDATION_ERROR";
    return next(err);
  }

  req.body.text = trimmed;
  next();
}

module.exports = { validateTranslate };
