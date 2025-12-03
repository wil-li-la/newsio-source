#!/usr/bin/env python3
"""
Hacker News Ingestor
Fetches one top story and returns its title, text, and comments
"""

import urllib.request
import json
from html import unescape
import re


def strip_html_tags(html_text):
    """Remove HTML tags and decode HTML entities"""
    if not html_text:
        return ""
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', html_text)
    # Decode HTML entities like &quot; &amp; etc.
    clean_text = unescape(clean_text)
    return clean_text.strip()


def get_top_story(max_comments=10):
    """
    Fetch one top story and return its title, text, and top comments

    Args:
        max_comments (int): Maximum number of top-level comments to fetch (sorted by score)

    Returns:
        dict: Dictionary containing title, text, and comments
    """
    # Get top stories
    print("Fetching top story from Hacker News...")
    with urllib.request.urlopen('https://hacker-news.firebaseio.com/v0/topstories.json') as response:
        top_story_ids = json.loads(response.read())

    # Get the first story
    story_id = top_story_ids[0]
    print(f"Fetching story ID: {story_id}\n")

    # Fetch the story
    story_url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json"
    with urllib.request.urlopen(story_url) as response:
        story = json.loads(response.read())

    if not story:
        return None

    # Extract basic fields (only title, text, comments - no URL)
    result = {
        'title': story.get('title', ''),
        'text': strip_html_tags(story.get('text', '')),
        'comments': []
    }

    # Fetch and sort comments by score if they exist
    if 'kids' in story and story['kids']:
        print(f"Found {len(story['kids'])} top-level comments, fetching top {max_comments} by score...")

        # Fetch comment metadata to get scores
        comments_with_scores = []
        for comment_id in story['kids']:
            try:
                comment_url = f"https://hacker-news.firebaseio.com/v0/item/{comment_id}.json"
                with urllib.request.urlopen(comment_url) as response:
                    comment_data = json.loads(response.read())
                    if comment_data and not comment_data.get('deleted') and not comment_data.get('dead'):
                        score = comment_data.get('score', 0)
                        comments_with_scores.append((comment_id, score, comment_data))
            except Exception as e:
                print(f"Error fetching comment {comment_id} metadata: {e}")
                continue

        # Sort by score (highest first)
        comments_with_scores.sort(key=lambda x: x[1], reverse=True)

        # Take top N comments
        top_comments = comments_with_scores[:max_comments]
        print(f"Fetching {len(top_comments)} top comments...")

        # Format the top comments
        for comment_id, score, comment_data in top_comments:
            formatted = format_comment_data(comment_data, depth=0)
            if formatted:
                result['comments'].append(formatted)

    # Convert comments list to a single string
    result['comments'] = '\n\n---\n\n'.join(result['comments'])

    return result


def format_comment_data(comment_data, depth=0, max_depth=2):
    """
    Format a comment and recursively fetch its top replies

    Args:
        comment_data (dict): Comment data already fetched
        depth (int): Current recursion depth
        max_depth (int): Maximum depth to fetch replies

    Returns:
        str: Formatted comment text with replies
    """
    if not comment_data or comment_data.get('deleted') or comment_data.get('dead'):
        return None

    # Get comment text
    author = comment_data.get('by', 'unknown')
    text = strip_html_tags(comment_data.get('text', ''))
    score = comment_data.get('score', 0)

    if not text:
        return None

    # Format the comment with indentation and score
    indent = "  " * depth
    formatted_comment = f"{indent}[{author}] ({score} pts): {text}"

    # Fetch top replies if they exist and we haven't reached max depth
    if 'kids' in comment_data and comment_data['kids'] and depth < max_depth:
        # Limit replies to top 3 per comment
        reply_ids = comment_data['kids'][:3]
        replies = []

        for reply_id in reply_ids:
            try:
                reply_url = f"https://hacker-news.firebaseio.com/v0/item/{reply_id}.json"
                with urllib.request.urlopen(reply_url) as response:
                    reply_data = json.loads(response.read())

                reply = format_comment_data(reply_data, depth + 1, max_depth)
                if reply:
                    replies.append(reply)
            except Exception as e:
                print(f"Error fetching reply {reply_id}: {e}")
                continue

        if replies:
            formatted_comment += "\n" + "\n".join(replies)

    return formatted_comment


def main():
    """Main function - gets one top story and returns title, text, and comments"""

    story_data = get_top_story()

    #show story data attributes
    for key, value in story_data.items():
        print(f"{key}: {type(value)}")

    if story_data:
        print("="*80)
        print("TITLE:")
        print(story_data['title'])
        print("\n" + "="*80)

        print("TEXT:")
        print(story_data['text'] if story_data['text'] else "(No text content)")
        print("\n" + "="*80)

        print("COMMENTS:")
        print(story_data['comments'] if story_data['comments'] else "(No comments yet)")
        print("\n" + "="*80)

        # Print summary
        print(f"\nComment string length: {len(story_data['comments'])} characters")

        # Return the data
        return story_data
    else:
        print("Failed to fetch story data")
        return None


if __name__ == "__main__":
    main()