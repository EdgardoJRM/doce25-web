export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout simple sin protección de autenticación para la página de login
  return <>{children}</>
}

