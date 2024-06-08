import { createLazyFileRoute } from '@tanstack/react-router'

const Index = () => {
    return <>
        <p>Index</p>
    </>
}

export const Route = createLazyFileRoute('/')({
    component: Index,
})

