import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import AppHeader from '../components/Header'; // Your updated header component

const levelNames = {
    "Cooperation Challenge": ["Lvl 1: Buddy Bridge", "Lvl 2: Teamwork Trail", "Lvl 3: Harmony Hill", "Lvl 4: Unity Utopia", "Lvl 5: Alliance Arena"],
    "Empathy Test": ["Lvl 1: Feelings Forest", "Lvl 2: Kindness Kingdom", "Lvl 3: Compassion Cove", "Lvl 4: Heartland Haven", "Lvl 5: Empathy Empire"],
    "Collaboration Task": ["Lvl 1: Partner Path", "Lvl 2: Sync City", "Lvl 3: Together Town", "Lvl 4: Alliance Alley", "Lvl 5: Harmony Highway"],
    "Sharing Game": ["Lvl 1: Giveaway Grove", "Lvl 2: Share Square", "Lvl 3: Generosity Gardens", "Lvl 4: Caring Corner", "Lvl 5: Sharing Square"],
    "Communication Drill": ["Lvl 1: Chatter Chase", "Lvl 2: Talk Trail", "Lvl 3: Dialogue Drive", "Lvl 4: Conversation Cove", "Lvl 5: Communication Canyon"],
    "Conflict Resolution Sim": ["Lvl 1: Peace Path", "Lvl 2: Agreement Avenue", "Lvl 3: Resolution Ridge", "Lvl 4: Harmony Highway", "Lvl 5: Conflict Canyon"],
    "Teamopia: The Cooperation Quest": ["Lvl 1: Cooperation Canyon", "Lvl 2: Unity Valley", "Lvl 3: Teamwork Tundra", "Lvl 4: Alliance Archipelago", "Lvl 5: Harmony Highlands"]
};

export default function LevelsPage() {
    const { scenarioName } = useParams();
    const levels = levelNames[scenarioName] || ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
    // Retrieve the stored avatar from localStorage
    const storedAvatar = localStorage.getItem('selectedAvatar');

    return (
        <div className="w-screen h-screen bg-[#272052] text-white overflow-auto">
            <div className="flex flex-col min-h-screen">
                {/* Header: Using the AppHeader component */}
                <AppHeader storedAvatar={storedAvatar} />

                {/* Scenario Title */}
                <div className="px-6 py-4 w-full text-left">
                    <h1 className="text-3xl font-bold">{scenarioName}</h1>
                    <p className="text-lg">Choose a level to start your adventure!</p>
                </div>

                {/* Levels Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-4">
                    {levels.map((level, index) => (
                        <motion.div
                            key={index}
                            className="relative rounded-xl overflow-hidden shadow-lg bg-cover bg-center h-60"
                            style={{ backgroundImage: "url('/images/ceo-contract-wife.png')" }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-6">
                                <h3 className="text-2xl font-bold text-center">{level}</h3>
                                {/* Build the URL with scenarioName, levelNumber, and levelName */}
                                <Link to={`/scenario/${scenarioName}/level/${index + 1}/${encodeURIComponent(level)}`}>
                                    <button className="bg-purple-600 text-white py-2 px-6 rounded-full mt-4">Play</button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}      