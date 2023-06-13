export default function Layout(props: {
  children: React.ReactNode;
  wrapper: React.ReactNode;
}) {
  return (
    <>
      {props.children}
      {props.wrapper}
    </>
  );
}
