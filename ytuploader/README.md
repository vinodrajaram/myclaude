# YT Batch Upload — Chrome Extension

Batch upload multiple local video files to YouTube directly from your browser. Auth uses your existing Chrome Google account. Per-video privacy control. Dark theme.

---

## Setup

### 1. Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Navigate to **APIs & Services → Library**
4. Search for **YouTube Data API v3** → Enable it
5. Go to **APIs & Services → Credentials**
6. Click **Create Credentials → OAuth 2.0 Client ID**
7. Set **Application type** to **Chrome App**
8. Leave the Application ID blank for now (you'll fill it in after loading the extension)
9. Click **Create** and copy the **Client ID**

### 2. Configure the Extension

Open `manifest.json` and replace the placeholder:

```json
"oauth2": {
  "client_id": "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com",
  ...
}
```

### 3. Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select the `youtube-uploader/` folder
4. Note the **Extension ID** shown on the card

### 4. Register the Extension ID in Google Console

1. Back in Google Cloud Console → Credentials → your OAuth 2.0 Client ID
2. Under **Application ID**, enter the Extension ID from step 3
3. Save

### 5. Icon (optional)

The extension ships with `icon.svg`. To use a raster icon, convert it to PNG:

```bash
# using Inkscape
inkscape icon.svg -w 128 -h 128 -o icon.png

# or using ImageMagick
convert -background none icon.svg -resize 128x128 icon.png
```

If `icon.png` is missing, Chrome will show a generic puzzle-piece icon — the extension still works.

---

## Usage

1. Click the extension icon in the Chrome toolbar
2. Sign in with Google when prompted
3. Drag video files onto the drop zone, or click **browse**
4. Set the privacy level per file (Public / Unlisted / Private)
5. Click **Upload All** — progress bars update in real time
6. Check [YouTube Studio](https://studio.youtube.com) to confirm uploads

---

## Notes

- Uploads run **sequentially** to respect YouTube API rate limits
- Title defaults to the filename (without extension)
- A **401 error** triggers an automatic token refresh and one retry
- Failed uploads show an **Error** badge with a **Retry** button
- The extension never stores your auth token — Chrome manages it via `chrome.identity`

---

## File Structure

```
youtube-uploader/
├── manifest.json   # MV3 config, OAuth2 scopes
├── popup.html      # Extension popup UI
├── popup.css       # Dark theme styles
├── popup.js        # Auth, upload queue, progress tracking
├── icon.svg        # Source icon
└── README.md       # This file
```

---

## Permissions

| Permission | Purpose |
|---|---|
| `identity` | OAuth2 token via `chrome.identity.getAuthToken` |
| `https://www.googleapis.com/*` | YouTube Data API v3 upload endpoint |

No data is sent anywhere except directly to YouTube's API.
