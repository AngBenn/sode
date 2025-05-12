import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHandsHelping, FaComments, FaHandshake, FaSmile, FaBalanceScale } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AppHeader from '../components/Header'; // Your updated header component

const scenarios = [
  { name: "Empathy Test", category: "Empathy & Conflict Resolution", icon: <FaSmile size={25} />, image: "/images/Teamopia11.png" },
  { name: "Resolving Conflicts", category: "Empathy & Conflict Resolution", icon: <FaBalanceScale size={25} />, image: "/images/Teamopia9.png" },
  { name: "Sharing Is Caring", category: "Empathy & Conflict Resolution", icon: <FaHandsHelping size={25} />, image: "/images/Teamopia12.png" },

  { name: "Teamopia: The Cooperation Quest", category: "Cooperation & Communication", icon: <FaHandshake size={25} />, image: "/images/Teamopia7.png" }
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredScenarios =
    selectedCategory === "All"
      ? scenarios
      : scenarios.filter((scenario) => scenario.category === selectedCategory);

  // Retrieve the stored avatar from localStorage
  const storedAvatar = localStorage.getItem('selectedAvatar');

  return (
    <div className="w-screen h-screen bg-[#272052] text-white overflow-auto">
      {/* Header: Using the AppHeader component */}
      <AppHeader storedAvatar={storedAvatar} />

      {/* Greeting Message */}
      <div className="px-6 py-4 w-full text-left">
        <h1 className="text-2xl font-bold">Hello!</h1>
        <p className="text-lg">What would you like to work on today?</p>
      </div>

      {/* Big Card */}
      <div
        className="relative m-6 rounded-xl overflow-hidden shadow-lg bg-cover bg-center h-60"
        style={{ backgroundImage: "url('/images/Teamopia7.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-6">
          <h2 className="text-2xl font-bold">Teamopia: The Cooperation Quest</h2>
          <div className="flex justify-between items-center">
            <span className="text-sm">Level 1 of 3 | In Progress</span>
            <Link to={`/levels/Teamopia: The Cooperation Quest`}>
              <button className="bg-purple-600 text-white py-2 px-4 rounded-full self-end">Play</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-3 px-6 py-2 overflow-x-auto no-scrollbar">
        {["All", "Empathy & Conflict Resolution", "Cooperation & Communication"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-base ${selectedCategory === category ? 'bg-white text-[#272052]' : 'bg-[#3C2A73]'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Filtered Scenarios */}
      {selectedCategory !== "All" && (
        <div className="px-6 py-4 space-y-4">
          {filteredScenarios.map((scenario, index) => (
            <motion.div
              key={index}
              className="relative rounded-xl overflow-hidden shadow-lg bg-cover bg-center h-40"
              style={{ backgroundImage: `url('${scenario.image}')` }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-6">
                <h3 className="text-xl font-bold">{scenario.name}</h3>
                <Link to={
                  scenario.name === "Teamopia"
                    ? `/levels/${scenario.name}`
                    : `/scenario/${scenario.name}/level/1/${encodeURIComponent("Level 1")}`
                }>
                  <button className="bg-purple-600 text-white py-2 px-4 rounded-full self-end">Play</button>
                </Link>

              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Based on Recent Activity & You Might Like (for "All" selection) */}
      {selectedCategory === "All" && (
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold mb-2">🔥 Based on Your Recent Activity</h2>
          <div className="flex overflow-x-auto space-x-6 no-scrollbar">
            {scenarios.slice(0, 3).map((scenario, index) => (
              <Link
                key={index}
                to={
                  scenario.name === "Teamopia"
                    ? `/levels/${scenario.name}`
                    : `/scenario/${scenario.name}/level/1/${encodeURIComponent("Level 1")}`
                }
              >

                <motion.div
                  className="bg-[#3C2A73] p-4 rounded-xl shadow-lg w-80 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-white">{scenario.icon}</div>
                  <img
                    src={scenario.image}
                    alt={scenario.name}
                    className="w-full h-36 object-cover rounded-lg my-2"
                  />
                  <h3 className="text-lg font-semibold text-center">{scenario.name}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
          <br /><br />

        </div>
      )}
    </div>
  );
}









//Okay so it's not bad, I like the concept. But I would like to split the scenarios curently being showed into some--Done
//So for the all category, I would like to show all the scenarios, but for the other categories, I would like to show only the scenarios that match the category--Done
//In detail, for the all category, I would like to split the cards into let's say popular scenarios, based on your recent activity,--Done
//Then for the top part, when you click on each category, it should take you to that particular category page, and then the levels would be displayed there..--Done
//So clicking on each level card would open up the level, and then you can start the level--Pending( scenario pages)
//The coin icon I need to add to the header
//The profile part needs to become functional, it should take one to the profile page, maybe add in a dropdown menu
//The color scheme I have to change to the one I have in the figma design--why? not necessarily, depends depends on the design
//I think the pictures to have on the scenario cardsss, I'm looking at taking picture of the scenarios when I work on them in the future
