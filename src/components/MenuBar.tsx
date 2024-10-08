import React from 'react'
import { Menu } from 'lucide-react'

const MenuBar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="flex items-center">
        <Menu className="mr-4" />
        <h1 className="text-xl font-bold">Browser-like Interface</h1>
      </div>
    </div>
  )
}

export default MenuBar