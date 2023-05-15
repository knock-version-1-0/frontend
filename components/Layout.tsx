import SideScreen from "./SideScreen";

interface LayoutProps extends React.PropsWithChildren {
  sideScreenBody: JSX.Element
}

const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <div className="flex flex-row justify-center w-screen h-screen bg-zinc-50">
      <SideScreen>
        {props.sideScreenBody}
      </SideScreen>
      {props.children}
    </div>
  )
}

export default Layout
