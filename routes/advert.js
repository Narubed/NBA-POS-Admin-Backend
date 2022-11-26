const router = require("express").Router();
const advert = require("../controllers/advert.controller");
const auth = require("../lib/checkToken");

router.get("/", advert.findAll);
router.get("/:id", advert.findOne);

router.post("/", auth, advert.create);

router.delete("/:id", auth, advert.delete);
router.put("/:id", auth, advert.update);

module.exports = router;
