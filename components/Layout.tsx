import SideScreen from "./SideScreen";

interface LayoutProps extends React.PropsWithChildren {
  sideScreenBody: JSX.Element
}

const Layout = (props: LayoutProps): JSX.Element => {
  return (
    <div className="flex flex-row h-screen">
      <SideScreen>
        {props.sideScreenBody}
      </SideScreen>
      <div className="w-full h-full bg-zinc-50">
        {props.children}
      </div>
    </div>
  )
}

export default Layout
