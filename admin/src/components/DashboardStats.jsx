import { FileText, MessageCircle, Folder, Users } from "lucide-react";
import { motion } from "framer-motion";

const DashboardStats = ({ stats }) => {
   const cards = [
      {
         icon: <FileText className="text-blue-400" size={ 28 } />,
         label: "Posts",
         value: stats.totalPosts,
         bg: "bg-blue-950/40",
      },
      {
         icon: <MessageCircle className="text-green-400" size={ 28 } />,
         label: "Comments",
         value: stats.totalComments,
         bg: "bg-green-950/40",
      },
      {
         icon: <Folder className="text-purple-400" size={ 28 } />,
         label: "Categories",
         value: stats.totalCategories,
         bg: "bg-purple-950/40",
      },
      {
         icon: <Users className="text-orange-400" size={ 28 } />,
         label: "Users",
         value: stats.totalUsers,
         bg: "bg-orange-950/40",
      },
   ];

   return (
      <div className="space-y-6">
         <motion.h2
            className="text-3xl font-bold text-white"
            initial={ { opacity: 0, y: -10 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.4 } }
         >
            👋 Welcome back, Admin
         </motion.h2>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            { cards.map((card, index) => (
               <motion.div
                  key={ index }
                  className={ `p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${card.bg}` }
                  initial={ { opacity: 0, y: 20 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { delay: index * 0.1, duration: 0.4 } }
               >
                  <div className="p-2 bg-black/20 rounded-full">{ card.icon }</div>
                  <div>
                     <div className="text-gray-400 text-sm">{ card.label }</div>
                     <div className="text-white text-xl font-semibold">{ card.value }</div>
                  </div>
               </motion.div>
            )) }
         </div>
      </div>
   );
};

export default DashboardStats;
