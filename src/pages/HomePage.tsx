// import Hero from '../components/PricingSec';
import About from '../components/About';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUS';
import CaseStudy from '../components/CaseStudy';
import Testinomial from '../components/Testimonial';
import Blog from '../components/Blog';
import HeroSlider from '../components/HeroSlider';

const HomePage = () => {
  return (
    <>
      <HeroSlider/>
      <About />
      <Services />
      <WhyChooseUs />
      <CaseStudy />
      <Testinomial />
      
      <Blog />
      {/* <Hero /> */}
    </>
  );
};

export default HomePage;