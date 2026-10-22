import JSZip from 'jszip';

/**
 * Extracts a map of username -> metadata from raw Instagram JSON data
 */
export function extractUsers(jsonData) {
  const users = new Map();

  let targetList = jsonData;

  if (jsonData && typeof jsonData === 'object' && !Array.isArray(jsonData)) {
    // Check known root wrapper keys
    for (const key of ['relationships_following', 'relationships_followers']) {
      if (Array.isArray(jsonData[key])) {
        targetList = jsonData[key];
        break;
      }
    }
  }

  if (Array.isArray(targetList)) {
    for (const item of targetList) {
      if (!item) continue;

      let username = '';
      let href = '';
      let timestamp = null;

      // Format 1: string_list_data containing value, href, timestamp
      if (Array.isArray(item.string_list_data) && item.string_list_data.length > 0) {
        const first = item.string_list_data[0];
        if (first.value) username = first.value.trim().toLowerCase();
        if (first.href) href = first.href;
        if (first.timestamp) timestamp = first.timestamp;
      }

      // Format 2: title property has username
      if (!username && item.title) {
        username = item.title.trim().toLowerCase();
      }

      // Format 3: simple string
      if (typeof item === 'string') {
        username = item.trim().toLowerCase();
      }

      if (username) {
        if (!href) href = `https://www.instagram.com/${username}/`;
        users.set(username, { username, href, timestamp });
      }
    }
  }

  return users;
}

/**
 * Reads and processes files from an uploaded Instagram .zip archive
 */
export async function parseZipArchive(file) {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  const followingUsers = new Map();
  const followerUsers = new Map();

  const entries = Object.keys(loadedZip.files);

  let foundFollowing = false;
  let foundFollowers = false;

  for (const filename of entries) {
    const lower = filename.toLowerCase();

    // Look for following.json
    if (lower.includes('following') && lower.endsWith('.json')) {
      const content = await loadedZip.files[filename].async('text');
      try {
        const parsed = JSON.parse(content);
        const extracted = extractUsers(parsed);
        for (const [u, data] of extracted) {
          followingUsers.set(u, data);
        }
        foundFollowing = true;
      } catch (err) {
        console.warn(`Failed parsing ${filename}:`, err);
      }
    }

    // Look for followers*.json (e.g. followers_1.json, followers.json)
    if (lower.includes('follower') && lower.endsWith('.json')) {
      const content = await loadedZip.files[filename].async('text');
      try {
        const parsed = JSON.parse(content);
        const extracted = extractUsers(parsed);
        for (const [u, data] of extracted) {
          followerUsers.set(u, data);
        }
        foundFollowers = true;
      } catch (err) {
        console.warn(`Failed parsing ${filename}:`, err);
      }
    }
  }

  if (!foundFollowing && !foundFollowers) {
    throw new Error(
      "Could not find 'following.json' or 'followers_1.json' inside the zip. Please ensure you selected 'Followers and following' when requesting the export in JSON format."
    );
  }

  return calculateRelationships(followingUsers, followerUsers);
}

/**
 * Reads multiple individually uploaded .json files
 */
export async function parseJsonFiles(fileList) {
  const followingUsers = new Map();
  const followerUsers = new Map();

  for (const file of fileList) {
    const lower = file.name.toLowerCase();
    const text = await file.text();
    const parsed = JSON.parse(text);
    const extracted = extractUsers(parsed);

    if (lower.includes('following')) {
      for (const [u, data] of extracted) {
        followingUsers.set(u, data);
      }
    } else if (lower.includes('follower')) {
      for (const [u, data] of extracted) {
        followerUsers.set(u, data);
      }
    }
  }

  if (followingUsers.size === 0 && followerUsers.size === 0) {
    throw new Error(
      "Uploaded JSON files must have 'following' or 'followers' in their file names (e.g. following.json and followers_1.json)."
    );
  }

  return calculateRelationships(followingUsers, followerUsers);
}

/**
 * Computes difference and returns categories
 */
function calculateRelationships(followingMap, followerMap) {
  const followingList = Array.from(followingMap.values());
  const followerList = Array.from(followerMap.values());

  const followerSet = new Set(followerMap.keys());

  // People you follow who do NOT follow you back
  const notFollowingBack = followingList
    .filter((u) => !followerSet.has(u.username))
    .sort((a, b) => a.username.localeCompare(b.username));

  return {
    stats: {
      followingCount: followingMap.size,
      followersCount: followerMap.size,
      notFollowingBackCount: notFollowingBack.length,
    },
    notFollowingBack,
    allFollowing: followingList.sort((a, b) => a.username.localeCompare(b.username)),
    allFollowers: followerList.sort((a, b) => a.username.localeCompare(b.username)),
  };
}
