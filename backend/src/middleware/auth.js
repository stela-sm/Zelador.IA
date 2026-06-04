import "dotenv/config";

const auth = (req, res, next) => {
  const secret = req.headers["x-admin-secret"];

  console.log(
    "Auth middleware - received secret:",
    secret?.substring(0, 5) + "...",
  );
  console.log(
    "Auth middleware - expected secret:",
    process.env.ADMIN_SECRET?.substring(0, 5) + "...",
  );

  if (secret !== process.env.ADMIN_SECRET) {
    console.log("Auth failed!");
    return res.status(401).json({ error: "Não autorizado" });
  }

  console.log("Auth passed!");
  next();
};

export default auth;
