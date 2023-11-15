import Topbar from './components/topbar'
import Main from './components/main/index'

export default function App() {
  return (
    <div className="h-screen flex flex-col w-screen">
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <Topbar />
      </div>
      <main className="lg:grid lg:grid-cols-2 flex-1 overflow-hidden">
        <Main />
      </main>
    </div>
  )
}
