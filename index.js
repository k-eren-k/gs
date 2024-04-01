const express = require("express");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");
app.use(express.static("images"));

cloudinary.config({
  cloud_name: "dmnlh52x4",
  api_key: "985118155375649",
  api_secret: "9me_XvHe7SjYDa9m1mqS6ROmW28",
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "glatasasyar",
    });
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/gif", (req, res) => {
  res.render("gif");
});
app.get("/test", (req, res) => {
  res.render("test");
});
app.get("/fav", (req, res) => {
  res.render("favoriler");
});
app.get("/admin", (req, res) => {
  res.render("admin");
});
const cache = require("memory-cache");

app.get("/cloudinary-images", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 240;

    const cacheKey = `cloudinaryImages_${page}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    let nextCursor = null;
    if (page > 1) {
      const prevPageKey = `cloudinaryImages_${page - 1}`;
      const prevPageData = cache.get(prevPageKey);
      if (prevPageData && prevPageData.next_cursor) {
        nextCursor = prevPageData.next_cursor;
      } else {
        throw new Error("Invalid pagination data");
      }
    }

    const cloudinaryImages = await cloudinary.api.resources({
      type: "upload",
      prefix: "glatasasyar/",
      max_results: pageSize,
      next_cursor: nextCursor,
    });

    cache.put(cacheKey, cloudinaryImages.resources, 60000);

    res.json(cloudinaryImages.resources);
  } catch (error) {
    console.error("Cloudinary Images Error:", error);
    res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
  }
});

app.post("/increase-view-count", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      throw new Error("Image URL is missing in the request body");
    }

    await Image.findOneAndUpdate({ imageUrl }, { $inc: { viewCount: 1 } });

    res.json({ success: true });
  } catch (error) {
    console.error("Increase View Count Error:", error);
    res.status(500).json({ error: "Failed to increase view count" });
  }
});

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
