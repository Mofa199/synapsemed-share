import { redirect } from 'next/navigation'

export default function BadgesRedirect() {
  redirect('/gamification?tab=badges')
}
