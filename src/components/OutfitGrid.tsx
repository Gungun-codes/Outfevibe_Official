interface OutfitItem {
  id?: string
  image?: string
  affiliateLink?: string
  name?: string
}

interface Props {
  items: OutfitItem[]
  type: string
}

export default function OutfitGrid({ items, type }: Props) {
  if (!items || items.length === 0) return null

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
        {type === "top" ? "Tops" : "Bottoms"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "12px"
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "10px",
              textAlign: "center",
              background: "white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt="outfit"
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />
            )}

            {item.affiliateLink && (
              <a
                href={item.affiliateLink}
                target="_blank"
                style={{
                  display: "block",
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#8e2de2",
                  textDecoration: "none",
                  fontWeight: "600"
                }}
              >
                View Product
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
