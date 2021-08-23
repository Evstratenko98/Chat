const Router = require("express");

const dbController = require("../controllers/dbController.js");
const router = new Router();

router.post("/addRole", dbController.addRole);
router.post("/deleteRole", dbController.deleteRole);
router.get("/getRoles", dbController.getRoles);

router.post("/addUser", dbController.addUser);
router.post("/deleteUser", dbController.deleteUser);
router.put("/updateUser", dbController.updateUser);
router.post("/getUser", dbController.getUser);
router.get("/getUsers", dbController.getUsers);

router.post("/addRoom", dbController.addRoom);
router.post("/deleteRoom", dbController.deleteRoom);
router.post("/inviteRoom", dbController.inviteRoom);
router.get("/getRooms", dbController.getRooms);

router.post("/addMessage", dbController.addMessage);
router.post("/deleteMessage", dbController.deleteMessage);
router.post("/roomGetMessages", dbController.roomGetMessages);

module.exports = router;
