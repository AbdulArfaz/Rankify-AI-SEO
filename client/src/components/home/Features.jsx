import { homeFeaturesData } from "../../assets/assets.jsx";

export default function Features() {
  return (
    <section className="relative md:min-h-screen flex flex-col justify-center items-center max-lg:py-24">
      <div className="bg-dot-pattern absolute inset-0 -z-1 opacity-10"></div>
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4 ">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-8 text-foreground">
            Built to Outsmart{" "}
            <span className="gradient-text"> Your Competition</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Deep SEO insights driven by advanced AI and real-world browser
            simulation.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
          {homeFeaturesData.map((f) => (
            <div
              key={f.title}
              className="group bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/50"
            >
              <div className="text-primary mb-4 transition-transform duration-300 group-hover:-translate-y-1 inline-block">
                {f.icon}
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">
                {f.title}
              </h3>
              <p className="w-5/6 text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
