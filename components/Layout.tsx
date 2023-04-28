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
      {props.children}
    </div>
  )
}

export default Layout
