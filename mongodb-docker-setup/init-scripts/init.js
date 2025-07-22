db = db.getSiblingDB("dagverse");

db.createUser({
  user: "appuser",
  pwd: "AppUserPassword123",
  roles: [
    {
      role: "readWrite",
      db: "dagverse"
    }
  ]
});