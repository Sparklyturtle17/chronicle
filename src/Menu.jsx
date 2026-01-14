import { useState } from 'react';

export default function Menu({ menuItems }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = (item) => {
    const element = document.getElementById(item);
    if (element) {
      const isSmall = window.innerWidth < 768;
      const menu = document.getElementById('menu-sidebar');
      let offset = 20;
      if (isSmall) {
        offset += menu ? menu.offsetHeight : 0;
      }
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: elementTop, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <div className="menu" id="menu-sidebar">
      <button 
        className="menu-toggle md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        List of Entries ☰
      </button>
      <div className={`menu-items ${isOpen ? 'open' : ''}`}>
        {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="menu-item" 
              onClick={() => handleMenuClick(item.title)}
            >
              <p className="entry-date">{item.prettyDate}</p>
              <p className="entry-title">{item.title}</p>
            </div>
        ))}
      </div>
    </div>
  )
}