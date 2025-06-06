import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload, label }) => {
   if (active && payload?.length) {
      return (
         <div className="bg-gray-900 text-white text-sm p-2 rounded shadow-lg">
            <p className="font-semibold">Date: { label }</p>
            <p>Total Views: { payload[0].value }</p>
         </div>
      );
   }
   return null;
};

const ViewsChart = ({ data }) => {
   return (
      <motion.div
         className="bg-[#1e1e2f] rounded-2xl shadow p-5"
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.5 } }
      >
         <h3 className="text-lg font-semibold text-white mb-4">
            📊 Views Over Time
         </h3>
         <ResponsiveContainer width="100%" height={ 250 }>
            <LineChart data={ data } margin={ { top: 5, right: 20, bottom: 5, left: 0 } }>
               <CartesianGrid stroke="#2e2e42" strokeDasharray="3 3" />
               <XAxis
                  dataKey="_id"
                  tick={ { fill: "#aaa", fontSize: 12 } }
                  axisLine={ { stroke: "#555" } }
                  tickLine={ { stroke: "#555" } }
               />
               <YAxis
                  tick={ { fill: "#aaa", fontSize: 12 } }
                  axisLine={ { stroke: "#555" } }
                  tickLine={ { stroke: "#555" } }
               />
               <Tooltip content={ <CustomTooltip /> } />
               <Line
                  type="monotone"
                  dataKey="totalViews"
                  stroke="#3b82f6"
                  strokeWidth={ 2.5 }
                  dot={ { r: 4, strokeWidth: 1, fill: "#3b82f6" } }
                  activeDot={ { r: 6 } }
               />
            </LineChart>
         </ResponsiveContainer>
      </motion.div>
   );
};

export default ViewsChart;
