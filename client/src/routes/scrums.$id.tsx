import { createFileRoute, useParams } from '@tanstack/react-router'
import { ScrumLayout } from '../components/layout/ScrumLayout'

const ScrumsRoute = () => {
    const { id } = Route.useParams();

    return <ScrumLayout>
        <p>Scrum {id}</p>
    </ScrumLayout>
}

export const Route = createFileRoute('/scrums/$id')({
  component: ScrumsRoute
})