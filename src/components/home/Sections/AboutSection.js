import team from "../../../assets/team.jpeg"
import { Link } from "react-router-dom"

export default function AboutSection() {
  return (
    <div className="">
      <section className="min-h-[400px] md:min-h-[500px] lg:h-[70vh] w-full bg-[#406C6E] py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center mx-auto">
            {/* Left: Image */}
            <div className="flex justify-center order-1 md:order-1">
              <img
                src={team}
                alt="Our Team"
                className="w-full max-w-sm sm:max-w-md md:max-w-lg h-64 sm:h-72 md:h-80 lg:h-96 object-cover rounded-sm shadow-lg"
              />
            </div>

            {/* Right: Text Content */}
            <div className="text-white text-center md:text-left order-2 md:order-2 px-4 sm:px-6 md:px-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-alumni tracking-wide mb-3 sm:mb-4 md:mb-6">
                GET TO KNOW US
              </h2>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 text-gray-100 font-noto">
                Have you ever found yourself daydreaming about staying forever
                after the most relaxing vacation of your life—sunbathing on a
                tropical beach or taking a once-in-a-lifetime sabbatical in a
                remote island paradise? That dream of owning a piece of "the
                rock" may be closer than you think.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <Link to="/meetourteam">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-white text-[#406C6E] border border-white font-alumni font-semibold text-sm sm:text-base tracking-wide hover:bg-opacity-90 transition-all duration-300 uppercase">
                  MEET THE TEAM
                </button>
                </Link>
                <Link to="/contact">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-white border border-white font-alumni font-semibold text-sm sm:text-base tracking-wide hover:bg-white hover:text-[#406C6E] transition-all duration-300 uppercase">
                  CONTACT US
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
