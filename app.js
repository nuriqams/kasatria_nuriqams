const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { google } = require("googleapis");

const app = express();

app.use(express.static("public"));
app.use(session({ secret: "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", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );

  app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/success");
    }
  );

  app.get("/success", (req, res) => {
    res.send("You are logged in!");
  });
  
  app.get("/logout", (req, res) => {
    req.logout(err => {
      if (err) { return next(err); }
      res.redirect("/");
    });
  });

//Spreadsheet ID: 1wBNTGX5LdR9jqk_TvXaOmYyDyAVqBpwmLZO3G0xGiNU
//API Key: AIzaSyB1JlCIVrZDgWUR9MPhQW0fuOsnjAQkBZk

const cors = require("cors");
const PORT = 3000;

app.use(cors()); // Enable CORS

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // Path to service account credentials
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const apiKey = "AIzaSyB1JlCIVrZDgWUR9MPhQW0fuOsnjAQkBZk"; // Replace with your API key

// Fetch data from Google Sheets
app.get("/api/sheetdata", async (req, res) => {
  try {
    const spreadsheetId = "1wBNTGX5LdR9jqk_TvXaOmYyDyAVqBpwmLZO3G0xGiNU"; // Replace with your spreadsheet ID

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      key: apiKey,
    });

    const targetSheet = response.data.sheets.find(
      (sheet) => sheet.properties.title === "Sheet1"
    );

    if (!targetSheet) {
      return res.status(404).json({ error: "Sheet not found!" });
    }

    const range = `${targetSheet.properties.title}!A1:Z`;
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      key: apiKey,
    });

    res.json(dataResponse.data.values);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
