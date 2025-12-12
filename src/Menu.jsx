export default function Menu({ menuItems }) {
  return (
    <div className="menu" id="menu-sidebar">
        {menuItems.map((item, index) => (
            <div key={index} className="menu-item" onClick={() => {
              const element = document.getElementById(item);
              if (element) {
                const isSmall = window.innerWidth < 768;
                const title = document.getElementById('title-header');
                const menu = document.getElementById('menu-sidebar');
                let offset = title ? title.offsetHeight : 0;
                if (isSmall) {
                  offset += menu ? menu.offsetHeight : 0;
                }
                const elementTop = element.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: elementTop, behavior: 'smooth' });
              }
            }}>
                {item}
            </div>
        ))}
    </div>
  )
}