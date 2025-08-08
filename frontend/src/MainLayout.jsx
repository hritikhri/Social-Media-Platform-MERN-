import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
const MainLayout = ({ children }) => {
  return (
    <>
      <div className={`div`} style={{minHeight:"100vh"}}>
        <div className="fixNavbar">
          <Navbar />
        </div>
        <main style={{ paddingTop: "60px"}}>{children}</main>
        <footer>
          <Footer/>
        </footer>
      </div>
    </>
  );
};

export default MainLayout;
