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
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const dateMatch = html.match(/<meta\s+name="last-updated"\s+content="([^"]+)"/);
  const prettyDate = dateMatch ? new Date(dateMatch[1]).toLocaleDateString() : null;
  
  return {
    title: titleMatch?.[1] ?? 'Untitled',
    prettyDate: prettyDate || '1/1/1970'
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
          <Footer></Footer>
        </div>
      </div>
    </div>
  )
}