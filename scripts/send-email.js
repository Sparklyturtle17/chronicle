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
        const commitMessage = process.env.COMMIT_MESSAGE || 'A new entry has been added.';
        const commitDescription = process.env.COMMIT_DESCRIPTION || 'A new entry has been added.';

        // Use description for merges, message for direct pushes
        const isMerge = commitMessage.startsWith('Merge');


        const displayMessage = (isMerge && commitDescription ? commitDescription : commitMessage)
            .replace('[notify]', '')
            .trim();

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
        const emailSubject = `New Post to Adventures in Malawi!`;
        const emailHTML = `
            <h2>New Post to Adventures in Malawi!</h2>
            <p>Adventures in Malawi has been updated with a new post:</p>
            <p><strong>Message:</strong> ${displayMessage}</p>
            <p>Visit the live site to see the latest changes:</p>
            <p><a href="https://chronicle.adventuresinmalawi.com">https://chronicle.adventuresinmalawi.com</a></p>
        `;

        const emailText = `
            New Post to Adventures in Malawi!

            Adventures in Malawi has been updated with a new post:
            Message: ${displayMessage}
            Visit the live site to see the latest changes:
            https://chronicle.adventuresinmalawi.com
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
