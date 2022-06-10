import Nav from "./nav";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Nav />
      <main>{children}</main>
      <Footer/>
    </div>
  );
}
