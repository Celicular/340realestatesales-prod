import React from "react";
import { Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tina10 from "../../../assets/agent/tina/tina10.png";
import aboutstHero from "../../../assets/team.jpeg";

const AgentsSection = () => {
  const agents = [
    {
      id: "tammy-donnelly",
      name: "Tammy Donnelly",
      title: "Broker/Owner/ABR®",
      bio: "Tammy Donnelly has lived on St. John since 1978. Her first retail job was in 1979 – 1981 here at the ..",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tammy-Donnelly-About-150x150.jpg",
      email: "340realestateco@gmail.com",
      phone: "+1 340-643-6068",
    },
    {
      id: "jennifer-doran",
      name: "Jennifer Doran",
      title: "Sales Associate",
      bio: "Jennifer arrived on St. John in the mid 80's, just in time to celebrate her 18th birthday! Jennifer .",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Jennifer-Doran-home-334x500-1-150x150.jpg",
      email: "jdoran.340realestate@gmail.com",
      phone: "+1 340-998-0006",
    },
    {
      id: "tina-petitto",
      name: "Tina Petitto",
      title: "Sales Associate",
      bio: "Tina Petitto has lived on St John since 2004, when she left her then position as Director of Finance",
      image: tina10,
      email: "tina340realestate@gmail.com",
      phone: "+1 305-299-4411",
    },
    {
      id: "rosanne-ramos-lloyd",
      name: "Rosanne Ramos Lloyd",
      title: "Sales Associate",
      bio: "Rosanne Ramos Lloyd is the newest sales agent to join 340 Real Estate Company. Born and raised in ...",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Rosanne-Ramos-Lloyd-150x150.jpg",
      email: "340realestaterrl@gmail.com",
      phone: "+1 401-996-6751",
    },
    {
      id: "jenn-manes",
      name: "Jenn Manes",
      title: "Sales Associate",
      bio: "Jenn Manes is the newest realtor to join 340 Real Estate Co. She has blogged about St. John real ...",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/05/image0-150x150.png",
      email: "jenn@explorestj.com",
      phone: "+1 203-376-3786",
    },
    {
      id: "adonis-morton",
      name: "Adonis Morton",
      title: "Sales Associate",
      bio: "Born, raised and educated on ST Thomas, Adonis moved to St John 20 years ago after meeting and ...",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Adonis-Morton-2-150x150.jpg",
      email: "adonis.340realestate@gmail.com",
      phone: "+1 340-690-0338",
    },
    {
      id: "mary-moroney",
      name: "Mary Moroney",
      title: "Sales Associate",
      bio: "Mary Moroney hails from New England, born and raised in Connecticut she moved north to Maine in ..",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mary-Moroney-welcome-page-150x150.jpg",
      email: "mcm.340realestate@gmail.com",
      phone: "+1 340-244-6664",
    },
    {
      id: "john-mccann",
      name: "John McCann",
      title: "Broker Associate",
      bio: "Born in Hawaii, John has always had island living in his blood. Life leads him from Hawaii to ...",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/John-McCann-150x150.jpg",
      email: "john@helloimjohn.com",
      phone: "+1 340-998-0423",
    },
    {
      id: "mark-shekleton",
      name: "Mark Shekleton",
      title: "Sales Associate",
      bio: "Mark Shekleton arrived on St. John in 1979 and has been a full-time resident since. Mark started a .",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mark-Shekleton-500x500-1-150x150.jpg",
      email: "mark@seaviewhomes.com",
      phone: "+1 340-513-2608",
    },
  ];

  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };
  return (
    <div className="App relative scroll-smooth p-3">
     <section className="w-full bg-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
        <img
          src={aboutstHero}
          alt="Meet the Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-wide mb-4">
            Meet the Team
          </h1>
        </div>
      </div>
    </section>
    <section id="agents" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-light text-gray-800 tracking-wide mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our experienced team of real estate professionals is dedicated to
            helping you find your perfect piece of paradise.
          </p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agent/${agent.id}`)}
              className="relative group cursor-pointer overflow-hidden"
            >
              {/* Agent Portrait Image */}
              <div className="relative w-full h-80 overflow-hidden">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay for name */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Agent Name */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-serif font-light tracking-wide uppercase">
                    {agent.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-white border border-gray-200 p-12 lg:p-16">
            <h3 className="text-3xl lg:text-4xl font-alumni font-light text-gray-800 tracking-wide mb-6">
              Ready to Work with Our Team?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-noto">
              Let us help you find your dream property in St. John
            </p>
            <button
              onClick={handleContactClick}
              className="px-8 py-4 bg-gray-800 text-white font-alumni font-medium tracking-wide uppercase hover:bg-gray-700 transition-all duration-300"
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default AgentsSection;
