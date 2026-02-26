interface OutfitCardProps {
  item: any
  type: "top" | "bottom"
}

export default function OutfitCard({ item, type }: OutfitCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "10px",
        textAlign: "center"
      }}
    >
      <img
        src={item.image}
        width="100%"
        style={{ borderRadius: "8px" }}
      />

      <div style={{ marginTop: "10px" }}>
        <a
          href={item.affiliate_link}
          target="_blank"
          style={{
            backgroundColor: "#6b46c1",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            textDecoration: "none",
            display: "inline-block"
          }}
        >
          Shop {type === "top" ? "Top" : "Bottom"}
        </a>
      </div>
    </div>
  )
}
