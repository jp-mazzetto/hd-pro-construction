import { MessageSquare, Phone } from "lucide-react";

import { DISPLAY_PHONE } from "../../consts/site";
import Button from "../Button";

interface ContactSectionProps {
  onEstimateClick: () => void;
  onCallClick: () => void;
}

const ContactSection = ({
  onEstimateClick,
  onCallClick,
}: ContactSectionProps) => {
  return (
    <section id="contact" className="py-32 relative text-center">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto bg-white p-16 md:p-24 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100">
          <h2 className="text-5xl md:text-8xl font-black uppercase italic mb-8 leading-[0.85] tracking-tighter">
            Call or <span className="text-orange-600">Text</span> <br /> For
            Free Estimate
          </h2>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium text-center">
            Let's discuss your next project. We are ready to help you transform
            your outdoor space in Boston, Massachusetts.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Button onClick={onEstimateClick} className="text-2xl py-8 px-16 shadow-2xl">
              <MessageSquare size={32} />
              {DISPLAY_PHONE}
            </Button>
            <Button
              onClick={onCallClick}
              variant="outline"
              className="text-2xl py-8 px-16 border-4"
            >
              <Phone size={32} />
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
