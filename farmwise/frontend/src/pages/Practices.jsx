import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// ── Crop Data ────────────────────────────────────────────────────────────────
const CROPS = [
  {
    id: "maize",
    label: "Maize",
    emoji: "🌽",
    color: "#BA7517",
    lightBg: "#FEF9ED",
    tagline: "West Africa's most cultivated staple",
    sections: [
      {
        icon: "🌱",
        title: "Planting Season",
        content:
          "Wait for the rains to settle in before you start planting. In Nigeria, this usually means March or April for the first round, and August or September for the second. A good rule of thumb is to make sure the soil feels warm—about 18°C—so your seeds can wake up and grow properly.",
      },
      {
        icon: "🪱",
        title: "Soil & Land Prep",
        content:
          "Maize loves 'rich' soil that doesn't hold too much water—loamy soil is perfect. Before you plant, try to dig down about 30cm to loosen the earth. It’s also a great idea to mix in some organic compost a couple of weeks early to give the soil a natural nutrient boost.",
      },
      {
        icon: "📏",
        title: "Spacing & Planting",
        content:
          "Give your maize some 'breathing room' by planting them about 75cm apart in rows. Place two seeds in each hole, and if both grow, pull out the smaller one later so the stronger plant has all the space it needs. Plant them about 3–5cm deep.",
      },
      {
        icon: "💧",
        title: "Watering",
        content:
          "Your maize is thirstiest when it's growing its 'tassels' (the hairy tops). Try to water them every week if the clouds don't help. Just be careful not to let them sit in a puddle, as maize roots hate 'wet feet' or waterlogging.",
      },
      {
        icon: "🌿",
        title: "Fertilizer",
        content:
          "Think of fertilizer (like NPK 15-15-15) as a 'starter meal' at planting time. Then, when the plants are about knee-high (4–6 weeks), give them a 'growth boost' with urea. One secret: don't overfeed them with nitrogen when the silks appear, or you'll get big leaves but small corn.",
      },
      {
        icon: "🌾",
        title: "Harvesting",
        content:
          "You'll know it's time when the outer husks turn dry and the kernels feel rock-hard. If you want to eat them fresh, pick them while they're still a bit juicy. For long-term storage, wait until they are completely dry and hard.",
      },
    ],
  },
  {
    id: "tomato",
    label: "Tomato",
    emoji: "🍅",
    color: "#C0392B",
    lightBg: "#FEF2F2",
    tagline: "High-value crop with year-round demand",
    sections: [
      {
        icon: "🌱",
        title: "Planting Season",
        content:
          "Tomatoes love the sun and can grow all year if you have enough water. Many farmers find that planting in the dry season (October to February) is best because there are fewer pests and diseases to worry about.",
      },
      {
        icon: "🪱",
        title: "Soil & Land Prep",
        content:
          "Your tomatoes need 'fertile' soil that drains well. It's a good idea to build 'raised beds' (mounds of soil) to help the water flow away. Always mix in plenty of old manure or compost before you bring in your young plants.",
      },
      {
        icon: "📏",
        title: "Spacing & Planting",
        content:
          "When your seedlings are about a month old, move them to the field. Space them about 60cm apart. A pro tip: transplant them in the cool evening or on a cloudy day so they don't get 'shocked' by the hot sun.",
      },
      {
        icon: "💧",
        title: "Watering",
        content:
          "Tomatoes are picky about water—they like it steady! If you let the soil dry out then soak it too much, the fruits might crack. Try to water the base of the plant, not the leaves, to keep them from getting sick.",
      },
      {
        icon: "🌿",
        title: "Fertilizer",
        content:
          "Start with a balanced NPK fertilizer when you transplant. Once the first tiny green tomatoes appear, give them some 'calcium boost' to prevent the bottoms from rotting. Potassium sprays can also make your tomatoes extra sweet and red.",
      },
      {
        icon: "🌾",
        title: "Harvesting",
        content:
          "You can pick them when they just start turning a pinkish-red (the 'breaker' stage). This way, they can finish ripening on their way to the market without getting squashed or bruised.",
      },
    ],
  },
  {
    id: "pepper",
    label: "Pepper",
    emoji: "🫑",
    color: "#27AE60",
    lightBg: "#F0FDF4",
    tagline: "Essential spice with strong market value",
    sections: [
      {
        icon: "🌱",
        title: "Planting Season",
        content:
          "Peppers love the warmth. The best time to start is usually at the beginning of the rainy season in March or April. If you're growing them in a nursery first, wait about 5 to 7 weeks until they look strong enough to handle the move to your main field.",
      },
      {
        icon: "🪱",
        title: "Soil & Land Prep",
        content:
          "Peppers like 'sandy loam' soil—basically soil that’s a bit gritty but still rich. If you live in a very rainy area, building raised beds will help prevent the roots from drowning. Adding some compost or well-rotted manure before you plant will give them a great head start.",
      },
      {
        icon: "📏",
        title: "Spacing & Planting",
        content:
          "Give each pepper plant its own space, about 60cm apart. Like tomatoes, they do better if you transplant them in the late afternoon when it's cooler. Water them right away to help them settle into their new home.",
      },
      {
        icon: "💧",
        title: "Watering",
        content:
          "Try to keep the soil damp but not soaked. During dry weeks, watering every 3 to 5 days is a good goal. Peppers are sensitive—they don't like being too dry, but they also hate sitting in water.",
      },
      {
        icon: "🌿",
        title: "Fertilizer",
        content:
          "Feed them once when you transplant them (an NPK 20-10-10 works well). Then, about 6 and 10 weeks later, give them a little more 'fast food' like urea. If you want big, healthy peppers, you can also use a liquid feed that has minerals like zinc and boron.",
      },
      {
        icon: "🌾",
        title: "Harvesting",
        content:
          "You can pick them green after about 70 days, or wait until they turn fully red and ripe (usually around 100 days). Handle them gently like eggs, as they bruise easily, and pick them regularly to keep the plant producing more.",
      },
    ],
  },
  {
    id: "potato",
    label: "Potato",
    emoji: "🥔",
    color: "#8B6914",
    lightBg: "#FDFAF0",
    tagline: "Versatile tuber for highland farmers",
    sections: [
      {
        icon: "🌱",
        title: "Planting Season",
        content:
          "In cooler places like the Jos Plateau, the best times are March to May or September to October. Potatoes are 'cool weather' lovers and grow best when the air is fresh, around 15–20°C.",
      },
      {
        icon: "🪱",
        title: "Soil & Land Prep",
        content:
          "Potatoes need 'loose' and airy soil so the tubers can grow nice and big. Avoid heavy clay that feels sticky; instead, look for sandy loam. Deeply plowing the soil before you start is one of the most important steps for a big harvest.",
      },
      {
        icon: "📏",
        title: "Spacing & Planting",
        content:
          "Plant your seed potatoes (or pieces with at least two 'eyes') about 10cm deep and 30cm apart. If you cut your potatoes into pieces, let the 'wounds' dry for a day or two before you put them in the ground to prevent them from rotting.",
      },
      {
        icon: "💧",
        title: "Watering",
        content:
          "Keep the water steady, especially when the potatoes are starting to form under the ground (usually 45 to 70 days in). About two weeks before you plan to harvest, stop watering—this helps the skins get tough so they store better.",
      },
      {
        icon: "🌿",
        title: "Fertilizer",
        content:
          "Potatoes are hungry for potassium to grow big tubers! Start with a balanced NPK fertilizer at planting. When the plants are about 20cm tall, pile some extra soil around the base (this is called 'hilling') and add a little more potassium-rich fertilizer.",
      },
      {
        icon: "🌾",
        title: "Harvesting",
        content:
          "Watch for the leaves to turn yellow and die back—that's the signal! Dig them up carefully with a fork so you don't nick the skins. Let them 'rest' in the shade for a week or two before you store them so they stay fresh longer.",
      },
    ],
  },
  {
    id: "groundnut",
    label: "Groundnut",
    emoji: "🥜",
    color: "#D4821A",
    lightBg: "#FFF8ED",
    tagline: "Nitrogen-fixing legume, great for rotation",
    sections: [
      {
        icon: "🌱",
        title: "Planting Season",
        content:
          "Groundnuts love the sun and steady rain. In the north, aim for May to July; in the south, March to April is better. They need about 4 to 5 months of good weather to fill their pods properly.",
      },
      {
        icon: "🪱",
        title: "Soil & Land Prep",
        content:
          "Choose a spot with sandy soil that doesn't get swampy. Groundnuts are special because they actually make their own 'nitrogen' (plant food) in the soil! Just avoid using too much nitrogen fertilizer, or you'll get lots of leaves but very few peanuts.",
      },
      {
        icon: "📏",
        title: "Spacing & Planting",
        content:
          "Plant 2 or 3 seeds in each hole, about 5cm deep. Use seeds that haven't been shelled for too long, as they lose their 'spark' quickly. Shelling them right before you plant is always the best way to go.",
      },
      {
        icon: "💧",
        title: "Watering",
        content:
          "They are quite tough and can handle dry spells, but they really need water when the 'pegs' (the stems that grow into the ground) start forming pods. Stop watering a few weeks before harvest to help them dry out.",
      },
      {
        icon: "🌿",
        title: "Fertilizer",
        content:
          "Since they make their own nitrogen, they mainly need 'phosphorus' and 'calcium' to build strong shells. Adding something like gypsum when you see the pods starting to form will help make sure every shell is full and heavy.",
      },
      {
        icon: "🌾",
        title: "Harvesting",
        content:
          "When the leaves turn yellow and the pods rattle when you shake them, it's time! Pull the whole plant out of the ground and let them dry in the sun for a few days. Make sure they are nice and dry before you store them so they stay crunchy and don't get moldy.",
      },
    ],
  },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Practices() {
  const [activeCrop, setActiveCrop] = useState(CROPS[0]);
  const [activeSection, setActiveSection] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setActiveSection(0);
    setMessages([]);
  }, [activeCrop]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || chatLoading) return;
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setChatLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/farming-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop: activeCrop.label, question: text }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer || data.error }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, couldn't reach the server. Please check your connection." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const crop = activeCrop;
  const section = crop.sections[activeSection];

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBF5", fontFamily: "'Geist', sans-serif" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .practices-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .practices-grid {
            grid-template-columns: 1fr;
          }
          .sidebar {
            position: relative !important;
            top: 0 !important;
            margin-bottom: 24px;
          }
          .page-container {
            padding-top: 100px !important;
          }
        }

        .crop-tab:hover { background: #FAEEDA !important; }
        .section-pill:hover { background: #FAEEDA !important; }
        .send-btn:hover { opacity: 0.88; }
        .chat-input:focus { outline: none; border-color: #BA7517 !important; }
      `}</style>

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="page-container" style={{ maxWidth: 900, margin: "0 auto", padding: "110px 24px 0" }}>
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "#854F0B", textDecoration: "none", fontSize: 13, marginBottom: 24,
        }}>
          ← Back to home
        </Link>

        <h1 style={{ fontSize: "clamp(28px, 6vw, 36px)", fontWeight: 700, color: "#412402", margin: "0 0 8px", lineHeight: 1.2 }}>
          Farming Best Practices
        </h1>
        <p style={{ color: "#854F0B", margin: "0 0 32px", fontSize: "clamp(14px, 4vw, 16px)" }}>
          Locally curated growing guides + AI advisor for your crops
        </p>

        {/* ── Crop Tabs ────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {CROPS.map((c) => (
            <button
              key={c.id}
              className="crop-tab"
              onClick={() => setActiveCrop(c)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 999, border: "2px solid",
                borderColor: activeCrop.id === c.id ? c.color : "#E8D5B0",
                background:  activeCrop.id === c.id ? c.color : "transparent",
                color:       activeCrop.id === c.id ? "#fff"  : "#412402",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                transition: "all .18s ease",
              }}
            >
              <span style={{ fontSize: 16 }}>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* ── Main Content Area ─────────────────────────────────────────── */}
        <div 
          className="practices-grid"
          style={{
            animation: "fadeUp .35s ease",
            marginBottom: 40,
          }} 
          key={activeCrop.id}
        >

          {/* Left: section nav */}
          <div className="sidebar" style={{
            background: "#FAEEDA", borderRadius: 20,
            padding: 16, alignSelf: "start",
            position: "sticky", top: 100,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: "#BA7517",
              letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: 12, paddingLeft: 8,
            }}>
              {crop.emoji} {crop.label} Guide
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {crop.sections.map((s, i) => (
                <button
                  key={i}
                  className="section-pill"
                  onClick={() => setActiveSection(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 12, border: "none",
                    background: activeSection === i ? "#fff" : "transparent",
                    color: activeSection === i ? "#412402" : "#854F0B",
                    fontWeight: activeSection === i ? 600 : 400,
                    fontSize: 14, cursor: "pointer", textAlign: "left",
                    boxShadow: activeSection === i ? "0 2px 8px rgba(65,36,2,.08)" : "none",
                    transition: "all .15s ease",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  {s.title}
                </button>
              ))}
            </div>

            {/* Crop tagline */}
            <div style={{
              marginTop: 16, padding: "12px", borderRadius: 12,
              background: "#fff8", borderTop: "1px solid #E8D5B0",
              fontSize: 12, color: "#854F0B", lineHeight: 1.5,
              fontStyle: "italic",
            }}>
              "{crop.tagline}"
            </div>
          </div>

          {/* Right: content card */}
          <div className="content-card" key={`${activeCrop.id}-${activeSection}`} style={{
            background: "#fff", borderRadius: 20,
            border: "1px solid #FAEEDA",
            boxShadow: "0 4px 24px rgba(65,36,2,.07)",
            overflow: "hidden",
            animation: "fadeUp .25s ease",
          }}>
            {/* Card header */}
            <div style={{
              background: crop.lightBg,
              borderBottom: "1px solid #FAEEDA",
              padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
                boxShadow: "0 2px 10px rgba(65,36,2,.08)",
              }}>
                {section.icon}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: crop.color,
                  letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                  {crop.label} · {activeSection + 1} of {crop.sections.length}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#412402", margin: 0 }}>
                  {section.title}
                </h2>
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: "24px" }}>
              <p style={{
                color: "#412402", fontSize: 15, lineHeight: 1.8,
                margin: "0 0 24px",
              }}>
                {section.content}
              </p>

              {/* Navigation buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
                  disabled={activeSection === 0}
                  style={{
                    flex: 1, padding: "10px 16px", borderRadius: 999,
                    border: "2px solid #E8D5B0",
                    background: activeSection === 0 ? "transparent" : "#FAEEDA",
                    color: activeSection === 0 ? "#C9B090" : "#412402",
                    fontWeight: 500, fontSize: 13, cursor: activeSection === 0 ? "not-allowed" : "pointer",
                    transition: "all .15s ease",
                  }}
                >
                  ← Previous
                </button>

                {/* Step dots */}
                <div style={{ display: "flex", gap: 5 }}>
                  {crop.sections.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveSection(i)}
                      style={{
                        width: i === activeSection ? 16 : 6,
                        height: 6, borderRadius: 999,
                        background: i === activeSection ? crop.color : "#E8D5B0",
                        cursor: "pointer", transition: "all .2s ease",
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveSection((s) => Math.min(crop.sections.length - 1, s + 1))}
                  disabled={activeSection === crop.sections.length - 1}
                  style={{
                    flex: 1, padding: "10px 16px", borderRadius: 999,
                    border: "none",
                    background: activeSection === crop.sections.length - 1 ? "#E8D5B0" : "#412402",
                    color: activeSection === crop.sections.length - 1 ? "#9A7A5A" : "#FFFBF5",
                    fontWeight: 500, fontSize: 13,
                    cursor: activeSection === crop.sections.length - 1 ? "not-allowed" : "pointer",
                    transition: "all .15s ease",
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Chat Section ───────────────────────────────────────────── */}
        <div style={{
          background: "#fff", borderRadius: 24,
          border: "1px solid #FAEEDA",
          boxShadow: "0 4px 32px rgba(65,36,2,.07)",
          marginBottom: 64, overflow: "hidden",
        }}>
          {/* Chat header */}
          <div style={{
            background: "#412402", padding: "24px 28px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg, #BA7517 0%, #FAC775 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(186,117,23,.25)",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.8541 8.1459L21 11L14.8541 13.8541L12 20L9.1459 13.8541L3 11L9.1459 8.1459L12 2Z" fill="#FFFBF5" />
                <path d="M19 3L19.7123 4.2877L21 5L19.7123 5.7123L19 7L18.2877 5.7123L17 5L18.2877 4.2877L19 3Z" fill="#FFFBF5" opacity="0.6" />
              </svg>
            </div>
            <div>
              <div style={{ color: "#FFFBF5", fontWeight: 700, fontSize: 17, marginBottom: 2 }}>
                Ask FarmWise Advisor
              </div>
              <div style={{ color: "rgba(250,199,117,0.9)", fontSize: 13, fontWeight: 400 }}>
                Answers all technical & non-technical questions instantly
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            minHeight: 220, maxHeight: 400,
            overflowY: "auto", padding: "24px",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ 
                  fontSize: 48, marginBottom: 16, 
                  background: "#FAEEDA", width: 80, height: 80, 
                  borderRadius: "50%", display: "flex", 
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto"
                }}>{crop.emoji}</div>
                <h3 style={{ color: "#412402", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
                  Need specific advice?
                </h3>
                <p style={{ color: "#854F0B", fontSize: 15, margin: "0 0 24px", lineHeight: 1.5 }}>
                  Ask FarmWise anything about growing {crop.label} —<br />
                  from simple care to complex disease management.
                </p>

                {/* Suggestion chips */}
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}>
                  {[
                    `Best fertilizer for ${crop.label}?`,
                    `Common ${crop.label} diseases?`,
                    `How to improve my ${crop.label} yield?`,
                  ].map((q) => (
                    <button key={q} onClick={() => setInput(q)} style={{
                      padding: "7px 14px", borderRadius: 999,
                      border: "1px solid #E8D5B0", background: "#FAEEDA",
                      color: "#854F0B", fontSize: 13, cursor: "pointer",
                      transition: "all .15s ease",
                    }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                animation: "fadeUp .2s ease",
              }}>
                <div style={{
                  maxWidth: "78%", padding: "12px 16px", borderRadius: 16,
                  borderBottomRightRadius: m.role === "user" ? 4 : 16,
                  borderBottomLeftRadius:  m.role === "user" ? 16 : 4,
                  background: m.role === "user" ? "#412402" : "#FAEEDA",
                  color:      m.role === "user" ? "#FFFBF5" : "#412402",
                  fontSize: 14, lineHeight: 1.65,
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "12px 18px", borderRadius: 16, borderBottomLeftRadius: 4,
                  background: "#FAEEDA", display: "flex", gap: 5, alignItems: "center",
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%", background: "#BA7517",
                      animation: `bounce .9s ease ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            borderTop: "1px solid #FAEEDA", padding: "16px 20px",
            display: "flex", gap: 10,
          }}>
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={`Ask about ${crop.label} farming…`}
              style={{
                flex: 1, padding: "12px 18px", borderRadius: 999,
                border: "2px solid #E8D5B0", background: "#FAEEDA33",
                color: "#412402", fontSize: 14,
                fontFamily: "'Geist', sans-serif",
                transition: "border-color .15s ease",
              }}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={chatLoading || !input.trim()}
              style={{
                width: 48, height: 48, borderRadius: 999,
                background: chatLoading || !input.trim() ? "#E8D5B0" : "#412402",
                color: "#FFFBF5", border: "none", fontSize: 18,
                cursor: chatLoading || !input.trim() ? "not-allowed" : "pointer",
                transition: "all .15s ease", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
