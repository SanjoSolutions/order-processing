"use client"

import { useEffect, useState } from "react"

interface User {}

export default function () {
  const [users, setUsers] = useState<User[]>([])

  useEffect(function () {
    async function requestUsers() {
      // FIXME
      // const result = await client.queries.users()
      // console.log("result", result)
    }

    requestUsers()
  }, [])

  return (
    <div>
      <h1>Users</h1>

      <ul className="list-group">
        <li className="list-group-item">An item</li>
        <li className="list-group-item">A second item</li>
        <li className="list-group-item">A third item</li>
        <li className="list-group-item">A fourth item</li>
        <li className="list-group-item">And a fifth one</li>
      </ul>
    </div>
  )
}
