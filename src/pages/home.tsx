import NavBar from "../components/navbar";
import "bootstrap/dist/css/bootstrap.css";
import imagePath from "../assets/app-logo.png";

function HomePage() {
  return (
    <div
      style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", color: "white" }}
    >
      <NavBar
        brandName="AI Speech Clarity"
        imageSrcPath={imagePath}
        navItems={["Home", "About Us"]}
      />
      <section className="hero-section py-32 flex items-center justify-center">
        <div className="container mx-auto flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
          <div className="md:w-1/2 order-2 md:order-1 text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Improve Your Speech with Our{" "}
              <span className="text-indigo-400">Speech Clarity App</span>
            </h1>
            <p className="text-lg md:text-xl">
              Empower your communication with our advanced AI-driven speech
              clarity solutions. Achieve clearer and more effective speech in
              any environment.
            </p>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="/register"
                className="btn btn-primary px-6 py-3 text-lg font-semibold"
              >
                Get Started
              </a>
              <a
                href="/learn-more"
                className="btn btn-secondary px-6 py-3 text-lg font-semibold"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2 text-center">
            <img
              src={imagePath}
              alt="AI Speech Clarity"
              className="w-3/4 md:w-full max-w-lg mx-auto transform md:rotate-3 hover:rotate-0 transition duration-500 ease-in-out"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
