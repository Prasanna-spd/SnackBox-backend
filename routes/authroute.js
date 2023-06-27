const router = require("express").Router();
const passport = require("passport");
const clientUrl = process.env.CLIENT_URL;

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${clientUrl}`,
    failureRedirect: `${clientUrl}/login`,
  })
);

router.get(`${clientUrl}/login`, (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.clearCookie("session");
  res.redirect(clientUrl);
});

router.get("/login/success", (req, res) => {
  if (req.user) {
    const sessionId = req.cookies.session;
    const userEmail = req.user.emails[0].value;
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      sessionId: sessionId,
      email: userEmail,
      //   cookie: res.cookie,
    });

    // console.log("Session ID:", sessionId);
  }
});

module.exports = router;
