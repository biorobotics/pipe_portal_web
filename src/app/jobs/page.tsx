/**
 * @fileoverview Placeholder page for the jobs list.
 * @remark This page will be populated with job listings in the future.
 */

/**
 * @returns - A placeholder page for the jobs list
 */
export default function JobsPage() {
  return (
    <div style={{ 
      padding: "2.58vh",
      marginLeft: "6.25vw", // Account for the left sidebar
      marginTop: "8.25vh", // Account for the header
      minHeight: "calc(100vh - 8.25vh)",
      background: "#EAEAEA"
    }}>
      <h1 style={{ 
        color: "#242424", 
        fontFamily: "var(--font-roboto), Roboto, Arial, sans-serif",
        fontSize: "2rem",
        marginBottom: "2.58vh"
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