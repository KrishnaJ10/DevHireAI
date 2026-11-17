function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-wrap">
      <div className="loader-ring" />
      <p className="loader-text">{text}</p>
    </div>
  );
}

export default Loader;