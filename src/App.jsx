import React, { useState, useEffect } from 'react'
import Title from './Title.jsx'
import Menu from './Menu.jsx'
import EntriesContainer from './EntriesContainer.jsx'
import Footer from './Footer.jsx'
import './index.css'
import Octokat from "octokat"

const htmlModules = import.meta.glob('./entries/*.html', { 
  query: '?raw',
  eager: true,
  import: 'default'
});

const commentsModules = import.meta.glob('./comments/*.html', { 
  query: '?raw',
  eager: true,
  import: 'default'
});


function extractMeta(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const title = doc.querySelector('title')?.textContent ?? 'Untitled';
  const date = doc.querySelector('meta[name="last-updated"]')?.getAttribute('content');
  const prettyDate = date ? new Date(date).toLocaleDateString() : '1/1/1970';

  const textEl = doc.querySelector('.entry-text');
  const mediaEl = doc.querySelector('.entry-media');

  const mediaItems = mediaEl
    ? Array.from(mediaEl.children).map((child) => {
        const isImg = child.tagName === 'IMG';
        return {
          html: child.outerHTML,
          alt: isImg ? child.getAttribute('alt') : ''
        };
      })
    : [];

  const commentsItems = Object.entries(commentsModules)
  .map(([path, html]) => ({
    ...extractCommentsMeta(html),
    html,
    path
  }))
  .filter((comment) => comment.postId == title)
  .sort((a, b) => new Date(b.prettyDate) - new Date(a.prettyDate));

  return {
    title,
    prettyDate,
    text: textEl?.innerHTML.trim() ?? '',
    media: mediaItems,
    comments: commentsItems
  };
}

function extractCommentsMeta(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const sender = doc.querySelector('meta[name="sender"]')?.getAttribute('content') ?? 'Untitled';
  const date = doc.querySelector('meta[name="last-updated"]')?.getAttribute('content');
  const prettyDate = date ? new Date(date).toLocaleDateString() : '1/1/1970';
  const postId = doc.querySelector('title')?.textContent ?? 'Untitled';

  const textEl = doc.querySelector('.entry-text');

  return {
    postId,
    sender,
    prettyDate,
    text: textEl?.innerHTML.trim() ?? '',
  };
}

const entries = Object.entries(htmlModules)
  .map(([path, html]) => ({
    ...extractMeta(html),
    html,
    path
  }))
  .sort((a, b) => new Date(a.prettyDate) - new Date(b.prettyDate));



export default function App() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentsUrl = `${import.meta.env.BASE_URL}comments.json`;
    fetch(commentsUrl)
      .then(res => res.json())
      .then(setComments)
      .catch(() => setComments([])); // in case file not found
  }, []);

  return (
    <div className="fullpage">
      <div className="title" id="title-header">
        <Title></Title>
      </div>
      <div className="flex flex-col md:flex-row gap-4 m-4">
        <Menu menuItems={entries} />
        <div>
          <EntriesContainer entriesItems={entries} comments={comments} />
        </div>
      </div>
      <div className="footer" id="footer-sticky">
        <Footer></Footer>
      </div>
    </div>
  )
}