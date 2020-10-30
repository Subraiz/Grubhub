export default function Custom404() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          height: 80,
          justifyContent: "center",
          position: "relative",
          zIndex: 1
        }}
      >
        <h1>404</h1>
        <div
          style={{
            height: "100%",
            width: 1,
            margin: "0 20px",
            backgroundColor: "white"
          }}
        />
        <p style={{ fontWeight: 100 }}>Looks like you got finessed</p>
      </div>

      <div
        style={{
          position: "absolute",
          width: "80%",
          height: "80%",
          margin: "auto",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
          opacity: 0.6
        }}
      >
        <img
          src={"/static/logo.png"}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>
    </div>
  );
}
