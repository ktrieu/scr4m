import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '../components/layout/AuthLayout'
import { GoogleLogin } from '../components/GoogleLogin'

const RegisterRoute = () => {
  return <AuthLayout>
    <p className="text-xl mt-8 mb-6">Register with company:</p>
    <hr className="border-primary b-2 w-full mb-6" />
    <GoogleLogin />
  </AuthLayout>
}

export const Route = createFileRoute('/register')({
  component: RegisterRoute
})