import { validateTokan } from "../Services/authentication.js";

function checkForAuthCookie(cookieName) {
   return (req, _, next) => {
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

export default checkForAuthCookie;
