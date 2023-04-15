import { SideScreen } from "./side-screen";

const Layout = (props: React.PropsWithChildren): JSX.Element => {
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
