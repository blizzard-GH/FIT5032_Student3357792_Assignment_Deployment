/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const logger = require("firebase-functions/logger");
const cors = require("cors")({origin: true});
const sgMail = require("@sendgrid/mail");

const {google} = require("googleapis");

admin.initializeApp();

// Function to count events in the collection
exports.countevents = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      console.log("Fetching event collection...");
      const eventCollection = admin.firestore().collection("SAHevents");
      const snapshot = await eventCollection.get();
      console.log("Collection fetched");
      const count = snapshot.size;
      res.status(200).send({count});
      console.log("Document count:", count);
    } catch (error) {
      console.error("Error counting events:", error.message);
      res.status(500).send("Error counting events.");
    }
  });
});

// Function to fetch all events in the collection
exports.getallevents = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      console.log("Fetching books collection...");
      const eventCollection = admin.firestore().collection("books");
      const snapshot = await eventCollection.get();
      console.log("Collection fetched");
      const events = [];
      snapshot.forEach((doc) => {
        events.push({id: doc.id, ...doc.data()});
      });
      res.status(200).json(events);
      console.log("Document count:", events.length);
    } catch (error) {
      console.error("Error counting books:", error.message);
      res.status(500).send("Error counting books.");
    }
  });
});

// Function to capitalise all letters in event titles before saving to Firestore
exports.capitaliseEventTitles = functions.firestore
    .document("SAHevents/{eventID}")
    .onCreate(async (snap, context) => {
      const originalName = snap.data().eventname;
      const fullyCapitalisedTitle = originalName.toUpperCase();

      return snap.ref.update({
        eventname: fullyCapitalisedTitle,
      });
    });

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const {subject, text, attachments} = req.body;
    if (!subject || !text) {
      res.status(400).send("Missing required fields");
      return;
    }

    sgMail.setApiKey(functions.config().sendgrid.key);

    const msg = {
      to: "fay.abdillah@gmail.com",
      from: "netol49663@skrak.com",
      subject,
      text,
      attachments: attachments || [],
    };

    sgMail
        .send(msg)
        .then(() => res.status(200).send("Email sent successfully!"))
        .catch((error) => {
          console.error("Failed to send email:", error);

          if (error.response && error.response.body &&
            error.response.body.errors) {
            res.status(500).send(`Failed to send email: 
              ${error.response.body.errors.map((e) => e.message).join(", ")}`);
          } else {
            res.status(500).send("Failed to send email.");
          }
        });
  });
});

exports.sendBulkEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const {subject, text, recipients, attachments} = req.body;
    if (!subject || !text) {
      res.status(400).send("Missing required fields");
      return;
    }

    sgMail.setApiKey(functions.config().sendgrid.key);

    const msg = {
      to: recipients,
      from: "netol49663@skrak.com",
      subject,
      text,
      attachments: attachments || [],
    };

    sgMail
        .sendMultiple(msg)
        .then(() => res.status(200).send("Emails sent successfully"))
        .catch((error) => {
          console.error("Failed to send emails:", error);
          if (error.response && error.response.body &&
            error.response.body.errors) {
            res.status(500).send(`Failed to send email: 
              ${error.response.body.errors.map((e) => e.message).join(", ")}`);
          } else {
            res.status(500).send("Failed to send email.");
          }
        });
  });
});

exports.getCalendarEvents = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    const accessToken = req.query.accessToken;
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken,
    });
    const calendar = google.calendar({version: "v3", auth: oauth2Client});

    calendar.events.list({
      calendarId: "primary",
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    }, (error, result) => {
      if (error) {
        console.error("The API returned an error: " + error);
        res.status(500).send(error);
        return;
      }
      const events = result.data.items;
      if (events.length) {
        console.log("Upcoming 10 events:", events);
        res.status(200).send(events);
      } else {
        console.log("No upcoming events found.");
        res.status(404).send("No upcoming events found.");
      }
    });
  });
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

