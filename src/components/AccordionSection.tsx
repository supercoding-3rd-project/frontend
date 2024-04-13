import React, { useState } from "react";
import "./footer.scss";

interface AccordionSection {
  title: string;
  content: string | JSX.Element;
}

interface AccordionProps {
  sections: AccordionSection[];
}

const Accordion: React.FC<AccordionProps> = ({ sections }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {sections.map((section, index) => (
        <div key={index} className="accordion__section">
          <div
            className={`accordion__section__header ${
              activeIndex === index ? "active" : ""
            }`}
            onClick={() => toggleSection(index)}
          >
            {section.title}
          </div>
          {activeIndex === index && (
            <div className="accordion__section__content">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
