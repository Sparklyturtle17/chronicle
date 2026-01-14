export default function EntriesContainer({ entriesItems }) {
  return (
    <div className="w-full">
      {entriesItems.map((item) => (
        <div key={item.path} 
            id={item.title} 
            className="entry-item">
          <div>
            <div>
              <h2 className="entry-title">{item.title}</h2>
              <span className="entry-date">{item.prettyDate}</span>
            </div>
            <hr />
          </div>
          <div dangerouslySetInnerHTML={{ __html: item.html }}/>
        </div>
      ))}
    </div>
  );
}