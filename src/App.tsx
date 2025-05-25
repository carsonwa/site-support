import './App.css'
import Chat from './components/Chat'
import InstructionEditor from './components/InstructionEditor'

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50 justify-center items-stretch">
      <div className="w-[600px] h-full bg-white border-r">
        <InstructionEditor />
      </div>
      <div className="w-[600px] h-full bg-white shadow-lg">
        <Chat />
      </div>
    </div>
  )
}

