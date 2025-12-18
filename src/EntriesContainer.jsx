export default function EntriesContainer({ entriesItems }) {
  return (
    <div className="w-full">
        {entriesItems.map((item, index) => (
            <div key={index} id={item.title} className="entry-item">
                <item.Component />
            </div>
        ))}
    </div>
  )
}