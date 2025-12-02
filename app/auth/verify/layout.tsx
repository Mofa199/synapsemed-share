import { Suspense } from "react"

export default function Layout({ children }: { children: any }) {
    return (
        <Suspense fallback={null}>
            {children}
        </Suspense>
    )
}
