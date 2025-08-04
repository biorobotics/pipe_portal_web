export default function JobsPage() {
  return (
    <div style={{ 
      padding: "20px",
      marginLeft: "96px", // Account for the left sidebar
      marginTop: "64px", // Account for the header
      minHeight: "calc(100vh - 64px)",
      background: "#EAEAEA"
    }}>
      <h1 style={{ 
        color: "#242424", 
        fontFamily: "var(--font-roboto), Roboto, Arial, sans-serif",
        fontSize: "2rem",
        marginBottom: "20px"
      }}>
        All Jobs
      </h1>
      <p style={{ 
        color: "#555", 
        fontFamily: "var(--font-roboto), Roboto, Arial, sans-serif",
        fontSize: "1rem"
      }}>
        This is a placeholder page for the jobs list. Content will be added later.
      </p>
    </div>
  );
} 