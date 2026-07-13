#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'fs';
import { createTransport } from 'nodemailer';
import { join } from 'path';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
            const emailFilePath = join(__dirname, './emails.txt');
            if (!existsSync(emailFilePath)) {
                process.exit(1);
            }

            const emailsContent = readFileSync(emailFilePath, 'utf-8');
            emails = emailsContent
                .split(',')
                .map(email => email.trim())
                .filter(email => email.length > 0);
        }

        if (emails.length === 0) {
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

        const entriesDir = join(__dirname, '../src/entries');
        let mostRecentEntryTitle = 'Untitled';

        if (existsSync(entriesDir)) {
            const entries = readdirSync(entriesDir)
                .filter(f => f.endsWith('.html'))
                .map(file => {
                    const html = readFileSync(join(entriesDir, file), 'utf-8');
                    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
                    const dateMatch = html.match(/<meta\s+name=["']last-updated["']\s+content=["'](.*?)["']/i);
                    const prettyDate = dateMatch ? new Date(dateMatch[1]).toLocaleDateString() : '1/1/1970';
                    return {
                        title: titleMatch ? titleMatch[1].trim() : 'Untitled',
                        prettyDate,
                    };
                })
                .sort((a, b) => new Date(b.prettyDate) - new Date(a.prettyDate));
            
            if (entries.length > 0) {
                mostRecentEntryTitle = entries[0].title;
            }
        }

        const scrolledLink = 'https://sparklyturtle17.github.io/chronicle/#scrollTo=' + encodeURIComponent(mostRecentEntryTitle);

        // Configure email transporter
        // Using Gmail as example - you can change to your email service
        const transporter = createTransport({
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
            <p><a href=${scrolledLink}>https://sparklyturtle17.github.io/chronicle/</a></p>
        `;

        const emailText = `
            New Post to Adventures in Malawi!

            Adventures in Malawi has been updated with a new post:
            Message: ${displayMessage}
            Visit the live site to see the latest changes:
            https://chronicle.adventuresinmalawi.com
        `;

        for (const email of emails) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: emailSubject,
                text: emailText,
                html: emailHTML,
            });
        }

    } catch (error) {
        process.exit(1);
    }
}

sendMergeNotification();
