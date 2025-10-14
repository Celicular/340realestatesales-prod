import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAgents } from "../firebase/firestore";

import teamhero from "../assets/teamcrop.jpg";

// Tammy's images
import tammy1 from "../assets/agent/tammy/tammy1.jpg";
import tammy2 from "../assets/agent/tammy/tammy2.jpg";
import tammy3 from "../assets/agent/tammy/tammy3.jpg";
import tammy4 from "../assets/agent/tammy/tammy4.jpg";
import tammy5 from "../assets/agent/tammy/tammy5.jpg";
import tammy6 from "../assets/agent/tammy/tammy6.jpg";

// Tina's images
import tina1 from "../assets/agent/tina/tina1.jpg";
import tina2 from "../assets/agent/tina/tina2.jpg";
import tina3 from "../assets/agent/tina/tina3.jpg";
import tina4 from "../assets/agent/tina/tina4.jpg";
import tina5 from "../assets/agent/tina/tina5.jpg";
import tina6 from "../assets/agent/tina/tina6.jpg";
import tina7 from "../assets/agent/tina/tina7.jpg";
import tina8 from "../assets/agent/tina/tina8.jpg";
import tina9 from "../assets/agent/tina/tina9.jpg";
import tina10 from "../assets/agent/tina/tina10.png";

// Jenn's images
import jenn1 from "../assets/agent/Jenn/jenn1.jpg";
import jenn2 from "../assets/agent/Jenn/jenn2.jpg";
import jenn3 from "../assets/agent/Jenn/jenn3.jpg";
import jenn4 from "../assets/agent/Jenn/jenn4.jpg";
import jenn5 from "../assets/agent/Jenn/jenn5.jpg";

// Adonis's images
import adonis1 from "../assets/agent/adronis/adronis1.jpg";
import adonis2 from "../assets/agent/adronis/adronis2.jpg";
import adonis3 from "../assets/agent/adronis/adronis3.jpg";
import adonis4 from "../assets/agent/adronis/adronis4.jpg";
import adonis5 from "../assets/agent/adronis/adronis5.jpg";

const AgentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all agents from Firestore
        const result = await getAgents({ status: 'active', sortBy: 'name' });
        
        if (result.success) {
          // Find agent by Firestore ID or by legacy ID (converted to string)
          const foundAgent = result.data.find(a => 
            a.id === id || a.legacyId === id
          );
          
          if (foundAgent) {
            setAgent(foundAgent);
          } else {
            // Fallback to local agentsData for name-based IDs
            const localAgent = agentsData.find(a => a.id === id);
            if (localAgent) {
              setAgent(localAgent);
            } else {
              setError('Agent not found');
            }
          }
        } else {
          // Fallback to local agentsData if Firestore fails
          const localAgent = agentsData.find(a => a.id === id);
          if (localAgent) {
            setAgent(localAgent);
          } else {
            setError(result.error || 'Failed to fetch agent data');
          }
        }
      } catch (err) {
        console.error('Error fetching agent:', err);
        setError('Failed to load agent information');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgent();
    }
  }, [id]);

  // Agent data with additional images and details
  const agentsData = [
    {
      id: "tammy-donnelly",
      name: "Tammy Donnelly",
      title: "Broker / Owner / ABR®",
      bio: "Tammy Donnelly has lived on St. John since 1978. Her first retail job was in 1979 – 1981 here at the 340 Real Estate Company. She has been a licensed real estate agent since 1981 and has been the broker/owner of 340 Real Estate Company since 1985.",
      fullBio: `Tammy Donnelly has lived on St. John since 1978. Her first retail job was in 1979 – 1981 here at the Dockshop.

Prior to earning her real estate brokers license in 2000, Tammy worked for many years as a restaurant manager and a vacation rental home manager on St. John. She is also the former owner/builder of the “Tennis Villa” and has experience in the construction and development field.

Tammy has served on the St John Board of Realtors for seven years; two terms as President, a Board member of the Fish Bay Owners Association, Past President of the St. John Antilles Parent Association, and current Board member of the Friends of the Park. She supports many other community organizations including (St John Cancer Fund, Friends of the Park, Love City Pan Dragons, the ACC and more) and environmental organizations here and abroad.

Tammy and her husband Jeff another longtime island resident reside in Fish Bay. Jeff is the owner of Jolly Dog and Zemi Designs stores located in Isola Shoppes in Coral Bay.

Tammy has gained the respect of customers and clients who recognize her dedication, hard work, honesty and knowledge in real estate. Tammy prides herself on providing excellent customer service.`,
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tammy-Donnelly-About.jpg",
      images: [
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tammy-Donnelly-About.jpg",

        tammy1,
        tammy2,
        tammy3,
        tammy4,
        tammy5,
        tammy6,
        "https://340realestateco.com/wp-content/uploads/2021/10/IMG_3838-375x500.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Tammy-Donnelly.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/IMG_5960-375x500.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Tammy-Grandbabies.jpg",
      ],
      email: "340realestateco@gmail.com",
      phone: "+1 340-643-6068",
      experience: "40+ Years",
      specialties: [
        "Luxury Properties",
        "Investment Properties",
        "Beachfront Homes",
        "Commercial Real Estate",
      ],
      achievements: [
        "Top Producer 2023",
        "Luxury Property Specialist",
        "Community Leader Award",
      ],
      location: "Cruz Bay, St. John",
    },
    {
      id: "jennifer-doran",
      name: "Jennifer Doran",
      title: "Sales Associate",
      bio: "Jennifer arrived on St. John in the mid 80's, just in time to celebrate her 18th birthday! Jennifer has been a licensed real estate agent since 1990.",
      fullBio: `Jennifer arrived on St. John in the mid 80’s, just in time to celebrate her 18th birthday! Jennifer was born and raised in Germany and the mountains of the Basque country, world famous for its exquisite surfing beaches and the beauty of the Pyrenees Mountains. Her love for beautiful places brought Jennifer to St. John when her father asked her to work with him on his new venture, the first “true” grocery store on island and NY style deli.

After many years, Jennifer left the successful family business and opened the famous Dockside Pub on St. John. For 12 years she was the first smiling face you saw when arriving by ferry to St. John. Her passion for food and hard work made Dockside Pub a local favorite and it is still missed 14 years after its closing. Her two sons Justin and Julien, who were both born and raised in St. John, had their lunch boxes coveted daily for the fabulous sandwiches Jennifer packed for them!

Jennifer eventually took her natural salesmanship abilities to the Westin St. John and successfully sold vacation ownership for 13 years. Her friendly and hardworking personality made her a favorite among Westin St. John clients.

Life in an office became too sedentary for this energetic lady and it became time to move on to her long dreamt passion for real estate sales and property management. Her never-ending quest for perfection and exemplary customer service makes this an easy transition for Jennifer. She has traded her corporate heels for flip flops and is quickly growing her property management business with several homes already under her management.

Jennifer joined 340 Real Estate in 2015 and is very excited to translate her love and knowledge of St. John into finding the perfect home for clients looking for their own beloved piece of the island. Her never-ending smile and trusting soul make her the right choice for anyone looking to buy or sell property on this little slice of paradise she has called home for over 30 years.`,
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Jennifer-Doran-home-334x500-1.jpg",
      images: [
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Jennifer-Doran-home-334x500-1.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Jennifer-Doran-Family-500x335.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Jennifer-Doran-Happy-500x333.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Jennifer-Doran.jpg",
      ],
      email: "jdoran.340realestate@gmail.com",
      phone: "+1 340-998-0006",
      experience: "30+ Years",
      specialties: [
        "Residential Sales",
        "Property Management",
        "First-time Buyers",
        "Island Properties",
      ],
      achievements: ["Excellence in Service Award", "Top Sales Associate 2022"],
      location: "Coral Bay, St. John",
    },
    {
      id: "tina-petitto",
      name: "Tina Petitto",
      title: "Sales Associate",
      bio: "Tina Petitto has lived on St John since 2004, when she left her then position as Director of Finance to pursue her passion for real estate.",
      fullBio: `Tina Petitto has lived on St John since 2004, when she left her then position as Director of Finance for the Sales and Marketing Division of Hearst Publications in Charlotte, NC. She spent her childhood until the age of 21 living in the Middle East and SE Asia. Time away from home was spent at boarding school, college and the Graduate School at Villanova University.

 In the late 80’s she was introduced to St John by her still best friend from High School. After a short two year stay, and many return visits, she moved back with her family. Tina is a Finance and Accounting Manager for many St John businesses, owns several rental properties, and has recently become more formally involved in the world of Real Estate. 

She currently resides in quiet and peaceful Fish Bay with her contractor husband, Joe Nogueira. 

Her daughter, stepson, and two stepdaughters live in the Carolinas, which is a place still close to her heart. She loves spending time in Miami visiting her mother and, most of all, traveling and exploring the world with her daughter and family.`,
      image: tina10,
      images: [
        tina10,
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tina-Petitto-sm.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Maia-Tina.png",
        "https://340realestateco.com/wp-content/uploads/2021/10/Joe-Tina-500x425.png",
        tina1,
        tina2,
        tina3,
        tina4,
        tina5,
        tina6,
        tina7,
        tina8,
        tina9,
        tina10,
      ],
      email: "tina340realestate@gmail.com",
      phone: "+1 305-299-4411",
      experience: "15+ Years",
      specialties: [
        "Investment Properties",
        "Financial Analysis",
        "Property Valuation",
        "Market Trends",
      ],
      achievements: ["Financial Excellence Award", "Investment Specialist"],
      location: "Cruz Bay, St. John",
    },
    {
      id: "rosanne-ramos-lloyd",
      name: "Rosanne Ramos Lloyd",
      title: "Sales Associate",
      bio: "Rosanne Ramos Lloyd is the newest sales agent to join 340 Real Estate Company. Born and raised in the Virgin Islands, she brings local expertise and fresh perspective.",
      fullBio: `Rosanne Ramos Lloyd is the newest sales agent to join 340 Real Estate Company. Born and raised in Houston Texas, Rosanne started what would become a lifelong Residential Design career with a Bachelor’s Degree in Architecture from the University of Houston in 1997. After five years working as a designer in the office of Natalye Appel + Associates Architects LLC, she left Houston for Rhode Island School of Design to complete her Masters in Industrial Design. After graduating, Rosanne taught in the Undergraduate ID program at RISD and started her own design practice, Inclusion By Design LLC. During her time in Rhode Island, Rosanne was introduced to St. John when she met the owner of Maho Bay Camps, Stanley Selengut, in New York. Stanley’s interest in Rosanne’s work was routed in her commitment inclusive design, and then grew to impact the development, and later renovation, of Concordia Eco-Resort.

Rosanne met her future husband Wayne on St. John in 2004 while working on “Building a Destination for All, 2005;” an awareness raising initiative for the tourism industry to develop an island wide physical infrastructure accessible for all ages and abilities, specifically aging populations and persons with disabilities. In January 2010 Rosanne moved full time to St John, married Wayne and continued her design work.

Rosanne has 23 years of professional experience working directly with homeowners on residential design, construction administration and owner representation. Rosanne is owner of Antares Property & Hospitality LLC, serving St. John homeowners with management and marketing of short-term villa rentals. Subsequently, she and her husband opened Island Host, a full-service concierge located in the Isola Shops Building in Coral Bay.

Since 2005, Rosanne has donated her professional expertise on the Francis Bay Accessible Trail, and Cinnamon Bay Accessible Trail through Friends of the Virgin Islands National Park and has taken commissioned work with FVINP, including a comprehensive accessibility study of the park’s beaches and trail system, as well as a Trail Ratings Project. Rosanne is an active member of FVINP advisory council.

Prior to 340 and Antares, Rosanne was principal of Inclusion By Design LLC, an interdisciplinary design practice committed to creating built environments, products, systems, and graphic information for people across all ages and abilities. Her hands-on, collaborative style of research, analysis, and design is a result of her multidisciplinary training in Architecture and Industrial Design combined with her 23 years of professional experience. Rosanne’s work history is diverse in industry and scope. Her greatest talent is for understanding the multiplicity in human experience and using that knowledge to ensure user-centered solutions. Her capabilities range from lead designer, project manager, and primary consultant to construction administrator.

Under Rosanne’s direction, Inclusion By Design became an established leader in the field of inclusive strategy for both public and private projects. Her passion and commitment to socially responsible and sustainable design remains a significant part of her life’s work. The confidence that is displayed in her work comes from understanding the impact her design will have on people’s lives and receiving that knowledge as an obligation and responsibility to demonstrate discipline and accountability in everything she does. Rosanne has been invited to speak at national and international forums, from Nevada to Florida and from Brazil to Mozambique, about these issues and to showcase her work.

Her gift is in listening and understanding to the wants, needs and tastes of her clients. Her expertise is in knowing how design impacts usability and the satisfaction of each individual client.

Focus
Real Estate / Property Management
Home Design, Addition & Renovation
Inclusive Design / Universal Design / Human Centered Design
Assistive Technology / Ethnographic Research Methodologies
User Experience / Collaborative & Inclusive Processes
Beyond ADA Compliance`,
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Rosanne-Ramos-Lloyd.jpg",
      images: [
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Rosanne-Ramos-Lloyd.jpg",
        "https://340realestateco.com/wp-content/uploads/2023/05/Rosanne-768x822.jpeg",
      ],
      email: "340realestaterrl@gmail.com",
      phone: "+1 401-996-6751",
      experience: "5+ Years",
      specialties: [
        "Local Market Expertise",
        "New Construction",
        "Luxury Homes",
        "International Buyers",
      ],
      achievements: ["Rising Star Award", "Local Expert Recognition"],
      location: "St. John, USVI",
    },
    {
      id: "jenn-manes",
      name: "Jenn Manes",
      title: "Sales Associate",
      bio: "Jenn Manes is the newest realtor to join 340 Real Estate Co. She has blogged about St. John real estate and brings digital marketing expertise.",
      fullBio: `Jenn Manes is the newest realtor to join 340 Real Estate Co. She has blogged about St. John real estate for over a decade and discusses it almost daily with her island tour guests. Jenn is very excited to formally launch her real estate career here in St. John. 

Jenn Manes and sonJenn moved to St. John from Connecticut more than 10 years ago. She launched News of St. John, an online blog geared toward tourists in 2013, and was the owner and publisher until it was sold in 2020. During that time, she created St. Johnopoly, a Monopoly-style board game that was customized for the island of St. John. Jenn has provided in-person island tours since 2017 and launched Explore STJ, a newer online blog for tourists in 2022. Prior to moving to the island, Jenn worked as a marketing director for a university in Connecticut and also as an award-winning crime reporter.

Jenn officially became a homeowner on St. John in 2023 when she purchased an adorable little cottage in Fish Bay (with the help of 340 Real Estate Co., of course!). She lives with her longtime partner Mike Hedy, their five-year-old son Dalton, who attends Gifft Hill School, and Lucy, their rambunctious ACC rescue cat.

Jenn is on the board of the Animal Care Center (ACC) and the Estate Fish Bay Owners’ Association. In her free time, Jenn enjoys gardening, snorkeling with Dalton and hiking around the island. 

If you’d like to know more about the happenings in St. John, please check out Jenn’s blog at www.explorestj.com. `,
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/05/image0.png",
      images: [
        "https://340realestatestjohn.com/wp-content/uploads/2024/05/image0.png",
        jenn1,
        jenn2,
        jenn3,
        jenn4,
        jenn5,

        "https://340realestateco.com/wp-content/uploads/2024/05/Jenn-Manes-2-1152x1536.jpg",
      ],
      email: "jenn@explorestj.com",
      phone: "+1 203-376-3786",
      experience: "3+ Years",
      specialties: [
        "Digital Marketing",
        "Property Photography",
        "Social Media",
        "First-time Buyers",
      ],
      achievements: ["Digital Innovation Award", "Marketing Excellence"],
      location: "St. John, USVI",
    },
    {
      id: "adonis-morton",
      name: "Adonis Morton",
      title: "Sales Associate",
      bio: "Born, raised and educated on ST Thomas, Adonis moved to St John 20 years ago after meeting and marrying his wife.",
      fullBio: `Born, raised and educated on ST Thomas, Adonis moved to St John 20 years ago after meeting and falling in love with his now wife, Krista. In addition to being a family man raising two daughters Triniese and Aria, Adonis has over 30 years in the banking field, in positions ranging from Consumer Loan Officer and Mortgage Specialist to Branch, Collections, Operation and REO Management. Adonis also currently holds memberships on The VI Real Estate Appraiser’s Board and the St John Caner Fund Board. Adonis is well-known throughout his island community for volunteering his DJ and MC skills to many community organizations fundraisers such as, St John Cancer Fund, Friends of NPS, Team River Runner, ACC, Gifft Hill School etc. Adonis and Krista truly embrace their commitment to family life and community involvement.`,
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Adonis-Morton-2.jpg",
      images: [
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Adonis-Morton-2.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/image2-1-300x300.jpeg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Adonis2-768x1024.jpeg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Adonis-Family.jpeg",
        adonis1,
        adonis2,
        adonis3,
        adonis4,
        adonis5,
      ],
      email: "adonis.340realestate@gmail.com",
      phone: "+1 340-690-0338",
      experience: "20+ Years",
      specialties: [
        "Local Market",
        "Island Properties",
        "Community Integration",
        "Cultural Expertise",
      ],
      achievements: ["Local Expert Award", "Community Service Recognition"],
      location: "St. John, USVI",
    },
    {
      id: "mary-moroney",
      name: "Mary Moroney",
      title: "Sales Associate",
      bio: "Mary Moroney hails from New England, born and raised in Connecticut she moved north to Maine in her early twenties.",
      fullBio: `Mary Moroney hails from New England, born and raised in Connecticut she moved north to Maine in 1976. In Maine, she raised her children and was a K-12 Art teacher with over 500 students per week. Mary and husband Tim bought land on St John in 1998 as their 5 children were emptying the nest. They had a 5-year plan to sell all of their property in Maine so they could sail their boat down to St John and build a home. In 2003 they pushed off the mooring in Rockland, Maine and sailed to St John. Their adventure had begun in earnest and although there were rough seas at times and hoops to jump through with the building process they managed to build their home on St John. Mary and Tim were designers, general contractors, builders, electricians, carpenters, tilers, masons, plumbers, and laborers.

Their home is masonry, poured concrete with wood jalousie windows and doors. Although they did hire help for large cement pours, they managed to achieve the build themselves with patience and hard work. This experience has given Mary great insight into the building process and how to make dreams come true. Mary is a board member of Estate Fish Bay Owners Association. Mary and Tim love life and have an ever-growing family of their 5 children they have 16 grandchildren. Let her put her passion and experience to work for you! `,

      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mary-Moroney-welcome-page.jpg",
      images: [
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mary-Moroney-welcome-page.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Mary-Tim-Moroney-500x391.jpg",
      ],
      email: "mcm.340realestate@gmail.com",
      phone: "+1 340-244-6664",
      experience: "15+ Years",
      specialties: [
        "Mainland to Island Transitions",
        "Luxury Properties",
        "Property Management",
        "Relocation Services",
      ],
      achievements: ["Relocation Specialist", "Luxury Property Expert"],
      location: "St. John, USVI",
    },
    {
      id: "john-mccann",
      name: "John McCann",
      title: "Broker Associate",
      bio: "Born in Hawaii, John has always had island living in his blood. Life leads him from Hawaii to various tropical destinations.",
      fullBio: `Born in Hawaii, John has always had island living in his blood. Life leads him from Hawaii to southern California and then to Boston where he began his real estate career in 1995, over 20 years ago. Needing to escape the harsh winters in the northeast, John discovered St. John and the rest is history. He made a 2-year plan to uproot his life and move to paradise, but, he couldn’t wait that long…18 months later, in 2001, St. John was home and he began his St. John real estate career. John brings a multi-faceted, progressive approach to his real estate career and is licensed in the US Virgin Islands, California, and Massachusetts.

Whether you are looking to buy or sell, John would love to put his over 20 years of real estate experience to work for you.`,
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/John-McCann.jpg",
      images: [
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/John-McCann.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/John-McCann.jpg",
      ],
      email: "john@helloimjohn.com",
      phone: "+1 340-998-0423",
      experience: "25+ Years",
      specialties: [
        "Island Properties",
        "Luxury Real Estate",
        "Investment Analysis",
        "Tropical Markets",
      ],
      achievements: ["Island Property Specialist", "Broker Excellence Award"],
      location: "St. John, USVI",
    },
    {
      id: "mark-shekleton",
      name: "Mark Shekleton",
      title: "Sales Associate",
      bio: "Mark Shekleton arrived on St. John in 1979 and has been a full-time resident since. Mark started his real estate career in the early 1980s.",
      fullBio:
        "Mark Shekleton is one of St. John's longest-standing real estate professionals, having arrived on the island in 1979 and been a full-time resident ever since. His career in real estate began in the early 1980s, giving him over four decades of experience in the St. John market. Mark's deep historical knowledge of the island's development and real estate evolution makes him an invaluable resource for understanding market trends and property values. His long-term perspective helps clients make informed decisions about their real estate investments.",
      image:
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mark-Shekleton-500x500-1.jpg",
      images: [
        "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mark-Shekleton-500x500-1.jpg",
        "https://340realestateco.com/wp-content/uploads/2021/10/Mark-Shekleton-500x500.jpg",
      ],
      email: "mark@seaviewhomes.com",
      phone: "+1 340-513-2608",
      experience: "40+ Years",
      specialties: [
        "Historical Market Knowledge",
        "Property Development",
        "Investment Properties",
        "Market Analysis",
      ],
      achievements: ["Lifetime Achievement Award", "Market Expert Recognition"],
      location: "St. John, USVI",
    },
  ];

  useEffect(() => {
    const foundAgent = agentsData.find((a) => a.id === id);
    setAgent(foundAgent);
  }, [id]);

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Agent not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-tropical-600 text-white rounded-lg hover:bg-tropical-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
        <img
          src={teamhero}
          alt="St. John"
          className="absolute inset-0 w-full h-full object-cover object-center  scale-105 transition-transform duration-700 ease-in-out"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/40 " />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide mb-4">
            About 340 Real Estate Team
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-tropical-500 to-blue-400 rounded-full mb-4"></div>
        </motion.div>
      </section>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 font-sans ">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-tropical-600 hover:text-tropical-700 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>

        {/* Hero Section - Main Image & Agent Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Main Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                  <img
                    src={agent.images[0]}
                    alt={`${agent.name} - Professional headshot`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Professional Badge */}
                <div className="absolute -bottom-4 -right-4 bg-tropical-600 text-white px-6 py-3 rounded-full shadow-lg">
                  <div className="text-center">
                    <div className="text-sm font-medium">Professional</div>
                    <div className="text-xs opacity-90">Real Estate Agent</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Agent Details */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Agent Header */}
              <div className="space-y-4">
                <h1 className="text-5xl font-serif font-bold text-gray-900">
                  {agent.name}
                </h1>
                <p className="text-2xl text-tropical-600 font-medium">
                  {agent.title}
                </p>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span className="font-medium">{agent.location}</span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span className="font-medium">
                      {agent.experience} Experience
                    </span>
                  </div> */}
                </div>
              </div>

              {/* About Section */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  About {agent.name}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {agent.fullBio}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-3">
                  {agent.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-tropical-100 text-tropical-800 rounded-full text-sm font-medium border border-tropical-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              {/* <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={24} className="text-tropical-600" />
                  Achievements
                </h3>
                <ul className="space-y-3">
                  {agent.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-700 text-base"
                    >
                      <span className="w-3 h-3 bg-tropical-500 rounded-full flex-shrink-0"></span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div> */}

              {/* Contact Information */}
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-tropical-100 rounded-full flex items-center justify-center group-hover:bg-tropical-200 transition-colors">
                      <Mail size={20} className="text-tropical-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-gray-700 font-medium">
                        {agent.email}
                      </div>
                    </div>
                  </a>
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-tropical-100 rounded-full flex items-center justify-center group-hover:bg-tropical-200 transition-colors">
                      <Phone size={20} className="text-tropical-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="text-gray-700 font-medium">
                        {agent.phone}
                      </div>
                    </div>
                  </a>

                  {/* <a
                    href={`https://wa.me/${agent.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <FaWhatsapp size={20} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">WhatsApp</div>
                      <div className="text-gray-700 font-medium">
                        Send Message
                      </div>
                    </div>
                  </a> */}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Gallery Section - Additional Images */}
        {agent.images.length > 1 && (
          <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-3xl font-serif font-bold text-gray-900 text-center mb-12">
                  Professional Gallery
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {agent.images.slice(1).map((image, index) => (
                    <motion.div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={image}
                          alt={`${agent.name} - Portfolio ${index + 2}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="text-sm font-medium">
                            Professional Photo
                          </div>
                          <div className="text-xs opacity-90">
                            Gallery {index + 2}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDetail;
