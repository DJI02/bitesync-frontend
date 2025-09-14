function AllergyModal({ allergies }) {
  return (
    <div className="flex flex-col items-center justify-between w-full font-['Inter']">
      {/* Title box */}
      <div
        className="w-[90%] h-[60px] p-4 rounded-lg mb-4 text-2xl font-bold flex items-center justify-center"
        style={{ backgroundColor: "#A5907E" }}
      >
        Atendee Allergies
      </div>

      {/* Allergy List */}
      <div
        className={`w-[90%] flex-grow p-4 rounded-lg mb-4 bg-[#F4EFE9] shadow-md ${
          allergies.length === 0 ? "hidden" : ""
        }`}
      >
        {allergies.map((allergy, index) => (
          <div key={index} className="flex items-center justify-start mb-2">
            <span className="text-lg font-semibold">{allergy[0]}:</span>
            <span className="ml-2 text-md text-gray-700">
              {allergy[1]} {allergy[1] > 1 ? "people have" : "person has"} this
              allergy
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllergyModal;
