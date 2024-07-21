const { OAuth2Client } = require("google-auth-library");

const authToken = async (req, res) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
  }

  verify().catch(console.error);
  console.log(verify);
};

module.exports = authToken;
