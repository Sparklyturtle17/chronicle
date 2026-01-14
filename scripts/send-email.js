#!/usr/bin/env node

const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');

async function sendMergeNotification() {
  try {
    // Read email list from environment variable or file
    let emails = [];
    
    if (process.env.EMAIL_LIST) {
      // Use environment variable (from GitHub Actions)
      emails = process.env.EMAIL_LIST
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
    } else {
      // Fall back to local file (for development)
      const emailFilePath = path.join(__dirname, '../emails.txt');
      if (!fs.existsSync(emailFilePath)) {
        console.error('Error: EMAIL_LIST environment variable or emails.txt file not found');
        process.exit(1);
      }

      const emailsContent = fs.readFileSync(emailFilePath, 'utf-8');
      emails = emailsContent
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
    }

    if (emails.length === 0) {
      console.error('Error: No valid email addresses found in emails.txt');
      process.exit(1);
    }

    // Get commit information from environment
    const commitSha = process.env.GITHUB_SHA || 'unknown';
    const commitMessage = process.env.COMMIT_MESSAGE || 'A new version has been deployed';
    const repositoryName = process.env.GITHUB_REPOSITORY || 'Chronicle';
    const actor = process.env.GITHUB_ACTOR || 'Unknown User';

    // Configure email transporter
    // Using Gmail as example - you can change to your email service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Prepare email content
    const emailSubject = `${repositoryName} - New deployment to main`;
    const emailHTML = `
      <h2>${repositoryName} Deployment Notification</h2>
      <p>A new version has been merged to the main branch and deployed.</p>
      <ul>
        <li><strong>Repository:</strong> ${repositoryName}</li>
        <li><strong>Deployed by:</strong> ${actor}</li>
        <li><strong>Commit:</strong> ${commitSha.substring(0, 7)}</li>
        <li><strong>Message:</strong> ${commitMessage}</li>
      </ul>
      <p>Visit the live site to see the latest changes.</p>
    `;

    const emailText = `
${repositoryName} Deployment Notification

A new version has been merged to the main branch and deployed.

Repository: ${repositoryName}
Deployed by: ${actor}
Commit: ${commitSha.substring(0, 7)}
Message: ${commitMessage}

Visit the live site to see the latest changes.
    `;

    // Send emails
    console.log(`Sending notification emails to ${emails.length} recipient(s)...`);
    
    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: emailSubject,
          text: emailText,
          html: emailHTML,
        });
        console.log(`✓ Email sent to ${email}`);
      } catch (error) {
        console.error(`✗ Failed to send email to ${email}:`, error.message);
      }
    }

    console.log('Email notification process completed');
  } catch (error) {
    console.error('Error sending emails:', error.message);
    process.exit(1);
  }
}

sendMergeNotification();
