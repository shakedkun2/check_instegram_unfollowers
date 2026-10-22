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

      // Format 2: title property has username (common in following.json)
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
 * Determines whether a file represents 'following' or 'followers' based on
 * its filename (basename only, avoiding parent folder names) or JSON structure.
 */
function identifyFileType(parsedJson, filename) {
  // 1. Check JSON structure signature
  if (parsedJson && typeof parsedJson === 'object' && !Array.isArray(parsedJson)) {
    if ('relationships_following' in parsedJson) return 'following';
    if ('relationships_followers' in parsedJson) return 'followers';
  }

  // 2. Check filename basename (ignore folder paths like "followers_and_following/")
  const basename = filename.split('/').pop().split('\\').pop().toLowerCase();

  if (basename.startsWith('following') && basename.endsWith('.json')) {
    return 'following';
  }
  if (basename.startsWith('follower') && basename.endsWith('.json')) {
    return 'followers';
  }

  return 'unknown';
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

  for (const filename of entries) {
    if (!filename.toLowerCase().endsWith('.json')) continue;

    const basename = filename.split('/').pop().toLowerCase();
    
    // Only inspect files whose names start with 'following' or 'follower'
    if (!basename.startsWith('following') && !basename.startsWith('follower')) {
      continue;
    }

    try {
      const content = await loadedZip.files[filename].async('text');
      const parsed = JSON.parse(content);
      const fileType = identifyFileType(parsed, filename);
      const extracted = extractUsers(parsed);

      if (fileType === 'following') {
        for (const [u, data] of extracted) {
          followingUsers.set(u, data);
        }
      } else if (fileType === 'followers') {
        for (const [u, data] of extracted) {
          followerUsers.set(u, data);
        }
      }
    } catch (err) {
      console.warn(`Failed parsing ${filename}:`, err);
    }
  }

  if (followingUsers.size === 0 && followerUsers.size === 0) {
    throw new Error(
      "Could not find 'following.json' or 'followers_1.json' inside the zip. Please ensure you selected 'Followers and following' in JSON format."
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
    const text = await file.text();
    const parsed = JSON.parse(text);
    const fileType = identifyFileType(parsed, file.name);
    const extracted = extractUsers(parsed);

    if (fileType === 'following') {
      for (const [u, data] of extracted) {
        followingUsers.set(u, data);
      }
    } else if (fileType === 'followers') {
      for (const [u, data] of extracted) {
        followerUsers.set(u, data);
      }
    }
  }

  if (followingUsers.size === 0 && followerUsers.size === 0) {
    throw new Error(
      "Uploaded JSON files must be named following.json and followers_1.json."
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
