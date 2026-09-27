import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturedProductProps {
  onProductSelect?: (id: number) => void;
}

const FeaturedProduct = ({ onProductSelect }: FeaturedProductProps) => {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--bg-secondary)",
        paddingTop: "32px",
        paddingBottom: "40px",
      }}
    >
      {/* Decorative background */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          left: "-180px",
          top: "10%",
          borderRadius: "50%",
          border: "1px solid rgba(201,169,110,0.12)",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          width: 360,
          height: 360,
          left: "-110px",
          top: "18%",
          borderRadius: "50%",
          border: "1px solid rgba(201,169,110,0.10)",
        }}
      />

      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* TEXT SIDE */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              margin: "-100px",
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-4 order-2 lg:order-1"
          >
            <span className="heading-eyebrow">Şefin Önerisi</span>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold leading-tight"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Peru Papagoya
              <br />
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                Grade 1
              </span>
            </h2>

            <div
              className="h-px w-16"
              style={{
                background: "linear-gradient(90deg, var(--accent), transparent)",
              }}
            />

            <div
              className="space-y-3 text-sm md:text-base leading-relaxed"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              <p>
                Peru Papagoya Grade 1, ilk yudumdaki tatlılıktan son yudumdaki hafif asiditeye kadar
                dengeli ve temiz bir içim sunar.
              </p>

              <p>
                Fındık ve sütlü çikolata notalarıyla belirgin bir gövde oluşturur. Filtre ve
                espresso demlemelerde karakterini korur.
              </p>
            </div>

            {/* Flavor Card */}
            <div
              className="p-6 space-y-4 max-w-md"
              style={{
                borderRadius: "24px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 8px 30px var(--shadow)",
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: "var(--accent)",
                }}
              >
                Tat Profili
              </p>

              {[
                ["Gövde", 4],
                ["Asidite", 3],
                ["Tatlılık", 5],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-center gap-4">
                  <span
                    className="text-sm font-medium min-w-[80px]"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {label}
                  </span>

                  <div className="flex gap-1.5 flex-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className="flex-1 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            index < (value as number) ? "var(--accent)" : "var(--border)",
                          transition: "background-color 400ms ease",
                        }}
                      />
                    ))}
                  </div>

                  <span
                    className="text-xs min-w-[28px] text-right"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {value}/5
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onProductSelect?.(1)}
              className="btn-primary group inline-flex items-center gap-3"
            >
              Detaylı İncele
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </motion.div>

          {/* IMAGE SIDE */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              margin: "-100px",
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative order-1 lg:order-2"
          >
            <div
              className="relative aspect-[4/5] max-w-md mx-auto overflow-hidden group"
              style={{
                borderRadius: "32px",
                border: "1px solid var(--border)",
                boxShadow: "0 16px 48px var(--shadow-strong)",
              }}
            >
              <img
                src="https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/peru-papagoye-grade1.png"
                alt="Peru Papagoya Grade 1"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://www.forcoffeetr.com/magaza/wp-content/uploads/2026/02/PERU-GRADE1.png";

                  e.currentTarget.onerror = null;
                }}
              />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.15))",
                }}
              />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                rotate: -8,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.5,
                duration: 0.6,
              }}
              className="absolute -top-4 -right-4 lg:-right-8 px-6 py-3 rounded-full hidden md:block"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 8px 32px var(--shadow)",
              }}
            >
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.2em] block"
                style={{
                  color: "var(--accent)",
                }}
              >
                Şefin
              </span>

              <span
                className="font-serif text-lg"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Önerisi
              </span>
            </motion.div>

            {/* Floating Icon */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 4, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -left-5 w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 10px 30px var(--shadow)",
              }}
            >
              <Sparkles
                size={20}
                strokeWidth={1.5}
                style={{
                  color: "var(--accent)",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
