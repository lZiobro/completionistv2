const HowToUse = () => {
  return (
    <div className="container-fluid bg-dark App">
      <h2
        style={{ color: "white", textAlign: "center" }}
      >{`Select gamemode => use the bottom of the left panel to fetch the scores => use the site`}</h2>
      <p style={{ color: "white" }}>Why do i need to fetch the scores first?</p>
      <p style={{ color: "white" }}>
        "osu!api doesnt have an endpoint for such a large amount of scores, so
        in order to use the app you need to manually fetch the scores from osu,
        which are then saved in completionist!db for usage on site"
      </p>
    </div>
  );
};

export default HowToUse;
