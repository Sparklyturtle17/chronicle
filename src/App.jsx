import React from 'react'
import Title from './Title.jsx'
import Menu from './Menu.jsx'
import EntriesContainer from './EntriesContainer.jsx'
import Footer from './Footer.jsx'
import './index.css'

const htmlModules = import.meta.glob('./entries/*.html', { 
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
    ? Array.from(mediaEl.children).map((child) => child.outerHTML)
    : [];

  return {
    title,
    prettyDate,
    text: textEl?.innerHTML.trim() ?? '',
    media: mediaItems
  };
}

const entries = Object.entries(htmlModules)
  .map(([path, html]) => ({
    ...extractMeta(html),
    html,
    path
  }))
  .sort((a, b) => new Date(b.prettyDate) - new Date(a.prettyDate));

export default function App() {

  return (
    <div className="fullpage">
      <div className="title" id="title-header">
        <Title></Title>
      </div>
      <div className="flex flex-col md:flex-row gap-4 m-4">
        <Menu menuItems={entries} />
        <div>
          <EntriesContainer entriesItems={entries} />
        </div>
      </div>
      <div className="footer" id="footer-sticky">
        <Footer></Footer>
      </div>
    </div>
  )
}