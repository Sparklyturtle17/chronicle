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
  
  return {
    title: titleMatch?.[1] ?? 'Untitled',
    createDate: dateMatch?.[1] ?? '1970-01-01'
  };
}

const entries = Object.entries(htmlModules)
  .map(([path, html]) => ({
    ...extractMeta(html),
    html,
    path
  }))
  .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

export default function App() {
  const menuItems = entries.map(entry => entry.title);

  return (
    <div className="fullpage">
      <div className="title" id="title-header">
        <Title></Title>
      </div>
      <div className="flex flex-col md:flex-row gap-4 m-4">
        <Menu menuItems={menuItems} />
        <div>
          <EntriesContainer entriesItems={entries} />
          <Footer></Footer>
        </div>
      </div>
    </div>
  )
}