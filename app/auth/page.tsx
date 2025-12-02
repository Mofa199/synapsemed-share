"use client"

import { redirect } from "next/navigation"

export default function Auth() {
  // Redirect to the proper login page
  redirect("/login")
}