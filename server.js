import express from "express";
import session from "express-session";
import path from "path";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { json } from "stream/consumers";

dotenv.config();

const app = express();
app.use(express.json()); // Add this line
app.use(cors());
app.use(
  session({
    secret: "YV^(dfg46TUV&^#G*&*^DRF^G&H*J", // Change this to a random secure key
    resave: false, // Avoid resaving if nothing has changed
    saveUninitialized: true, // Save new sessions
    cookie: {
      maxAge: 1000 * 60 * 60, // Session expires in 1 hour
      secure: false, // Set to true in production with HTTPS
    },
  })
);

const __dirname = dirname(fileURLToPath(import.meta.url));

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Get Session
const setSession = async (req, res) => {
  try {
    const url = `https://tile.googleapis.com/v1/3dtiles/root.json?key=${GOOGLE_API_KEY}`;
    // console.log("Fetching 3D tiles root from:", url);

    const response = await axios.get(url, {
      responseType: "json", // Since it returns binary data
    });

    // console.log("Fetched 3D tiles root:", response.data.root.children[0].children[0]);

    const fileURL = `https://tile.googleapis.com`+response.data.root.children[0].children[0].content.uri+`&key=${GOOGLE_API_KEY}`;
    const parsedUrl = new URL(fileURL);
    const SessionParam = parsedUrl.searchParams.get("session");
    req.session.user = { session: SessionParam, fileURL: fileURL };

    return SessionParam;

  } catch (error) {
    console.error("Error fetching session:", error.message);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};

const indiciesFromCoordinates = (latitude, longitude, zoom) => {
  if (longitude < 0 && longitude > -90 && latitude > 0 && latitude < 90) {
    const indicies = [2,1]

    let L_long = -90;
    let R_long = 0;
    let T_lat = 90;
    let B_lat = 0;

    for (let i = 2; i < zoom; i++) {
      if ((i+1)%5==0) {
        indicies.push(0);
        continue;
      }
      let index = 0;

      if (Math.abs((L_long+R_long)/2) > Math.abs(longitude)) {
        index += 1
        L_long = (L_long+R_long)/2
      }
      else {
        R_long = (L_long+R_long)/2
      }

      if ((T_lat+B_lat)/2 < latitude) {
        index += 2
        B_lat = (T_lat+B_lat)/2
      }
      else {
        T_lat = (T_lat+B_lat)/2
      }

      indicies.push(index);
      
    }
    console.log("Indicies:",indicies);

    return indicies;
  }

  return [0,0];
  
}

const getJSONResponse = async (fileResponse, indicies, SessionParam) => {

  let jsonResponse = fileResponse;

  for (let i = 0; i+5 < indicies.length; i+=5) {
    const jsonURL = `https://tile.googleapis.com`+ jsonResponse.data.root.children[indicies[i]].children[indicies[i+1]].children[indicies[i+2]].children[indicies[i+3]].children[indicies[i+4]].content.uri+`?session=${SessionParam}&key=${GOOGLE_API_KEY}`;
    console.log("Fetching json file from:", jsonURL);
    jsonResponse = await axios.get(jsonURL, {
        responseType: "json", // Since it returns binary data
    });
  }
  
  // console.log("Fetched json data:",latitude, longitude, jsonResponse.data.root.children[0].children[0].content.uri);

  return jsonResponse;
}

const getGLBFile = async (latitude, longitude, SessionParam, fileResponse, Indicies) => {

  let child = fileResponse.data.root;

  for (let i = 0; i < Indicies.length; i++) {
    child = child.children[Indicies[i]]; 
  }

  // GLB FILE LFG
  const GLBfileURL = `https://tile.googleapis.com`+ child.content.uri+`?session=${SessionParam}&key=${GOOGLE_API_KEY}`;
  console.log("Fetching 3D GLB tiles file from:", GLBfileURL);
  const GLBfileResponse = await axios.get(GLBfileURL, {
      responseType: "arraybuffer", // Since it returns binary data
  });
  console.log("Fetched 3D tiles file for:",latitude, longitude, GLBfileResponse.data);

  return GLBfileResponse.data;

};

app.post("/api/get-indicies", async (req, res) => {
  let {latitude, longitude, zoom} = req.body;

  if (latitude == null || longitude == null || zoom == null) {
    console.log("Latitude or longitude not found");
    latitude = 0;
    longitude = 0;
    zoom = 21;
  }

  let indicies = indiciesFromCoordinates(latitude, longitude, zoom);

  res.json({indicies: indicies});
});

// Get 3D tiles from Google Maps
app.post("/api/get-3d-tiles", async (req, res) => {
  let {latitude, longitude, zoom = 17, Indicies } = req.body;

  if (latitude == null || longitude == null) {
    console.log("Latitude or longitude not found");
    latitude = 0;
    longitude = 0;
  }

  if (!req.session.user) {
    await setSession(req, res);
  }
  const session = req.session.user.session;
  if (!session) {
    console.error("Session not found");
  }

  try {
      const SessionParam = session;
      const fileURL = req.session.user.fileURL;
      
      // console.log("Fetching 3D tiles file from:", fileURL);
      const fileResponse = await axios.get(fileURL, {
          responseType: "json", // Since it returns binary data
      });
      // console.log("Fetched 3D tiles file:", fileResponse.data.root.children[0].children[0].content.uri);

      let indicies = Indicies;
      if (Indicies == null) {
        indicies = indiciesFromCoordinates(latitude, longitude, zoom);
      }

      console.log("Fetching 3D tiles from:",indicies);

      // GLB FILE LFG
      const jsonResponse = await getJSONResponse(fileResponse, indicies, SessionParam);
      
      const GLBFile = await getGLBFile(latitude, longitude, SessionParam, jsonResponse, indicies.slice(indicies.length-(indicies.length%5), indicies.length));

      res.setHeader("Content-Type", "application/octet-stream"); // GLB or binary type
      res.send(GLBFile);

  } catch (error) {
      console.error("Error fetching 3D tiles:", error.message);
      res.status(500).json({ error: "Failed to fetch 3D tiles" });
  }
});

// Serve static files from the "dist" directory
app.use(express.static(join(__dirname, "dist")));

// Handle all other routes by serving the main index.htmls
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
