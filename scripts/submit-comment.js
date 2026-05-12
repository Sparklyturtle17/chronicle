const express = require('express');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// GitHub configuration
const GITHUB_TOKEN = process.env.COMMENT_TOKEN; // Set this in your environment
const REPO_OWNER = 'Sparklyturtle17';
const REPO_NAME = 'chronicle';
const BRANCH_BASE = 'main';
const COMMENTS_FILE_PATH = 'public/comments.json'; // Path in the repo

// Initialize Octokit with token
const octokit = new Octokit({ auth: GITHUB_TOKEN });

app.post('/submit-comment', async (req, res) => {
  try {
    const { name, email, comment, entrySlug } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ error: 'Name and comment are required' });
    }

    // Step 1: Get the current comments.json from the repo
    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: COMMENTS_FILE_PATH,
      ref: BRANCH_BASE,
    });

    const comments = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

    // Step 2: Add the new comment
    const newComment = {
      id: Date.now().toString(),
      name,
      email,
      comment,
      entrySlug,
      timestamp: new Date().toISOString(),
    };

    if (!comments[entrySlug]) {
      comments[entrySlug] = [];
    }
    comments[entrySlug].push(newComment);

    // Step 3: Create a new branch
    const branchName = `add-comment-${newComment.id}`;
    const { data: baseRef } = await octokit.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${BRANCH_BASE}`,
    });

    await octokit.git.createRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `refs/heads/main`,
      sha: baseRef.object.sha,
    });

    // Step 4: Update the file on the new branch
    const updatedContent = Buffer.from(JSON.stringify(comments, null, 2)).toString('base64');
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: COMMENTS_FILE_PATH,
      message: `Add comment from ${name}`,
      content: updatedContent,
      branch: branchName,
      sha: fileData.sha, // SHA of the file on base branch
    });

    // Step 5: Create a pull request
    const pr = await octokit.pulls.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title: `New comment from ${name}`,
      head: branchName,
      base: BRANCH_BASE,
      body: `Comment details:\n- Name: ${name}\n- Email: ${email}\n- Comment: ${comment}\n- Entry: ${entrySlug}`,
    });

    res.json({ success: true, prUrl: pr.data.html_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit comment' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});