export default function Title() {
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
          <p>Friends and Family - Comments are now enabled!</p>
          <p>Please note, they will go through an approval process before appearing on the site.</p>
          <p>Real names of Mtemba and Chiboda will not be published.</p>
        </div>
      </div>
    </div>
  )
}