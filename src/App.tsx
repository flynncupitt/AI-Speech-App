import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import imagePath from "./assets/app-logo.png";

function App() {
  let items = ["Home", "Product", "Service"];
  return (
    <div>
      <NavBar
        brandName="AI Speech Clarity"
        imageSrcPath={imagePath}
        navItems={items}
      />
    </div>
  );
}

export default App;
