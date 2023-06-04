interface LoginLayoutProps extends React.PropsWithChildren {
  title: string | React.ReactNode
}

export const LoginLayout: React.FC<LoginLayoutProps> = ({ title, children }) => {
  return (
    <div className="px-4">
      <div className="mt-36 py-12 text-xl font-light">
        { title }
      </div>
      { children }
    </div>
  )
}
