export interface Project {
  id: string;
  title: string;
  url?: string; // Optional, as some might be platforms/labs
  description: string; // Short description for card
  image: string; // Placeholder image path
  details: string; // Longer description for modal
  techStack?: string[]; // Optional: for modal
}

export const newProjectsData: Project[] = [
  {
    id: "zeindfood",
    title: "ZeIndFood",
    url: "zeindfood.com",
    description: "A platform for discovering authentic Indonesian cuisine.",
    image: "/images/projects/placeholder-zeindfood.jpg", // Replace with actual paths if available
    details: "ZeIndFood is a comprehensive web application connecting users with local Indonesian restaurants and home cooks. Features include search, reviews, and online ordering integration. Built with Next.js, Tailwind CSS, and a Node.js backend.",
    techStack: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB"],
  },
  {
    id: "syrian-stone",
    title: "Syrian Stone",
    url: "syrian-stone.com",
    description: "E-commerce site for Syrian natural stone products.",
    image: "/images/projects/placeholder-syrian-stone.jpg",
    details: "A bespoke e-commerce platform showcasing and selling unique Syrian natural stone products. Features include product catalogs, secure checkout, and international shipping options. Developed using Shopify and custom Liquid templating.",
    techStack: ["Shopify", "Liquid", "E-commerce"],
  },
  {
    id: "iron-protv",
    title: "Iron ProTV",
    url: "iron-protv.fr",
    description: "IPTV service provider website with subscription management.",
    image: "/images/projects/placeholder-iron-protv.jpg",
    details: "Iron ProTV offers IPTV subscription services. The website allows users to browse packages, manage subscriptions, and access customer support. Built with React and Firebase.",
    techStack: ["React", "Firebase", "IPTV"],
  },
  {
    id: "atlas-ontvpro",
    title: "Atlas ONTVPro",
    url: "atlas-ontvpro.com",
    description: "Another IPTV service with a focus on MENA region content.",
    image: "/images/projects/placeholder-atlas-ontvpro.jpg",
    details: "Atlas ONTVPro provides IPTV services with a rich selection of channels, particularly focusing on the MENA region. The platform includes user authentication and content streaming. Built using Angular and a custom backend.",
    techStack: ["Angular", "Node.js", "Streaming"],
  },
  {
    id: "clickagency",
    title: "Click Agency",
    url: "clickagency.tech",
    description: "Digital marketing agency website showcasing services.",
    image: "/images/projects/placeholder-clickagency.jpg",
    details: "Click Agency is a digital marketing firm. Their website highlights their services, portfolio, and client testimonials. Developed with WordPress and custom theme modifications.",
    techStack: ["WordPress", "PHP", "Digital Marketing"],
  },
  {
    id: "phoenixweb",
    title: "Phoenix Web Labs",
    // url: undefined, // Internal platform or lab
    description: "Experimental web projects and R&D platform.",
    image: "/images/projects/placeholder-phoenixweb.jpg",
    details: "Phoenix Web Labs is an internal initiative for research and development of cutting-edge web technologies, including Web3, AI integrations, and advanced animations with Three.js.",
    techStack: ["Three.js", "Web3", "AI", "R&D"],
  },
  {
    id: "eulmaexpress",
    title: "Eulma Express",
    url: "eulmaexpress.dz", // Assuming .dz for Algeria
    description: "Local e-commerce and delivery service platform.",
    image: "/images/projects/placeholder-eulmaexpress.jpg",
    details: "Eulma Express is a localized e-commerce and delivery service, connecting local vendors with customers. Features include product listings, order management, and delivery tracking. Built with Laravel and Vue.js.",
    techStack: ["Laravel", "Vue.js", "E-commerce", "Logistics"],
  },
  {
    id: "freelancerdz",
    title: "Freelancer DZ",
    // url: undefined, 
    description: "Platform connecting Algerian freelancers with clients.",
    image: "/images/projects/placeholder-freelancerdz.jpg",
    details: "Freelancer DZ aims to bridge the gap between Algerian freelance talent and businesses seeking their skills. Features include profiles, project bidding, and secure payments. Tech stack: MERN.",
    techStack: ["React", "Node.js", "MongoDB", "Express.js"],
  },
  {
    id: "cabadz",
    title: "CabaDZ",
    // url: undefined, 
    description: "Ride-sharing or taxi booking service for Algeria.",
    image: "/images/projects/placeholder-cabadz.jpg",
    details: "CabaDZ is a concept for a ride-sharing application tailored for the Algerian market, focusing on ease of use and safety features. Mockups and prototypes developed using Figma and React Native.",
    techStack: ["React Native", "Figma", "Mobile App"],
  },
  {
    id: "travelplatform",
    title: "Travel Platform",
    // url: undefined, 
    description: "Concept for a comprehensive travel booking platform.",
    image: "/images/projects/placeholder-travelplatform.jpg",
    details: "A conceptual travel platform designed to offer flights, hotels, and tour packages with a user-friendly interface and AI-powered recommendations. Explored technologies include Python (Django) and React.",
    techStack: ["Python", "Django", "React", "AI"],
  },
];
