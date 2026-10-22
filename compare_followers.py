import json
import glob
import os
import sys
from pathlib import Path


def extract_usernames(data):
    """
    Extracts a set of usernames from Instagram export data formats.
    """
    usernames = set()

    if isinstance(data, dict):
        for key in ("relationships_following", "relationships_followers"):
            if key in data:
                data = data[key]
                break

    if isinstance(data, list):
        for entry in data:
            if isinstance(entry, dict):
                string_list = entry.get("string_list_data", [])
                if string_list and isinstance(string_list, list):
                    for item in string_list:
                        if isinstance(item, dict) and "value" in item:
                            usernames.add(item["value"].strip().lower())
                elif "title" in entry and entry["title"]:
                    usernames.add(entry["title"].strip().lower())
            elif isinstance(entry, str):
                usernames.add(entry.strip().lower())

    return usernames


def load_json(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    data_dir = Path("data")

    # Find following file
    following_files = list(data_dir.glob("*following*.json"))
    if not following_files:
        print("❌ Error: Could not find following.json in data/ folder.", file=sys.stderr)
        sys.exit(1)

    # Find follower files
    follower_files = list(data_dir.glob("*follower*.json"))
    if not follower_files:
        print("❌ Error: Could not find followers.json or followers_1.json in data/ folder.", file=sys.stderr)
        sys.exit(1)

    following_users = set()
    for f in following_files:
        following_users.update(extract_usernames(load_json(f)))

    follower_users = set()
    for f in follower_files:
        follower_users.update(extract_usernames(load_json(f)))

    not_following_back = sorted(following_users - follower_users)

    print(f"\n📊 Instagram Relationship Summary:")
    print(f" - Accounts you follow: {len(following_users)}")
    print(f" - Accounts following you: {len(follower_users)}")
    print(f" - Not following you back: {len(not_following_back)}\n")

    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)

    with open(output_dir / "not_following_back.txt", "w", encoding="utf-8") as f:
        for user in not_following_back:
            f.write(f"https://www.instagram.com/{user}/\n")

    print(f"Saved unfollowers list to {output_dir / 'not_following_back.txt'}")


if __name__ == "__main__":
    main()
