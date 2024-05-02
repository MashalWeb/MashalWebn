const { validateTokan } = require("../Services/authentication");

function checkForAuthCookie(cookieName) {
   return (req, res, next) => {
      const tokanCookieValue = req.cookies[cookieName];
      if (!tokanCookieValue) {
         next();
      }

      try {
         const userpayload = validateTokan(tokanCookieValue);
         req.user = userpayload;
      } catch (error) {
         return null;
      }
      next();
   };
}

module.exports = checkForAuthCookie;
