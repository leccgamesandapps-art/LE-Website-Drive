'use client'

import { HardDrive } from 'lucide-react'

export default function DrivePage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Drive</h2>
        <p className="text-zinc-500 text-sm">Encrypted personal storage powered by INFI DATABASE</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
        <div className="border-2 border-dashed border-zinc-800 rounded-xl p-16 text-center">
          <HardDrive className="w-14 h-14 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 font-medium">Drop files here or click to upload</p>
          <p className="text-xs text-zinc-600 mt-2">Files are encrypted client-side before storage</p>
          <button className="mt-6 bg-sky-600 hover:bg-sky-500 px-5 py-2 rounded-xl text-sm font-medium">
            Select Files
          </button>
        </div>
      </div>
    </div>
  )
}