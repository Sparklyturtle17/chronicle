export default function EntriesContainer({ entriesItems }) {
  return (
    <div className="w-full">
      {entriesItems.map((item) => (
        <div 
          key={item.path} 
          id={item.title} 
          className="entry-item"
          dangerouslySetInnerHTML={{ __html: item.html }}
        />
      ))}
    </div>
  );
}