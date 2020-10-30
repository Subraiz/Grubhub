import "./main.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <title>FinesseHub</title>
      <Component {...pageProps} />
    </div>
  );
}
