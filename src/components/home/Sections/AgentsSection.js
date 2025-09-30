import React from "react";
import { Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tina10 from "../../../assets/agent/tina/tina10.png";

const AgentsSection = () => {
  const agents = [
    {
      id: 1,
      name: "Tammy Donnelly",
      title: "Broker/Owner/ABR®",
      bio: "Tammy Donnelly has lived on St. John since 1978. Her first retail job was in 1979 – 1981 here at the ..",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tammy-Donnelly-About-150x150.jpg",
      email: "340realestateco@gmail.com",
      phone: "+1 340-643-6068",
    },
    {
      id: 2,
      name: "Jennifer Doran",
      title: "Sales Associate",
      bio: "Jennifer arrived on St. John in the mid 80’s, just in time to celebrate her 18th birthday! Jennifer .",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Jennifer-Doran-home-334x500-1-150x150.jpg",
      email: "jdoran.340realestate@gmail.com",
      phone: "+1 340-998-0006",
    },
    {
      id: 3,
      name: "Tina Petitto",
      title: "Sales Associate",
      bio: "Tina Petitto has lived on St John since 2004, when she left her then position as Director of Finance",
      image: tina10,
      email: "tina340realestate@gmail.com",
      phone: "+1 305-299-4411",
    },
    {
      id: 4,
      name: "Rosanne Ramos Lloyd",
      title: "Sales Associate",
      bio: "Rosanne Ramos Lloyd is the newest sales agent to join 340 Real Estate Company. Born and raised in ...",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Rosanne-Ramos-Lloyd-150x150.jpg",
      email: "340realestaterrl@gmail.com",
      phone: "+1 401-996-6751",
    },
    {
      id: 5,
      name: "Jenn Manes",
      title: "Sales Associate",
      bio: "Jenn Manes is the newest realtor to join 340 Real Estate Co. She has blogged about St. John real ...",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/05/image0-150x150.png",
      email: "jenn@explorestj.com",
      phone: "+1 203-376-3786",
    },
    {
      id: 6,
      name: "Adonis Morton",
      title: "Sales Associate",
      bio: "Born, raised and educated on ST Thomas, Adonis moved to St John 20 years ago after meeting and ...",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Adonis-Morton-2-150x150.jpg",
      email: "adonis.340realestate@gmail.com",
      phone: "+1 340-690-0338",
    },
    {
      id: 7,
      name: "Mary Moroney",
      title: "Sales Associate",
      bio: "Mary Moroney hails from New England, born and raised in Connecticut she moved north to Maine in ..",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mary-Moroney-welcome-page-150x150.jpg",
      email: "mcm.340realestate@gmail.com",
      phone: "+1 340-244-6664",
    },
    {
      id: 8,
      name: "John McCann",
      title: "Broker Associate",
      bio: "Born in Hawaii, John has always had island living in his blood. Life leads him from Hawaii to ...",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/John-McCann-150x150.jpg",
      email: "john@helloimjohn.com",
      phone: "+1 340-998-0423",
    },
    {
      id: 9,
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
    <section id="agents" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#3c6a72] mb-4">
            Meet Our Family
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our experienced team of real estate professionals dedicated to
            helping you find your perfect piece of paradise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agent/${agent.id}`)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center cursor-pointer"
            >
              {/* Agent Photo */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-tropical-100">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-tropical-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Agent Info */}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {agent.name}
              </h3>
              <p className="text-tropical-600 font-medium mb-3">
                {agent.title}
              </p>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {agent.bio}
              </p>

              {/* Contact Buttons */}
              <div
                className="flex justify-center space-x-3"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={`mailto:${agent.email}`}
                  className="w-10 h-10 bg-tropical-100 hover:bg-tropical-200 rounded-full flex items-center justify-center transition-colors duration-300 group"
                  aria-label={`Email ${agent.name}`}
                >
                  <Mail
                    size={18}
                    className="text-tropical-600 group-hover:text-tropical-700"
                  />
                </a>
                <a
                  href={`tel:${agent.phone}`}
                  className="w-10 h-10 bg-tropical-100 hover:bg-tropical-200 rounded-full flex items-center justify-center transition-colors duration-300 group"
                  aria-label={`Call ${agent.name}`}
                >
                  <Phone
                    size={18}
                    className="text-tropical-600 group-hover:text-tropical-700"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#3c6a72] to-[#3d8b99] rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-serif font-bold mb-4">
              Ready to Work with Our Team?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Let us help you find your dream property in St. John
            </p>
            <button
              onClick={handleContactClick}
              className="px-8 py-4 bg-white text-tropical-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
