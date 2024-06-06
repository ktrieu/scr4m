import { RegisterBodySchema } from "@scr4m/common"
import { GoogleLogin } from "./components/GoogleLogin"


function App() {
  RegisterBodySchema.parse({ token: '' })
  return (
    <>
      <GoogleLogin />
    </>
  )
}

export default App
