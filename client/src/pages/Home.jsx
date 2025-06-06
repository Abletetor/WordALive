import FeaturedScripture from '../components/FeaturedScripture';
import HeroBanner from '../components/HeroBanner';
import RecentPosts from '../components/RecentPosts';
import QuoteOfTheDay from '../components/QuoteOfTheDay';
import TestimonySlider from '../components/TestimonialSlider';


const Home = () => {
   return (
      <div>
         <QuoteOfTheDay />
         <HeroBanner />
         <FeaturedScripture />
         <RecentPosts />
         <TestimonySlider />
      </div>
   );
};

export default Home;
