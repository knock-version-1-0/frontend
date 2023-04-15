import { SideScreen } from "./side-screen";

interface LayoutProps extends React.PropsWithChildren {}

const Layout = (props: LayoutProps): JSX.Element => {
  return (
    <div className="flex flex-row h-screen">
      <SideScreen></SideScreen>
      <div className="w-full h-full bg-zinc-50">
        {props.children}
      </div>
    </div>
  )
}

export default Layout
