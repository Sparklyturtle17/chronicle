export default function Title({newestEntryTitle}) {
  return (
    <div className="flex items-stretch gap-4">
      <div className="flex-shrink-0">
        <img src="/chronicle/images/Malawi-Map.png" alt="Map of Malawi" className="h-24 w-auto" />
      </div>
      <div className="flex-grow flex flex-col items-end justify-between relative">
        <div className="w-full items-center">
          <h1 className="text-7xl font-bold">Adventures in Malawi!</h1>
        </div>
        <div className="text-right">
          <a className="notification" href={`#${newestEntryTitle}`}>Newest Entry: {newestEntryTitle}!</a>
        </div>
      </div>
    </div>
  )
}