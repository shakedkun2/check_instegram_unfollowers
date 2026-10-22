# 📷 Instagram Unfollower Tracker (React + Cloudflare Pages)

A modern, mobile-friendly web app to find out who doesn't follow you back on Instagram. Designed to run smoothly directly on your phone with zero server setup.

---

## ✨ Features

- **📱 Mobile-First:** Designed specifically to be used from your phone browser (iOS Safari, Android Chrome).
- **📦 Direct `.ZIP` Support:** Upload the raw export `.zip` directly from Instagram without needing to unzip it on your phone.
- **📄 Multi-JSON Support:** Also accepts individual `followers_1.json` and `following.json` files.
- **🎯 One-Tap Profile Links:** Tap "Profile" next to any user to open their profile directly inside the Instagram app.
- **✅ Unfollow Check-off Tracker:** Check off accounts as you unfollow them so you never lose your spot.
- **📊 Clean Categories:** *Not Following Back*, *Total Following*, and *Total Followers*.
- **📋 Export Options:** Copy usernames to clipboard or export to a `.txt` file with one tap.

---

## 🚀 How to Deploy to Cloudflare Pages (Free Forever)

You don't need any server or credit card. Cloudflare Pages connects directly to your GitHub repository:

1. Push this repository to GitHub:
   ```bash
   git push origin main
   ```
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
3. Click **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
4. Select your `check_instegram_unfollowers` repository.
5. In the Build settings:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Click **Save and Deploy**.

Cloudflare will deploy your site and provide a permanent `*.pages.dev` URL that you can open on your phone or save to your home screen.

---

## 📱 How to Use on Your Phone

### 1. Download your data from Instagram
1. Open the Instagram app &rarr; go to your profile &rarr; tap menu (☰) &rarr; **Accounts Center**.
2. Tap **Your information and permissions** &rarr; **Download your information**.
3. Tap **Download or transfer information** &rarr; choose **Some of your information**.
4. Scroll down and check only **Followers and following**.
5. Choose **Download to device**.
6. Set Format to **JSON** (Date range: All time) and tap **Submit request**.
7. Once Instagram notifies you that your download is ready, download the `.zip` file to your phone.

### 2. Check your unfollowers
1. Open your Cloudflare Pages URL in Safari / Chrome on your phone.
2. Tap the upload box and select the downloaded `.zip` file.
3. Browse the **Not Following Back** tab and tap **Profile** to unfollow them in the Instagram app!

---

## 💻 Local Development

```bash
npm install
npm run dev
```

To build for production:
```bash
npm run build
```
