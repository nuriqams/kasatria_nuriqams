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

  
async function listSheetNames() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

    const spreadsheetId = "1wBNTGX5LdR9jqk_TvXaOmYyDyAVqBpwmLZO3G0xGiNU"; // Replace with your actual spreadsheet ID
    const response = await sheets.spreadsheets.get({ spreadsheetId });
    
    console.log("Sheet names:");
    response.data.sheets.forEach(sheet => console.log(sheet.properties.title));
}

listSheetNames();
