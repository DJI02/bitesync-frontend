function OldContactBar() {
  return (
    <div
      className="w-full h-32 left-0 bottom-0 absolute"
      style={{ backgroundColor: "#A5907E" }}
    >
      <div className="w-52 h-24 left-[13px] top-[13px] absolute justify-start text-white font-['Inter']">
        Contact Info:
        <br />
        <br />
        Person 1: xxx-xxx-xxxx
        <br />
        Person 2: xxx-xxx-xxxx
      </div>
      <div className="w-52 h-24 left-[226px] top-[13px] absolute justify-start text-white font-['Inter']">
        <br />
        <br />
        Person 3: xxx-xxx-xxxx
        <br />
        Person 4: xxx-xxx-xxxx
      </div>
      <div className="w-52 h-24 left-[438px] top-[13px] absolute justify-start text-white font-['Inter']">
        <br />
        <br />
        Person 5: xxx-xxx-xxxx
        <br />
        Person 6: xxx-xxx-xxxx
      </div>
    </div>
  );
}

export default OldContactBar;
