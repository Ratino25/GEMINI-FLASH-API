const { GoogleGenerativeAI } = require("@google/generative-ai");

const dotenv = require("dotenv");
const e = require("express");
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const port = 3000;

dotenv.config();
const app = express();
app.use(express.json());

