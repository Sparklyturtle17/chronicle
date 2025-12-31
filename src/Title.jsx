import malawiMap from './images/Malawi-Map.png'

export default function Title() {
  return (
    <div className="flex items-stretch gap-4">
      <div className="flex-shrink-0">
        <img src={malawiMap} alt="Map of Malawi" className="h-24 w-auto" />
      </div>
      <div className="flex-grow flex flex-col items-center relative">
        <h1 className="text-7xl font-bold">Adventures in Malawi!</h1>
        <div className="absolute bottom-0 right-0 text-right text-lg">
          <p>If you already have Mom's phone number,</p>
          <p>you can download whatsapp to message her.</p>
          <p className="text-xs">-you might want to turn off auto-download in the settings.</p>
        </div>
      </div>
    </div>
  )
}