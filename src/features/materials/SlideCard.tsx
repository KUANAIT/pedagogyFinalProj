import type { Slide } from "../../data/materials";

export function SlideCard({
  slide,
  lectureTitle,
  size = "large",
}: {
  slide: Slide;
  lectureTitle: string;
  size?: "large" | "thumb";
}) {
  if (slide.image) {
    return (
      <div className={`slide-card ${size} has-image`}>
        <img src={slide.image} alt={`${lectureTitle}, slide ${slide.page}`} />
        <span className="slide-number">{slide.page}</span>
      </div>
    );
  }
  return (
    <div className={`slide-card ${size}`}>
      <div className="slide-head">{lectureTitle.split(" · ")[0]}</div>
      <h3>{slide.title}</h3>
      {size === "large" && <p>{slide.text}</p>}
      <span className="slide-number">{slide.page}</span>
    </div>
  );
}
