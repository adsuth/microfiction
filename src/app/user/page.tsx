"use client"

import { useUser } from "@auth0/nextjs-auth0/client"

export default function page()
{
  const {user, isLoading} = useUser()

  if ( isLoading )
    return

  if ( !user )
    window.location.href = "/api/auth/login"

  return (
    <div>page</div>
  )
}