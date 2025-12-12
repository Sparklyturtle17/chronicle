import React, { useState, useEffect } from 'react'
import Title from './Title.jsx'
import Menu from './Menu.jsx'
import EntriesContainer from './EntriesContainer.jsx'
import './index.css'
import './entries/entries.css'

export default function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      const modules = import.meta.glob('./entries/*.jsx');
      const loadedEntries = [];
      for (const path in modules) {
        console.log(path, modules);
        const module = await modules[path]();
        const Component = module.default;
        const title = module.title || Component.name;
        loadedEntries.push({ title, Component });
      }
      setEntries(loadedEntries);
      console.log(loadedEntries);
      setLoading(false);
    };
    loadEntries();
  }, []);

  if (loading) {
    return (
      <div className="fullpage flex items-center justify-center">
        <div className="text-xl">Loading entries...</div>
      </div>
    );
  }

  const menuItems = entries.map(entry => entry.title);

  return (
    <div className="fullpage">
      <div className="title" id="title-header">
        <Title></Title>
      </div>
        <div className="flex flex-col md:flex-row gap-4 m-4">
          <Menu
            menuItems={menuItems}
          />
          <EntriesContainer 
            entriesItems={entries} 
          />
        </div>
    </div>
  )
}
