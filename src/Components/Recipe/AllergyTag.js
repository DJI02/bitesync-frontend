function AllergyTag({ allergy }) {
  return (
    <div className="p-2 h-10 bottom-0 bg-[#7A5E48] rounded-[90px] border-[0.50px] border-black flex items-center justify-center">
      <div className="text-center text-white text-base font-normal font-['Inter']">
        {allergy}
      </div>
    </div>
  );
}

export default AllergyTag;
