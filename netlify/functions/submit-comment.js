const { Octokit } = require('@octokit/rest');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the form data
    const { name, email, comment, entrySlug } = JSON.parse(event.body);

    if (!name || !comment) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and comment are required' }),
      };
    }

    // GitHub configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set in Netlify environment variables
    const REPO_OWNER = 'Sparklyturtle17';
    const REPO_NAME = 'chronicle';
    const BRANCH_BASE = 'commentsAsJson';
    const COMMENTS_FILE_PATH = 'public/comments.json';

    // Initialize Octokit
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // Step 1: Get the current comments.json
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
      entry: entrySlug,
      name,
      comment,
      date: new Date().toISOString(),
    };

    comments.push(newComment);

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
      ref: `refs/heads/${branchName}`,
      sha: baseRef.object.sha,
    });

    // Step 4: Update the file
    const updatedContent = Buffer.from(JSON.stringify(comments, null, 2)).toString('base64');
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: COMMENTS_FILE_PATH,
      message: `Add comment from ${name}`,
      content: updatedContent,
      branch: branchName,
      sha: fileData.sha,
    });

    // Step 5: Create the PR
    const pr = await octokit.pulls.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title: `New comment from ${name}`,
      head: branchName,
      base: BRANCH_BASE,
      body: `Comment details:\n- Name: ${name}\n- Email: ${email}\n- Comment: ${comment}\n- Entry: ${entrySlug}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, prUrl: pr.data.html_url }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit comment' }),
    };
  }
};